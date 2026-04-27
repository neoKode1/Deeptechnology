import { randomUUID } from 'crypto';
import { d1Query, d1First, d1Exec } from '@/lib/d1';
import type { Quote, QuoteMessage, CreateQuotePayload, UpdateQuotePayload, LineItem } from './types';

/**
 * D1-backed quote store. Quotes are stored as JSON blobs in the `quotes` table
 * with `email` and `status` indexed for common lookups (admin filtering,
 * portal magic-link readback).
 */

interface QuoteRow {
  id: string;
  email: string | null;
  status: string;
  data: string;
  created_at: number;
  updated_at: number;
}

function rowToQuote(row: QuoteRow): Quote {
  const q = JSON.parse(row.data) as Quote;
  if (!q.messages) q.messages = [];
  return q;
}

/**
 * Create a new quote from the provided payload.
 * Applies default 15% markup and calculates totals.
 */
export async function createQuote(payload: CreateQuotePayload): Promise<Quote> {
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

  const oneTimeItems = lineItems.filter((li) => li.billingCycle !== 'monthly');
  const monthlyItems = lineItems.filter((li) => li.billingCycle === 'monthly');

  const subtotal = Math.round(oneTimeItems.reduce((sum, li) => sum + li.clientPrice, 0) * 100) / 100;
  const monthlyTotal = Math.round(monthlyItems.reduce((sum, li) => sum + li.clientPrice, 0) * 100) / 100;
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

  const ts = Date.now();
  const email = payload.customerEmail?.toLowerCase().trim() ?? null;
  await d1Exec(
    'INSERT INTO quotes (id, email, status, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [id, email, quote.status, JSON.stringify(quote), ts, ts],
  );

  console.log(`[quotes] Created quote ${id} for ${payload.customerEmail}`);
  return quote;
}

/** Get a quote by ID. */
export async function getQuote(id: string): Promise<Quote | null> {
  const row = await d1First<QuoteRow>('SELECT * FROM quotes WHERE id = ?', [id]);
  return row ? rowToQuote(row) : null;
}

/**
 * Persist a Quote object to D1 (used by webhook + cancel flows that mutate
 * fields not covered by `updateQuote`).
 */
export async function saveQuote(quote: Quote): Promise<void> {
  const ts = Date.now();
  const email = quote.customerEmail?.toLowerCase().trim() ?? null;
  quote.updatedAt = new Date().toISOString();
  await d1Exec(
    'UPDATE quotes SET email = ?, status = ?, data = ?, updated_at = ? WHERE id = ?',
    [email, quote.status, JSON.stringify(quote), ts, quote.id],
  );
}

/** Update a quote's mutable fields. */
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

  await saveQuote(quote);
  console.log(`[quotes] Updated quote ${id} → ${quote.status}`);
  return quote;
}

/** List all quotes, optionally filtered by status. Newest first. */
export async function listQuotes(status?: string): Promise<Quote[]> {
  const rows = status
    ? await d1Query<QuoteRow>(
        'SELECT * FROM quotes WHERE status = ? ORDER BY created_at DESC',
        [status],
      )
    : await d1Query<QuoteRow>('SELECT * FROM quotes ORDER BY created_at DESC');
  return rows.map(rowToQuote);
}

/** Look up all quote IDs for a customer email (used by portal magic-link). */
export async function listQuotesByEmail(email: string): Promise<Quote[]> {
  const rows = await d1Query<QuoteRow>(
    'SELECT * FROM quotes WHERE email = ? ORDER BY created_at DESC',
    [email.toLowerCase().trim()],
  );
  return rows.map(rowToQuote);
}

/** Add a message to a quote's conversation thread. */
export async function addMessage(
  quoteId: string,
  message: Omit<QuoteMessage, 'id' | 'sentAt'>,
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

  await saveQuote(quote);
  console.log(`[quotes] Added message ${msg.id} to quote ${quoteId}`);
  return msg;
}
