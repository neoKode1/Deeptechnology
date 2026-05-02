/**
 * Public-facing buy-action resolver.
 *
 * Given a Vendor + VendorProduct, returns the action the public Buy button
 * should take. Pure function — safe to call from server components and
 * shared with the API route so the displayed action and the executed action
 * are guaranteed to match.
 *
 * Buy paths:
 *   direct_online → Buy Now (full price, one-time payment)
 *                   OR Reserve (deposit) when status is pre_order or vendor
 *                   availability is sourcing/coming_soon
 *   email_required → Reserve (deposit only; full balance billed by procurement)
 *   raas_only      → Subscribe (monthly) IF a parseable monthly price exists,
 *                   otherwise Request (Deeptech-mediated quote)
 *   dealer_only    → Request (vendor mandates dealer relationship)
 *   b2b_partner    → Request (enterprise terms negotiated case-by-case)
 *   not_available  → Unavailable (Notify Me)
 *
 * Deposit math: explicit `product.deposit` wins; otherwise 5% of price,
 * rounded to nearest $50, $200 floor, $5k cap.
 */
import type { Vendor, VendorProduct } from '@/data/vendors';

export type BuyKind = 'buy_now' | 'reserve' | 'subscribe' | 'request' | 'unavailable';

export interface BuyAction {
  kind: BuyKind;
  /** Full button label, e.g. "Buy Now — $13,500" or "Reserve · $500 deposit" */
  label: string;
  /** Compact button label, e.g. "Buy Now" — for tight layouts */
  shortLabel: string;
  /** Sub-text shown beneath the button */
  helpText: string;
  /** Stripe checkout amount in cents (one-time charge OR monthly amount) */
  amountCents?: number;
  /** Reference full price in cents — shown alongside deposit reservations */
  fullPriceCents?: number;
  /** Stripe checkout mode */
  mode?: 'payment' | 'subscription';
  /** True when amountCents is a deposit and the balance ships separately */
  isDeposit?: boolean;
  /** True when amountCents is a recurring subscription */
  isSubscription?: boolean;
  /** Stable href for non-Stripe paths (request/unavailable) */
  fallbackHref?: string;
}

/** Parse a price string like "$13,500", "From $5,900", "~$43,500", "$499/mo". */
export function parsePrice(s: string): { amountCents: number | null; recurring: boolean } {
  if (!s) return { amountCents: null, recurring: false };
  const recurring = /\/(mo|mon|month|yr|year)/i.test(s);
  const m = s.match(/\$?\s*([0-9][0-9,]*(?:\.[0-9]+)?)/);
  if (!m) return { amountCents: null, recurring };
  const num = Number(m[1].replace(/,/g, ''));
  if (!isFinite(num) || num <= 0) return { amountCents: null, recurring };
  return { amountCents: Math.round(num * 100), recurring };
}

/** Calculate the deposit cents for a reservation when no explicit deposit is set. */
export function depositCentsFrom(priceCents: number | null, explicit?: string): number | null {
  if (explicit) {
    const parsed = parsePrice(explicit).amountCents;
    if (parsed) return parsed;
  }
  if (!priceCents) return null;
  const fivePct = priceCents * 0.05;
  const rounded = Math.round(fivePct / 5000) * 5000;
  return Math.max(20000, Math.min(500000, rounded));
}

