'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import type { BuyAction } from '@/lib/buy/resolve';

/**
 * Public-facing in-app buy button. Renders the resolved BuyAction and, on
 * click, calls /api/buy to either redirect to a Stripe Checkout session
 * (buy_now / reserve / subscribe) or navigate to the contact form
 * (request / unavailable).
 *
 * The action is resolved on the server and passed in as a prop so the
 * displayed label and the executed action are guaranteed to match.
 */
export default function PublicBuyButton({
  vendorId,
  productSlug,
  action,
  variant = 'primary',
}: {
  vendorId: string;
  productSlug: string;
  action: BuyAction;
  variant?: 'primary' | 'secondary';
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isStripe = action.kind === 'buy_now' || action.kind === 'reserve' || action.kind === 'subscribe';

  async function onClick() {
    setError(null);
    if (!isStripe) {
      if (action.fallbackHref) router.push(action.fallbackHref);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId, productSlug }),
      });
      const data = (await res.json()) as { success?: boolean; url?: string; redirect?: string; message?: string };
      if (!res.ok || !data.success) {
        setError(data.message || 'Could not start checkout. Please try again.');
        setLoading(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.redirect) {
        router.push(data.redirect);
        return;
      }
      setError('Checkout response was missing a destination.');
      setLoading(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Network error. Please try again.';
      setError(msg);
      setLoading(false);
    }
  }

  const base =
    'inline-flex items-center gap-2 font-manrope text-sm px-6 py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed';
  const styles =
    variant === 'primary'
      ? 'bg-white text-black font-semibold hover:bg-neutral-200'
      : 'border border-neutral-700 text-white hover:border-neutral-500';

  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={onClick} disabled={loading} className={`${base} ${styles}`}>
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Redirecting…
          </>
        ) : (
          <>
            {action.label}
            <ArrowUpRight className="w-4 h-4" />
          </>
        )}
      </button>
      <p className="text-xs text-neutral-500 max-w-md">{action.helpText}</p>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
