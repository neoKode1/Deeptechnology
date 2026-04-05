/**
 * Nurture email sequences — D+0, D+3, D+7
 *
 * Uses Resend's `scheduledAt` parameter so all three emails are queued in a
 * single burst at lead-capture time. No cron required.
 *
 * Sequences:
 *  - ROI Calculator leads   → roiNurture()
 *  - Contact form leads     → contactNurture()
 */

import { Resend } from 'resend';

const FROM = 'Deep Tech <info@deeptechnologies.dev>';
const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://deeptechnologies.dev';

/** ISO timestamp N days from now */
function daysFromNow(n: number): string {
  return new Date(Date.now() + n * 86_400_000).toISOString();
}

// ─── ROI nurture ─────────────────────────────────────────────────────────────

export interface RoiNurtureArgs {
  resend: Resend;
  email: string;
  units: number;
  monthlyProfit: number;
  fmt: (n: number) => string;
}

/**
 * Schedule D+3 and D+7 follow-ups for an ROI calculator lead.
 * D+0 is sent inline by the roi-capture route itself.
 */
export async function roiNurture({ resend, email, units, monthlyProfit, fmt }: RoiNurtureArgs) {
  const profit = fmt(monthlyProfit);
  const plural = units > 1 ? 's' : '';

  // D+3 — soft check-in
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Re: your ${units}-robot ROI model — one quick question`,
    scheduledAt: daysFromNow(3),
    html: roiD3Html({ units, profit, plural }),
    text: roiD3Text({ units, profit, plural }),
  });

  // D+7 — deployment urgency
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Deployment window closing — ${units} robot${plural} → ${profit}/mo`,
    scheduledAt: daysFromNow(7),
    html: roiD7Html({ units, profit, plural }),
    text: roiD7Text({ units, profit, plural }),
  });

  // D+14 — personal note from Chad
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Personal note — your robot ROI model`,
    scheduledAt: daysFromNow(14),
    html: personalNoteHtml('ROI model', `${BASE}/contact?inquiry=robotics`),
    text: personalNoteText('ROI model', `${BASE}/contact?inquiry=robotics`),
  });
}

// ─── Contact nurture ──────────────────────────────────────────────────────────

export interface ContactNurtureArgs {
  resend: Resend;
  email: string;
  firstName: string;
  inquiry: string;
}

/**
 * Send D+0 customer confirmation + schedule D+3 and D+7 follow-ups
 * for a contact form lead.
 */
export async function contactNurture({ resend, email, firstName, inquiry }: ContactNurtureArgs) {
  // D+0 — confirmation (sent immediately, no scheduledAt)
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `We received your message, ${firstName}`,
    html: contactD0Html({ firstName, inquiry }),
    text: contactD0Text({ firstName, inquiry }),
  });

  // D+3 — progress update
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Quick update on your Deep Tech inquiry`,
    scheduledAt: daysFromNow(3),
    html: contactD3Html({ firstName }),
    text: contactD3Text({ firstName }),
  });

  // D+7 — final close
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Circling back — ${firstName}, still interested?`,
    scheduledAt: daysFromNow(7),
    html: contactD7Html({ firstName }),
    text: contactD7Text({ firstName }),
  });

  // D+14 — personal note from Chad
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `A quick note from Chad at Deep Tech`,
    scheduledAt: daysFromNow(14),
    html: personalNoteHtml('your inquiry', `${BASE}/contact`),
    text: personalNoteText('your inquiry', `${BASE}/contact`),
  });
}

// ─── Sequence 3 — Quote Follow-Up ────────────────────────────────────────────

export interface QuoteNurtureArgs {
  resend: Resend;
  email: string;
  customerName: string;
  quoteId: string;
  total: number;
  summary: string;
}

/**
 * Schedule D+3, D+7, D+8 follow-ups after a quote is marked 'sent'.
 * D+0 customer email is already sent by sendQuoteEmail() in lib/quotes/email.ts.
 */
export async function quoteNurture({ resend, email, customerName, quoteId, total, summary }: QuoteNurtureArgs) {
  const firstName = customerName.split(' ')[0];
  const fmt = (n: number) => `$${n.toLocaleString()}`;
  const orderHref = `${BASE}/orders?id=${quoteId}`;

  // D+3 — have questions?
  await resend.emails.send({
    from: FROM, to: email,
    subject: `Quick question about your Deep Tech quote`,
    scheduledAt: daysFromNow(3),
    html: quoteD3Html({ firstName, orderHref }),
    text: `Hi ${firstName},\n\nDo you have any questions about your quote? Our AI sourcing assistant can answer most questions instantly at ${orderHref}\n\nOr reply to this email and we'll respond personally.\n\n— Deep Tech`,
  });

  // D+7 — pilot upgrade offer
  await resend.emails.send({
    from: FROM, to: email,
    subject: `Alternative path — 30-day pilot before full commitment`,
    scheduledAt: daysFromNow(7),
    html: quoteD7Html({ firstName, total: fmt(total), summary, orderHref }),
    text: `Hi ${firstName},\n\nIf a full fleet feels like a big commitment, our 30-day paid pilot lets you validate performance in your environment first.\n\nStart a pilot: ${BASE}/pilot\nView your quote: ${orderHref}\n\n— Deep Tech`,
  });

  // D+8 — 24h expiry warning
  await resend.emails.send({
    from: FROM, to: email,
    subject: `⏰ Your quote expires in 24 hours`,
    scheduledAt: daysFromNow(8),
    html: quoteD8Html({ firstName, orderHref }),
    text: `Hi ${firstName},\n\nYour Deep Tech quote expires in 24 hours. Approve it at ${orderHref} or reply to this email if you need more time.\n\n— Deep Tech`,
  });
}

