import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getQuote, addMessage } from '@/lib/quotes/store';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/quotes/[id]/message
 *
 * Customer sends a message on their quote. No auth required — the customer
 * must know their quote ID (which is effectively a capability URL).
 *
 * Body: { name: string, email: string, message: string }
 *
 * - Logs the message in the quote's thread
 * - Sends admin notification email
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const quote = await getQuote(id);
  if (!quote) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
  }

  const { name, email, message } = await request.json();
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'name, email, and message are required' }, { status: 400 });
  }

  // Verify email matches quote customer (basic security)
  if (email.toLowerCase() !== quote.customerEmail.toLowerCase()) {
    return NextResponse.json({ error: 'Email does not match quote' }, { status: 403 });
  }

  // Log message in quote thread
  const msg = await addMessage(id, {
    from: 'customer',
    to: 'admin',
    subject: `Reply from ${name}`,
    body: message,
    sentBy: email,
  });

  // Send admin notification
  try {
    const adminEmail = process.env.ADMIN_EMAIL || '1deeptechnology@gmail.com';
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://deeptechnologies.dev';
    const fmt = (n: number) => '$' + n.toFixed(2);

    await resend.emails.send({
      from: 'Deep Tech <info@deeptechnologies.dev>',
      to: adminEmail,
      replyTo: email,
      subject: `💬 Customer Reply — ${name} (Quote ${id})`,
      html: `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0a0a0a;color:#ccc;border-radius:8px;border:1px solid #222;">
        <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#3b82f6;margin:0 0 16px;">Customer Message</p>
        <h2 style="color:#fff;margin:0 0 4px;font-size:18px;">${name}</h2>
        <p style="font-size:12px;color:#888;margin:0 0 16px;">${email}</p>
        <div style="background:#111;border:1px solid #333;border-radius:6px;padding:16px;margin-bottom:20px;">
          <p style="font-size:14px;color:#eee;line-height:1.7;white-space:pre-wrap;margin:0;">${message}</p>
        </div>
        <table style="width:100%;font-size:12px;color:#888;">
          <tr><td>Quote</td><td style="color:#eee;">${id} — ${quote.summary}</td></tr>
          <tr><td>Total</td><td style="color:#eee;">${fmt(quote.total)}</td></tr>
          <tr><td>Status</td><td style="color:#eee;">${quote.status}</td></tr>
        </table>
        <div style="margin-top:24px;">
          <a href="${baseUrl}/admin/quotes" style="display:inline-block;background:#3b82f6;color:#fff;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;">Reply in Dashboard →</a>
        </div>
      </div>`,
      text: `Customer Reply from ${name} (${email})\n\n${message}\n\nQuote: ${id} — ${quote.summary}\nTotal: ${fmt(quote.total)}\nStatus: ${quote.status}\n\nReply in dashboard: ${baseUrl}/admin/quotes`,
    });
  } catch (emailErr) {
    console.error('[message] Failed to send admin notification:', emailErr);
  }

  console.log(`[message] Customer ${email} sent message on quote ${id}`);
  return NextResponse.json({ success: true, message: msg });
}

