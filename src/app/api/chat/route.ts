import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getQuote } from '@/lib/quotes/store';
import { buildSystemPrompt } from '@/lib/chat-prompt';

/**
 * POST /api/chat
 *
 * Customer-facing chat endpoint powered by Claude.
 * Accepts { message, orderId? } and returns { reply }.
 */
export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Chat unavailable' }, { status: 503 });
  }

  let body: { message?: string; orderId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { message, orderId } = body;
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  // Look up order if provided
  const order = orderId ? await getQuote(orderId) : null;
  const systemPrompt = buildSystemPrompt(order);

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: 'user', content: message.trim() }],
    });

    const reply =
      response.content[0]?.type === 'text'
        ? response.content[0].text
        : "I wasn't able to process that. Please try again.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('[chat] Claude API error:', err);
    return NextResponse.json({ error: 'Chat temporarily unavailable' }, { status: 502 });
  }
}