// ─── Sequence 4 — Enterprise Bridge ──────────────────────────────────────────

export interface EnterpriseConfirmationArgs {
  resend: Resend;
  email: string;
  contactName: string;
  companyName: string;
  robotType: string;
  fleetSize: string;
}

/** D+0 enterprise acknowledgment — term sheet in progress */
export async function enterpriseConfirmation({ resend, email, contactName, companyName, robotType, fleetSize }: EnterpriseConfirmationArgs) {
  const firstName = contactName.split(' ')[0];
  await resend.emails.send({
    from: FROM, to: email,
    subject: `Enterprise inquiry received — ${companyName}`,
    html: `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;padding:36px;background:#fff;border:1px solid #eee;border-radius:8px;color:#333;">
  <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#999;margin:0 0 16px;">Deep Tech · Enterprise</p>
  <h2 style="color:#111;margin:0 0 12px;font-size:20px;">We received your enterprise requisition, ${firstName}</h2>
  <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 16px;">We're reviewing your request for <strong style="color:#111;">${fleetSize} ${robotType} units</strong> for <strong style="color:#111;">${companyName}</strong>. Our enterprise team prepares a tailored term sheet for every request — expect to hear from us within a few hours.</p>
  <div style="background:#f9f9f9;border:1px solid #eee;border-radius:6px;padding:16px 20px;margin:0 0 24px;">
    <p style="font-size:12px;color:#888;margin:0 0 8px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;">What's in the term sheet</p>
    <p style="font-size:13px;color:#555;margin:0;line-height:1.7;">✓ Vendor recommendations with verified pricing<br/>✓ Lead times and deployment timeline<br/>✓ Fleet financing and RaaS options<br/>✓ Site readiness checklist</p>
  </div>
  <a href="${BASE}/contact?inquiry=enterprise" style="display:inline-block;background:#111;color:#fff;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;">Ask a Question →</a>
  <p style="font-size:11px;color:#bbb;margin-top:28px;">Deep Tech · <a href="${BASE}" style="color:#bbb;">${BASE.replace('https://', '')}</a></p>
</div>`,
    text: `Hi ${firstName},\n\nWe received your enterprise requisition for ${fleetSize} ${robotType} units for ${companyName}. Our team is preparing a tailored term sheet — expect to hear back within a few hours.\n\n— Deep Tech`,
  });
}

// ─── Sequence 5 — Post-Deployment Retention ───────────────────────────────────

export interface DeployedRetentionArgs {
  resend: Resend;
  email: string;
  customerName: string;
  quoteId: string;
}