function fmtUsd(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

/** Build a fallback /contact link with vendor + product context. */
function requestHref(vendor: Vendor, product: VendorProduct, interest: string): string {
  const q = new URLSearchParams({
    inquiry: 'robotics',
    vendor: vendor.name,
    product: product.name,
    interest,
  });
  return `/contact?${q.toString()}`;
}

export function resolveBuy(vendor: Vendor, product: VendorProduct): BuyAction {
  const parsed = parsePrice(product.price);
  const priceCents = parsed.amountCents;
  const looksMonthly = parsed.recurring;
  const availability = vendor.availability ?? 'active';
  const isPreOrder = product.status === 'pre_order';
  const isComingSoon = availability === 'coming_soon';
  const isSourcing = availability === 'sourcing';

  // Hard stop: explicitly unavailable
  if (product.status === 'not_available' || vendor.buyPath === 'not_available') {
    return {
      kind: 'unavailable',
      label: 'Notify Me When Available',
      shortLabel: 'Notify Me',
      helpText: 'Join the waitlist — we\u2019ll email you the moment this ships.',
      fallbackHref: requestHref(vendor, product, 'waitlist'),
    };
  }

  // Dealer / B2B / quote_required → request flow
  if (vendor.buyPath === 'dealer_only' || vendor.buyPath === 'b2b_partner' || product.status === 'quote_required') {
    return {
      kind: 'request',
      label: 'Request via Deeptech',
      shortLabel: 'Request',
      helpText: 'Sourced and quoted by Deeptech within 24 hours.',
      fullPriceCents: priceCents ?? undefined,
      fallbackHref: requestHref(vendor, product, vendor.buyPath),
    };
  }

  // RaaS — subscription if monthly price is parseable, else request
  if (vendor.buyPath === 'raas_only' || product.status === 'raas') {
    if (looksMonthly && priceCents) {
      return {
        kind: 'subscribe', label: `Start RaaS \u2014 ${fmtUsd(priceCents)}/mo`, shortLabel: 'Start RaaS',
        helpText: 'Monthly billing via Stripe. Cancel within 72 hours of each billing cycle.',
        amountCents: priceCents, mode: 'subscription', isSubscription: true,
      };
    }
    return {
      kind: 'request', label: 'Request RaaS Terms', shortLabel: 'Request RaaS',
      helpText: 'Robot-as-a-Service plans are quoted per deployment — typically 24h turnaround.',
      fallbackHref: requestHref(vendor, product, 'raas'),
    };
  }

  // Reserve (deposit) when pre-order or vendor still in sourcing/coming-soon phase
  if (isPreOrder || isComingSoon || isSourcing || vendor.buyPath === 'email_required') {
    const deposit = depositCentsFrom(priceCents, product.deposit);
    if (!deposit) {
      return {
        kind: 'request', label: 'Request via Deeptech', shortLabel: 'Request',
        helpText: 'Pricing not yet published \u2014 we\u2019ll source a real quote within 24h.',
        fallbackHref: requestHref(vendor, product, isComingSoon ? 'coming_soon' : 'reserve'),
      };
    }
    const refundable = product.deposit ? ' refundable' : '';
    return {
      kind: 'reserve', label: `Reserve \u2014 ${fmtUsd(deposit)} deposit`, shortLabel: 'Reserve',
      helpText: priceCents
        ? `${fmtUsd(deposit)}${refundable} deposit holds your unit. Balance of ${fmtUsd(priceCents - deposit)} on shipment.`
        : `${fmtUsd(deposit)}${refundable} deposit. Final pricing confirmed before shipment.`,
      amountCents: deposit, fullPriceCents: priceCents ?? undefined, mode: 'payment', isDeposit: true,
    };
  }

  // direct_online + in_stock + clear price → Buy Now
  if (vendor.buyPath === 'direct_online' && priceCents && !looksMonthly) {
    return {
      kind: 'buy_now', label: `Buy Now \u2014 ${fmtUsd(priceCents)}`, shortLabel: 'Buy Now',
      helpText: 'Pays in full via Stripe. Deeptech places the vendor PO on confirmation.',
      amountCents: priceCents, fullPriceCents: priceCents, mode: 'payment',
    };
  }

  // Default fallback — unknown shape, route through request flow
  return {
    kind: 'request', label: 'Source via Deeptech', shortLabel: 'Source',
    helpText: 'We\u2019ll handle vendor outreach, quotes, and procurement.',
    fullPriceCents: priceCents ?? undefined,
    fallbackHref: requestHref(vendor, product, 'source'),
  };
}
