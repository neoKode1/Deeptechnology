/**
 * Smart pre-population for admin Quick Inquiry forms.
 *
 * The composer opens with every field already filled in so the operator can
 * just hit Send. Defaults are derived from:
 *   - the vendor record (first product, mailto contact)
 *   - a small static config (region, default template)
 *   - a computed timeline ("next quarter" relative to today)
 *
 * Everything is overrideable from the form; these are the starting values.
 */
import type { Vendor } from '@/data/vendors';
import type { TemplateId } from './templates';

/** The template that loads first when the operator clicks the primary Send button. */
export const DEFAULT_TEMPLATE: TemplateId = 'quote_request';

/** Region the buyer is presumed to be in unless the operator changes it. */
export const DEFAULT_REGION = 'United States';

/** Default opening quantity (most enterprise sourcing convos start with a single-unit eval). */
export const DEFAULT_QUANTITY = 1;

/**
 * Returns "Q{n} {YYYY}" for the quarter that starts at least 6 weeks from
 * today — long enough that the vendor doesn't feel rushed, short enough that
 * we keep momentum.
 */
export function defaultTimeline(now: Date = new Date()): string {
  const t = new Date(now);
  t.setDate(t.getDate() + 42); // +6 weeks
  const month = t.getMonth(); // 0-indexed
  const quarter = Math.floor(month / 3) + 1;
  return `Q${quarter} ${t.getFullYear()}`;
}

/** First mailto contact on the vendor, or empty string if none. */
export function defaultRecipient(vendor: Vendor): string {
  const c = vendor.contacts.find(x => x.href?.startsWith('mailto:'));
  return c?.value?.trim() ?? '';
}

/** First product name, or empty string if the vendor has no listed products. */
export function defaultProductName(vendor: Vendor): string {
  return vendor.products[0]?.name ?? '';
}

/**
 * One-liner buyer use case derived from vendor metadata. Keeps the email
 * grounded so the vendor can immediately tell whether the conversation is
 * worth their time. Falls back to a generic line if no notes exist.
 */
export function defaultUseCase(vendor: Vendor): string {
  const product = vendor.products[0];
  const productNote = product?.notes?.trim();
  if (productNote) {
    // Take the first sentence to keep it tight.
    const firstSentence = productNote.split(/(?<=[.!?])\s/)[0].trim();
    if (firstSentence.length > 0 && firstSentence.length <= 200) return firstSentence;
  }
  if (vendor.procurementNotes) {
    const firstSentence = vendor.procurementNotes.split(/(?<=[.!?])\s/)[0].trim();
    if (firstSentence.length > 0 && firstSentence.length <= 200) return firstSentence;
  }
  return `Production deployment in a ${vendor.category} workflow.`;
}

export interface InquiryDefaults {
  templateId: TemplateId;
  toEmail: string;
  productName: string;
  quantity: number;
  region: string;
  timeline: string;
  useCase: string;
}

/**
 * Build the full set of pre-populated form values for a vendor + template.
 * The composer feeds these directly into its initial state.
 */
export function buildDefaults(vendor: Vendor, templateId: TemplateId = DEFAULT_TEMPLATE): InquiryDefaults {
  return {
    templateId,
    toEmail: defaultRecipient(vendor),
    productName: defaultProductName(vendor),
    quantity: DEFAULT_QUANTITY,
    region: DEFAULT_REGION,
    timeline: defaultTimeline(),
    useCase: defaultUseCase(vendor),
  };
}
