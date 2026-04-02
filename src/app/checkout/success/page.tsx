'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import SoftDevHeader from '@/components/SoftDevHeader';

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const quoteId = searchParams.get('quote_id');

  return (
    <div className="min-h-screen bg-white text-[#4d4d4d]">
      <SoftDevHeader />

      <section className="px-4 sm:px-6 md:px-12 lg:px-20 pt-32 pb-24 max-w-[82rem] mx-auto">
        <div className="max-w-xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <h1
            className="font-manrope font-semibold text-[#111] leading-tight tracking-tight mb-4"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}
          >
            Payment confirmed.
          </h1>

          <p className="text-sm sm:text-base text-[#777] leading-relaxed font-manrope mb-2">
            Your order has been received and is being processed.
          </p>

          {quoteId && (
            <p className="text-xs text-[#999] font-manrope mb-8">
              Quote reference: <span className="text-[#555] font-medium">{quoteId}</span>
            </p>
          )}

          <div className="border border-[#eee] rounded-sm p-6 bg-[#fafafa] text-left mb-8">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#999] font-manrope font-semibold mb-3">
              What happens next
            </p>
            <ol className="space-y-3 text-sm text-[#555] font-manrope">
              <li className="flex gap-3">
                <span className="text-[#111] font-semibold shrink-0">1.</span>
                <span>You&apos;ll receive a confirmation email with your receipt.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#111] font-semibold shrink-0">2.</span>
                <span>Our sourcing team will begin procurement with the selected vendor(s).</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#111] font-semibold shrink-0">3.</span>
                <span>You&apos;ll receive status updates as your order progresses.</span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {quoteId && (
              <Link
                href={`/quote/${quoteId}`}
                className="inline-flex items-center gap-2 border border-[#ccc] text-[#111] rounded-none px-6 py-3 text-sm font-medium hover:border-[#111] transition-colors font-manrope"
              >
                View Order Details <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#111] text-white rounded-none px-6 py-3 text-sm font-medium hover:bg-black transition-colors font-manrope"
            >
              Back to Deep Tech
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

