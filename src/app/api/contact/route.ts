import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';
import Content from '@/models/Content';
import { escapeHtml, getClientIp, isEmail, rateLimit, singleLine } from '@/lib/formSecurity';

const LIMITS = { name: 100, email: 254, phone: 30, service: 100, message: 2000 } as const;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(`contact:${ip}`);
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    // Honeypot: bots fill the hidden "website" field. Pretend success, do nothing.
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ success: true });
    }

    // Strings only; optional fields may be absent.
    for (const key of ['name', 'email', 'phone', 'service', 'message'] as const) {
      const v = body[key];
      if (v !== undefined && v !== null && typeof v !== 'string') {
        return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
      }
    }

    const name = (body.name ?? '').trim();
    const email = (body.email ?? '').trim();
    const phone = (body.phone ?? '').trim();
    const service = (body.service ?? '').trim();
    const message = (body.message ?? '').trim();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }
    if (
      name.length > LIMITS.name ||
      phone.length > LIMITS.phone ||
      service.length > LIMITS.service ||
      message.length > LIMITS.message
    ) {
      return NextResponse.json({ error: 'One or more fields are too long.' }, { status: 400 });
    }
    if (!isEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    await connectDB();

    // Save to database
    await Submission.create({
      name,
      email,
      phone,
      subject: service,
      message,
      type: 'Contact Form',
      source: 'Website Contact Form',
      extraData: service ? { service } : undefined,
    });

    // Try to send notification email via Resend (if configured)
    try {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        // Fetch dynamic receiver email from CMS
        let receiverEmail = 'antoine.lyles@yahoo.com';
        try {
          const contentDoc = await Content.findOne({ key: "complete_data" }).lean() as any;
          if (contentDoc?.data?.contactPage?.email) {
            receiverEmail = contentDoc.data.contactPage.email;
          } else if (contentDoc?.data?.quote?.email) {
            receiverEmail = contentDoc.data.quote.email;
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

        const { Resend } = await import('resend');
        const resend = new Resend(resendKey);

        const eName = escapeHtml(name);
        const eEmail = escapeHtml(email);

        const { error: resendError } = await resend.emails.send({
          from: process.env.RESEND_FROM || 'Contact Form <noreply@410-muscletherapy.com>',
          to: receiverEmail,
          replyTo: email,
          subject: singleLine(`New Contact Form Submission from ${name}`),
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
              <h2 style="color: #1a1a1a; border-bottom: 2px solid #be9c25; padding-bottom: 10px;">New Contact Form Submission</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #888; width: 120px;">Name:</td><td style="padding: 8px 0; font-weight: bold;">${eName}</td></tr>
                <tr><td style="padding: 8px 0; color: #888;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${eEmail}">${eEmail}</a></td></tr>
                ${phone ? `<tr><td style="padding: 8px 0; color: #888;">Phone:</td><td style="padding: 8px 0;">${escapeHtml(phone)}</td></tr>` : ''}
                ${service ? `<tr><td style="padding: 8px 0; color: #888;">Service:</td><td style="padding: 8px 0;">${escapeHtml(service)}</td></tr>` : ''}
              </table>
              ${message ? `<div style="margin-top: 16px; padding: 12px; background: #f9f9f9; border-radius: 6px;"><p style="color: #888; margin: 0 0 4px;">Message:</p><p style="margin: 0; color: #333; white-space: pre-wrap;">${escapeHtml(message)}</p></div>` : ''}
              <p style="margin-top: 20px; font-size: 12px; color: #aaa;">Sent from 410 Muscle Therapy website contact form</p>
            </div>
          `,
        });
        if (resendError) {
          console.error('Email notification failed (submission still saved):', resendError.name);
        }
      }
    } catch (emailErr) {
      console.error('Email notification failed (submission still saved)');
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been submitted successfully.',
    });
  } catch (error: any) {
    console.error('Contact Form Error:', error?.message);
    return NextResponse.json(
      { error: 'Failed to submit contact form.' },
      { status: 500 }
    );
  }
}
