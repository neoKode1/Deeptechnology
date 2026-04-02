import { NextResponse } from 'next/server';
import { getQuote, updateQuote } from '@/lib/quotes/store';
import { sendQuoteEmail } from '@/lib/quotes/email';
import { isAuthorizedRequest, unauthorizedResponse } from '@/lib/admin-auth';
import type { UpdateQuotePayload } from '@/lib/quotes/types';

/**
 * GET /api/quotes/[id]
 * Fetch a single quote by ID.
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quote = await getQuote(params.id);

    if (!quote) {
      return NextResponse.json(
        { success: false, message: 'Quote not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, quote });
  } catch (err) {
    console.error(`[quotes] Get ${params.id} error:`, err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch quote.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/quotes/[id]
 * Update a quote's status, routing, notes, or line items.
 *
 * Example payloads:
 *   { "status": "sent" }                              — Admin approves and sends
 *   { "status": "accepted" }                           — User accepts
 *   { "routing": { "destination": "noelle" } }         — Admin routes to Noelle
 *   { "status": "ordered", "notes": "PO #12345" }     — Order placed
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthorizedRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = (await request.json()) as UpdateQuotePayload;
    const quote = await updateQuote(params.id, body);

    if (!quote) {
      return NextResponse.json(
        { success: false, message: 'Quote not found.' },
        { status: 404 }
      );
    }

    // Send email when quote transitions to "sent"
    let emailResult: { success: boolean; error?: string } | undefined;
    if (body.status === 'sent') {
      emailResult = await sendQuoteEmail(quote);
      if (!emailResult.success) {
        console.error(`[quotes] Email failed for ${quote.id}:`, emailResult.error);
      }
    }

    return NextResponse.json({ success: true, quote, emailSent: emailResult?.success });
  } catch (err) {
    console.error(`[quotes] Update ${params.id} error:`, err);
    return NextResponse.json(
      { success: false, message: 'Failed to update quote.' },
      { status: 500 }
    );
  }
}

