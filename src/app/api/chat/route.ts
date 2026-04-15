import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Redis } from '@upstash/redis';
import { getQuote } from '@/lib/quotes/store';
import { buildSystemPrompt } from '@/lib/chat-prompt';
import { rateLimit, limiters } from '@/lib/ratelimit';

const MAX_HISTORY = 20;           // messages kept per thread (10 exchanges)
const HISTORY_TTL = 60 * 60 * 24 * 7; // 7-day TTL
const MAX_MESSAGE_CHARS = 600;    // hard cap on incoming message length
const SESSION_DAILY_CAP = 12;     // max messages a single anonymous session can send per 24h

// Allowed origins — requests from anywhere else are rejected
const ALLOWED_ORIGINS = [
  'https://deeptechnologies.dev',
  'https://www.deeptechnologies.dev',
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),
];

type ChatMessage = { role: 'user' | 'assistant'; content: string };

/**
 * GET /api/chat?orderId=xxx
 * Load stored conversation history so the client can restore the chat UI on mount.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');
  const sessionId = searchParams.get('sessionId');

  const historyKey = orderId
    ? `chat:${orderId}:history`
    : sessionId ? `chat:anon:${sessionId}:history` : null;

  if (!historyKey) return NextResponse.json({ history: [] });

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    const stored = await redis.get<ChatMessage[]>(historyKey);
    return NextResponse.json({ history: Array.isArray(stored) ? stored : [] });
  } catch {
    return NextResponse.json({ history: [] });
  }
}

/**
 * POST /api/chat
 *
 * Customer-facing chat endpoint powered by Claude.
 * Accepts { message, orderId? } and returns { reply }.
 *
 * Conversation history is persisted in Redis under:
 *   chat:{orderId}:history   (when orderId is provided)
 *   chat:anon:{sessionId}:history   (anonymous sessions — sessionId from client)
 */
export async function POST(request: Request) {
  // ── Origin guard — block direct API calls from outside the site ──────────────
  const origin = request.headers.get('origin') ?? '';
  if (!ALLOWED_ORIGINS.includes(origin)) {
    console.warn('[chat] Blocked request from origin:', origin);
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // ── Per-IP rate limit ────────────────────────────────────────────────────────
  const limited = await rateLimit(limiters.chat, request);
  if (limited) return limited;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Chat unavailable' }, { status: 503 });
  }

  let body: { message?: string; orderId?: string; sessionId?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { message, orderId, sessionId, email } = body;
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  // ── Hard cap on message length (prevents token stuffing) ────────────────────
  const userMessage = message.trim().slice(0, MAX_MESSAGE_CHARS);

  // ── Redis history key ────────────────────────────────────────────────────────
  const historyKey = orderId
    ? `chat:${orderId}:history`
    : sessionId
      ? `chat:anon:${sessionId}:history`
      : null;

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  // ── Log email against session when provided (lead capture from chat gate) ────
  if (sessionId && email && typeof email === 'string' && email.includes('@')) {
    const emailKey = `chat:lead:${sessionId}`;
    try {
      await redis.set(
        emailKey,
        JSON.stringify({ email: email.toLowerCase().trim(), capturedAt: new Date().toISOString() }),
        { ex: HISTORY_TTL },
      );
      console.log(`[chat] Lead email captured for session ${sessionId}: ${email}`);
    } catch (err) {
      console.warn('[chat] Failed to log lead email:', err);
    }
  }

  // ── Per-session daily cap (anonymous sessions only) ──────────────────────────
  if (sessionId && !orderId) {
    const capKey = `chat:cap:${sessionId}:${new Date().toISOString().slice(0, 10)}`;
    const count = await redis.incr(capKey);
    if (count === 1) await redis.expire(capKey, 60 * 60 * 25); // TTL slightly > 24h
    if (count > SESSION_DAILY_CAP) {
      console.warn('[chat] Session daily cap hit:', sessionId);
      return NextResponse.json(
        { error: 'Daily message limit reached. Please contact us directly.' },
        { status: 429 },
      );
    }
  }

  // ── Load existing history ────────────────────────────────────────────────────
  let history: ChatMessage[] = [];
  if (historyKey) {
    try {
      const stored = await redis.get<ChatMessage[]>(historyKey);
      if (Array.isArray(stored)) history = stored;
    } catch (err) {
      console.warn('[chat] Failed to load history:', err);
    }
  }

  // ── Build messages array for Claude ─────────────────────────────────────────
  const order = orderId ? await getQuote(orderId) : null;
  const systemPrompt = buildSystemPrompt(order);

  const messages: ChatMessage[] = [
    ...history,
    { role: 'user', content: userMessage },
  ];

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 400,
      system: systemPrompt,
      messages,
    });

    const reply =
      response.content[0]?.type === 'text'
        ? response.content[0].text
        : "I wasn't able to process that. Please try again.";

    // ── Persist updated history ──────────────────────────────────────────────
    if (historyKey) {
      const updated: ChatMessage[] = [
        ...(messages as ChatMessage[]),
        { role: 'assistant' as const, content: reply },
      ].slice(-MAX_HISTORY); // keep last N messages

      try {
        await redis.set(historyKey, updated, { ex: HISTORY_TTL });
      } catch (err) {
        console.warn('[chat] Failed to save history:', err);
      }
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('[chat] Claude API error:', err);
    return NextResponse.json({ error: 'Chat temporarily unavailable' }, { status: 502 });
  }
}

