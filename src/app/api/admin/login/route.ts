import { NextResponse } from 'next/server';
import { createAdminSession } from '@/lib/admin-auth';
import { Redis } from '@upstash/redis';

const MAX_FAILS   = 5;           // failed attempts before lockout
const LOCKOUT_TTL = 60 * 15;     // 15 minutes in seconds
const FAIL_PREFIX = 'admin:fail:';

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

/**
 * POST /api/admin/login
 * Validates the admin secret and issues a Redis-backed session token cookie.
 * Brute-force protection: locks the IP after 5 failed attempts for 15 minutes.
 * Body: { secret: string }
 */
export async function POST(request: Request) {
  // Resolve client IP (Vercel sets x-forwarded-for)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  const failKey = `${FAIL_PREFIX}${ip}`;

  try {
    const { secret } = (await request.json()) as { secret?: string };
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSecret) {
      return NextResponse.json(
        { success: false, message: 'Admin access not configured.' },
        { status: 503 }
      );
    }

    // Check lockout before validating password
    const redis = getRedis();
    const fails = await redis.get<number>(failKey);
    if (fails !== null && fails >= MAX_FAILS) {
      return NextResponse.json(
        { success: false, message: 'Too many failed attempts. Try again in 15 minutes.' },
        { status: 429 }
      );
    }

    if (!secret || secret !== adminSecret) {
      // Increment failure counter; set TTL only on first failure
      if (fails === null) {
        await redis.set(failKey, 1, { ex: LOCKOUT_TTL });
      } else {
        await redis.incr(failKey);
      }
      return NextResponse.json(
        { success: false, message: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    // Successful login — clear failure counter
    await redis.del(failKey);

    // Create a UUID session in Redis — cookie holds the UUID, not the secret
    const sessionToken = await createAdminSession();

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours (matches Redis TTL)
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: 'Something went wrong.' },
      { status: 500 }
    );
  }
}

