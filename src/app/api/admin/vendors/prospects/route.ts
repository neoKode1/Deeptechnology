import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedRequest } from '@/lib/admin-auth';
import {
  listVendorProspects,
  saveVendorProspect,
  type VendorProspect,
} from '@/lib/vendor-prospects';

export type { VendorProspect };

/**
 * GET /api/admin/vendors/prospects
 * Returns all field-collected vendor prospects.
 */
export async function GET(request: NextRequest) {
  if (!(await isAuthorizedRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const prospects = await listVendorProspects();
  return NextResponse.json({ prospects });
}

/**
 * POST /api/admin/vendors/prospects
 * Adds a new vendor prospect.
 * Body: Omit<VendorProspect, 'id' | 'createdAt'>
 */
export async function POST(request: NextRequest) {
  if (!(await isAuthorizedRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as Partial<VendorProspect>;

  if (!body.companyName?.trim() || !body.contactName?.trim()) {
    return NextResponse.json(
      { error: 'companyName and contactName are required' },
      { status: 400 },
    );
  }

  const prospect: VendorProspect = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    companyName:  body.companyName.trim(),
    productName:  body.productName?.trim()   ?? '',
    category:     body.category              ?? 'other',
    contactName:  body.contactName.trim(),
    contactEmail: body.contactEmail?.trim()  ?? '',
    contactPhone: body.contactPhone?.trim()  ?? '',
    website:      body.website?.trim()       ?? '',
    notes:        body.notes?.trim()         ?? '',
    status:       body.status                ?? 'prospect',
    metAt:        body.metAt?.trim()         ?? '',
  };

  await saveVendorProspect(prospect);

  return NextResponse.json({ prospect }, { status: 201 });
}
