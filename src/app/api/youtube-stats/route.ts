import { NextResponse } from 'next/server';

/**
 * GET /api/youtube-stats
 *
 * Stubbed — Creative division (YouTube channel) is not yet active.
 * Re-implement when YOUTUBE_API_KEY + YOUTUBE_CHANNEL_ID are available.
 */
export async function GET() {
  return NextResponse.json(
    { error: 'YouTube channel not yet active.' },
    { status: 503 }
  );
}

