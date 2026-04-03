/**
 * Quote system types for the Deeptech sourcing pipeline.
 *
 * Flow: contact form → Nimbus sources → quote created (draft)
 *       → admin reviews (pending_review) → sent to user (sent)
 *       → user accepts (accepted) → order placed (ordered)
 */

export type QuoteStatus =
  | 'draft'              // Nimbus generated, not yet reviewed
  | 'pending_review'     // Waiting for admin approval
  | 'sent'               // Approved and emailed to user
  | 'accepted'           // User clicked "Accept Quote"
  | 'pending_net_terms'  // Customer requested Net-30/60 payment terms
  | 'expired'            // Past expiration window
  | 'ordered'            // Order placed with vendor / build started
  | 'procurement'        // Vendor contacted, purchase order submitted
  | 'shipped'            // Vendor has shipped the hardware
  | 'in_transit'         // En route to customer / deployment site
  | 'delivered'          // Hardware received at destination
  | 'deployed'           // On-site, operational, in the field
  | 'cancelled'          // Work order cancelled — service fee retained, vendor costs refunded
  | 'rejected';          // Admin or user declined

/** Ordered stages for the fulfillment timeline (post-payment) */
export const FULFILLMENT_STAGES: QuoteStatus[] = [
  'ordered',
  'procurement',
  'shipped',
  'in_transit',
  'delivered',
  'deployed',
];

/** Human-readable labels for each fulfillment stage */
export const STAGE_LABELS: Record<string, string> = {
  ordered: 'Order Confirmed',
  procurement: 'Procurement',
  shipped: 'Shipped',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  deployed: 'Deployed',
};

export type BillingCycle = 'one_time' | 'monthly';

export interface LineItem {
  description: string;
  vendor: string;
  vendorUrl?: string;
  vendorCost: number;
  markup: number;        // e.g. 0.15 for 15%
  clientPrice: number;   // vendorCost * (1 + markup)
  billingCycle?: BillingCycle; // 'one_time' (default) | 'monthly' for RaaS
  notes?: string;
}

/** A message in the quote conversation thread (admin ↔ customer ↔ system) */
export interface QuoteMessage {
  id: string;              // msg-{uuid}
  from: 'admin' | 'system' | 'customer';
  to: string;              // email address
  subject: string;
  body: string;            // plain text or markdown
  sentAt: string;          // ISO 8601
  sentBy?: string;         // admin identifier or customer email
}

export interface Quote {
  id: string;              // quote-{uuid}
  requestId: string;       // links to original sourcing session
  customerName: string;
  customerEmail: string;
  inquiryType: string;     // 'Software solutions' | 'Autonomous solutions' | 'Media solutions'
  summary: string;         // Brief description of what was sourced
  lineItems: LineItem[];
  subtotal: number;        // Sum of all one_time clientPrice values
  total: number;           // Final one-time total (same as subtotal for now)
  billingCycle?: BillingCycle; // Overall quote billing mode (derived from line items)
  monthlyTotal?: number;   // Sum of all monthly clientPrice values (RaaS)
  status: QuoteStatus;
  routing?: QuoteRouting;  // Admin triage decision
  messages: QuoteMessage[];// Conversation thread (admin replies, system notifications)
  createdAt: string;       // ISO 8601
  updatedAt: string;       // ISO 8601
  expiresAt: string;       // ISO 8601 — typically 7 days after sent
  acceptedAt?: string;     // ISO 8601
  paidAt?: string;         // ISO 8601 — Stripe payment confirmed
  workOrderStartedAt?: string; // ISO 8601 — admin clicked "Start Work Order"
  stripePaymentIntent?: string;  // pi_... from Stripe (one-time)
  stripeSubscriptionId?: string; // sub_... from Stripe (RaaS monthly)
  stripeAmountTotal?: number;    // amount_total in cents from Stripe session — refund ceiling
  notes?: string;          // Admin notes
  // Cancellation fields
  cancelledAt?: string;        // ISO 8601
  cancellation?: CancellationRecord;
}

/** Record of a work order cancellation */
export interface CancellationRecord {
  reason: string;              // Admin-provided reason
  serviceFeeRetained: number;  // The markup amount Deep Tech keeps (service fee)
  vendorCostRefunded: number;  // The vendor cost portion refunded to customer
  refundTotal: number;         // Amount actually refunded via Stripe
  stripeRefundId?: string;     // re_... from Stripe
  cancelledBy: string;         // admin identifier
}

/** Admin routing decision — where does this work go? */
export interface QuoteRouting {
  destination: 'noelle' | 'manual' | 'vendor_order' | 'production';
  assignedTo?: string;     // email or name
  notes?: string;
}

/** Payload for creating a new quote via POST /api/quotes */
export interface CreateQuotePayload {
  requestId: string;
  customerName: string;
  customerEmail: string;
  inquiryType: string;
  summary: string;
  lineItems: Array<{
    description: string;
    vendor: string;
    vendorUrl?: string;
    vendorCost: number;
    markup?: number;            // defaults to 0.15
    billingCycle?: BillingCycle; // defaults to 'one_time'
    notes?: string;
  }>;
  notes?: string;
}

/** Payload for updating a quote via PATCH /api/quotes/[id] */
export interface UpdateQuotePayload {
  status?: QuoteStatus;
  routing?: QuoteRouting;
  notes?: string;
  lineItems?: Quote['lineItems'];
}

