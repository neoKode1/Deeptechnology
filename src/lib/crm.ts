/**
 * CRM bridge — pushes structured lead data to Make.com via webhook.
 *
 * Make.com receives the payload and can route it to HubSpot, Airtable,
 * Google Sheets, Slack, or any other tool in the scenario.
 *
 * Setup:
 *   1. Create a Make.com scenario with a "Custom webhook" trigger
 *   2. Copy the webhook URL into MAKE_COM_WEBHOOK_URL in .env.local
 *   3. Connect HubSpot (or any CRM) as the next module
 *
 * All calls are fire-and-forget — a failure never blocks the customer response.
 */

export type CRMLeadType =
  | 'contact_form'
  | 'roi_calculator'
  | 'pilot_request'
  | 'enterprise_requisition'
  | 'compare_unlock';

export interface CRMPayload {
  /** Source of the lead */
  leadType: CRMLeadType;
  /** ISO timestamp of lead capture */
  capturedAt: string;
  /** Contact info */
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
  /** Lead-specific data */
  inquiry?: string;
  message?: string;
  robotType?: string;
  fleetSize?: string;
  environment?: string;
  budget?: string;
  timeline?: string;
  /** ROI calculator outputs */
  roiMonthlyProfit?: number;
  roiMonthlyRevenue?: number;
  roiPercent?: number;
  roiUnits?: number;
  /** Comparison page that triggered the unlock */
  compareSlug?: string;
  /** Internal reference */
  quoteId?: string;
  requestId?: string;
}

/**
 * Push a lead to Make.com. Fire-and-forget — never throws.
 * Call this after the admin email and customer confirmation have already sent.
 */
export function pushToCRM(payload: CRMPayload): void {
  const webhookUrl = process.env.MAKE_COM_WEBHOOK_URL;
  if (!webhookUrl) {
    // Not configured — silently skip (don't break local dev)
    return;
  }

  const body = JSON.stringify({
    ...payload,
    capturedAt: payload.capturedAt ?? new Date().toISOString(),
    source: 'deeptechnologies.dev',
  });

  // Fire-and-forget: use native fetch with a 10s timeout
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    signal: controller.signal,
  })
    .then(res => {
      clearTimeout(timer);
      if (!res.ok) {
        console.warn(`[crm] Make.com webhook returned ${res.status}`);
      } else {
        console.log(`[crm] Lead pushed — ${payload.leadType} · ${payload.email}`);
      }
    })
    .catch(err => {
      clearTimeout(timer);
      console.warn(`[crm] Make.com webhook failed (non-fatal):`, err?.message ?? err);
    });
}
