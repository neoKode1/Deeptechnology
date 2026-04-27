import { d1Query, d1Exec } from '@/lib/d1';

/**
 * D1-backed vendor prospect store. Replaces the single Redis JSON-array key.
 */
export interface VendorProspect {
  id: string;
  createdAt: string;
  companyName: string;
  productName: string;
  category: 'humanoid' | 'amr' | 'delivery' | 'drone' | 'software' | 'other';
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  notes: string;
  status: 'prospect' | 'evaluating' | 'active';
  metAt: string;
}

interface VendorProspectRow {
  id: string;
  data: string;
  created_at: number;
}

function rowToProspect(row: VendorProspectRow): VendorProspect {
  return JSON.parse(row.data) as VendorProspect;
}

/** List all vendor prospects, newest first. */
export async function listVendorProspects(): Promise<VendorProspect[]> {
  const rows = await d1Query<VendorProspectRow>(
    'SELECT id, data, created_at FROM vendor_prospects ORDER BY created_at DESC',
  );
  return rows.map(rowToProspect);
}

/** Insert a vendor prospect. */
export async function saveVendorProspect(prospect: VendorProspect): Promise<void> {
  await d1Exec(
    'INSERT INTO vendor_prospects (id, data, created_at) VALUES (?, ?, ?)',
    [prospect.id, JSON.stringify(prospect), Date.now()],
  );
}
