import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { Quote, CreateQuotePayload, UpdateQuotePayload, LineItem } from './types';

/** Directory where quote JSON files are stored */
const QUOTES_DIR = path.resolve(process.cwd(), '.data', 'quotes');

/** Ensure the quotes directory exists */
function ensureDir(): void {
  if (!fs.existsSync(QUOTES_DIR)) {
    fs.mkdirSync(QUOTES_DIR, { recursive: true });
  }
}

/** File path for a given quote ID */
function quotePath(id: string): string {
  return path.join(QUOTES_DIR, `${id}.json`);
}

/**
 * Create a new quote from the provided payload.
 * Applies default 15% markup and calculates totals.
 */
export function createQuote(payload: CreateQuotePayload): Quote {
  ensureDir();

  const id = `quote-${randomUUID().slice(0, 8)}`;
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

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

  fs.writeFileSync(quotePath(id), JSON.stringify(quote, null, 2), 'utf-8');
  console.log(`[quotes] Created quote ${id} for ${payload.customerEmail}`);
  return quote;
}

/**
 * Get a quote by ID. Returns null if not found.
 */
export function getQuote(id: string): Quote | null {
  const fp = quotePath(id);
  if (!fs.existsSync(fp)) return null;
  const raw = fs.readFileSync(fp, 'utf-8');
  return JSON.parse(raw) as Quote;
}

/**
 * Update a quote's mutable fields (status, routing, notes, lineItems).
 * Recalculates totals if lineItems are updated.
 */
export function updateQuote(id: string, payload: UpdateQuotePayload): Quote | null {
  const quote = getQuote(id);
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
  fs.writeFileSync(quotePath(id), JSON.stringify(quote, null, 2), 'utf-8');
  console.log(`[quotes] Updated quote ${id} → ${quote.status}`);
  return quote;
}

/**
 * List all quotes, optionally filtered by status.
 * Returns newest first.
 */
export function listQuotes(status?: string): Quote[] {
  ensureDir();
  const files = fs.readdirSync(QUOTES_DIR).filter((f) => f.endsWith('.json'));
  const quotes: Quote[] = files.map((f) => {
    const raw = fs.readFileSync(path.join(QUOTES_DIR, f), 'utf-8');
    return JSON.parse(raw) as Quote;
  });

  const filtered = status ? quotes.filter((q) => q.status === status) : quotes;
  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

