import { NextRequest, NextResponse } from 'next/server';
import { d1First, d1Exec } from '@/lib/d1';

/**
 * D1-backed sliding-window rate limiter.
 *
 * Each request inserts a row into `rate_limits (bucket, ip, ts)`. We then
 * count rows in the trailing `windowMs` window — if the count exceeds
 * `limit`, the request is rejected with 429.
 *
 * Old rows are best-effort pruned on each call (small probability) to keep
 * the table from growing without bound.
 */

export interface LimiterConfig {
  bucket: string;     // e.g. 'rl:chat'
  limit: number;      // max requests per window
  windowMs: number;   // window size in milliseconds
}

function cfg(bucket: string, limit: number, seconds: number): LimiterConfig {
  return { bucket, limit, windowMs: seconds * 1000 };
}

/**
 * Per-route rate limiters.
 *
 * contact / chat / compare / roi — 5 / 60 s
 * checkout / portal / enterprise — 3 / 60 s
 */
export const limiters = {
  contact:    cfg('rl:contact',    5, 60),
  chat:       cfg('rl:chat',       5, 60),
  checkout:   cfg('rl:checkout',   3, 60),
  compare:    cfg('rl:compare',    5, 60),
  roi:        cfg('rl:roi',        5, 60),
  portal:     cfg('rl:portal',     3, 60),
  enterprise: cfg('rl:enterprise', 3, 60),
  // Admin outbound vendor inquiries — keep tight to prevent accidental spam
  outreach:   cfg('rl:outreach',   10, 60),
};

/**
 * Extract the real client IP from a Next.js request.
 * Respects Vercel / Cloudflare / reverse-proxy forwarding headers.
 */
export function getIP(request: NextRequest | Request): string {
  const req = request as NextRequest;
  return (
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    '127.0.0.1'
  );
}

/**
 * Apply a rate limit check. Returns a 429 NextResponse if the limit is
 * exceeded, or null if the request is allowed through.
 *
 * Usage:
 *   const limited = await rateLimit(limiters.chat, request);
 *   if (limited) return limited;
 */
export async function rateLimit(
  limiter: LimiterConfig,
  request: NextRequest | Request,
): Promise<NextResponse | null> {
  const ip = getIP(request);
  const now = Date.now();
  const windowStart = now - limiter.windowMs;

  try {
    // Count requests in the trailing window
    const row = await d1First<{ n: number }>(
      'SELECT COUNT(*) AS n FROM rate_limits WHERE bucket = ? AND ip = ? AND ts > ?',
      [limiter.bucket, ip, windowStart],
    );
    const count = row?.n ?? 0;

    if (count >= limiter.limit) {
      const oldest = await d1First<{ ts: number }>(
        'SELECT MIN(ts) AS ts FROM rate_limits WHERE bucket = ? AND ip = ? AND ts > ?',
        [limiter.bucket, ip, windowStart],
      );
      const reset = (oldest?.ts ?? now) + limiter.windowMs;
      const retryAfter = Math.max(1, Math.ceil((reset - now) / 1000));
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Too many requests. Please slow down.',
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': String(limiter.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(reset),
            'Retry-After': String(retryAfter),
          },
        },
      );
    }

    // Record this request
    await d1Exec(
      'INSERT INTO rate_limits (bucket, ip, ts) VALUES (?, ?, ?)',
      [limiter.bucket, ip, now],
    );

    // Best-effort prune (1-in-20 calls): drop rows older than the window
    if (Math.random() < 0.05) {
      await d1Exec(
        'DELETE FROM rate_limits WHERE bucket = ? AND ts <= ?',
        [limiter.bucket, windowStart],
      ).catch(() => undefined);
    }

    return null;
  } catch (err) {
    // Fail open — never let rate-limit infrastructure break a real request
    console.error('[ratelimit] Check failed (fail-open):', err);
    return null;
  }
}
