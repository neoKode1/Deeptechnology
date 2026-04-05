import { NextResponse } from 'next/server';
import { getQuote, updateQuote } from '@/lib/quotes/store';
import { sendQuoteEmail } from '@/lib/quotes/email';
import { isAuthorizedRequest, unauthorizedResponse } from '@/lib/admin-auth';
import type { UpdateQuotePayload } from '@/lib/quotes/types';
import { Resend } from 'resend';
import { quoteNurture, deployedRetention } from '@/lib/nurture';

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
  if (!await isAuthorizedRequest(request)) {
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

    // Send email + schedule nurture when quote transitions to "sent"
    let emailResult: { success: boolean; error?: string } | undefined;
    if (body.status === 'sent') {
      emailResult = await sendQuoteEmail(quote);
      if (!emailResult.success) {
        console.error(`[quotes] Email failed for ${quote.id}:`, emailResult.error);
      } else {
        // Schedule Seq 3 follow-ups (D+3/D+7/D+8) — non-fatal
        try {
          const resend = new Resend(process.env.RESEND_API_KEY);
          const total = quote.lineItems?.reduce((s: number, li) => s + li.clientPrice, 0) ?? 0;
          await quoteNurture({
            resend,
            email: quote.customerEmail,
            customerName: quote.customerName,
            quoteId: quote.id,
            total,
            summary: quote.summary ?? 'your robot order',
          });
          console.log(`[quotes] Seq-3 nurture scheduled for ${quote.customerEmail}`);
        } catch (nErr) {
          console.error('[quotes] quoteNurture error (non-fatal):', nErr);
        }
      }
    }

    // Schedule Seq 5 retention emails when quote is marked deployed
    if (body.status === 'deployed') {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await deployedRetention({
          resend,
          email: quote.customerEmail,
          customerName: quote.customerName,
          quoteId: quote.id,
        });
        console.log(`[quotes] Seq-5 retention (M+1/M+3/M+6) scheduled for ${quote.customerEmail}`);
      } catch (rErr) {
        console.error('[quotes] deployedRetention error (non-fatal):', rErr);
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

