import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import SoftDevHeader from '@/components/SoftDevHeader';
import { VENDORS, BUY_PATH_LABELS, BUY_PATH_COLORS, type VendorCategory } from '@/data/vendors';
import { CATEGORY_META } from '@/data/categories';
import { VENDOR_IMAGES } from '@/data/vendor-images';



export function generateStaticParams() {
  return (Object.keys(CATEGORY_META) as VendorCategory[]).map((c) => ({ category: c }));
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const meta = CATEGORY_META[params.category as VendorCategory];
  if (!meta) return {};
  return {
    title: `${meta.label} | Deeptech Robotics`,
    description: meta.desc,
  };
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const cat = params.category as VendorCategory;
  const meta = CATEGORY_META[cat];
  if (!meta) notFound();

  const vendors = VENDORS.filter((v) => v.category === cat);
  if (vendors.length === 0) notFound();

  return (
    <div className="min-h-screen bg-black text-white">
      <SoftDevHeader />

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-24">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-600 mb-10 font-manrope">
          <Link href="/" className="hover:text-neutral-400 transition-colors">Robotics</Link>
          <span>/</span>
          <Link href="/robotics/categories" className="hover:text-neutral-400 transition-colors">Categories</Link>
          <span>/</span>
          <span className="text-neutral-400">{meta.label}</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-2xl mb-6 bg-neutral-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={meta.image}
              alt={meta.label}
              className="w-full h-full object-cover object-top opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-5">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-manrope">Category</span>
              <h1 className="font-manrope font-semibold text-2xl sm:text-3xl text-white leading-tight">{meta.label}</h1>
            </div>
          </div>
          <p className="text-neutral-400 text-base max-w-2xl leading-relaxed">{meta.desc}</p>
          <p className="text-neutral-600 text-sm mt-3 font-manrope">{vendors.length} vendor{vendors.length !== 1 ? 's' : ''} in catalog</p>
        </div>

        {/* Vendor grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendors.map((vendor) => {
            const hasSlugPage = true; // all 85 vendors have a generated /robotics/[slug] page

            const priceRange = (() => {
              const prices = vendor.products
                .map((p) => p.price)
                .filter((p) => !p.toLowerCase().includes('quote') && !p.toLowerCase().includes('raas') && !p.toLowerCase().includes('contact'));
              return prices.length > 0 ? prices[0] : null;
            })();

            const vendorImg = VENDOR_IMAGES[vendor.id] ?? meta.image;

            return (
              <div key={vendor.id} className="group bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-colors rounded-xl overflow-hidden flex flex-col">

                {/* Photo banner */}
                <div className="relative h-72 w-full shrink-0 bg-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={vendorImg}
                    alt={vendor.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/10 to-transparent" />
                  <div className="absolute top-2.5 right-2.5">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full ${BUY_PATH_COLORS[vendor.buyPath] ?? 'bg-neutral-800 text-neutral-400'}`}>
                      {BUY_PATH_LABELS[vendor.buyPath]}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-3">

                  {/* Always-visible: name + starting price */}
                  <div>
                    <h2 className="font-manrope font-semibold text-white text-base leading-snug">{vendor.name}</h2>
                    {priceRange && (
                      <p className="text-green-400 text-sm mt-0.5">{priceRange}</p>
                    )}
                  </div>

                  {/* Collapsible details — slides open on hover */}
                  <div className="overflow-hidden max-h-0 group-hover:max-h-64 transition-all duration-300 ease-in-out">
                    {/* Products list */}
                    <div className="flex flex-col gap-1 mb-3">
                      {vendor.products.slice(0, 3).map((p) => (
                        <div key={p.name} className="flex items-center justify-between text-xs">
                          <span className="text-neutral-300 truncate mr-2">{p.name}</span>
                          <span className="text-neutral-500 font-mono shrink-0">{p.price}</span>
                        </div>
                      ))}
                      {vendor.products.length > 3 && (
                        <p className="text-neutral-600 text-xs">+{vendor.products.length - 3} more products</p>
                      )}
                    </div>
                    {/* Procurement notes */}
                    {vendor.procurementNotes && (
                      <p className="text-neutral-500 text-xs leading-relaxed line-clamp-3">
                        {vendor.procurementNotes}
                      </p>
                    )}
                  </div>

                  {/* CTAs — always visible */}
                  <div className="flex gap-2 pt-1">
                    {hasSlugPage && (
                      <Link
                        href={`/robotics/${vendor.id}`}
                        className="text-xs border border-neutral-700 hover:border-white px-3 py-1.5 rounded-lg text-neutral-300 hover:text-white transition-colors"
                      >
                        Full Profile
                      </Link>
                    )}
                    <Link
                      href={`/contact?inquiry=robotics&vendor=${encodeURIComponent(vendor.name)}`}
                      className="flex items-center gap-1 text-xs bg-white text-black hover:bg-neutral-100 px-3 py-1.5 rounded-lg font-medium transition-colors ml-auto"
                    >
                      Get Quote <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-neutral-800">
          <Link href="/" className="text-sm text-neutral-500 hover:text-white transition-colors font-manrope">
            &larr; Back to Robotics Division
          </Link>
        </div>
      </main>
    </div>
  );
}