/**
 * Schedule M+1, M+3, M+6 retention emails after a quote is marked 'deployed'.
 * Uses scheduledAt — Resend supports scheduling up to 1 year out.
 */
export async function deployedRetention({ resend, email, customerName, quoteId }: DeployedRetentionArgs) {
  const firstName = customerName.split(' ')[0];
  const orderHref = `${BASE}/orders?id=${quoteId}`;

  // M+1 (30 days) — 30-day check-in
  await resend.emails.send({
    from: FROM, to: email,
    subject: `30-day check-in — how are the robots performing?`,
    scheduledAt: daysFromNow(30),
    html: retentionHtml({ firstName, heading: '30-day fleet check-in', body: 'Your fleet has been live for a month. How is it performing vs. your projections? Reply and let us know — we can run a quick optimization audit at no charge.', cta: 'Request Free Audit →', ctaHref: `${BASE}/contact?inquiry=audit` }),
    text: `Hi ${firstName},\n\nYour fleet has been live for a month. How is it performing? Reply and we'll run a free optimization audit.\n\n${BASE}/contact?inquiry=audit\n\n— Deep Tech`,
  });

  // M+3 (90 days) — fleet expansion offer
  await resend.emails.send({
    from: FROM, to: email,
    subject: `Time to expand? 3-month fleet performance review`,
    scheduledAt: daysFromNow(90),
    html: retentionHtml({ firstName, heading: 'Fleet expansion opportunity', body: 'Three months in — operators typically see 15–30% higher throughput than projected by month 3 as the fleet learns your environment. If your numbers are strong, now is the optimal time to expand before Q-end lead times kick in.', cta: 'Get an Expansion Quote →', ctaHref: `${BASE}/contact?inquiry=expansion` }),
    text: `Hi ${firstName},\n\nThree months in — if your fleet is performing well, now is the optimal time to expand before Q-end lead times kick in.\n\n${BASE}/contact?inquiry=expansion\n\n— Deep Tech`,
  });

  // M+6 (180 days) — Fleet Optimization Retainer
  await resend.emails.send({
    from: FROM, to: email,
    subject: `6-month milestone — Fleet Optimization Retainer`,
    scheduledAt: daysFromNow(180),
    html: retentionHtml({ firstName, heading: '6-month milestone 🎉', body: 'Six months of autonomous operation is a major milestone. Most fleets at this stage benefit from a Fleet Optimization Retainer — monthly firmware updates, route re-optimization, vendor SLA management, and a dedicated account manager. Flat fee, cancel anytime.', cta: 'Learn About the Retainer →', ctaHref: `${BASE}/contact?inquiry=retainer` }),
    text: `Hi ${firstName},\n\nSix months in — congrats! Most fleets at this stage benefit from our Fleet Optimization Retainer (firmware updates, route optimization, SLA management). Flat fee, cancel anytime.\n\n${BASE}/contact?inquiry=retainer\n\n— Deep Tech`,
  });
}

// ─── ROI templates ───────────────────────────────────────────────────────────

function roiD3Html({ units, profit, plural }: { units: number; profit: string; plural: string }) {
  return `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;padding:36px;background:#fff;border:1px solid #eee;border-radius:8px;color:#333;">
  <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#999;margin:0 0 16px;">Deep Tech · Follow-up</p>
  <h2 style="color:#111;margin:0 0 12px;font-size:20px;">Quick check-in on your robot ROI</h2>
  <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 16px;">Three days ago you modeled a <strong style="color:#111;">${units}-robot fleet</strong> projecting <strong style="color:#16a34a;">${profit}/mo</strong> in profit. Have you had a chance to think it over?</p>
  <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 24px;">A lot of operators in your position have two questions at this stage:<br/>
  <strong>① Which vendor fits my environment?</strong><br/>
  <strong>② What's the actual procurement timeline?</strong></p>
  <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 28px;">We can answer both in a 20-minute call — and send you sourced quotes from the top vendors matching your specs within 24 hours.</p>
  <a href="${BASE}/contact?inquiry=robotics" style="display:inline-block;background:#111;color:#fff;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;">Get Sourced Quotes →</a>
  <p style="font-size:11px;color:#bbb;margin-top:28px;">Deep Tech · <a href="${BASE}" style="color:#bbb;">${BASE.replace('https://', '')}</a></p>
</div>`;
}

