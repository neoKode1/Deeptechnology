import { NextResponse } from 'next/server';

/**
 * POST /api/admin/login
 * Validates the admin secret and sets a cookie for browser-based admin access.
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

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', adminSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: 'Something went wrong.' },
      { status: 500 }
    );
  }
}

