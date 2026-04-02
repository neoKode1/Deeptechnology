import { Redis } from '@upstash/redis';
import { randomUUID } from 'crypto';
import type { Quote, CreateQuotePayload, UpdateQuotePayload, LineItem } from './types';

/**
 * Upstash Redis client (REST-based, works in Vercel serverless).
 * Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars.
 */
let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN');
    }
    redis = new Redis({ url, token });
  }
  return redis;
}

/** Redis key for a quote */
function quoteKey(id: string): string {
  return `quote:${id}`;
}

/** Redis key for the sorted set of all quote IDs (sorted by createdAt) */
const QUOTES_INDEX = 'quotes:index';

/**
 * Create a new quote from the provided payload.
 * Applies default 15% markup and calculates totals.
 */
export async function createQuote(payload: CreateQuotePayload): Promise<Quote> {
  const r = getRedis();
  const id = `quote-${randomUUID().slice(0, 8)}`;
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const lineItems: LineItem[] = payload.lineItems.map((item) => {
    const markup = item.markup ?? 0.15;
    const clientPrice = Math.round(item.vendorCost * (1 + markup) * 100) / 100;
    return {
      description: item.description,
      vendor: item.vendor,
      vendorUrl: item.vendorUrl,
      vendorCost: item.vendorCost,
      markup,
      clientPrice,
      notes: item.notes,
    };
  });

  const subtotal = Math.round(lineItems.reduce((sum, li) => sum + li.clientPrice, 0) * 100) / 100;

  const quote: Quote = {
    id,
    requestId: payload.requestId,
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    inquiryType: payload.inquiryType,
    summary: payload.summary,
    lineItems,
    subtotal,
    total: subtotal,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    expiresAt,
    notes: payload.notes,
  };

  // Store quote JSON and add to sorted index (score = timestamp for ordering)
  await r.set(quoteKey(id), JSON.stringify(quote));
  await r.zadd(QUOTES_INDEX, { score: Date.now(), member: id });

  console.log(`[quotes] Created quote ${id} for ${payload.customerEmail}`);
  return quote;
}

/**
 * Get a quote by ID. Returns null if not found.
 */
export async function getQuote(id: string): Promise<Quote | null> {
  const r = getRedis();
  const raw = await r.get<string>(quoteKey(id));
  if (!raw) return null;
  return (typeof raw === 'string' ? JSON.parse(raw) : raw) as Quote;
}

/**
 * Update a quote's mutable fields (status, routing, notes, lineItems).
 * Recalculates totals if lineItems are updated.
 */
export async function updateQuote(id: string, payload: UpdateQuotePayload): Promise<Quote | null> {
  const quote = await getQuote(id);
  if (!quote) return null;

  if (payload.status) quote.status = payload.status;
  if (payload.routing) quote.routing = payload.routing;
  if (payload.notes !== undefined) quote.notes = payload.notes;

  if (payload.lineItems) {
    quote.lineItems = payload.lineItems;
    quote.subtotal = Math.round(
      quote.lineItems.reduce((sum, li) => sum + li.clientPrice, 0) * 100
    ) / 100;
    quote.total = quote.subtotal;
  }

  if (payload.status === 'accepted') {
    quote.acceptedAt = new Date().toISOString();
  }

  quote.updatedAt = new Date().toISOString();
  const r = getRedis();
  await r.set(quoteKey(id), JSON.stringify(quote));
  console.log(`[quotes] Updated quote ${id} → ${quote.status}`);
  return quote;
}

/**
 * List all quotes, optionally filtered by status.
 * Returns newest first.
 */
export async function listQuotes(status?: string): Promise<Quote[]> {
  const r = getRedis();
  // Get all quote IDs from sorted set, newest first
  const ids = await r.zrange(QUOTES_INDEX, 0, -1, { rev: true }) as string[];

  if (ids.length === 0) return [];

  // Fetch all quotes in parallel
  const quotes = await Promise.all(
    ids.map(async (id) => {
      const raw = await r.get<string>(quoteKey(id));
      if (!raw) return null;
      return (typeof raw === 'string' ? JSON.parse(raw) : raw) as Quote;
    })
  );

  const valid = quotes.filter((q): q is Quote => q !== null);
  return status ? valid.filter((q) => q.status === status) : valid;
}

