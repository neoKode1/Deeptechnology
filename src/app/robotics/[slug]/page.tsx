import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { VENDORS, BUY_PATH_LABELS, getVendor } from '@/data/vendors';
import { COMPARISONS } from '@/data/comparisons';
import { VENDOR_IMAGES } from '@/data/vendor-images';
import { CATEGORY_META } from '@/data/categories';
import SoftDevHeader from '@/components/SoftDevHeader';

/** Pre-render all 85 vendor pages at build time */
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
  const description = `Verified ${vendor.name} procurement guide. ${priceRange ? priceRange + '. ' : ''}${(vendor.procurementNotes ?? '').slice(0, 120)}…`;

  return {
    title,
    description,
    openGraph: { title, description, url: `https://deeptechnologies.dev/robotics/${vendor.id}` },
    alternates: { canonical: `https://deeptechnologies.dev/robotics/${vendor.id}` },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  humanoid:    'Humanoid Robot',    delivery:    'Delivery Robot',
  industrial:  'Warehouse / Industrial', drone:  'Enterprise Drone',
  cobot:       'Cobot / Robot Arm', surgical:    'Surgical Robot',
  service:     'Service Robot',     agricultural:'Agricultural Robot',
  security:    'Security Robot',    cleaning:    'Floor Cleaning Robot',
  exoskeleton: 'Exoskeleton',       components:  'Components & Sensors',
  quadruped:   'Quadruped Robot',   underwater:  'Underwater ROV',
  inspection:  'Inspection Robot',  defense:     'Defense Robot',
};

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

  const ctaHref    = `/contact?inquiry=robotics&vendor=${encodeURIComponent(vendor.name)}`;
  const heroImage  = VENDOR_IMAGES[vendor.id];
  const catMeta    = CATEGORY_META[vendor.category];
  const catLabel   = CATEGORY_LABELS[vendor.category];

  // Related comparisons featuring this vendor
  const relatedComparisons = COMPARISONS.filter(
    (c) => c.vendorAId === vendor.id || c.vendorBId === vendor.id
  );

  // Other vendors in the same category (up to 3)
  const relatedVendors = VENDORS.filter(
    (v) => v.category === vendor.category && v.id !== vendor.id
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-black text-white">
      <SoftDevHeader />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-600 mb-10 font-manrope">
          <Link href="/robotics" className="hover:text-neutral-400 transition-colors">Robotics</Link>
          <span>/</span>
          <Link href={`/robotics/categories/${vendor.category}`} className="hover:text-neutral-400 transition-colors">
            {catMeta?.label ?? catLabel}
          </Link>
          <span>/</span>
          <span className="text-neutral-400">{vendor.name}</span>
        </nav>

        {/* ── Two-column hero: left info · right full robot image ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">

          {/* Left: vendor identity + CTAs */}
          <div>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="text-[10px] uppercase tracking-widest border border-neutral-800 text-neutral-500 rounded-full px-3 py-1 font-manrope">
                {catLabel}
              </span>
              <span className="text-[10px] uppercase tracking-widest border border-neutral-700 text-neutral-400 rounded-full px-3 py-1 font-manrope">
                {BUY_PATH_LABELS[vendor.buyPath]}
              </span>
              {vendor.leadTime && (
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-manrope border border-neutral-800 rounded-full px-3 py-1">
                  Lead time: {vendor.leadTime}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold font-manrope text-white leading-tight mb-4">
              {vendor.name}
            </h1>

            {vendor.procurementNotes && (
              <p className="text-neutral-400 text-sm font-manrope leading-relaxed mb-8">
                {vendor.procurementNotes}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <Link href={ctaHref}
                className="inline-flex items-center justify-center bg-white text-black rounded-lg px-6 py-2.5 text-sm font-semibold font-manrope hover:bg-neutral-100 transition-colors">
                Get a Quote →
              </Link>
              <Link href="/pilot"
                className="inline-flex items-center justify-center border border-neutral-700 text-neutral-300 rounded-lg px-6 py-2.5 text-sm font-manrope hover:border-neutral-500 hover:text-white transition-colors">
                30-Day Pilot
              </Link>
            </div>
          </div>

          {/* Right: full robot image — object-contain, no cropping */}
          <div className="flex items-center justify-center rounded-2xl bg-neutral-950 border border-neutral-900 overflow-hidden"
            style={{ minHeight: '360px' }}>
            {heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImage}
                alt={`${vendor.name} robot`}
                className="w-full max-h-[480px] object-contain p-6"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 p-10 text-center">
                <p className="text-neutral-700 text-xs uppercase tracking-widest font-manrope">{catLabel}</p>
                <p className="text-neutral-600 text-xs font-manrope mt-1">{vendor.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Products */}
        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-widest text-neutral-600 mb-4 font-manrope">Products & Pricing</h2>
          <div className="divide-y divide-neutral-900 border border-neutral-900 rounded-xl overflow-hidden">
            {vendor.products.map((p) => (
              <div key={p.name} className="flex items-start justify-between gap-4 px-5 py-4 bg-neutral-950 hover:bg-neutral-900 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white font-manrope">{p.name}</p>
                  {p.notes   && <p className="text-xs text-neutral-600 mt-0.5 font-manrope">{p.notes}</p>}
                  {p.deposit && <p className="text-xs text-yellow-600 mt-0.5 font-manrope">Deposit: {p.deposit}</p>}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-sm font-semibold text-white font-manrope tabular-nums">{p.price}</span>
                  <span className={`text-[10px] uppercase tracking-wider border rounded-full px-2 py-0.5 font-manrope ${STATUS_STYLES[p.status]}`}>
                    {STATUS_LABELS[p.status]}
                  </span>
                  {p.orderUrl && p.status !== 'not_available' && (
                    <a href={p.orderUrl} target="_blank" rel="noopener noreferrer"
                      className="text-[10px] text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-full px-3 py-1 font-manrope transition-colors">
                      {p.status === 'raas' ? 'Request RaaS →' : p.status === 'pre_order' ? 'Pre-Order →' : 'Order →'}
                    </a>
                  )}
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
                <span className="text-xs text-neutral-600 font-manrope w-40 shrink-0">{c.label}</span>
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

        {/* Related comparisons */}
        {relatedComparisons.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-widest text-neutral-600 mb-4 font-manrope">See How They Compare</h2>
            <div className="space-y-2">
              {relatedComparisons.map((c) => (
                <Link key={c.slug} href={`/compare/${c.slug}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 border border-neutral-900 rounded-xl bg-neutral-950 hover:bg-neutral-900 hover:border-neutral-700 transition-all group">
                  <div>
                    <p className="text-sm text-white font-manrope font-medium group-hover:text-white">{c.vendorALabel} vs {c.vendorBLabel}</p>
                    <p className="text-xs text-neutral-600 mt-0.5 font-manrope line-clamp-1">{c.description}</p>
                  </div>
                  <span className="text-neutral-600 group-hover:text-white transition-colors text-sm shrink-0">→</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="border border-neutral-800 rounded-2xl p-8 text-center bg-neutral-950 mb-10">
          <p className="text-sm font-semibold text-white font-manrope mb-1">Need help sourcing {vendor.name}?</p>
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

        {/* Related vendors */}
        {relatedVendors.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-widest text-neutral-600 mb-4 font-manrope">
              Also in {catMeta?.label ?? catLabel}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedVendors.map((v) => {
                const img = VENDOR_IMAGES[v.id];
                return (
                  <Link key={v.id} href={`/robotics/${v.id}`}
                    className="group border border-neutral-900 rounded-xl overflow-hidden bg-neutral-950 hover:border-neutral-700 transition-all">
                    {img && (
                      <div className="h-32 overflow-hidden bg-neutral-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={v.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-white font-manrope">{v.name}</p>
                      <p className="text-xs text-neutral-600 font-manrope mt-0.5">{v.products[0]?.price}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Back */}
        <div className="flex items-center justify-between text-xs text-neutral-600 font-manrope">
          <Link href={`/robotics/categories/${vendor.category}`} className="hover:text-neutral-400 transition-colors">
            ← Back to {catMeta?.label ?? catLabel}
          </Link>
          <Link href="/robotics" className="hover:text-neutral-400 transition-colors">
            All Robots →
          </Link>
        </div>

      </main>
    </div>
  );
}
