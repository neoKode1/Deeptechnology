import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';
import { roiNurture } from '@/lib/nurture';
import { pushToCRM } from '@/lib/crm';
import { rateLimit, limiters } from '@/lib/ratelimit';

export interface RoiParams {
  units: number;
  deliveries: number;
  commission: number;
  daysPerMonth: number;
  leaseCost: number;
  // derived
  monthlyRevenue: number;
  monthlyCost: number;
  monthlyProfit: number;
  roi: number;
  breakEvenDays: number | null;
}

/**
 * POST /api/roi-capture
 *
 * Called when a visitor provides their email in the ROI Calculator gate.
 * 1. Saves the lead + ROI parameters to Redis (roi-lead:{id})
 * 2. Sends a D+0 ROI report email via Resend
 *
 * Body: { email: string, roiParams: RoiParams }
 */
export async function POST(request: Request) {
  const limited = await rateLimit(limiters.roi, request);
  if (limited) return limited;

  let body: { email: string; roiParams: RoiParams };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { email, roiParams } = body;

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
  }
  if (!roiParams || typeof roiParams.units !== 'number') {
    return NextResponse.json({ error: 'roiParams is required' }, { status: 400 });
  }

  const id = `roi-lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const timestamp = new Date().toISOString();
  const leadRecord = { id, email, roiParams, timestamp, source: 'roi_calculator' };

  // ── Persist to Redis ──────────────────────────────────────────────────────
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    await redis.set(`roi-lead:${id}`, JSON.stringify(leadRecord), { ex: 60 * 60 * 24 * 90 }); // 90-day TTL
    await redis.lpush('roi-leads', id);
    console.log(`[roi-capture] Saved lead ${id} for ${email}`);
  } catch (err) {
    console.error('[roi-capture] Redis error:', err);
    // Don't fail the request — still send the email
  }

  // ── Send D+0 ROI report email ─────────────────────────────────────────────
  const fmt = (n: number) =>
    n >= 1000 ? '$' + (n / 1000).toFixed(1) + 'k' : '$' + n.toFixed(0);
  const pct = (n: number) => (n >= 0 ? '+' : '') + n.toFixed(0) + '%';

  const { units, deliveries, commission, daysPerMonth, leaseCost,
    monthlyRevenue, monthlyCost, monthlyProfit, roi, breakEvenDays } = roiParams;

  const resendKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || 'info@deeptechnologies.dev';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://deeptechnologies.dev';

  if (resendKey) {
    try {
      const resend = new Resend(resendKey);

      // Customer D+0 email
      await resend.emails.send({
        from: 'Deep Tech <info@deeptechnologies.dev>',
        to: email,
        subject: `Your Delivery Robot ROI Report — ${fmt(monthlyProfit)}/mo projected profit`,
        html: roiEmailHtml({ units, deliveries, commission, daysPerMonth, leaseCost,
          monthlyRevenue, monthlyCost, monthlyProfit, roi, breakEvenDays, baseUrl, fmt, pct }),
        text: roiEmailText({ units, deliveries, commission, daysPerMonth, leaseCost,
          monthlyRevenue, monthlyCost, monthlyProfit, roi, breakEvenDays, baseUrl, fmt, pct }),
      });

      // Admin notification
      const profitColor = monthlyProfit >= 0 ? '#16a34a' : '#dc2626';
      await resend.emails.send({
        from: 'Deep Tech <info@deeptechnologies.dev>',
        to: adminEmail,
        subject: `📊 New ROI Lead — ${email} (${fmt(monthlyProfit)}/mo, ${units} robot${units > 1 ? 's' : ''})`,
        html: `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:580px;margin:0 auto;padding:32px;background:#0a0a0a;color:#ccc;border-radius:8px;border:1px solid #222;">
  <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#555;margin:0 0 12px;">Deep Tech · ROI Lead</p>
  <h2 style="color:#fff;margin:0 0 4px;font-size:20px;">📊 New ROI Calculator Lead</h2>
  <p style="font-size:14px;color:#aaa;margin:0 0 24px;">${email} modeled a <strong style="color:#fff;">${units}-robot fleet</strong> with <strong style="color:${profitColor};">${fmt(monthlyProfit)}/mo</strong> projected profit.</p>

  <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;">
    <tr style="border-bottom:1px solid #1e1e1e;">
      <td style="padding:10px 0;color:#555;">Fleet size</td>
      <td style="padding:10px 0;color:#eee;text-align:right;font-weight:600;">${units} robot${units > 1 ? 's' : ''}</td>
    </tr>
    <tr style="border-bottom:1px solid #1e1e1e;">
      <td style="padding:10px 0;color:#555;">Deliveries / bot / day</td>
      <td style="padding:10px 0;color:#eee;text-align:right;font-weight:600;">${deliveries}</td>
    </tr>
    <tr style="border-bottom:1px solid #1e1e1e;">
      <td style="padding:10px 0;color:#555;">Skid commission</td>
      <td style="padding:10px 0;color:#eee;text-align:right;font-weight:600;">$${commission.toFixed(2)} / delivery</td>
    </tr>
    <tr style="border-bottom:1px solid #1e1e1e;">
      <td style="padding:10px 0;color:#555;">Operating days / month</td>
      <td style="padding:10px 0;color:#eee;text-align:right;font-weight:600;">${daysPerMonth} days</td>
    </tr>
    <tr>
      <td style="padding:10px 0;color:#555;">Lease cost / bot / month</td>
      <td style="padding:10px 0;color:#eee;text-align:right;font-weight:600;">$${leaseCost.toLocaleString()}</td>
    </tr>
  </table>

  <div style="display:grid;gap:8px;margin-bottom:24px;">
    <div style="background:#111;border:1px solid #1e1e1e;border-radius:6px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:12px;color:#666;text-transform:uppercase;letter-spacing:0.1em;">Monthly Revenue</span>
      <span style="font-size:18px;font-weight:700;color:#16a34a;">${fmt(monthlyRevenue)}</span>
    </div>
    <div style="background:#111;border:1px solid #1e1e1e;border-radius:6px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:12px;color:#666;text-transform:uppercase;letter-spacing:0.1em;">Fleet Cost / mo</span>
      <span style="font-size:18px;font-weight:700;color:#eee;">${fmt(monthlyCost)}</span>
    </div>
    <div style="background:#111;border:1px solid ${monthlyProfit >= 0 ? '#166534' : '#7f1d1d'};border-radius:6px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:12px;color:#666;text-transform:uppercase;letter-spacing:0.1em;">Monthly Profit</span>
      <span style="font-size:22px;font-weight:700;color:${profitColor};">${fmt(monthlyProfit)}</span>
    </div>
    <div style="background:#111;border:1px solid #1e1e1e;border-radius:6px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:12px;color:#666;text-transform:uppercase;letter-spacing:0.1em;">ROI on Fleet Cost</span>
      <span style="font-size:18px;font-weight:700;color:${profitColor};">${pct(roi)}</span>
    </div>
  </div>

  ${breakEvenDays ? `<p style="font-size:13px;color:#888;margin:0 0 20px;">⏱ Break-even in <strong style="color:#eee;">${breakEvenDays} operating day${breakEvenDays !== 1 ? 's' : ''}</strong> per month.</p>` : ''}

  <div style="border-top:1px solid #1e1e1e;padding-top:16px;margin-top:4px;">
    <p style="font-size:11px;color:#444;margin:0 0 4px;">Lead ID: <span style="font-family:monospace;color:#555;">${id}</span></p>
    <p style="font-size:11px;color:#444;margin:0;">Captured: ${new Date(timestamp).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
  </div>
</div>`,
        text: `New ROI calculator lead\n\nEmail: ${email}\nFleet: ${units} robot${units > 1 ? 's' : ''}\nMonthly profit: ${fmt(monthlyProfit)}\nROI: ${pct(roi)}\nBreak-even: ${breakEvenDays ? breakEvenDays + ' days' : 'N/A'}\n\nLead ID: ${id}\nTimestamp: ${timestamp}`,
      });

      console.log(`[roi-capture] D+0 email sent to ${email}`);

      // Schedule D+3 and D+7 nurture emails
      await roiNurture({ resend, email, units, monthlyProfit, fmt });
      console.log(`[roi-capture] D+3 and D+7 nurture scheduled for ${email}`);
    } catch (err) {
      console.error('[roi-capture] Resend error:', err);
    }
  }

  // ── Push to CRM (fire-and-forget) ────────────────────────────────────────────
  pushToCRM({
    leadType: 'roi_calculator',
    capturedAt: new Date().toISOString(),
    email,
    roiUnits: roiParams.units,
    roiMonthlyRevenue: roiParams.monthlyRevenue,
    roiMonthlyProfit: roiParams.monthlyProfit,
    roiPercent: roiParams.roi,
    quoteId: id,
  });

  return NextResponse.json({ success: true, id });
}

// ── Email template helpers ────────────────────────────────────────────────────

type TplArgs = RoiParams & {
  baseUrl: string;
  fmt: (n: number) => string;
  pct: (n: number) => string;
};

function roiEmailHtml(a: TplArgs): string {
  const { units, deliveries, commission, daysPerMonth, leaseCost,
    monthlyRevenue, monthlyCost, monthlyProfit, roi, breakEvenDays, baseUrl, fmt, pct } = a;
  const profitColor = monthlyProfit >= 0 ? '#16a34a' : '#dc2626';

  return `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#fff;color:#333;border:1px solid #eee;border-radius:8px;">
    <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#999;margin:0 0 16px;">Deep Tech · ROI Report</p>
    <h2 style="color:#111;margin:0 0 8px;font-size:22px;">Your Delivery Robot ROI</h2>
    <p style="color:#555;font-size:14px;margin:0 0 24px;">Based on your inputs, here's the projected economics for your fleet.</p>

    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr style="background:#f9f9f9;">
        <td style="padding:10px 14px;font-size:13px;color:#666;border:1px solid #eee;">Fleet size</td>
        <td style="padding:10px 14px;font-size:13px;color:#111;font-weight:600;border:1px solid #eee;">${units} robot${units > 1 ? 's' : ''}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-size:13px;color:#666;border:1px solid #eee;">Deliveries / bot / day</td>
        <td style="padding:10px 14px;font-size:13px;color:#111;font-weight:600;border:1px solid #eee;">${deliveries}</td>
      </tr>
      <tr style="background:#f9f9f9;">
        <td style="padding:10px 14px;font-size:13px;color:#666;border:1px solid #eee;">Skid commission</td>
        <td style="padding:10px 14px;font-size:13px;color:#111;font-weight:600;border:1px solid #eee;">$${commission.toFixed(2)} / delivery</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-size:13px;color:#666;border:1px solid #eee;">Operating days / month</td>
        <td style="padding:10px 14px;font-size:13px;color:#111;font-weight:600;border:1px solid #eee;">${daysPerMonth} days</td>
      </tr>
      <tr style="background:#f9f9f9;">
        <td style="padding:10px 14px;font-size:13px;color:#666;border:1px solid #eee;">Lease cost / bot / month</td>
        <td style="padding:10px 14px;font-size:13px;color:#111;font-weight:600;border:1px solid #eee;">$${leaseCost.toLocaleString()}</td>
      </tr>
    </table>

    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr style="background:#f0fdf4;">
        <td style="padding:12px 14px;font-size:13px;color:#166534;border:1px solid #bbf7d0;">Monthly Revenue</td>
        <td style="padding:12px 14px;font-size:16px;font-weight:700;color:#16a34a;border:1px solid #bbf7d0;">${fmt(monthlyRevenue)}</td>
      </tr>
      <tr>
        <td style="padding:12px 14px;font-size:13px;color:#666;border:1px solid #eee;">Fleet Cost / mo</td>
        <td style="padding:12px 14px;font-size:16px;font-weight:700;color:#111;border:1px solid #eee;">${fmt(monthlyCost)}</td>
      </tr>
      <tr style="background:${monthlyProfit >= 0 ? '#f0fdf4' : '#fef2f2'};">
        <td style="padding:12px 14px;font-size:13px;color:${profitColor};border:1px solid ${monthlyProfit >= 0 ? '#bbf7d0' : '#fecaca'};">Monthly Profit</td>
        <td style="padding:12px 14px;font-size:20px;font-weight:700;color:${profitColor};border:1px solid ${monthlyProfit >= 0 ? '#bbf7d0' : '#fecaca'};">${fmt(monthlyProfit)}</td>
      </tr>
      <tr>
        <td style="padding:12px 14px;font-size:13px;color:#666;border:1px solid #eee;">ROI on Fleet Cost</td>
        <td style="padding:12px 14px;font-size:16px;font-weight:700;color:${profitColor};border:1px solid #eee;">${pct(roi)}</td>
      </tr>
    </table>

    ${breakEvenDays ? `<p style="font-size:13px;color:#555;margin-bottom:24px;">⏱ Break-even in <strong>${breakEvenDays} operating days</strong> per month.</p>` : ''}

    <p style="font-size:13px;color:#555;margin-bottom:24px;">Ready to deploy? Our sourcing team can match you with the right robot for your use case and get you to deployment in weeks — not months.</p>

    <a href="${baseUrl}/robotics#contact" style="display:inline-block;background:#111;color:#fff;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;">Talk to a Deployment Specialist →</a>

    <p style="font-size:11px;color:#aaa;margin-top:24px;">Deep Tech · AI-native robotics procurement · <a href="${baseUrl}" style="color:#aaa;">${baseUrl.replace('https://', '')}</a></p>
  </div>`;
}

function roiEmailText(a: TplArgs): string {
  const { units, deliveries, commission, daysPerMonth, leaseCost,
    monthlyRevenue, monthlyCost, monthlyProfit, roi, breakEvenDays, baseUrl, fmt, pct } = a;
  return `Deep Tech — Your Delivery Robot ROI Report

Fleet: ${units} robot${units > 1 ? 's' : ''}
Deliveries / bot / day: ${deliveries}
Skid commission: $${commission.toFixed(2)} / delivery
Operating days / month: ${daysPerMonth}
Lease cost / bot: $${leaseCost.toLocaleString()}/mo

Monthly Revenue: ${fmt(monthlyRevenue)}
Fleet Cost / mo: ${fmt(monthlyCost)}
Monthly Profit:  ${fmt(monthlyProfit)}
ROI on Fleet Cost: ${pct(roi)}
${breakEvenDays ? `Break-even: ${breakEvenDays} operating days/month\n` : ''}
Ready to deploy? ${baseUrl}/robotics#contact`;
}