function roiD3Text({ units, profit, plural }: { units: number; profit: string; plural: string }) {
  return `Hi,

Three days ago you modeled a ${units}-robot fleet${plural ? 's' : ''} projecting ${profit}/mo in profit.

Have you had a chance to think it over? We can answer your vendor and timeline questions in a 20-minute call, and send sourced quotes within 24 hours.

${BASE}/contact?inquiry=robotics

— Deep Tech`;
}

function roiD7Html({ units, profit, plural }: { units: number; profit: string; plural: string }) {
  return `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;padding:36px;background:#fff;border:1px solid #eee;border-radius:8px;color:#333;">
  <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#999;margin:0 0 16px;">Deep Tech · Last touch</p>
  <h2 style="color:#111;margin:0 0 12px;font-size:20px;">Deployment window closing for Q${Math.ceil((new Date().getMonth() + 2) / 3)}</h2>
  <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 16px;">Fleet deployment slots fill up 6–10 weeks in advance. If you want your <strong style="color:#111;">${units}-robot fleet</strong> generating <strong style="color:#16a34a;">${profit}/mo</strong> this quarter, now is the time to start vendor outreach.</p>
  <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 28px;">We handle everything: vendor RFQ, contract negotiation, site readiness, and go-live support. One team, flat fee.</p>
  <div style="display:flex;gap:12px;flex-wrap:wrap;">
    <a href="${BASE}/pilot" style="display:inline-block;background:#111;color:#fff;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;">Start a 30-Day Pilot →</a>
    <a href="${BASE}/contact?inquiry=robotics" style="display:inline-block;border:1px solid #ddd;color:#333;font-size:13px;font-weight:500;text-decoration:none;padding:12px 28px;border-radius:4px;">Talk to the Team</a>
  </div>
  <p style="font-size:11px;color:#bbb;margin-top:28px;">This is our last automated follow-up. We'll only reach out again when you're ready. · <a href="${BASE}" style="color:#bbb;">${BASE.replace('https://', '')}</a></p>
</div>`;
}

function roiD7Text({ units, profit, plural }: { units: number; profit: string; plural: string }) {
  return `Hi,

Deployment slots for Q${Math.ceil((new Date().getMonth() + 2) / 3)} are filling up. If you want your ${units}-robot fleet generating ${profit}/mo this quarter, now is the time.

Start a 30-day pilot: ${BASE}/pilot
Talk to the team: ${BASE}/contact?inquiry=robotics

This is our last automated follow-up.

— Deep Tech`;
}

// ─── Contact templates ────────────────────────────────────────────────────────

function contactD0Html({ firstName, inquiry }: { firstName: string; inquiry: string }) {
  return `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;padding:36px;background:#fff;border:1px solid #eee;border-radius:8px;color:#333;">
  <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#999;margin:0 0 16px;">Deep Tech</p>
  <h2 style="color:#111;margin:0 0 12px;font-size:20px;">We got your message, ${firstName}</h2>
  <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 16px;">Thanks for reaching out about <strong style="color:#111;">${inquiry}</strong>. Our team reviews every inquiry personally — you can expect to hear from us within one business day.</p>
  <p style="font-size:13px;color:#888;margin:0 0 24px;border-left:3px solid #eee;padding-left:14px;line-height:1.7;">
    <strong style="color:#555;">What happens next:</strong><br/>
    1. We review your requirements<br/>
    2. We prepare a tailored recommendation<br/>
    3. We reach out to schedule a call (usually within 24h)
  </p>
  <a href="${BASE}/robotics" style="display:inline-block;background:#111;color:#fff;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;">Explore the Robot Catalog →</a>
  <p style="font-size:11px;color:#bbb;margin-top:28px;">Deep Tech · <a href="${BASE}" style="color:#bbb;">${BASE.replace('https://', '')}</a></p>
</div>`;
}

function contactD0Text({ firstName, inquiry }: { firstName: string; inquiry: string }) {
  return `Hi ${firstName},

We received your message about ${inquiry}. Our team reviews every inquiry personally — expect to hear from us within one business day.

What happens next:
1. We review your requirements
2. We prepare a tailored recommendation
3. We reach out to schedule a call

Explore our robot catalog: ${BASE}/robotics

— Deep Tech`;
}

