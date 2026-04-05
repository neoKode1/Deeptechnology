import { NextResponse } from 'next/server';
import { createAdminSession } from '@/lib/admin-auth';

/**
 * POST /api/admin/login
 * Validates the admin secret and issues a Redis-backed session token cookie.
 * The cookie value is a random UUID — the secret itself is never sent to the client.
 * Body: { secret: string }
 */
export async function POST(request: Request) {
  try {
    const { secret } = (await request.json()) as { secret?: string };
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSecret) {
      return NextResponse.json(
        { success: false, message: 'Admin access not configured.' },
        { status: 503 }
      );
    }

    if (!secret || secret !== adminSecret) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials.' },
        { status: 401 }
      );
    }

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

