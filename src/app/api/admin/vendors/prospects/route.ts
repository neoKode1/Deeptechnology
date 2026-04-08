import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { isAuthorizedRequest } from '@/lib/admin-auth';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const KEY = 'vendors:prospects';

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
  metAt: string;        // where/how you met them e.g. "CES 2025", "cold outreach"
}

/**
 * GET /api/admin/vendors/prospects
 * Returns all field-collected vendor prospects from Redis.
 */
export async function GET(request: NextRequest) {
  if (!(await isAuthorizedRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const raw = await redis.get<VendorProspect[]>(KEY);
  const prospects = Array.isArray(raw) ? raw : [];

  return NextResponse.json({ prospects });
}

/**
 * POST /api/admin/vendors/prospects
 * Adds a new vendor prospect to Redis.
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

  const existing = await redis.get<VendorProspect[]>(KEY);
  const list = Array.isArray(existing) ? existing : [];
  list.unshift(prospect); // newest first

  await redis.set(KEY, list);

  return NextResponse.json({ prospect }, { status: 201 });
}
