import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { isAuthorizedRequest, unauthorizedResponse } from '@/lib/admin-auth';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export interface ChatLead {
  sessionId: string;
  email: string;
  capturedAt: string | null;
}

/**
 * GET /api/admin/leads
 * Returns all chat leads captured from the Nimbus email gate.
 * Auth: admin session cookie or Bearer header.
 */
export async function GET(request: Request) {
  if (!(await isAuthorizedRequest(request))) {
    return unauthorizedResponse();
  }

  try {
    // Scan for all chat lead keys
    let cursor = 0;
    const keys: string[] = [];
    do {
      const [nextCursor, batch] = await redis.scan(cursor, {
        match: 'chat:lead:*',
        count: 100,
      });
      cursor = Number(nextCursor);
      keys.push(...batch);
    } while (cursor !== 0);

    if (keys.length === 0) {
      return NextResponse.json({ leads: [] });
    }

    // Fetch all lead values
    const values = keys.length > 0 ? await redis.mget<string[]>(...keys) : [];

    const leads: ChatLead[] = keys.map((key, i) => {
      const sessionId = key.replace('chat:lead:', '');
      const raw = values[i];
      let email = '';
      let capturedAt: string | null = null;

      if (raw) {
        try {
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          email = parsed.email ?? raw;
          capturedAt = parsed.capturedAt ?? null;
        } catch {
          email = String(raw);
        }
      }

      return { sessionId, email, capturedAt };
    });

    // Sort newest first (by capturedAt if available, else by key order)
    leads.sort((a, b) => {
      if (a.capturedAt && b.capturedAt) {
        return new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime();
      }
      return 0;
    });

    return NextResponse.json({ leads });
  } catch (err) {
    console.error('Failed to fetch leads:', err);
    return NextResponse.json({ error: 'Failed to fetch leads.' }, { status: 500 });
  }
}
