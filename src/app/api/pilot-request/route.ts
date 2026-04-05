import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createQuote } from '@/lib/quotes/store';
import { updateQuote } from '@/lib/quotes/store';
import { rateLimit, limiters } from '@/lib/ratelimit';
import { pushToCRM } from '@/lib/crm';

/**
 * POST /api/pilot-request
 *
 * Accepts a pilot program intake form submission.
 * 1. Creates a quote record in Redis with status `pending_review`
 * 2. Sends admin notification (styled HTML)
 * 3. Sends customer confirmation email
 *
 * Pilot pricing (credited toward full fleet order):
 *   1 unit  → $2,500 pilot fee
 *   2–3 units → $5,000 pilot fee
 */
export async function POST(request: Request) {
  const limited = await rateLimit(limiters.contact, request);
  if (limited) return limited;

  let body: {
    companyName?: string;
    contactName?: string;
    email?: string;
    phone?: string;
    environment?: string;
    robotType?: string;
    fleetSize?: string;
    timeline?: string;
    useCase?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { companyName, contactName, email, phone, environment, robotType, fleetSize, timeline, useCase } = body;

  if (!companyName || !contactName || !email || !environment || !robotType || !fleetSize) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const units = parseInt(fleetSize, 10) || 1;
  const pilotFee = units === 1 ? 2500 : 5000;
  const pilotFeeFormatted = `$${pilotFee.toLocaleString()}`;

  // ── Create quote record ──────────────────────────────────────────────────────
  let quoteId = '';
  try {
    const quote = await createQuote({
      requestId: `pilot-${Date.now()}`,
      customerName: `${contactName} (${companyName})`,
      customerEmail: email,
      inquiryType: 'Autonomous solutions',
      summary: `30-day pilot: ${robotType}, ${units} unit${units > 1 ? 's' : ''}, ${environment}. Fee: ${pilotFeeFormatted} (credited toward full order).`,
      lineItems: [
        {
          description: `30-Day Pilot Program — ${robotType} (${units} unit${units > 1 ? 's' : ''})`,
          vendor: 'Deep Tech',
          vendorCost: pilotFee / 1.15,
          markup: 0.15,
          billingCycle: 'one_time',
          notes: `Credited toward full fleet order. Environment: ${environment}. Timeline: ${timeline ?? 'TBD'}.`,
        },
      ],
      notes: [
        `Company: ${companyName}`,
        `Contact: ${contactName}${phone ? ' · ' + phone : ''}`,
        `Robot type: ${robotType}`,
        `Fleet goal: ${units} unit${units > 1 ? 's' : ''}`,
        `Environment: ${environment}`,
        `Timeline: ${timeline ?? 'TBD'}`,
        useCase ? `Use case: ${useCase}` : '',
      ].filter(Boolean).join('\n'),
    });

    quoteId = quote.id;

    // Immediately elevate to pending_review so it surfaces in admin triage
    await updateQuote(quote.id, { status: 'pending_review' });
    console.log(`[pilot-request] Created ${quote.id} (pending_review) for ${email}`);
  } catch (err) {
    console.error('[pilot-request] Redis error:', err);
    return NextResponse.json({ error: 'Failed to create pilot record' }, { status: 500 });
  }

  // ── Send emails ──────────────────────────────────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL ?? 'info@deeptechnologies.dev';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://deeptechnologies.dev';

  if (resendKey) {
    const resend = new Resend(resendKey);

    await Promise.allSettled([
      // Admin notification
      resend.emails.send({
        from: 'Deep Tech <info@deeptechnologies.dev>',
        to: adminEmail,
        subject: `🚀 New Pilot Request — ${companyName} (${units} robot${units > 1 ? 's' : ''}, ${pilotFeeFormatted})`,
        html: adminPilotHtml({ companyName, contactName, email, phone, environment, robotType, units, pilotFeeFormatted, timeline, useCase, quoteId, baseUrl }),
        text: `New pilot request\n\nCompany: ${companyName}\nContact: ${contactName}\nEmail: ${email}\nRobot: ${robotType}\nFleet: ${units} unit(s)\nEnvironment: ${environment}\nPilot fee: ${pilotFeeFormatted}\nQuote: ${quoteId}`,
      }),
      // Customer confirmation
      resend.emails.send({
        from: 'Deep Tech <info@deeptechnologies.dev>',
        to: email,
        subject: `Your 30-Day Pilot Request — We'll be in touch within 24 hours`,
        html: customerConfirmHtml({ contactName, companyName, robotType, units, environment, pilotFeeFormatted, baseUrl }),
        text: `Hi ${contactName},\n\nWe received your pilot request for ${units} ${robotType} unit${units > 1 ? 's' : ''} at ${companyName}.\n\nPilot fee: ${pilotFeeFormatted} (fully credited toward your full fleet order if you convert).\n\nWe'll review your submission and be in touch within 24 hours to schedule your kickoff call.\n\n— Deep Tech`,
      }),
    ]);
  }

  // Fire-and-forget: push to CRM
  const [firstName, ...rest] = (contactName ?? '').trim().split(' ');
  pushToCRM({
    leadType: 'pilot_request',
    capturedAt: new Date().toISOString(),
    email: email!,
    firstName, lastName: rest.join(' ') || undefined,
    fullName: contactName, phone, company: companyName,
    robotType, fleetSize, environment, timeline,
    quoteId: quoteId ?? undefined,
  });

  return NextResponse.json({ success: true, quoteId });
}

// ── Email templates ───────────────────────────────────────────────────────────

function adminPilotHtml(a: {
  companyName: string; contactName: string; email: string; phone?: string;
  environment: string; robotType: string; units: number; pilotFeeFormatted: string;
  timeline?: string; useCase?: string; quoteId: string; baseUrl: string;
}): string {
  return `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:580px;margin:0 auto;padding:32px;background:#0a0a0a;color:#ccc;border-radius:8px;border:1px solid #222;">
  <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#555;margin:0 0 12px;">Deep Tech · Pilot Request</p>
  <h2 style="color:#fff;margin:0 0 4px;font-size:20px;">🚀 New 30-Day Pilot Request</h2>
  <p style="font-size:14px;color:#aaa;margin:0 0 24px;"><strong style="color:#fff;">${a.contactName}</strong> at <strong style="color:#fff;">${a.companyName}</strong> wants to pilot <strong style="color:#fff;">${a.units} ${a.robotType}</strong>.</p>

  <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;">
    ${[
      ['Company', a.companyName], ['Contact', a.contactName],
      ['Email', a.email], ['Phone', a.phone ?? '—'],
      ['Robot type', a.robotType], ['Fleet size', `${a.units} unit${a.units > 1 ? 's' : ''}`],
      ['Environment', a.environment], ['Timeline', a.timeline ?? 'TBD'],
    ].map(([label, val]) => `<tr style="border-bottom:1px solid #1e1e1e;">
      <td style="padding:10px 0;color:#555;">${label}</td>
      <td style="padding:10px 0;color:#eee;text-align:right;font-weight:600;">${val}</td>
    </tr>`).join('')}
  </table>

  ${a.useCase ? `<div style="background:#111;border:1px solid #1e1e1e;border-radius:6px;padding:14px;margin-bottom:20px;"><p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#555;margin:0 0 6px;">Use Case</p><p style="font-size:13px;color:#ccc;margin:0;">${a.useCase}</p></div>` : ''}

  <div style="background:#111;border:1px solid #166534;border-radius:6px;padding:16px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;">
    <span style="font-size:12px;color:#666;text-transform:uppercase;letter-spacing:0.1em;">Pilot Fee</span>
    <span style="font-size:22px;font-weight:700;color:#16a34a;">${a.pilotFeeFormatted}</span>
  </div>

  <a href="${a.baseUrl}/admin/quotes" style="display:inline-block;background:#fff;color:#000;font-size:13px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:4px;margin-bottom:20px;">Review in Admin Dashboard →</a>

  <div style="border-top:1px solid #1e1e1e;padding-top:16px;">
    <p style="font-size:11px;color:#444;margin:0;">Quote ID: <span style="font-family:monospace;">${a.quoteId}</span></p>
  </div>
</div>`;
}

function customerConfirmHtml(a: {
  contactName: string; companyName: string; robotType: string;
  units: number; environment: string; pilotFeeFormatted: string; baseUrl: string;
}): string {
  return `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#fff;color:#333;border:1px solid #eee;border-radius:8px;">
  <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#999;margin:0 0 16px;">Deep Tech · Pilot Program</p>
  <h2 style="color:#111;margin:0 0 8px;font-size:22px;">We've received your pilot request.</h2>
  <p style="color:#555;font-size:14px;margin:0 0 24px;">Hi ${a.contactName}, our team will review your submission and reach out within <strong>24 hours</strong> to schedule your kickoff call.</p>

  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
    ${[
      ['Company', a.companyName], ['Robot', a.robotType],
      ['Fleet size', `${a.units} unit${a.units > 1 ? 's' : ''}`], ['Environment', a.environment],
    ].map(([l, v]) => `<tr style="border-bottom:1px solid #eee;">
      <td style="padding:10px 14px;font-size:13px;color:#666;">${l}</td>
      <td style="padding:10px 14px;font-size:13px;color:#111;font-weight:600;text-align:right;">${v}</td>
    </tr>`).join('')}
  </table>

  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:16px;margin-bottom:24px;">
    <p style="font-size:13px;color:#166534;margin:0;"><strong>Pilot fee: ${a.pilotFeeFormatted}</strong> — fully credited toward your full fleet order if you convert at Day 30.</p>
  </div>

  <p style="font-size:13px;color:#555;margin:0 0 24px;">Questions in the meantime? Reply to this email or use the chat on our site.</p>
  <a href="${a.baseUrl}/robotics" style="display:inline-block;background:#111;color:#fff;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;">Explore the Robot Catalog →</a>
  <p style="font-size:11px;color:#aaa;margin-top:24px;">Deep Tech · AI-native robotics procurement</p>
</div>`;
}
