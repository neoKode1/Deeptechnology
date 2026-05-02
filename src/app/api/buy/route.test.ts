/**
 * Integration tests for POST /api/buy.
 *
 * Strategy: mock Stripe + the quote store + the rate limiter + the VENDORS
 * fixture so we exercise the full route handler (validation, resolveBuy
 * branching, draft-quote creation, session metadata) without touching the
 * network or D1.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Vendor } from '@/data/vendors';
import { POST } from './route';

// ── Mocks ──────────────────────────────────────────────────────────────────
// vi.mock calls are hoisted to the top of the file, so any variables they
// reference must come from vi.hoisted (which runs even earlier).
const { sessionsCreate, createQuote } = vi.hoisted(() => ({
  sessionsCreate: vi.fn(),
  createQuote: vi.fn(),
}));

vi.mock('stripe', () => {
  class StripeMock {
    checkout = { sessions: { create: sessionsCreate } };
  }
  return { default: StripeMock };
});

vi.mock('@/lib/quotes/store', () => ({ createQuote }));

vi.mock('@/lib/ratelimit', () => ({
  rateLimit: vi.fn().mockResolvedValue(null),
  limiters: { checkout: { bucket: 'checkout', limit: 5, windowMs: 60_000 } },
}));

const { VENDORS_MOCK } = vi.hoisted(() => ({
  VENDORS_MOCK: [
    {
      id: 'unitree', name: 'Unitree', category: 'quadruped', buyPath: 'direct_online',
      contacts: [{ label: 'Sales', value: 'sales@unitree.com', href: 'mailto:sales@unitree.com' }],
      products: [{ name: 'Go2 EDU', price: '$13,500', status: 'in_stock' }],
    },
    {
      id: '1x', name: '1X', category: 'humanoid', buyPath: 'direct_online',
      contacts: [{ label: 'Press', value: 'press@1x.tech', href: 'mailto:press@1x.tech' }],
      products: [{ name: 'NEO Early Access', price: '$20,000', status: 'pre_order', deposit: '$200 refundable' }],
    },
    {
      id: 'avride', name: 'Avride', category: 'delivery', buyPath: 'raas_only',
      contacts: [{ label: 'Partners', value: 'partners@avride.com', href: 'mailto:partners@avride.com' }],
      products: [{ name: 'Delivery Robot', price: '$499/mo', status: 'raas' }],
    },
    {
      id: 'fanuc', name: 'FANUC', category: 'industrial', buyPath: 'dealer_only',
      contacts: [{ label: 'Dealer Inquiries', value: 'dealers@fanuc.com', href: 'mailto:dealers@fanuc.com' }],
      products: [{ name: 'CRX-10iA', price: '$45,000', status: 'quote_required' }],
    },
    {
      id: 'archer', name: 'Archer', category: 'delivery', buyPath: 'not_available',
      contacts: [{ label: 'Press', value: 'press@archer.com', href: 'mailto:press@archer.com' }],
      products: [{ name: 'Midnight', price: 'TBD', status: 'not_available' }],
    },
  ] as Vendor[],
}));
vi.mock('@/data/vendors', async () => {
  const actual = await vi.importActual<typeof import('@/data/vendors')>('@/data/vendors');
  return { ...actual, VENDORS: VENDORS_MOCK };
});

// ── Helpers ────────────────────────────────────────────────────────────────
function makeReq(body: unknown): Request {
  return new Request('http://localhost/api/buy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  sessionsCreate.mockReset();
  createQuote.mockReset();
  createQuote.mockResolvedValue({ id: 'quote-deadbeef' });
  sessionsCreate.mockResolvedValue({ id: 'cs_test_123', url: 'https://stripe.test/cs_test_123' });
  process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
  process.env.NEXT_PUBLIC_BASE_URL = 'https://deeptechnologies.dev';
});

// ── Validation ─────────────────────────────────────────────────────────────
describe('POST /api/buy — validation', () => {
  it('400 on missing vendorId/productSlug', async () => {
    const res = await POST(makeReq({}) as never);
    expect(res.status).toBe(400);
  });
  it('404 on unknown vendor', async () => {
    const res = await POST(makeReq({ vendorId: 'nope', productSlug: 'x' }) as never);
    expect(res.status).toBe(404);
  });
  it('404 on unknown product slug', async () => {
    const res = await POST(makeReq({ vendorId: 'unitree', productSlug: 'unknown' }) as never);
    expect(res.status).toBe(404);
  });
});

// ── Buy Now (direct_online + in_stock) ─────────────────────────────────────
describe('POST /api/buy — Buy Now', () => {
  it('creates a one-time payment session with full price + draft quote', async () => {
    const res = await POST(makeReq({ vendorId: 'unitree', productSlug: 'go2-edu' }) as never);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body).toMatchObject({ success: true, url: expect.stringContaining('cs_test_123'), sessionId: 'cs_test_123', quoteId: 'quote-deadbeef' });
    expect(createQuote).toHaveBeenCalledOnce();
    expect(sessionsCreate).toHaveBeenCalledOnce();
    const params = sessionsCreate.mock.calls[0][0];
    expect(params.mode).toBe('payment');
    expect(params.line_items[0].price_data.unit_amount).toBe(1350000);
    expect(params.line_items[0].price_data.recurring).toBeUndefined();
    expect(params.metadata).toMatchObject({
      source: 'public_buy', vendorId: 'unitree', buyKind: 'buy_now',
      isDeposit: '0', amountCents: '1350000', quoteId: 'quote-deadbeef',
    });
    expect(params.success_url).toContain('quote_id=quote-deadbeef');
    expect(params.cancel_url).toContain('?canceled=1');
  });
});

// ── Reserve (pre_order + explicit deposit) ─────────────────────────────────
describe('POST /api/buy — Reserve', () => {
  it('creates a deposit-mode payment session, fullPriceCents in metadata', async () => {
    const res = await POST(makeReq({ vendorId: '1x', productSlug: 'neo-early-access' }) as never);
    expect(res.status).toBe(200);
    const params = sessionsCreate.mock.calls[0][0];
    expect(params.mode).toBe('payment');
    expect(params.line_items[0].price_data.unit_amount).toBe(20000);
    expect(params.line_items[0].price_data.product_data.name).toMatch(/Reservation Deposit/);
    expect(params.metadata).toMatchObject({
      buyKind: 'reserve', isDeposit: '1', amountCents: '20000', fullPriceCents: '2000000',
    });
  });
});

// ── Subscribe (raas_only) ──────────────────────────────────────────────────
describe('POST /api/buy — Subscribe', () => {
  it('creates a subscription session with monthly recurring + subscription_data.metadata', async () => {
    const res = await POST(makeReq({ vendorId: 'avride', productSlug: 'delivery-robot' }) as never);
    expect(res.status).toBe(200);
    const params = sessionsCreate.mock.calls[0][0];
    expect(params.mode).toBe('subscription');
    expect(params.line_items[0].price_data.recurring).toEqual({ interval: 'month' });
    expect(params.line_items[0].price_data.unit_amount).toBe(49900);
    expect(params.subscription_data.metadata).toMatchObject({ buyKind: 'subscribe', source: 'public_buy' });
  });
});

// ── Request / Unavailable ─────────────────────────────────────────────────
describe('POST /api/buy — non-Stripe paths', () => {
  it('Request (dealer_only): returns redirect, no Stripe call', async () => {
    const res = await POST(makeReq({ vendorId: 'fanuc', productSlug: 'crx-10ia' }) as never);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.redirect).toMatch(/\/contact\?/);
    expect(sessionsCreate).not.toHaveBeenCalled();
    expect(createQuote).not.toHaveBeenCalled();
  });

  it('Unavailable (not_available): returns redirect, no Stripe call', async () => {
    const res = await POST(makeReq({ vendorId: 'archer', productSlug: 'midnight' }) as never);
    const body = await res.json();
    expect(body.redirect).toMatch(/interest=waitlist/);
    expect(sessionsCreate).not.toHaveBeenCalled();
  });
});

// ── Resilience ─────────────────────────────────────────────────────────────
describe('POST /api/buy — resilience', () => {
  it('continues to Stripe even if draft quote pre-create fails', async () => {
    createQuote.mockRejectedValueOnce(new Error('D1 down'));
    const res = await POST(makeReq({ vendorId: 'unitree', productSlug: 'go2-edu' }) as never);
    expect(res.status).toBe(200);
    expect(sessionsCreate).toHaveBeenCalledOnce();
    const params = sessionsCreate.mock.calls[0][0];
    expect(params.metadata.quoteId).toBeUndefined();
    expect(params.success_url).not.toContain('quote_id=');
  });

  it('503 when STRIPE_SECRET_KEY is missing', async () => {
    delete process.env.STRIPE_SECRET_KEY;
    const res = await POST(makeReq({ vendorId: 'unitree', productSlug: 'go2-edu' }) as never);
    expect(res.status).toBe(503);
  });

  it('502 when Stripe rejects session creation', async () => {
    sessionsCreate.mockRejectedValueOnce(new Error('Stripe unavailable'));
    const res = await POST(makeReq({ vendorId: 'unitree', productSlug: 'go2-edu' }) as never);
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.message).toMatch(/Stripe unavailable/);
  });
});
