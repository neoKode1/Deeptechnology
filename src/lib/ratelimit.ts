import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Shared Upstash Redis instance for rate limiting.
 * Reuses the same Redis credentials already in the stack.
 */
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Per-route sliding-window rate limiters.
 *
 * contact  — 5 submissions / 60 s  (spam protection, Nimbus cost control)
 * chat     — 10 messages / 60 s    (Claude API cost control — most critical)
 * checkout — 3 attempts / 60 s     (Stripe probing protection)
 */
export const limiters = {
  contact: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '60 s'),
    prefix: 'rl:contact',
    analytics: true,
  }),
  chat: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '60 s'),
    prefix: 'rl:chat',
    analytics: true,
  }),
  checkout: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '60 s'),
    prefix: 'rl:checkout',
    analytics: true,
  }),
  compare: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '60 s'),
    prefix: 'rl:compare',
    analytics: true,
  }),
  roi: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '60 s'),
    prefix: 'rl:roi',
    analytics: true,
  }),
  portal: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '60 s'),
    prefix: 'rl:portal',
    analytics: true,
  }),
  enterprise: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '60 s'),
    prefix: 'rl:enterprise',
    analytics: true,
  }),
};

/**
 * Extract the real client IP from a Next.js request.
 * Respects Vercel / Cloudflare / reverse-proxy forwarding headers.
 * Falls back to '127.0.0.1' in local dev.
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
  limiter: Ratelimit,
  request: NextRequest | Request,
): Promise<NextResponse | null> {
  const ip = getIP(request);
  const { success, limit, remaining, reset } = await limiter.limit(ip);

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
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
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(reset),
          'Retry-After': String(retryAfter),
        },
      },
    );
  }

  return null;
}
