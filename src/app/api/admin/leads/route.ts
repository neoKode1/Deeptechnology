import { NextResponse } from 'next/server';
import { isAuthorizedRequest, unauthorizedResponse } from '@/lib/admin-auth';
import { listChatLeads, type ChatLeadRow } from '@/lib/chat-store';

export type ChatLead = ChatLeadRow;

/**
 * GET /api/admin/leads
 * Returns all chat leads captured from the Nimbus email gate.
 * Auth: admin session cookie or Bearer header.
 */
export async function GET(request: Request) {
  if (!(await isAuthorizedRequest(request))) {
    return unauthorizedResponse();
  }

  try {
    const leads = await listChatLeads();
    return NextResponse.json({ leads });
  } catch (err) {
    console.error('Failed to fetch leads:', err);
    return NextResponse.json({ error: 'Failed to fetch leads.' }, { status: 500 });
  }
}
