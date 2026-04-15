import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import SoftDevHeader from '@/components/SoftDevHeader';
import { VENDORS } from '@/data/vendors';
import { VENDOR_IMAGES } from '@/data/vendor-images';

// ── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  const params: { slug: string; product: string }[] = [];
  for (const vendor of VENDORS) {
    for (const p of vendor.products) {
      if (p.image) {
        params.push({ slug: vendor.id, product: toSlug(p.name) });
      }
    }
  }
  return params;
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string; product: string };
}): Promise<Metadata> {
  const vendor = VENDORS.find((v) => v.id === params.slug);
  if (!vendor) return {};
  const product = vendor.products.find((p) => toSlug(p.name) === params.product);
  if (!product) return {};
  return {
    title: `${product.name} — ${vendor.name} | Deeptech Robotics`,
    description: product.notes ?? `${product.name} by ${vendor.name}. Price: ${product.price}.`,
  };
}

// ── Status labels / styles ────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  in_stock:       'In Stock',
  pre_order:      'Pre-Order',
  raas:           'RaaS',
  not_available:  'Not Available',
  quote_required: 'Quote Required',
};

const STATUS_STYLES: Record<string, string> = {
  in_stock:       'border-emerald-700 text-emerald-400',
  pre_order:      'border-yellow-700 text-yellow-400',
  raas:           'border-cyan-700 text-cyan-400',
  not_available:  'border-neutral-700 text-neutral-500',
  quote_required: 'border-neutral-600 text-neutral-400',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProductPage({
  params,
}: {
  params: { slug: string; product: string };
}) {
  const vendor = VENDORS.find((v) => v.id === params.slug);
  if (!vendor) notFound();

  const product = vendor.products.find((p) => toSlug(p.name) === params.product);
  if (!product) notFound();

  const vendorHeroImage = VENDOR_IMAGES[vendor.id];
  const ctaHref = `/contact?inquiry=robotics&vendor=${encodeURIComponent(vendor.name)}&product=${encodeURIComponent(product.name)}`;

  return (
    <div className="min-h-screen bg-black text-white">
      <SoftDevHeader />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-600 font-manrope mb-10">
          <Link href="/robotics" className="hover:text-neutral-400 transition-colors">Robots</Link>
          <span>/</span>
          <Link href={`/robotics/categories/${vendor.category}`} className="hover:text-neutral-400 transition-colors capitalize">{vendor.category}</Link>
          <span>/</span>
          <Link href={`/robotics/${vendor.id}`} className="hover:text-neutral-400 transition-colors">{vendor.name}</Link>
          <span>/</span>
          <span className="text-neutral-400">{product.name}</span>
        </nav>

        {/* ── Two-column hero: left info · right full robot image ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">

          {/* Left: identity + specs + CTAs */}
          <div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="text-[10px] uppercase tracking-widest border border-neutral-800 text-neutral-500 rounded-full px-3 py-1 font-manrope">
                {vendor.name}
              </span>
              <span className={`text-[10px] uppercase tracking-widest border rounded-full px-3 py-1 font-manrope ${STATUS_STYLES[product.status]}`}>
                {STATUS_LABELS[product.status]}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold font-manrope text-white leading-tight mb-6">
              {product.name}
            </h1>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-3">
                <p className="text-[10px] uppercase tracking-widest text-neutral-600 font-manrope mb-1">Price</p>
                <p className="text-sm font-semibold text-white font-manrope">{product.price}</p>
              </div>
              <div className="bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-3">
                <p className="text-[10px] uppercase tracking-widest text-neutral-600 font-manrope mb-1">Availability</p>
                <p className={`text-sm font-semibold font-manrope ${STATUS_STYLES[product.status].split(' ')[1]}`}>
                  {STATUS_LABELS[product.status]}
                </p>
              </div>
              {product.deposit && (
                <div className="bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-3">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-600 font-manrope mb-1">Deposit</p>
                  <p className="text-sm font-semibold text-yellow-400 font-manrope">{product.deposit}</p>
                </div>
              )}
              {vendor.leadTime && (
                <div className="bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-3">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-600 font-manrope mb-1">Lead Time</p>
                  <p className="text-sm font-semibold text-white font-manrope">{vendor.leadTime}</p>
                </div>
              )}
            </div>

            {/* Notes */}
            {product.notes && (
              <div className="bg-neutral-950 border border-neutral-900 rounded-xl px-5 py-4 mb-6">
                <p className="text-[10px] uppercase tracking-widest text-neutral-600 font-manrope mb-2">About this model</p>
                <p className="text-sm text-neutral-300 font-manrope leading-relaxed">{product.notes}</p>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link href={ctaHref}
                className="inline-flex items-center gap-2 bg-white text-black font-manrope text-sm font-semibold px-6 py-3 rounded-xl hover:bg-neutral-200 transition-colors">
                Get a Quote <ArrowUpRight className="w-4 h-4" />
              </Link>
              {product.orderUrl && product.status !== 'not_available' && (
                <a href={product.orderUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-neutral-700 text-white font-manrope text-sm px-6 py-3 rounded-xl hover:border-neutral-500 transition-colors">
                  {product.status === 'raas' ? 'Request RaaS' : product.status === 'pre_order' ? 'Pre-Order Now' : 'Order Now'}
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Right: full robot image — object-contain, no cropping */}
          <div className="flex items-center justify-center rounded-2xl bg-neutral-950 border border-neutral-900 overflow-hidden"
            style={{ minHeight: '400px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image ?? vendorHeroImage ?? ''}
              alt={product.name}
              className="w-full max-h-[560px] object-contain p-6"
            />
          </div>
        </div>

        {/* Other models from same vendor */}
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-neutral-600 mb-3 font-manrope">Other {vendor.name} models</h2>
          <div className="divide-y divide-neutral-900 border border-neutral-900 rounded-xl overflow-hidden">
            {vendor.products.filter((p) => p.name !== product.name).slice(0, 6).map((p) => (
              <div key={p.name} className="relative flex items-center gap-3 px-4 py-3 bg-neutral-950 hover:bg-neutral-900 transition-colors">
                {p.image && <Link href={`/robotics/${vendor.id}/${toSlug(p.name)}`} className="absolute inset-0" aria-label={p.name} />}
                <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800">
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.name} className="w-full h-full object-contain p-0.5" />
                  )}
                </div>
                <span className={`text-sm font-manrope truncate flex-1 min-w-0 ${p.image ? 'text-white' : 'text-neutral-400'}`}>{p.name}</span>
                <span className="relative z-10 text-sm text-neutral-500 font-manrope shrink-0 tabular-nums">{p.price}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Back links */}
        <div className="flex items-center justify-between text-xs text-neutral-600 font-manrope">
          <Link href={`/robotics/${vendor.id}`} className="hover:text-neutral-400 transition-colors">
            ← Back to {vendor.name}
          </Link>
          <Link href="/robotics" className="hover:text-neutral-400 transition-colors">
            All Robots →
          </Link>
        </div>

      </main>
    </div>
  );
}
