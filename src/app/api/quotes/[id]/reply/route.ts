import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getQuote, addMessage } from '@/lib/quotes/store';
import { isAuthorizedRequest, unauthorizedResponse } from '@/lib/admin-auth';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/quotes/[id]/reply
 *
 * Send an admin reply to the customer via Resend and log it in the quote's
 * message thread. Requires admin authentication (admin_secret cookie).
 *
 * Body: { subject: string, body: string }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAuthorizedRequest(request)) return unauthorizedResponse();

  const { id } = await params;
  const quote = await getQuote(id);
  if (!quote) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
  }

  const { subject, body } = await request.json();
  if (!subject || !body) {
    return NextResponse.json({ error: 'subject and body are required' }, { status: 400 });
  }

  // Send email via Resend
  try {
    const { error } = await resend.emails.send({
      from: 'Deep Tech <info@deeptechnologies.dev>',
      to: quote.customerEmail,
      replyTo: 'info@deeptechnologies.dev',
      subject,
      html: `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#111;color:#ccc;border-radius:8px;">
        <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#666;margin:0 0 16px;">Deep Tech</p>
        <p style="font-size:15px;color:#eee;line-height:1.6;">Hi ${quote.customerName.split(' ')[0]},</p>
        <div style="font-size:14px;color:#ccc;line-height:1.7;margin:16px 0;white-space:pre-wrap;">${body}</div>
        <hr style="border:none;border-top:1px solid #333;margin:24px 0;" />
        <p style="font-size:12px;color:#555;">Re: Quote ${quote.id} — ${quote.summary}</p>
        <p style="font-size:11px;color:#444;margin-top:12px;">Deep Tech — Software, Robotics & Creative Technology</p>
      </div>`,
      text: `Hi ${quote.customerName.split(' ')[0]},\n\n${body}\n\n---\nRe: Quote ${quote.id} — ${quote.summary}\n— Deep Tech`,
    });

    if (error) {
      console.error('[reply] Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } catch (err) {
    console.error('[reply] Failed to send email:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }

  // Log message in quote thread
  const msg = await addMessage(id, {
    from: 'admin',
    to: quote.customerEmail,
    subject,
    body,
    sentBy: 'admin',
  });

  console.log(`[reply] Sent reply to ${quote.customerEmail} for quote ${id}`);
  return NextResponse.json({ success: true, message: msg });
}

