import { NextResponse } from 'next/server';
import { createQuote, listQuotes } from '@/lib/quotes/store';
import { isAuthorizedRequest, unauthorizedResponse } from '@/lib/admin-auth';
import type { CreateQuotePayload } from '@/lib/quotes/types';

/**
 * GET /api/quotes?status=draft
 * List all quotes, optionally filtered by status.
 */
export async function GET(request: Request) {
  if (!isAuthorizedRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') ?? undefined;
    const quotes = await listQuotes(status);

    return NextResponse.json({ success: true, quotes });
  } catch (err) {
    console.error('[quotes] List error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to list quotes.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/quotes
 * Create a new quote. Typically called by Nimbus after sourcing,
 * or manually by admin for testing.
 */
export async function POST(request: Request) {
  if (!isAuthorizedRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = (await request.json()) as CreateQuotePayload;

    if (!body.customerEmail || !body.customerName || !body.inquiryType || !body.lineItems?.length) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: customerEmail, customerName, inquiryType, lineItems.' },
        { status: 400 }
      );
    }

    const quote = await createQuote(body);

    return NextResponse.json({ success: true, quote }, { status: 201 });
  } catch (err) {
    console.error('[quotes] Create error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to create quote.' },
      { status: 500 }
    );
  }
}

