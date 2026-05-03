/**
 * Unit tests for the admin Quick Inquiry pre-population helpers.
 */
import { describe, it, expect } from 'vitest';
import type { Vendor } from '@/data/vendors';
import {
  buildDefaults,
  defaultRecipient,
  defaultProductName,
  defaultUseCase,
  defaultTimeline,
  DEFAULT_REGION,
  DEFAULT_QUANTITY,
  DEFAULT_TEMPLATE,
} from './defaults';

function fixture(overrides: Partial<Vendor> = {}): Vendor {
  return {
    id: 'acme',
    name: 'Acme Robotics',
    category: 'industrial',
    buyPath: 'email_required',
    contacts: [
      { label: 'Sales', value: 'sales@acme.example', href: 'mailto:sales@acme.example' },
      { label: 'Web',   value: 'acme.example',       href: 'https://acme.example' },
    ],
    products: [
      { name: 'Acme Scout v2', price: '$13,500', status: 'in_stock', notes: 'Compact AMR for warehouse picking. IP54.' },
      { name: 'Acme Sentinel', price: 'Quote required', status: 'quote_required' },
    ],
    procurementNotes: 'US-assembled. Ships from Boston. Volume tiers above 5 units.',
    ...overrides,
  };
}

describe('buildDefaults', () => {
  it('pre-populates every field for a well-formed vendor', () => {
    const v = fixture();
    const d = buildDefaults(v);
    expect(d.templateId).toBe(DEFAULT_TEMPLATE);
    expect(d.toEmail).toBe('sales@acme.example');
    expect(d.productName).toBe('Acme Scout v2');
    expect(d.quantity).toBe(DEFAULT_QUANTITY);
    expect(d.region).toBe(DEFAULT_REGION);
    expect(d.timeline).toMatch(/^Q[1-4] \d{4}$/);
    expect(d.useCase.length).toBeGreaterThan(0);
  });

  it('honors a non-default template override', () => {
    const d = buildDefaults(fixture(), 'spec_request');
    expect(d.templateId).toBe('spec_request');
  });

  it('falls back gracefully when vendor has no products, mailto, or notes', () => {
    const v = fixture({
      products: [],
      contacts: [{ label: 'Web', value: 'acme.example', href: 'https://acme.example' }],
      procurementNotes: undefined,
    });
    const d = buildDefaults(v);
    expect(d.toEmail).toBe('');
    expect(d.productName).toBe('');
    expect(d.useCase).toMatch(/industrial workflow/);
  });

  it('honors an explicit initialProductName override', () => {
    const v = fixture();
    const d = buildDefaults(v, undefined, 'Acme Sentinel');
    expect(d.productName).toBe('Acme Sentinel');
  });

  it('falls back to the first product when initialProductName does not match', () => {
    const v = fixture();
    const d = buildDefaults(v, undefined, 'Nonexistent Robot 9000');
    expect(d.productName).toBe('Acme Scout v2');
  });

  it('biases useCase toward the matched product notes when override is supplied', () => {
    const v = fixture({
      products: [
        { name: 'A', price: '$1', status: 'in_stock', notes: 'Alpha note for picking.' },
        { name: 'B', price: '$2', status: 'in_stock', notes: 'Beta note for sorting.' },
      ],
    });
    expect(buildDefaults(v, undefined, 'B').useCase).toBe('Beta note for sorting.');
  });
});

describe('defaultRecipient', () => {
  it('returns the first mailto contact', () => {
    expect(defaultRecipient(fixture())).toBe('sales@acme.example');
  });

  it('returns empty string when no mailto present', () => {
    const v = fixture({ contacts: [{ label: 'Web', value: 'acme.example', href: 'https://acme.example' }] });
    expect(defaultRecipient(v)).toBe('');
  });
});

describe('defaultProductName', () => {
  it('returns the first product name', () => {
    expect(defaultProductName(fixture())).toBe('Acme Scout v2');
  });

  it('returns empty string when products array is empty', () => {
    expect(defaultProductName(fixture({ products: [] }))).toBe('');
  });
});

describe('defaultUseCase', () => {
  it('extracts the first sentence from the first product notes', () => {
    expect(defaultUseCase(fixture())).toBe('Compact AMR for warehouse picking.');
  });

  it('falls back to procurementNotes when product notes are missing', () => {
    const v = fixture({
      products: [{ name: 'X', price: '$1', status: 'in_stock' }],
    });
    expect(defaultUseCase(v)).toBe('US-assembled.');
  });

  it('falls back to a generic line when nothing else is on file', () => {
    const v = fixture({
      products: [{ name: 'X', price: '$1', status: 'in_stock' }],
      procurementNotes: undefined,
    });
    expect(defaultUseCase(v)).toMatch(/industrial workflow/);
  });
});

describe('defaultTimeline', () => {
  it('returns "Q{n} {YYYY}" for a quarter at least 6 weeks out', () => {
    const t = defaultTimeline(new Date('2026-01-15T00:00:00Z'));
    // 2026-01-15 + 42 days = 2026-02-26 → Q1 2026
    expect(t).toBe('Q1 2026');
  });

  it('rolls into the next year correctly', () => {
    const t = defaultTimeline(new Date('2026-11-30T00:00:00Z'));
    // 2026-11-30 + 42 days = 2027-01-11 → Q1 2027
    expect(t).toBe('Q1 2027');
  });
});
