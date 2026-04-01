import { NextResponse } from 'next/server';

/**
 * GET /api/youtube-stats
 * Fetches channel-level statistics (viewCount, subscriberCount, videoCount)
 * from the YouTube Data API v3 and returns them as JSON.
 *
 * Env vars required:
 *   YOUTUBE_API_KEY     – Google Cloud API key with YouTube Data API v3 enabled
 *   YOUTUBE_CHANNEL_ID  – The target YouTube channel ID (starts with UC…)
 *
 * Response is cached for 1 hour via Cache-Control to avoid burning quota.
 */

interface YouTubeChannelResponse {
  items?: Array<{
    statistics: {
      viewCount: string;
      subscriberCount: string;
      videoCount: string;
      hiddenSubscriberCount: boolean;
    };
  }>;
  error?: { message: string };
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    return NextResponse.json(
      { error: 'Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID env vars' },
      { status: 500 }
    );
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1 hr
    const data: YouTubeChannelResponse = await res.json();

    if (!res.ok || data.error) {
      return NextResponse.json(
        { error: data.error?.message ?? 'YouTube API error' },
        { status: res.status }
      );
    }

    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      );
    }

    const stats = data.items[0].statistics;

    return NextResponse.json(
      {
        viewCount: stats.viewCount,
        subscriberCount: stats.subscriberCount,
        videoCount: stats.videoCount,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err) {
    console.error('YouTube stats fetch failed:', err);
    return NextResponse.json(
      { error: 'Failed to fetch YouTube stats' },
      { status: 500 }
    );
  }
}

