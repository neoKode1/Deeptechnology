import { Redis } from '@upstash/redis';
import { randomUUID } from 'crypto';
import type { Quote, QuoteMessage, CreateQuotePayload, UpdateQuotePayload, LineItem } from './types';

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
      billingCycle: item.billingCycle ?? 'one_time',
      notes: item.notes,
    };
  });

  // Separate one-time vs recurring line items for totals
  const oneTimeItems = lineItems.filter((li) => li.billingCycle !== 'monthly');
  const monthlyItems = lineItems.filter((li) => li.billingCycle === 'monthly');

  const subtotal = Math.round(oneTimeItems.reduce((sum, li) => sum + li.clientPrice, 0) * 100) / 100;
  const monthlyTotal = Math.round(monthlyItems.reduce((sum, li) => sum + li.clientPrice, 0) * 100) / 100;

  // Derive overall billing mode: 'monthly' if any line item is recurring, else 'one_time'
  const billingCycle: Quote['billingCycle'] = monthlyItems.length > 0 ? 'monthly' : 'one_time';

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
    billingCycle,
    ...(monthlyTotal > 0 && { monthlyTotal }),
    status: 'draft',
    messages: [],
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
  const quote = (typeof raw === 'string' ? JSON.parse(raw) : raw) as Quote;
  // Backfill messages array for quotes created before this field existed
  if (!quote.messages) quote.messages = [];
  return quote;
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
    const oneTimeItems = quote.lineItems.filter((li) => li.billingCycle !== 'monthly');
    const monthlyItems = quote.lineItems.filter((li) => li.billingCycle === 'monthly');
    quote.subtotal = Math.round(oneTimeItems.reduce((sum, li) => sum + li.clientPrice, 0) * 100) / 100;
    quote.total = quote.subtotal;
    quote.monthlyTotal = Math.round(monthlyItems.reduce((sum, li) => sum + li.clientPrice, 0) * 100) / 100;
    quote.billingCycle = monthlyItems.length > 0 ? 'monthly' : 'one_time';
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
  // Ensure messages array exists for older quotes created before this field
  for (const q of valid) {
    if (!q.messages) q.messages = [];
  }
  return status ? valid.filter((q) => q.status === status) : valid;
}

/**
 * Add a message to a quote's conversation thread.
 */
export async function addMessage(
  quoteId: string,
  message: Omit<QuoteMessage, 'id' | 'sentAt'>
): Promise<QuoteMessage | null> {
  const quote = await getQuote(quoteId);
  if (!quote) return null;

  const msg: QuoteMessage = {
    ...message,
    id: `msg-${randomUUID().slice(0, 8)}`,
    sentAt: new Date().toISOString(),
  };

  if (!quote.messages) quote.messages = [];
  quote.messages.push(msg);
  quote.updatedAt = new Date().toISOString();

  const r = getRedis();
  await r.set(quoteKey(quoteId), JSON.stringify(quote));
  console.log(`[quotes] Added message ${msg.id} to quote ${quoteId}`);
  return msg;
}

