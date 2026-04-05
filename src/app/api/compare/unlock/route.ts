import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';
import { rateLimit, limiters } from '@/lib/ratelimit';
import { getComparison } from '@/data/comparisons';
import { pushToCRM } from '@/lib/crm';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'Deep Tech <info@deeptechnologies.dev>';
const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://deeptechnologies.dev';

/**
 * POST /api/compare/unlock
 *
 * Captures an email lead from a gated comparison page and sends the
 * full comparison summary via Resend. Stores the lead in Redis.
 *
 * Body: { email: string; slug: string }
 * Returns: { success: true }
 */
export async function POST(request: Request) {
  const limited = await rateLimit(limiters.compare, request);
  if (limited) return limited;

  let body: { email?: string; slug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { email, slug } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'Comparison slug required' }, { status: 400 });
  }

  const comparison = getComparison(slug);
  if (!comparison) {
    return NextResponse.json({ error: 'Unknown comparison' }, { status: 404 });
  }

  const id = `compare-lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const timestamp = new Date().toISOString();

  // ── Persist to Redis ─────────────────────────────────────────────────────────
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    await redis.set(`compare-lead:${id}`, JSON.stringify({ id, email, slug, timestamp }), {
      ex: 60 * 60 * 24 * 90,
    });
    await redis.lpush('compare-leads', id);
  } catch (err) {
    console.error('[compare/unlock] Redis error:', err);
  }

  // ── Push to CRM ──────────────────────────────────────────────────────────────
  pushToCRM({ leadType: 'compare_unlock', capturedAt: timestamp, email, compareSlug: slug });

  // ── Send Resend welcome email ─────────────────────────────────────────────────
  try {
    const { vendorALabel, vendorBLabel, verdict } = comparison;
    const compareUrl = `${BASE}/compare/${slug}`;

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Your ${vendorALabel} vs ${vendorBLabel} breakdown`,
      html: `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;padding:36px;background:#fff;border:1px solid #eee;border-radius:8px;color:#333;">
  <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#999;margin:0 0 16px;">Deep Tech · Vendor Intelligence</p>
  <h2 style="color:#111;margin:0 0 12px;font-size:20px;">${vendorALabel} vs ${vendorBLabel}</h2>
  <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 16px;">${verdict.summary}</p>
  <table style="width:100%;border-collapse:collapse;margin:0 0 20px;">
    <tr><td style="padding:10px 12px;border:1px solid #eee;font-size:13px;color:#888;width:40%;">Choose ${vendorALabel}</td><td style="padding:10px 12px;border:1px solid #eee;font-size:13px;color:#333;">${verdict.chooseA}</td></tr>
    <tr><td style="padding:10px 12px;border:1px solid #eee;font-size:13px;color:#888;background:#fafafa;">Choose ${vendorBLabel}</td><td style="padding:10px 12px;border:1px solid #eee;font-size:13px;color:#333;background:#fafafa;">${verdict.chooseB}</td></tr>
  </table>
  <a href="${compareUrl}" style="display:inline-block;background:#111;color:#fff;padding:11px 22px;border-radius:6px;font-size:13px;text-decoration:none;margin-bottom:24px;">View Full Comparison →</a>
  <p style="font-size:13px;line-height:1.7;color:#555;">Ready to get a quote or start a 30-day pilot? <a href="${BASE}/contact?inquiry=robotics" style="color:#111;">Talk to the team →</a></p>
  <p style="font-size:11px;color:#bbb;margin-top:28px;">Deep Tech · <a href="${BASE}" style="color:#bbb;">deeptechnologies.dev</a></p>
</div>`,
      text: `${vendorALabel} vs ${vendorBLabel}\n\n${verdict.summary}\n\nChoose ${vendorALabel}: ${verdict.chooseA}\nChoose ${vendorBLabel}: ${verdict.chooseB}\n\nFull comparison: ${compareUrl}\n\nReady to get a quote? ${BASE}/contact?inquiry=robotics\n\n— Deep Tech`,
    });
  } catch (err) {
    console.error('[compare/unlock] Resend error:', err);
    // non-fatal — still unlock the gate
  }

  return NextResponse.json({ success: true });
}
