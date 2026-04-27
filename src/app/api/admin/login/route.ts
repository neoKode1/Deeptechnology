import { NextResponse } from 'next/server';
import { createAdminSession } from '@/lib/admin-auth';
import { d1Exec, d1First } from '@/lib/d1';

const MAX_FAILS      = 5;                   // failed attempts before lockout
const LOCKOUT_TTL_MS = 60 * 15 * 1000;      // 15 minutes

/**
 * POST /api/admin/login
 * Validates the admin secret and issues a D1-backed session token cookie.
 * Brute-force protection: locks the IP after 5 failed attempts for 15 minutes.
 * Body: { secret: string }
 */
export async function POST(request: Request) {
  // Resolve client IP (Vercel sets x-forwarded-for)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

  try {
    const { secret } = (await request.json()) as { secret?: string };
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSecret) {
      return NextResponse.json(
        { success: false, message: 'Admin access not configured.' },
        { status: 503 }
      );
    }

    const now = Date.now();

    // Read current lockout row (if any) — only counts if still within window
    const current = await d1First<{ fails: number; expires_at: number }>(
      'SELECT fails, expires_at FROM admin_lockouts WHERE ip = ? AND expires_at > ?',
      [ip, now],
    );

    if (current && current.fails >= MAX_FAILS) {
      return NextResponse.json(
        { success: false, message: 'Too many failed attempts. Try again in 15 minutes.' },
        { status: 429 }
      );
    }

    if (!secret || secret !== adminSecret) {
      // Increment failure counter (UPSERT). Fresh window starts on first failure.
      const newFails = (current?.fails ?? 0) + 1;
      const expiresAt = current?.expires_at ?? now + LOCKOUT_TTL_MS;
      await d1Exec(
        `INSERT INTO admin_lockouts (ip, fails, expires_at) VALUES (?, ?, ?)
         ON CONFLICT(ip) DO UPDATE SET fails = excluded.fails, expires_at = excluded.expires_at`,
        [ip, newFails, expiresAt],
      );
      return NextResponse.json(
        { success: false, message: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    // Successful login — clear failure counter
    await d1Exec('DELETE FROM admin_lockouts WHERE ip = ?', [ip]);

    // Create a UUID session in D1 — cookie holds the UUID, not the secret
    const sessionToken = await createAdminSession();

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours (matches D1 session TTL)
    });

    return response;
  } catch (err) {
    console.error('[admin/login] error:', err);
    return NextResponse.json(
      { success: false, message: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
