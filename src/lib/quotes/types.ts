/**
 * Quote system types for the Deeptech sourcing pipeline.
 *
 * Flow: contact form → Nimbus sources → quote created (draft)
 *       → admin reviews (pending_review) → sent to user (sent)
 *       → user accepts (accepted) → order placed (ordered)
 */

export type QuoteStatus =
  | 'draft'           // Nimbus generated, not yet reviewed
  | 'pending_review'  // Waiting for admin approval
  | 'sent'            // Approved and emailed to user
  | 'accepted'        // User clicked "Accept Quote"
  | 'expired'         // Past expiration window
  | 'ordered'         // Order placed with vendor / build started
  | 'procurement'     // Vendor contacted, purchase order submitted
  | 'shipped'         // Vendor has shipped the hardware
  | 'in_transit'      // En route to customer / deployment site
  | 'delivered'       // Hardware received at destination
  | 'deployed'        // On-site, operational, in the field
  | 'rejected';       // Admin or user declined

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

export interface LineItem {
  description: string;
  vendor: string;
  vendorUrl?: string;
  vendorCost: number;
  markup: number;       // e.g. 0.15 for 15%
  clientPrice: number;  // vendorCost * (1 + markup)
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
  subtotal: number;        // Sum of all clientPrice values
  total: number;           // Final total (same as subtotal for now; room for tax/fees later)
  status: QuoteStatus;
  routing?: QuoteRouting;  // Admin triage decision
  messages: QuoteMessage[];// Conversation thread (admin replies, system notifications)
  createdAt: string;       // ISO 8601
  updatedAt: string;       // ISO 8601
  expiresAt: string;       // ISO 8601 — typically 7 days after sent
  acceptedAt?: string;     // ISO 8601
  paidAt?: string;         // ISO 8601 — Stripe payment confirmed
  workOrderStartedAt?: string; // ISO 8601 — admin clicked "Start Work Order"
  stripePaymentIntent?: string; // pi_... from Stripe
  notes?: string;          // Admin notes
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
    markup?: number;       // defaults to 0.15
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

