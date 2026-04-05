import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createQuote } from '@/lib/quotes/store';
import type { CreateQuotePayload } from '@/lib/quotes/types';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/nimbus/callback
 *
 * Nimbus (Clawdbot) calls this endpoint after completing sourcing.
 * It creates a `draft` quote in Redis and notifies the admin.
 *
 * Authentication: Authorization: Bearer <NIMBUS_CALLBACK_SECRET>
 *
 * Body shape matches CreateQuotePayload:
 *   requestId, customerName, customerEmail, inquiryType, summary, lineItems[], notes?
 *
 * Line items auto-default to 15% markup if not provided.
 */
export async function POST(request: Request) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const callbackSecret = process.env.NIMBUS_CALLBACK_SECRET;
  if (!callbackSecret) {
    console.error('[nimbus/callback] NIMBUS_CALLBACK_SECRET not configured');
    return NextResponse.json({ error: 'Callback not configured' }, { status: 503 });
  }

  const authHeader = request.headers.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (token !== callbackSecret) {
    console.warn('[nimbus/callback] Unauthorized callback attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: CreateQuotePayload;
  try {
    body = (await request.json()) as CreateQuotePayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { requestId, customerName, customerEmail, inquiryType, summary, lineItems, notes } = body;

  if (!requestId || !customerName || !customerEmail || !inquiryType || !summary || !lineItems?.length) {
    return NextResponse.json(
      { error: 'Missing required fields: requestId, customerName, customerEmail, inquiryType, summary, lineItems' },
      { status: 400 }
    );
  }

  // ── Create draft quote ────────────────────────────────────────────────────
  let quote;
  try {
    quote = await createQuote({ requestId, customerName, customerEmail, inquiryType, summary, lineItems, notes });
    console.log(`[nimbus/callback] Draft quote created: ${quote.id} for ${customerEmail} (sourcing: ${requestId})`);
  } catch (err) {
    console.error('[nimbus/callback] Failed to create quote:', err);
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }

  // ── Notify admin ──────────────────────────────────────────────────────────
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://deeptechnologies.dev';
  const adminUrl = `${baseUrl}/admin/quotes`;
  const quoteUrl = `${baseUrl}/quote/${quote.id}`;

  const lineItemRows = quote.lineItems.map((li) =>
    `<tr>
      <td style="padding:6px 0;font-size:14px;color:#111;">${li.description}</td>
      <td style="padding:6px 0;font-size:14px;color:#555;">${li.vendor}</td>
      <td style="padding:6px 0;font-size:14px;color:#111;text-align:right;">
        $${li.clientPrice.toLocaleString()}${li.billingCycle === 'monthly' ? '/mo' : ''}
      </td>
    </tr>`
  ).join('');

  const totalDisplay = quote.billingCycle === 'monthly'
    ? `$${(quote.monthlyTotal ?? 0).toLocaleString()}/mo`
    : `$${quote.total.toLocaleString()}`;

  try {
    await resend.emails.send({
      from: 'Deep Tech <info@deeptechnologies.dev>',
      to: process.env.ADMIN_EMAIL || 'info@deeptechnologies.dev',
      subject: `[Draft Quote Ready] ${customerName} — ${inquiryType}`,
      html: `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border:1px solid #e8e8e8;">
        <tr><td style="background:#111;padding:32px 40px;">
          <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#888;">Deeptech · Nimbus</p>
          <h1 style="margin:8px 0 0;font-size:22px;font-weight:600;color:#fff;">Draft Quote Ready for Review</h1>
        </td></tr>
        <tr><td style="padding:32px 40px 0;">
          <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#999;">Customer</p>
          <p style="margin:0 0 16px;font-size:15px;color:#111;font-weight:600;">${customerName} &lt;${customerEmail}&gt;</p>
          <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#999;">Inquiry</p>
          <p style="margin:0 0 16px;font-size:15px;color:#111;">${inquiryType}</p>
          <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#999;">Summary</p>
          <p style="margin:0 0 24px;font-size:14px;color:#333;line-height:1.6;">${summary}</p>
        </td></tr>
        <tr><td style="padding:0 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eee;padding-top:16px;">
            <tr>
              <th style="text-align:left;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#999;padding-bottom:8px;">Item</th>
              <th style="text-align:left;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#999;padding-bottom:8px;">Vendor</th>
              <th style="text-align:right;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#999;padding-bottom:8px;">Price</th>
            </tr>
            ${lineItemRows}
            <tr><td colspan="3" style="border-top:1px solid #eee;padding-top:8px;"></td></tr>
            <tr>
              <td colspan="2" style="font-size:13px;font-weight:600;color:#111;padding:4px 0;">Total</td>
              <td style="font-size:15px;font-weight:700;color:#111;text-align:right;">${totalDisplay}</td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <a href="${adminUrl}" style="display:inline-block;background:#111;color:#fff;font-size:13px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;text-decoration:none;padding:14px 28px;margin-right:12px;">Review in Admin →</a>
          <a href="${quoteUrl}" style="display:inline-block;background:#f5f5f5;color:#111;font-size:13px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;text-decoration:none;padding:14px 28px;border:1px solid #ddd;">Preview Quote</a>
        </td></tr>
        <tr><td style="background:#f9f9f9;border-top:1px solid #eee;padding:20px 40px;">
          <p style="margin:0;font-size:11px;color:#aaa;">Quote ID: ${quote.id} · Sourcing request: ${requestId} · Status: draft</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
      text: `Draft Quote Ready: ${customerName} (${customerEmail})\nInquiry: ${inquiryType}\nSummary: ${summary}\nTotal: ${totalDisplay}\nQuote ID: ${quote.id}\n\nReview: ${adminUrl}\nPreview: ${quoteUrl}`,
    });
    console.log(`[nimbus/callback] Admin notification sent for draft quote ${quote.id}`);
  } catch (emailErr) {
    console.error('[nimbus/callback] Admin email failed (quote still created):', emailErr);
  }

  return NextResponse.json({ success: true, quoteId: quote.id, status: quote.status }, { status: 201 });
}

