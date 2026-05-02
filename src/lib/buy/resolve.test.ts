import { describe, it, expect } from 'vitest';
import { resolveBuy, parsePrice, depositCentsFrom } from './resolve';
import type { Vendor, VendorProduct } from '@/data/vendors';

// ── Fixtures ──────────────────────────────────────────────────────────────────
function vendor(overrides: Partial<Vendor> = {}): Vendor {
  return {
    id: 'test-vendor', name: 'Test Vendor', category: 'humanoid',
    buyPath: 'direct_online',
    contacts: [{ label: 'Sales', value: 'sales@test.com', href: 'mailto:sales@test.com' }],
    products: [],
    ...overrides,
  };
}
function product(overrides: Partial<VendorProduct> = {}): VendorProduct {
  return { name: 'Test Product', price: '$10,000', status: 'in_stock', ...overrides };
}

// ── parsePrice ────────────────────────────────────────────────────────────────
describe('parsePrice', () => {
  it('parses plain dollar amounts', () => {
    expect(parsePrice('$13,500')).toEqual({ amountCents: 1350000, recurring: false });
  });
  it('parses "From $X" pricing', () => {
    expect(parsePrice('From $5,900')).toEqual({ amountCents: 590000, recurring: false });
  });
  it('parses approximate "~$X" pricing', () => {
    expect(parsePrice('~$43,500')).toEqual({ amountCents: 4350000, recurring: false });
  });
  it('detects /mo recurring pricing', () => {
    expect(parsePrice('$499/mo')).toEqual({ amountCents: 49900, recurring: true });
  });
  it('detects /month recurring pricing', () => {
    expect(parsePrice('$1,200/month')).toEqual({ amountCents: 120000, recurring: true });
  });
  it('returns null amount for unparseable strings', () => {
    expect(parsePrice('Contact for pricing')).toEqual({ amountCents: null, recurring: false });
  });
  it('returns null for empty string', () => {
    expect(parsePrice('')).toEqual({ amountCents: null, recurring: false });
  });
  it('rejects zero / negative numbers', () => {
    expect(parsePrice('$0').amountCents).toBeNull();
  });
});

// ── depositCentsFrom ──────────────────────────────────────────────────────────
describe('depositCentsFrom', () => {
  it('uses explicit deposit string when provided', () => {
    expect(depositCentsFrom(2000000, '$200 refundable')).toBe(20000);
  });
  it('falls back to 5% of price rounded to nearest $50', () => {
    // 5% of $10,000 = $500 → $500 → 50000 cents
    expect(depositCentsFrom(1000000)).toBe(50000);
  });
  it('rounds 5% to the nearest $50 increment', () => {
    // 5% of $13,500 = $675 → rounded to $700 → 70000 cents
    expect(depositCentsFrom(1350000)).toBe(70000);
  });
  it('enforces a $200 floor', () => {
    // 5% of $1,000 = $50 → floored to $200 → 20000 cents
    expect(depositCentsFrom(100000)).toBe(20000);
  });
  it('enforces a $5,000 cap', () => {
    // 5% of $200,000 = $10,000 → capped at $5,000 → 500000 cents
    expect(depositCentsFrom(20000000)).toBe(500000);
  });
  it('returns null when price unknown and no explicit deposit', () => {
    expect(depositCentsFrom(null)).toBeNull();
  });
  it('falls back to 5% when explicit deposit is unparseable', () => {
    expect(depositCentsFrom(1000000, 'Contact us')).toBe(50000);
  });
});

// ── resolveBuy decision matrix ───────────────────────────────────────────────
describe('resolveBuy — decision matrix', () => {
  it('Buy Now: direct_online + in_stock + parseable price', () => {
    const a = resolveBuy(vendor({ buyPath: 'direct_online' }), product({ price: '$13,500', status: 'in_stock' }));
    expect(a.kind).toBe('buy_now');
    expect(a.amountCents).toBe(1350000);
    expect(a.mode).toBe('payment');
    expect(a.isDeposit).toBeUndefined();
    expect(a.label).toMatch(/Buy Now.*\$13,500/);
  });

  it('Reserve: pre_order with explicit deposit', () => {
    const a = resolveBuy(vendor({ buyPath: 'direct_online' }), product({
      price: '$20,000', status: 'pre_order', deposit: '$200 refundable',
    }));
    expect(a.kind).toBe('reserve');
    expect(a.amountCents).toBe(20000);
    expect(a.fullPriceCents).toBe(2000000);
    expect(a.mode).toBe('payment');
    expect(a.isDeposit).toBe(true);
  });

  it('Reserve: vendor availability=sourcing falls into deposit flow', () => {
    const a = resolveBuy(vendor({ buyPath: 'direct_online', availability: 'sourcing' }), product({ price: '$50,000' }));
    expect(a.kind).toBe('reserve');
    expect(a.amountCents).toBe(250000); // 5% of $50k = $2,500 → rounded to $2,500
    expect(a.isDeposit).toBe(true);
  });

  it('Subscribe: raas_only with parseable monthly price', () => {
    const a = resolveBuy(vendor({ buyPath: 'raas_only' }), product({ price: '$499/mo', status: 'raas' }));
    expect(a.kind).toBe('subscribe');
    expect(a.amountCents).toBe(49900);
    expect(a.mode).toBe('subscription');
    expect(a.isSubscription).toBe(true);
  });

  it('Request RaaS: raas_only without parseable monthly', () => {
    const a = resolveBuy(vendor({ buyPath: 'raas_only' }), product({ price: 'RaaS — Contact', status: 'raas' }));
    expect(a.kind).toBe('request');
    expect(a.fallbackHref).toMatch(/interest=raas/);
  });

  it('Request: dealer_only', () => {
    const a = resolveBuy(vendor({ buyPath: 'dealer_only' }), product({ price: '$25,000' }));
    expect(a.kind).toBe('request');
    expect(a.fallbackHref).toMatch(/interest=dealer_only/);
  });

  it('Request: b2b_partner', () => {
    const a = resolveBuy(vendor({ buyPath: 'b2b_partner' }), product({ price: '$100,000' }));
    expect(a.kind).toBe('request');
  });

  it('Request: product status=quote_required overrides direct_online', () => {
    const a = resolveBuy(vendor({ buyPath: 'direct_online' }), product({ price: '$90,000', status: 'quote_required' }));
    expect(a.kind).toBe('request');
  });

  it('Unavailable: product status=not_available', () => {
    const a = resolveBuy(vendor({ buyPath: 'direct_online' }), product({ status: 'not_available' }));
    expect(a.kind).toBe('unavailable');
    expect(a.fallbackHref).toMatch(/interest=waitlist/);
  });

  it('Unavailable: vendor buyPath=not_available', () => {
    const a = resolveBuy(vendor({ buyPath: 'not_available' }), product({}));
    expect(a.kind).toBe('unavailable');
  });

  it('Reserve precedence: pre_order beats direct_online + in_stock', () => {
    const a = resolveBuy(vendor({ buyPath: 'direct_online' }), product({ price: '$20,000', status: 'pre_order' }));
    expect(a.kind).toBe('reserve');
  });

  it('Fallback: email_required without parseable price → request', () => {
    const a = resolveBuy(vendor({ buyPath: 'email_required' }), product({ price: 'TBD' }));
    expect(a.kind).toBe('request');
  });
});
