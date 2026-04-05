import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Redis } from '@upstash/redis';
import { getQuote } from '@/lib/quotes/store';
import SoftDevHeader from '@/components/SoftDevHeader';
import type { Quote } from '@/lib/quotes/types';

const STATUS_STYLES: Record<string, string> = {
  draft:       'bg-neutral-800 text-neutral-400 border-neutral-700',
  sent:        'bg-blue-900/30 text-blue-400 border-blue-800/50',
  accepted:    'bg-yellow-900/30 text-yellow-400 border-yellow-800/50',
  ordered:     'bg-purple-900/30 text-purple-400 border-purple-800/50',
  procurement: 'bg-orange-900/30 text-orange-400 border-orange-800/50',
  deployed:    'bg-emerald-900/30 text-emerald-400 border-emerald-800/50',
  cancelled:   'bg-red-900/30 text-red-400 border-red-800/50',
};

async function OrderList({ token }: { token: string }) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  // Verify the magic-link token
  const email = await redis.get<string>(`portal:token:${token}`);
  if (!email) redirect('/portal?expired=1');

  // Consume the token so it can't be reused
  await redis.del(`portal:token:${token}`);

  // Fetch all quote IDs for this email
  const quoteIds: string[] = (await redis.lrange(`quotes:by-email:${email}`, 0, -1)) ?? [];

  // Load each quote
  const quotes: Quote[] = (
    await Promise.all(quoteIds.map(id => getQuote(id)))
  ).filter((q): q is Quote => q !== null);

  quotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="w-full max-w-2xl mx-auto">
      <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-600 mb-6 font-manrope">
        Deep Tech · Order Portal
      </p>
      <h1 className="text-2xl font-semibold text-white font-manrope mb-1">Your orders</h1>
      <p className="text-sm text-neutral-500 font-manrope mb-10">{email}</p>

      {quotes.length === 0 ? (
        <div className="border border-neutral-900 rounded-xl p-10 text-center">
          <p className="text-neutral-600 text-sm font-manrope">No orders found for this email.</p>
          <Link href="/contact" className="text-xs text-neutral-500 underline font-manrope mt-3 inline-block hover:text-neutral-300 transition-colors">
            Contact us →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {quotes.map(q => {
            const total = (q.lineItems ?? []).reduce(
              (s: number, li) => s + li.clientPrice, 0
            );
            return (
              <Link key={q.id} href={`/orders/${q.id}`}
                className="block border border-neutral-900 rounded-xl p-5 bg-neutral-950 hover:border-neutral-700 transition-colors group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white font-manrope truncate group-hover:text-white">
                      {q.summary ?? `Order ${q.id.slice(0, 8)}`}
                    </p>
                    <p className="text-xs text-neutral-600 font-manrope mt-0.5">
                      {new Date(q.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {total > 0 && (
                      <p className="text-sm font-semibold text-white font-manrope tabular-nums">
                        ${total.toLocaleString()}
                      </p>
                    )}
                    <span className={`text-[10px] uppercase tracking-wider border rounded-full px-2 py-0.5 font-manrope ${STATUS_STYLES[q.status] ?? STATUS_STYLES.draft}`}>
                      {q.status}
                    </span>
                  </div>
                </div>
                {q.status === 'sent' && (
                  <p className="text-xs text-blue-400 font-manrope mt-3">
                    Quote awaiting your approval — view &amp; approve →
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link href="/portal" className="text-xs text-neutral-700 hover:text-neutral-500 transition-colors font-manrope underline">
          ← Access a different email
        </Link>
      </div>
    </div>
  );
}

export default function PortalOrdersPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;
  if (!token) redirect('/portal');

  return (
    <div className="min-h-screen bg-black text-white">
      <SoftDevHeader />
      <main className="max-w-2xl mx-auto px-6 pt-32 pb-24">
        <Suspense fallback={
          <div className="text-neutral-600 text-sm font-manrope text-center py-20">
            Verifying your link…
          </div>
        }>
          <OrderList token={token} />
        </Suspense>
      </main>
    </div>
  );
}
