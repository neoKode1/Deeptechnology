import { d1Exec } from '@/lib/d1';

/**
 * D1-backed work order store. Created when an admin clicks "Start Work
 * Order" on a paid quote and consumed by automation (Claude Code agents,
 * etc.) that polls for new procurement tasks.
 */
export interface WorkOrderRecord {
  id: string;            // wo-{quoteId}
  quoteId: string;
  status: 'pending' | 'in_progress' | 'done';
  customer: { name: string; email: string };
  inquiryType: string;
  summary: string;
  routing: { destination: string; assignedTo?: string; notes?: string };
  lineItems: Array<{
    description: string;
    vendor: string;
    vendorUrl?: string;
    vendorCost: number;
    clientPrice: number;
    notes?: string;
  }>;
  total: number;
  stripePaymentIntent?: string;
  createdAt: string;
  updatedAt: string;
}

/** Insert (or replace) a work order record. Keyed by quote id. */
export async function saveWorkOrder(quoteId: string, record: WorkOrderRecord): Promise<void> {
  const ts = Date.now();
  await d1Exec(
    `INSERT INTO work_orders (id, data, created_at, updated_at) VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       data       = excluded.data,
       updated_at = excluded.updated_at`,
    [quoteId, JSON.stringify(record), ts, ts],
  );
}

/** Delete a work order (used when a quote is cancelled). */
export async function deleteWorkOrder(quoteId: string): Promise<void> {
  await d1Exec('DELETE FROM work_orders WHERE id = ?', [quoteId]);
}
