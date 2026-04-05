import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createQuote } from '@/lib/quotes/store';
import { enterpriseConfirmation } from '@/lib/nurture';
import { pushToCRM } from '@/lib/crm';
import { rateLimit, limiters } from '@/lib/ratelimit';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/enterprise/requisition
 *
 * Handles the fast enterprise requisition form.
 * Bypasses the full quote pipeline — sends admin a term-sheet-ready
 * email within seconds so a human can respond within hours.
 */
export async function POST(request: Request) {
  const limited = await rateLimit(limiters.enterprise, request);
  if (limited) return limited;

  const body = await request.json();
  const {
    companyName, contactName, email, phone,
    robotType, fleetSize, environment, timeline, budget, notes,
  } = body as {
    companyName: string; contactName: string; email: string; phone?: string;
    robotType: string; fleetSize: string; environment: string;
    timeline: string; budget: string; notes?: string;
  };

  if (!companyName || !contactName || !email || !robotType || !fleetSize || !environment || !timeline || !budget) {
    return NextResponse.json({ success: false, message: 'Required fields missing.' }, { status: 400 });
  }

  const timestamp = new Date().toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://deeptechnologies.dev';

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Enterprise Requisition — Deeptech</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111;border:1px solid #222;border-radius:8px;overflow:hidden;">
        <tr><td style="background:#0f0f0f;padding:32px 40px;border-bottom:1px solid #222;">
          <p style="margin:0;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#666;">Deeptech · Enterprise</p>
          <h1 style="margin:8px 0 0;font-size:22px;font-weight:600;color:#fff;letter-spacing:-0.02em;">🏢 Enterprise Requisition</h1>
        </td></tr>
        <tr><td style="padding:32px 40px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            ${[
              ['Company', companyName],
              ['Contact', `${contactName}${phone ? ' · ' + phone : ''}`],
              ['Reply-to', email],
              ['Robot Type', robotType],
              ['Fleet Size', fleetSize],
              ['Deployment Environment', environment],
              ['Timeline', timeline],
              ['Budget', budget],
              ...(notes ? [['Notes', notes]] : []),
            ].map(([l, v]) => `
              <tr>
                <td style="padding:8px 0;vertical-align:top;width:40%;">
                  <p style="margin:0;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#666;">${l}</p>
                </td>
                <td style="padding:8px 0 8px 16px;vertical-align:top;">
                  <p style="margin:0;font-size:14px;color:#eee;font-weight:500;">${v}</p>
                </td>
              </tr>`).join('')}
          </table>
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <a href="mailto:${email}?subject=Re: Enterprise Robotics Requisition — ${companyName}"
            style="display:inline-block;background:#fff;color:#000;font-size:13px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:4px;letter-spacing:0.04em;">
            Reply to ${contactName.split(' ')[0]} →
          </a>
          <a href="${baseUrl}/admin/quotes"
            style="display:inline-block;margin-left:12px;background:transparent;color:#aaa;font-size:13px;font-weight:500;text-decoration:none;padding:14px 0;border-bottom:1px solid #444;">
            Open Admin
          </a>
        </td></tr>
        <tr><td style="background:#0a0a0a;border-top:1px solid #1a1a1a;padding:20px 40px;">
          <p style="margin:0;font-size:11px;color:#444;">Received ${timestamp}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const adminEmail = process.env.ADMIN_EMAIL || 'info@deeptechnologies.dev';

    await resend.emails.send({
      from: 'Deep Tech <info@deeptechnologies.dev>',
      to: adminEmail,
      replyTo: email,
      subject: `🏢 Enterprise Req — ${companyName} · ${robotType} · ${fleetSize}`,
      html,
      text: `Enterprise Requisition\n\nCompany: ${companyName}\nContact: ${contactName} (${email})${phone ? '\nPhone: ' + phone : ''}\nRobot Type: ${robotType}\nFleet Size: ${fleetSize}\nEnvironment: ${environment}\nTimeline: ${timeline}\nBudget: ${budget}${notes ? '\nNotes: ' + notes : ''}\n\nReceived: ${timestamp}`,
    });
  } catch (err) {
    console.error('[enterprise/requisition] Email send failed:', err);
    return NextResponse.json({ success: false, message: 'Failed to send — please try again.' }, { status: 500 });
  }

  // ── Create a system record in Redis so this lead is never lost ──────────────
  // Even if the admin email is missed, deleted, or lands in spam, the requisition
  // will appear in /admin/quotes with status 'pending_review'.
  try {
    const quote = await createQuote({
      requestId: `enterprise-${Date.now()}`,
      customerName: `${contactName} (${companyName})`,
      customerEmail: email,
      inquiryType: 'Autonomous solutions',
      summary: `Enterprise req: ${robotType}, fleet ${fleetSize}, ${environment}. Budget: ${budget}. Timeline: ${timeline}.`,
      lineItems: [], // No line items yet — admin will build the quote after the discovery call
      notes: [
        `Company: ${companyName}`,
        `Contact: ${contactName}${phone ? ' · ' + phone : ''}`,
        `Robot type: ${robotType}`,
        `Fleet size: ${fleetSize}`,
        `Environment: ${environment}`,
        `Timeline: ${timeline}`,
        `Budget: ${budget}`,
        notes ? `Notes: ${notes}` : '',
      ].filter(Boolean).join('\n'),
    });
    console.log(`[enterprise/requisition] System record created: ${quote.id} for ${companyName} (${email})`);
  } catch (err) {
    // Non-fatal — the admin email already went out. Log and continue.
    console.error('[enterprise/requisition] Failed to create Redis record:', err);
  }

  // ── Send customer D+0 acknowledgment (Seq 4) ────────────────────────────────
  try {
    await enterpriseConfirmation({ resend, email, contactName, companyName, robotType, fleetSize });
    console.log(`[enterprise/requisition] Customer confirmation sent to ${email}`);
  } catch (err) {
    console.error('[enterprise/requisition] Customer confirmation failed (non-fatal):', err);
  }

  // Fire-and-forget: push to CRM
  const [firstName, ...rest] = contactName.trim().split(' ');
  pushToCRM({
    leadType: 'enterprise_requisition',
    capturedAt: new Date().toISOString(),
    email, firstName, lastName: rest.join(' ') || undefined,
    fullName: contactName, phone, company: companyName,
    robotType, fleetSize, environment, timeline, budget,
  });

  console.log(`[enterprise/requisition] Req received: ${companyName} (${email}) — ${robotType}, fleet: ${fleetSize}`);
  return NextResponse.json({ success: true });
}

