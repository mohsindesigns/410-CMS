import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';
import Content from '@/models/Content';
import { clamp, escapeHtml, getClientIp, isEmail, rateLimit, singleLine } from '@/lib/formSecurity';

const LIMITS = { name: 100, email: 254, phone: 30, subject: 200, type: 50, message: 5000, extraKey: 50, extraValue: 1000, extraCount: 20 } as const;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_FILE_EXT = ['pdf', 'doc', 'docx'];
const ALLOWED_FILE_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/octet-stream',
  '',
];
// Keys handled explicitly (or noise) and therefore not copied into extraData
const RESERVED_KEYS = ['name', 'email', 'phone', 'message', 'subject', '_subject', 'type', 'attachment', '_captcha', '_template', 'website'];

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

/** Only careers / job-application style forms may upload a file. */
const isApplicationType = (t: string) => /career|job|application|resume|cv/i.test(t);

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(`send:${ip}`);
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
      );
    }

    const contentType = request.headers.get('content-type') || '';
    const raw: Record<string, unknown> = {};
    let file: File | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        if (typeof value === 'string') {
          raw[key] = value;
        } else if (key === 'attachment') {
          file = value as File;
        }
      });
      if (raw.type === undefined || raw.type === '') raw.type = 'Career Application';
      if (raw.subject === undefined || raw.subject === '') raw.subject = raw._subject;
    } else {
      let body: any;
      try {
        body = await request.json();
      } catch {
        return bad('Invalid request.');
      }
      if (!body || typeof body !== 'object' || Array.isArray(body)) return bad('Invalid request.');
      Object.assign(raw, body);
    }

    // Honeypot: bots fill the hidden "website" field. Pretend success, do nothing.
    if (typeof raw.website === 'string' && raw.website.trim() !== '') {
      return NextResponse.json({ success: true });
    }

    // Core fields must be strings when present. Tolerate alternate field names configured in the CMS form builder.
    const pick = (...keys: string[]) => {
      for (const k of keys) {
        const v = raw[k];
        if (typeof v === 'string' && v.trim()) return v.trim();
      }
      return '';
    };
    for (const k of ['name', 'email', 'phone', 'message', 'subject', 'type']) {
      const v = raw[k];
      if (v !== undefined && v !== null && typeof v !== 'string') return bad('Invalid request.');
    }

    const name = pick('name', 'fullname', 'fullName', 'contact_name');
    const email = pick('email', 'user_email', 'contact_email');
    const phone = pick('phone');
    const message = pick('message', 'comments', 'inquiry') || 'No message content provided.';
    const subject = singleLine(pick('subject'));
    const type = pick('type') || 'Contact Form';

    if (!name || !email) return bad('Name and email are required.');
    if (
      name.length > LIMITS.name ||
      phone.length > LIMITS.phone ||
      subject.length > LIMITS.subject ||
      type.length > LIMITS.type ||
      message.length > LIMITS.message
    ) {
      return bad('One or more fields are too long.');
    }
    if (!isEmail(email)) return bad('Please enter a valid email address.');

    // Remaining simple fields -> extraData (primitives only, bounded)
    const extraData: Record<string, string> = {};
    let extraCount = 0;
    for (const [key, value] of Object.entries(raw)) {
      if (RESERVED_KEYS.includes(key)) continue;
      if (extraCount >= LIMITS.extraCount) break;
      if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') continue;
      const safeKey = key.slice(0, LIMITS.extraKey).replace(/[^\w -]/g, '_');
      if (!safeKey || safeKey.startsWith('$')) continue;
      extraData[safeKey] = clamp(String(value), LIMITS.extraValue);
      extraCount++;
    }

    // File upload: only application-style forms, 5MB max, pdf/doc/docx only
    const attachments: { filename: string; content: string }[] = [];
    let attachmentUrl: string | undefined;
    const upload = file as File | null;
    if (upload && upload.size > 0) {
      if (!isApplicationType(type)) return bad('File uploads are not accepted on this form.');
      if (upload.size > MAX_FILE_BYTES) return bad('File is too large (5MB maximum).');
      const ext = (upload.name.split('.').pop() || '').toLowerCase();
      if (!ALLOWED_FILE_EXT.includes(ext) || !ALLOWED_FILE_MIME.includes((upload.type || '').toLowerCase())) {
        return bad('Only PDF, DOC or DOCX files are accepted.');
      }
    }

    await connectDB();

    if (upload && upload.size > 0) {
      const buffer = Buffer.from(await upload.arrayBuffer());
      const { uploadFile } = await import('@/lib/storage');
      const { url } = await uploadFile(upload, buffer);
      attachmentUrl = url;
      attachments.push({ filename: upload.name.replace(/[^\w.\- ]/g, '_').slice(0, 100), content: buffer.toString('base64') });
    }

    // Save to Database
    let submission: any;
    try {
      submission = await Submission.create({
        name,
        email,
        phone,
        subject,
        message,
        type,
        attachmentUrl,
        extraData,
      });
    } catch (dbError: any) {
      // Still try to send the email even if the DB save fails
      console.error('DATABASE SAVE ERROR:', dbError?.message);
    }

    // Fetch dynamic email from Content CMS
    let receiverEmail = 'antoine.lyles@yahoo.com';
    try {
      const contentDoc = await Content.findOne({ key: "complete_data" }).lean() as any;
      if (contentDoc && contentDoc.data) {
        if (type === 'Quote Request' && contentDoc.data.quote?.email) {
          receiverEmail = contentDoc.data.quote.email;
        } else if (contentDoc.data.contactPage?.email) {
          receiverEmail = contentDoc.data.contactPage.email;
        } else if (contentDoc.data.quote?.email) {
          receiverEmail = contentDoc.data.quote.email;
        }
      }
    } catch (e) {
      console.error("Error fetching dynamic email");
    }

    if (receiverEmail) {
      receiverEmail = receiverEmail.replace(/\s+/g, '').toLowerCase();
    }
    if (!receiverEmail || !receiverEmail.includes('@')) {
      receiverEmail = 'antoine.lyles@yahoo.com';
    }

    const extraRows = Object.entries(extraData)
      .filter(([, v]) => v)
      .map(([k, v]) => `
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">${escapeHtml(k.replace(/_/g, ' '))}:</td>
                <td style="padding: 8px 0; color: #0f172a; font-weight: 500; font-size: 14px;">${escapeHtml(v)}</td>
              </tr>`)
      .join('');

    // Send email using Resend
    let emailOk = false;
    try {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) throw new Error('RESEND_API_KEY not configured');
      const resend = new Resend(apiKey);
      const { error: resendError } = await resend.emails.send({
        from: process.env.RESEND_FROM || '410 Muscle Therapy <onboarding@resend.dev>',
        to: [receiverEmail],
        replyTo: email,
        subject: subject || singleLine(`New Lead: ${name}`),
        html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #2430d2; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 20px;">New Submission${type ? ` &mdash; ${escapeHtml(type)}` : ''}</h1>
          </div>
          <div style="padding: 30px;">
            <p style="margin-top: 0; color: #64748b; font-size: 14px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em;">Customer Info</p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Name:</td>
                <td style="padding: 8px 0; color: #0f172a; font-weight: 500; font-size: 14px;">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email:</td>
                <td style="padding: 8px 0; color: #0f172a; font-weight: 500; font-size: 14px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Phone:</td>
                <td style="padding: 8px 0; color: #0f172a; font-weight: 500; font-size: 14px;">${escapeHtml(phone || 'Not provided')}</td>
              </tr>${extraRows}
            </table>

            <p style="margin-top: 0; color: #64748b; font-size: 14px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em;">Message</p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; color: #0f172a; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message || 'No message provided')}</div>
          </div>
        </div>
      `,
        attachments,
      });
      if (resendError) {
        console.error('RESEND API ERROR:', resendError.name);
      } else {
        emailOk = true;
      }
    } catch (sendErr: any) {
      console.error('RESEND SEND FAILED:', sendErr?.message);
    }

    if (!emailOk) {
      if (submission) {
        // Saved, but the owner was not notified: say so honestly.
        return NextResponse.json(
          {
            error: 'Your message was saved, but we could not send the notification email. We will review it from our dashboard; if it is urgent please call us.',
            // included so the careers form, which treats a saved application as received, keeps working
            submissionId: String(submission._id),
          },
          { status: 502 }
        );
      }
      return NextResponse.json({ error: 'We could not process your submission. Please try again or call us.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Submission received.' });
  } catch (error: any) {
    console.error('CRITICAL API ERROR IN /api/send:', error?.message);
    return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 });
  }
}
