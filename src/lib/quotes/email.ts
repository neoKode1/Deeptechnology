import { Resend } from 'resend';
import type { Quote } from './types';

const resend = new Resend(process.env.RESEND_API_KEY);

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://deeptech.varyai.link';

/** Admin email for quote replies */
export const ADMIN_EMAIL = 'info@deeptechnology.com';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

/**
 * Encode quote data into a URL-safe base64 string so the public
 * quote page works without server-side storage (Vercel serverless
 * has ephemeral filesystem).
 */
function encodeQuotePayload(quote: Quote): string {
  return Buffer.from(JSON.stringify(quote)).toString('base64url');
}

/**
 * Send a branded quote email to the customer via Resend.
 * Called when a quote's status transitions to "sent".
 */
export async function sendQuoteEmail(quote: Quote): Promise<{ success: boolean; error?: string }> {
  const payload = encodeQuotePayload(quote);
  const quoteUrl = `${BASE_URL}/quote/${quote.id}?d=${payload}`;

  const lineItemRows = quote.lineItems
    .map(
      (li) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #222222;font-size:14px;color:#cccccc;">${li.description}</td>
        <td style="padding:10px 0;border-bottom:1px solid #222222;font-size:14px;color:#ffffff;text-align:right;white-space:nowrap;">${fmt(li.clientPrice)}</td>
      </tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111111;border:1px solid #222222;border-radius:8px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:#0a0a0a;padding:32px 40px;border-bottom:1px solid #222222;">
            <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#666666;font-weight:500;">Deep Tech</p>
            <h1 style="margin:8px 0 0;font-size:22px;font-weight:600;color:#ffffff;letter-spacing:-0.02em;">Your Quote is Ready</h1>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:32px 40px 0;">
            <p style="margin:0;font-size:15px;color:#999999;line-height:1.6;">
              Hi ${quote.customerName.split(' ')[0]},<br /><br />
              We've prepared a quote for your <strong style="color:#ffffff;">${quote.inquiryType.toLowerCase()}</strong> request. Here's a summary:
            </p>
          </td>
        </tr>

        <!-- Summary -->
        <tr>
          <td style="padding:24px 40px 0;">
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#666666;font-weight:500;">Project</p>
            <p style="margin:0;font-size:14px;color:#cccccc;line-height:1.5;">${quote.summary}</p>
          </td>
        </tr>

        <!-- Line Items -->
        <tr>
          <td style="padding:28px 40px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:0 0 8px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#666666;font-weight:500;">Item</td>
                <td style="padding:0 0 8px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#666666;font-weight:500;text-align:right;">Price</td>
              </tr>
              ${lineItemRows}
              <tr>
                <td style="padding:14px 0 0;font-size:15px;font-weight:600;color:#ffffff;">Total</td>
                <td style="padding:14px 0 0;font-size:15px;font-weight:600;color:#ffffff;text-align:right;">${fmt(quote.total)}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Expiry -->
        <tr>
          <td style="padding:20px 40px 0;">
            <p style="margin:0;font-size:12px;color:#666666;">Valid until ${fmtDate(quote.expiresAt)}</p>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:32px 40px;">
            <a href="${quoteUrl}" style="display:inline-block;background:#ffffff;color:#0a0a0a;font-size:13px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;text-decoration:none;padding:14px 32px;border-radius:4px;">
              View Full Quote
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0a0a0a;border-top:1px solid #222222;padding:24px 40px;">
            <p style="margin:0;font-size:11px;color:#555555;line-height:1.6;">
              Questions? Reply to this email or reach us at <a href="mailto:info@deeptechnology.com" style="color:#888888;">info@deeptechnology.com</a>
            </p>
            <p style="margin:8px 0 0;font-size:10px;color:#333333;letter-spacing:0.15em;text-transform:uppercase;">Deep Tech — Software, Robotics & Creative Technology</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Hi ${quote.customerName.split(' ')[0]},

Your quote for ${quote.inquiryType.toLowerCase()} is ready.

${quote.summary}

${quote.lineItems.map((li) => `• ${li.description} — ${fmt(li.clientPrice)}`).join('\n')}

Total: ${fmt(quote.total)}
Valid until: ${fmtDate(quote.expiresAt)}

View your full quote: ${quoteUrl}

Questions? Reply to this email.
— Deep Tech`;

  try {
    const { error } = await resend.emails.send({
      from: 'Deep Tech <info@varyai.link>',
      to: quote.customerEmail,
      subject: `Your Deep Tech Quote — ${fmt(quote.total)}`,
      html,
      text,
    });

    if (error) {
      console.error('[quotes/email] Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log(`[quotes/email] Quote ${quote.id} emailed to ${quote.customerEmail}`);
    return { success: true };
  } catch (err) {
    console.error('[quotes/email] Unexpected error:', err);
    return { success: false, error: String(err) };
  }
}

