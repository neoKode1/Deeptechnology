/**
 * POST /api/portal/send-link
 *
 * Customer portal magic-link flow:
 * 1. Accept an email address
 * 2. Look up all quotes for that email in Redis (quotes:by-email:{email} list)
 * 3. If any found: generate a UUID token, store `portal:token:{uuid}` → email in Redis (1 hour TTL)
 * 4. Send a magic-link email via Resend
 *
 * Always returns 200 with { success: true } regardless of whether the email
 * has any quotes — prevents email enumeration.
 */

import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';
import { randomUUID } from 'crypto';
import { rateLimit, limiters } from '@/lib/ratelimit';

const TOKEN_TTL = 60 * 60; // 1 hour
const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://deeptechnologies.dev';
const FROM = 'Deep Tech <info@deeptechnologies.dev>';

export async function POST(request: Request) {
  const limited = await rateLimit(limiters.portal, request);
  if (limited) return limited;

  let email: string;
  try {
    ({ email } = await request.json());
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Valid email required' }, { status: 400 });
    }
    email = email.toLowerCase().trim();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  // Look up quote IDs for this email
  const quoteIds: string[] = (await redis.lrange(`quotes:by-email:${email}`, 0, -1)) ?? [];

  // Always return success — don't expose whether the email exists
  if (quoteIds.length === 0) {
    console.log(`[portal] No quotes for ${email} — sending not-found variant`);
    // Send a "no orders found" email so the user knows
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: FROM, to: email,
        subject: 'Deep Tech — no orders found for this email',
        text: `We couldn't find any orders linked to ${email}.\n\nIf you placed an order under a different address, try that one — or contact us at info@deeptechnologies.dev.\n\n— Deep Tech`,
        html: `<p style="font-family:sans-serif;font-size:14px;color:#555;">We couldn't find any orders linked to <strong>${email}</strong>.</p><p style="font-family:sans-serif;font-size:14px;color:#555;">If you placed an order under a different address, try that one — or <a href="mailto:info@deeptechnologies.dev">email us directly</a>.</p>`,
      });
    } catch { /* silent */ }
    return NextResponse.json({ success: true });
  }

  // Generate and store a token
  const token = randomUUID();
  await redis.set(`portal:token:${token}`, email, { ex: TOKEN_TTL });

  const magicLink = `${BASE}/portal/orders?token=${token}`;

  // Send the magic link
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: FROM, to: email,
      subject: 'Your Deep Tech order portal link',
      html: `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:520px;margin:0 auto;padding:36px;background:#fff;border:1px solid #eee;border-radius:8px;color:#333;">
  <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#999;margin:0 0 16px;">Deep Tech · Order Portal</p>
  <h2 style="color:#111;margin:0 0 12px;font-size:20px;">Your order portal access link</h2>
  <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 24px;">Click the button below to view all orders associated with this email. This link expires in <strong>1 hour</strong> and can only be used once.</p>
  <a href="${magicLink}" style="display:inline-block;background:#111;color:#fff;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;">View My Orders →</a>
  <p style="font-size:11px;color:#bbb;margin-top:28px;">If you didn't request this, you can safely ignore it. · Deep Tech</p>
</div>`,
      text: `View your Deep Tech orders:\n\n${magicLink}\n\nThis link expires in 1 hour.\n\n— Deep Tech`,
    });
    console.log(`[portal] Magic link sent to ${email} — ${quoteIds.length} orders`);
  } catch (err) {
    console.error('[portal] Email send failed:', err);
  }

  return NextResponse.json({ success: true });
}