function contactD3Html({ firstName }: { firstName: string }) {
  return `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;padding:36px;background:#fff;border:1px solid #eee;border-radius:8px;color:#333;">
  <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#999;margin:0 0 16px;">Deep Tech · Follow-up</p>
  <h2 style="color:#111;margin:0 0 12px;font-size:20px;">Quick update, ${firstName}</h2>
  <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 16px;">We wanted to check in. If you've had a chance to explore the site, our <a href="${BASE}/robotics" style="color:#111;">robot catalog</a> has verified pricing and lead times for all major vendors — including Unitree, Boston Dynamics, Serve Robotics, and more.</p>
  <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 28px;">If you're evaluating multiple vendors or need a side-by-side comparison, we can pull that together for you — just reply to this email.</p>
  <a href="${BASE}/contact" style="display:inline-block;border:1px solid #ddd;color:#333;font-size:13px;font-weight:500;text-decoration:none;padding:12px 28px;border-radius:4px;">Reply to this Email</a>
  <p style="font-size:11px;color:#bbb;margin-top:28px;">Deep Tech · <a href="${BASE}" style="color:#bbb;">${BASE.replace('https://', '')}</a></p>
</div>`;
}

function contactD3Text({ firstName }: { firstName: string }) {
  return `Hi ${firstName},

Checking in — if you're evaluating multiple vendors or need a side-by-side comparison, we can pull that together. Just reply to this email.

Robot catalog with verified pricing: ${BASE}/robotics

— Deep Tech`;
}

function contactD7Html({ firstName }: { firstName: string }) {
  return `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;padding:36px;background:#fff;border:1px solid #eee;border-radius:8px;color:#333;">
  <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#999;margin:0 0 16px;">Deep Tech · Last touch</p>
  <h2 style="color:#111;margin:0 0 12px;font-size:20px;">Still interested, ${firstName}?</h2>
  <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 16px;">We know your inbox is busy. If the timing isn't right yet, no worries — we'll be here when you're ready.</p>
  <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 28px;">If you want to move forward, the fastest path is our 30-day paid pilot. It's a zero-risk way to validate robot deployment in your environment before committing to a full fleet.</p>
  <a href="${BASE}/pilot" style="display:inline-block;background:#111;color:#fff;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;">Learn About the 30-Day Pilot →</a>
  <p style="font-size:11px;color:#bbb;margin-top:28px;">This is our last automated follow-up. · <a href="${BASE}" style="color:#bbb;">${BASE.replace('https://', '')}</a></p>
</div>`;
}

function contactD7Text({ firstName }: { firstName: string }) {
  return `Hi ${firstName},

Still interested? The fastest path is our 30-day paid pilot — a zero-risk way to validate robot deployment before committing to a full fleet.

${BASE}/pilot

This is our last automated follow-up.

— Deep Tech`;
}

// ─── Shared / reusable templates ─────────────────────────────────────────────

function personalNoteHtml(topic: string, ctaHref: string) {
  return `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;padding:36px;background:#fff;border:1px solid #eee;border-radius:8px;color:#333;">
  <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 16px;">Hey —</p>
  <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 16px;">I'm Chad, founder of Deep Tech. I noticed you engaged with ${topic} a couple weeks ago and wanted to reach out personally.</p>
  <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 28px;">No pitch — I'm just curious if there's a question I can answer directly, or if the timing wasn't right. Either way, happy to chat for 15 minutes.</p>
  <a href="${ctaHref}" style="display:inline-block;background:#111;color:#fff;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;">Pick a Time →</a>
  <p style="font-size:13px;color:#888;margin-top:24px;">— Chad<br/><span style="font-size:11px;color:#bbb;">Deep Tech · Robotics &amp; Automation</span></p>
</div>`;
}

function personalNoteText(topic: string, ctaHref: string) {
  return `Hey,

I'm Chad, founder of Deep Tech. I noticed you engaged with ${topic} a couple weeks ago.

No pitch — just curious if there's a question I can answer directly. Happy to chat for 15 minutes.

${ctaHref}

— Chad
Deep Tech · Robotics & Automation`;
}

