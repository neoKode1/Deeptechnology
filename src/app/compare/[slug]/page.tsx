import { notFound } from 'next/navigation';
import Link from 'next/link';
import { COMPARISONS, getComparison } from '@/data/comparisons';
import ComparisonGate from './ComparisonGate';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) return {};
  return {
    title: comparison.title,
    description: comparison.description,
    openGraph: {
      title: comparison.title,
      description: comparison.description,
      url: `https://deeptechnologies.dev/compare/${slug}`,
    },
  };
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) notFound();

  const { vendorALabel, vendorBLabel, description, vendorAId, vendorBId } = comparison;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xs font-bold tracking-widest uppercase text-white">
            Deep Tech
          </Link>
          <Link
            href="/robotics"
            className="text-xs text-neutral-400 hover:text-white transition-colors"
          >
            ← Vendor Catalog
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-6">
          Vendor Comparison · Robotics
        </p>

        {/* Hero */}
        <div className="mb-4 flex flex-wrap gap-3 items-center">
          <Link
            href={`/robotics/${vendorAId}`}
            className="border border-white/15 rounded-full px-3 py-1 text-xs text-neutral-300 hover:border-white/40 transition-colors"
          >
            {vendorALabel}
          </Link>
          <span className="text-neutral-600 text-xs">vs</span>
          <Link
            href={`/robotics/${vendorBId}`}
            className="border border-white/15 rounded-full px-3 py-1 text-xs text-neutral-300 hover:border-white/40 transition-colors"
          >
            {vendorBLabel}
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-snug">
          {vendorALabel} vs {vendorBLabel}
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed mb-3 max-w-2xl">{description}</p>
        <p className="text-neutral-500 text-xs mb-10">
          Updated April 2026 · Source-verified pricing from Deep Tech vendor database
        </p>

        {/* Comparison table + gate */}
        <ComparisonGate comparison={comparison} />

        {/* Footer links */}
        <div className="mt-16 border-t border-white/5 pt-10">
          <p className="text-xs uppercase tracking-widest text-neutral-600 mb-4">
            Other Comparisons
          </p>
          <div className="flex flex-wrap gap-3">
            {COMPARISONS.filter((c) => c.slug !== slug).map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="border border-white/10 rounded-full px-4 py-2 text-xs text-neutral-400 hover:border-white/30 hover:text-white transition-colors"
              >
                {c.vendorALabel} vs {c.vendorBLabel}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
