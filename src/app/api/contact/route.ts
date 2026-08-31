import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';
import Content from '@/models/Content';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, phone, service, message } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required.' },
        { status: 400 }
      );
    }

    // Save to database
    const submission = await Submission.create({
      name,
      email,
      phone: phone || '',
      subject: service || '',
      message: message || '',
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
          console.error("Error fetching dynamic email", e);
        }

        if (receiverEmail) {
          receiverEmail = receiverEmail.replace(/\s+/g, '').toLowerCase();
        }
        if (!receiverEmail || !receiverEmail.includes('@')) {
          receiverEmail = 'antoine.lyles@yahoo.com';
        }

        const { Resend } = await import('resend');
        const resend = new Resend(resendKey);

        await resend.emails.send({
          from: 'Contact Form <noreply@410-muscletherapy.com>',
          to: receiverEmail,
          subject: `New Contact Form Submission from ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
              <h2 style="color: #1a1a1a; border-bottom: 2px solid #be9c25; padding-bottom: 10px;">New Contact Form Submission</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #888; width: 120px;">Name:</td><td style="padding: 8px 0; font-weight: bold;">${name}</td></tr>
                <tr><td style="padding: 8px 0; color: #888;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
                ${phone ? `<tr><td style="padding: 8px 0; color: #888;">Phone:</td><td style="padding: 8px 0;">${phone}</td></tr>` : ''}
                ${service ? `<tr><td style="padding: 8px 0; color: #888;">Service:</td><td style="padding: 8px 0;">${service}</td></tr>` : ''}
              </table>
              ${message ? `<div style="margin-top: 16px; padding: 12px; background: #f9f9f9; border-radius: 6px;"><p style="color: #888; margin: 0 0 4px;">Message:</p><p style="margin: 0; color: #333;">${message}</p></div>` : ''}
              <p style="margin-top: 20px; font-size: 12px; color: #aaa;">Sent from 410 Muscle Therapy website contact form</p>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.error('Email notification failed (submission still saved):', emailErr);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Your message has been submitted successfully.',
      id: submission._id 
    });
  } catch (error: any) {
    console.error('Contact Form Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form.' },
      { status: 500 }
    );
  }
}