function quoteD3Html({ firstName, orderHref }: { firstName: string; orderHref: string }) {
  return `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;padding:36px;background:#fff;border:1px solid #eee;border-radius:8px;color:#333;">
  <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#999;margin:0 0 16px;">Deep Tech · Quote Follow-Up</p>
  <h2 style="color:#111;margin:0 0 12px;font-size:20px;">Any questions, ${firstName}?</h2>
  <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 16px;">Your quote is still open. If you have questions about specific line items, lead times, or vendor capabilities, our AI sourcing assistant on your order page can answer most questions instantly.</p>
  <a href="${orderHref}" style="display:inline-block;background:#111;color:#fff;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;margin-right:12px;">View Quote &amp; Chat →</a>
  <p style="font-size:11px;color:#bbb;margin-top:28px;">Deep Tech · <a href="${BASE}" style="color:#bbb;">${BASE.replace('https://', '')}</a></p>
</div>`;
}

function quoteD7Html({ firstName, total, summary, orderHref }: { firstName: string; total: string; summary: string; orderHref: string }) {
  return `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;padding:36px;background:#fff;border:1px solid #eee;border-radius:8px;color:#333;">
  <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#999;margin:0 0 16px;">Deep Tech · Alternative Path</p>
  <h2 style="color:#111;margin:0 0 12px;font-size:20px;">Not ready to commit yet, ${firstName}?</h2>
  <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 16px;">Your quote for <strong style="color:#111;">${summary}</strong> totals <strong style="color:#111;">${total}</strong>. If a full fleet commitment feels like a big step, our 30-day paid pilot lets you validate performance in your exact environment first — then apply the pilot fee toward your full order.</p>
  <div style="display:flex;gap:12px;flex-wrap:wrap;">
    <a href="${BASE}/pilot" style="display:inline-block;background:#111;color:#fff;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;">Start a 30-Day Pilot →</a>
    <a href="${orderHref}" style="display:inline-block;border:1px solid #ddd;color:#333;font-size:13px;font-weight:500;text-decoration:none;padding:12px 28px;border-radius:4px;">View Full Quote</a>
  </div>
  <p style="font-size:11px;color:#bbb;margin-top:28px;">Deep Tech · <a href="${BASE}" style="color:#bbb;">${BASE.replace('https://', '')}</a></p>
</div>`;
}

function quoteD8Html({ firstName, orderHref }: { firstName: string; orderHref: string }) {
  return `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;padding:36px;background:#fff;border:1px solid #eee;border-radius:8px;color:#333;">
  <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#e53e3e;margin:0 0 16px;">⏰ Expiring in 24 hours</p>
  <h2 style="color:#111;margin:0 0 12px;font-size:20px;">Your quote expires tomorrow, ${firstName}</h2>
  <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 24px;">Pricing and vendor availability are only locked in for 9 days. After that, we'll need to re-source and pricing may change. Approve your quote now to lock it in — or reply and we'll extend it.</p>
  <a href="${orderHref}" style="display:inline-block;background:#e53e3e;color:#fff;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;">Approve Quote →</a>
  <p style="font-size:11px;color:#bbb;margin-top:28px;">Deep Tech · <a href="${BASE}" style="color:#bbb;">${BASE.replace('https://', '')}</a></p>
</div>`;
}

function retentionHtml({ firstName, heading, body, cta, ctaHref }: { firstName: string; heading: string; body: string; cta: string; ctaHref: string }) {
  return `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;padding:36px;background:#fff;border:1px solid #eee;border-radius:8px;color:#333;">
  <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#999;margin:0 0 16px;">Deep Tech · Fleet Update</p>
  <h2 style="color:#111;margin:0 0 12px;font-size:20px;">${heading}</h2>
  <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 28px;">Hi ${firstName} — ${body}</p>
  <a href="${ctaHref}" style="display:inline-block;background:#111;color:#fff;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;">${cta}</a>
  <p style="font-size:11px;color:#bbb;margin-top:28px;">Deep Tech · <a href="${BASE}" style="color:#bbb;">${BASE.replace('https://', '')}</a></p>
</div>`;
}
