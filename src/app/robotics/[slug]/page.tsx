import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { VENDORS, BUY_PATH_LABELS, getVendor } from '@/data/vendors';
import SoftDevHeader from '@/components/SoftDevHeader';

/** Pre-render all 14 vendor pages at build time */
export function generateStaticParams() {
  return VENDORS.map((v) => ({ slug: v.id }));
}

/** Per-vendor SEO metadata */
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const vendor = getVendor(params.slug);
  if (!vendor) return {};

  const priceRange = vendor.products
    .map((p) => p.price)
    .filter((p) => p.match(/\$/))
    .slice(0, 2)
    .join(' – ');

  const title = `${vendor.name} Robots — Pricing, Lead Times & How to Buy | Deep Tech`;
  const description = `Verified ${vendor.name} procurement guide. ${priceRange ? priceRange + '. ' : ''}${vendor.procurementNotes.slice(0, 120)}…`;

  return {
    title,
    description,
    openGraph: { title, description, url: `https://deeptechnologies.dev/robotics/${vendor.id}` },
    alternates: { canonical: `https://deeptechnologies.dev/robotics/${vendor.id}` },
  };
}

const CATEGORY_LABELS = {
  humanoid: 'Humanoid Robot',
  delivery: 'Delivery Robot',
  industrial: 'Warehouse / Industrial',
  drone: 'Enterprise Drone',
} as const;

const STATUS_STYLES = {
  in_stock:       'bg-emerald-900/30 text-emerald-400 border-emerald-800/50',
  pre_order:      'bg-yellow-900/30 text-yellow-400 border-yellow-800/50',
  raas:           'bg-cyan-900/30 text-cyan-400 border-cyan-800/50',
  quote_required: 'bg-neutral-800 text-neutral-400 border-neutral-700',
  not_available:  'bg-red-900/30 text-red-400 border-red-800/50',
} as const;

const STATUS_LABELS = {
  in_stock: 'In Stock', pre_order: 'Pre-Order', raas: 'RaaS',
  quote_required: 'Quote Required', not_available: 'Not Available',
} as const;

export default function VendorPage({ params }: { params: { slug: string } }) {
  const vendor = getVendor(params.slug);
  if (!vendor) notFound();

  const ctaHref = `/contact?inquiry=robotics&vendor=${encodeURIComponent(vendor.name)}`;

  return (
    <div className="min-h-screen bg-black text-white">
      <SoftDevHeader />

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-600 mb-10 font-manrope">
          <Link href="/robotics" className="hover:text-neutral-400 transition-colors">Robotics</Link>
          <span>/</span>
          <span className="text-neutral-400">{vendor.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-[10px] uppercase tracking-widest border border-neutral-800 text-neutral-500 rounded-full px-3 py-1 font-manrope">
              {CATEGORY_LABELS[vendor.category]}
            </span>
            <span className="text-[10px] uppercase tracking-widest border rounded-full px-3 py-1 font-manrope text-neutral-400 border-neutral-700">
              {BUY_PATH_LABELS[vendor.buyPath]}
            </span>
            {vendor.leadTime && (
              <span className="text-[10px] uppercase tracking-widest text-neutral-600 font-manrope">
                Lead time: {vendor.leadTime}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold font-manrope text-white mb-3">{vendor.name}</h1>
          <p className="text-neutral-400 text-sm font-manrope leading-relaxed max-w-xl">{vendor.procurementNotes}</p>
        </div>

        {/* Products */}
        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-widest text-neutral-600 mb-4 font-manrope">Products & Pricing</h2>
          <div className="divide-y divide-neutral-900 border border-neutral-900 rounded-xl overflow-hidden">
            {vendor.products.map((p) => (
              <div key={p.name} className="flex items-start justify-between gap-4 px-5 py-4 bg-neutral-950 hover:bg-neutral-900 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white font-manrope">{p.name}</p>
                  {p.notes && <p className="text-xs text-neutral-600 mt-0.5 font-manrope">{p.notes}</p>}
                  {p.deposit && <p className="text-xs text-yellow-600 mt-0.5 font-manrope">Deposit: {p.deposit}</p>}
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-sm font-semibold text-white font-manrope tabular-nums">{p.price}</span>
                  <span className={`text-[10px] uppercase tracking-wider border rounded-full px-2 py-0.5 font-manrope ${STATUS_STYLES[p.status]}`}>
                    {STATUS_LABELS[p.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contacts */}
        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-widest text-neutral-600 mb-4 font-manrope">Verified Contacts</h2>
          <div className="space-y-2">
            {vendor.contacts.map((c) => (
              <div key={c.label} className="flex items-center justify-between gap-4 px-5 py-3 border border-neutral-900 rounded-lg bg-neutral-950">
                <span className="text-xs text-neutral-600 font-manrope w-36 shrink-0">{c.label}</span>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-neutral-300 hover:text-white transition-colors font-manrope truncate">
                    {c.value}
                  </a>
                ) : (
                  <span className="text-xs text-neutral-400 font-manrope truncate">{c.value}</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="border border-neutral-800 rounded-2xl p-8 text-center bg-neutral-950">
          <p className="text-sm font-semibold text-white font-manrope mb-1">
            Need help sourcing {vendor.name}?
          </p>
          <p className="text-xs text-neutral-500 font-manrope mb-6 max-w-sm mx-auto">
            Our team handles vendor outreach, quotes, and deployment coordination. Get a sourced quote in 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={ctaHref}
              className="inline-flex items-center justify-center bg-white text-black rounded-lg px-6 py-2.5 text-sm font-semibold font-manrope hover:bg-neutral-100 transition-colors">
              Get a Quote →
            </Link>
            <Link href="/pilot"
              className="inline-flex items-center justify-center border border-neutral-700 text-neutral-300 rounded-lg px-6 py-2.5 text-sm font-manrope hover:border-neutral-500 hover:text-white transition-colors">
              Start a 30-Day Pilot
            </Link>
          </div>
        </div>

        {/* Back */}
        <div className="mt-10 text-center">
          <Link href="/robotics" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors font-manrope">
            ← Back to Robot Catalog
          </Link>
        </div>

      </main>
    </div>
  );
}
