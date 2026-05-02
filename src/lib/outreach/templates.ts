/**
 * Outreach templates — industry-standard "blind first contact" inquiries.
 *
 * The buyer is referred to anonymously ("a qualified end-buyer") on the first
 * touch. The end-client is only revealed after the vendor responds with the
 * requested material (specs, indicative pricing, lead times) and Deeptech
 * confirms the opportunity is real on both sides.
 *
 * Each template renders a subject + plaintext body. The consuming route wraps
 * the plaintext into a minimal HTML wrapper and appends the signature.
 */
import type { Vendor } from '@/data/vendors';

export type TemplateId =
  | 'spec_request'
  | 'quote_request'
  | 'availability_check'
  | 'demo_request'
  | 'procurement_order'
  | 'subscription_cancelled';

export interface TemplateContext {
  vendor: Vendor;
  productName?: string;
  quantity?: number;
  region?: string;       // e.g. "United States — Pacific Northwest"
  timeline?: string;     // e.g. "Q3 2026"
  useCase?: string;      // free-form one-liner
  /** Order id (procurement_order only) — links the email to a paid Stripe session */
  orderRef?: string;
  depositPaid?: string;  // formatted, e.g. "$500"
}

export interface RenderedTemplate {
  templateId: TemplateId;
  label: string;
  subject: string;
  body: string;
}

const greet = (v: Vendor) => `Hello ${v.name} team,`;

const buyerLine = (region?: string) =>
  region
    ? `I'm reaching out on behalf of a qualified end-buyer based in ${region}.`
    : `I'm reaching out on behalf of a qualified end-buyer in our active book.`;

const productLine = (productName?: string, vendor?: Vendor) => {
  if (productName) return `Their interest is specifically your **${productName}**.`;
  if (vendor && vendor.products[0]) return `Their interest is in your ${vendor.products[0].name} (and adjacent SKUs).`;
  return `Their interest is in your current product line.`;
};

export const TEMPLATE_LABELS: Record<TemplateId, string> = {
  spec_request:          'Spec sheet / datasheet',
  quote_request:         'Indicative quote',
  availability_check:    'Stock & lead time',
  demo_request:          'Remote demo',
  procurement_order:     'Procurement order',
  subscription_cancelled:'Subscription cancellation',
};

export function renderTemplate(id: TemplateId, ctx: TemplateContext): RenderedTemplate {
  const { vendor, productName, quantity, region, timeline, useCase, orderRef, depositPaid } = ctx;
  const qty = quantity && quantity > 0 ? quantity : undefined;
  const label = TEMPLATE_LABELS[id];

  switch (id) {
    case 'spec_request': {
      const subject = `Spec sheet request — ${productName ?? vendor.name}`;
      const body = [
        greet(vendor),
        '',
        buyerLine(region),
        productLine(productName, vendor),
        '',
        `Could you send across the latest datasheet, payload/dimensional drawings, and any published safety certifications? We'd like to evaluate fit before bringing the buyer into the conversation directly.`,
        useCase ? `\nFor context, the planned use case is: ${useCase}.` : '',
        '',
        `If there's a partner-portal link or a contact better suited to spec requests, happy to be redirected.`,
        '',
        `Thanks in advance,`,
      ].filter(Boolean).join('\n');
      return { templateId: id, label, subject, body };
    }

    case 'quote_request': {
      const qtyText = qty ? `${qty} unit${qty === 1 ? '' : 's'}` : 'an initial fleet';
      const subject = `Indicative quote request — ${productName ?? vendor.name} (${qtyText})`;
      const body = [
        greet(vendor),
        '',
        buyerLine(region),
        productLine(productName, vendor),
        '',
        `Could you provide indicative pricing for ${qtyText}${timeline ? `, with target deployment in ${timeline}` : ''}? Useful if you can break out:`,
        `  • Per-unit hardware cost (and any volume tiers)`,
        `  • Recurring software / fleet-management fees`,
        `  • Estimated lead time from PO`,
        `  • Standard payment terms`,
        useCase ? `\nUse case: ${useCase}.` : '',
        '',
        `Once we have an indicative number, we'll loop the end-buyer in directly under NDA so we can move into a formal RFQ quickly.`,
        '',
        `Thanks,`,
      ].filter(Boolean).join('\n');
      return { templateId: id, label, subject, body };
    }

    case 'availability_check': {
      const subject = `Availability & lead time — ${productName ?? vendor.name}`;
      const body = [
        greet(vendor),
        '',
        buyerLine(region),
        productLine(productName, vendor),
        '',
        `Could you confirm current stock posture and realistic lead time from PO for ${qty ? `${qty} units` : 'the platform'}${timeline ? ` against a ${timeline} need-by date` : ''}?`,
        '',
        `If anything is gated by an allocation queue, I'd appreciate knowing where new buyers currently sit so we can set expectations honestly on our side.`,
        '',
        `Thanks,`,
      ].filter(Boolean).join('\n');
      return { templateId: id, label, subject, body };
    }

    case 'demo_request': {
      const subject = `Remote demo request — ${productName ?? vendor.name}`;
      const body = [
        greet(vendor),
        '',
        buyerLine(region),
        productLine(productName, vendor),
        '',
        `We'd like to schedule a remote demo (Zoom / Teams / Meet) so the end-buyer can see the platform live before we formalize anything. Anything from a 20-minute walkthrough to a full capability deep-dive works — happy to take whatever your team usually runs.`,
        useCase ? `\nThey're evaluating it for: ${useCase}.` : '',
        '',
        `Could you share a couple of windows over the next 1–2 weeks? Pacific & Eastern US time zones are easiest, but we can flex.`,
        '',
        `Thanks,`,
      ].filter(Boolean).join('\n');
      return { templateId: id, label, subject, body };
    }

    case 'procurement_order': {
      const subject = `Procurement order — ${productName ?? vendor.name}${orderRef ? ` (Ref ${orderRef})` : ''}`;
      const body = [
        greet(vendor),
        '',
        `We have a confirmed end-buyer ready to proceed${region ? ` in ${region}` : ''}.`,
        productLine(productName, vendor),
        qty ? `\nQuantity: ${qty} unit${qty === 1 ? '' : 's'}.` : '',
        depositPaid ? `Buyer deposit cleared: ${depositPaid}.` : '',
        orderRef ? `Internal reference: ${orderRef}.` : '',
        '',
        `Please send your standard PO / invoice paperwork and confirm earliest realistic ship date. We'll bring the buyer in directly for delivery coordination once paperwork is in motion.`,
        '',
        `Thanks,`,
      ].filter(Boolean).join('\n');
      return { templateId: id, label, subject, body };
    }

    case 'subscription_cancelled': {
      const subject = `RaaS cancellation — ${productName ?? vendor.name}${orderRef ? ` (Ref ${orderRef})` : ''}`;
      const body = [
        greet(vendor),
        '',
        `Heads up — a previously-active Robot-as-a-Service subscription has been cancelled on our side.`,
        productLine(productName, vendor),
        orderRef ? `Internal reference: ${orderRef}.` : '',
        '',
        `Please pause any further billing, scheduled shipments, or fleet-management provisioning tied to this account. If hardware retrieval logistics are required, we'll coordinate with you on that separately once the buyer confirms next steps.`,
        '',
        `Thanks,`,
      ].filter(Boolean).join('\n');
      return { templateId: id, label, subject, body };
    }
  }
}
