import type { Metadata } from 'next';
import Link from 'next/link';
import SoftDevHeader from '@/components/SoftDevHeader';
import { VENDORS, type VendorCategory } from '@/data/vendors';
import { CATEGORY_META } from '@/data/categories';

export const metadata: Metadata = {
  title: 'Robot Categories | Deeptech Robotics',
  description: 'Browse all robot categories — humanoid, delivery, industrial, drones, cobots, surgical, and more.',
};

export default function CategoriesPage() {
  const entries = Object.entries(CATEGORY_META) as [VendorCategory, typeof CATEGORY_META[VendorCategory]][];

  return (
    <div className="min-h-screen bg-black text-white">
      <SoftDevHeader />

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-24">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-600 mb-10 font-manrope">
          <Link href="/robotics" className="hover:text-neutral-400 transition-colors">Robotics</Link>
          <span>/</span>
          <span className="text-neutral-400">Categories</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="font-manrope font-semibold text-3xl sm:text-4xl text-white mb-3">Robot Categories</h1>
          <p className="text-neutral-500 text-base max-w-xl leading-relaxed">
            {entries.length} categories · {VENDORS.length}+ vendors in the Deeptech catalog
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {entries.map(([key, meta]) => {
            const count = VENDORS.filter((v) => v.category === key).length;
            return (
              <Link
                key={key}
                href={`/robotics/categories/${key}`}
                className="group bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-xl overflow-hidden flex flex-col transition-colors"
              >
                {/* Image banner */}
                <div className="relative h-44 w-full shrink-0 bg-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={meta.image}
                    alt={meta.label}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  {/* Vendor count badge */}
                  <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest bg-black/60 text-neutral-300 px-2 py-1 rounded-full font-manrope">
                    {count} vendor{count !== 1 ? 's' : ''}
                  </span>
                  {/* Category name overlay */}
                  <div className="absolute bottom-4 left-4">
                    <h2 className="font-manrope font-semibold text-white text-lg leading-tight">{meta.label}</h2>
                  </div>
                </div>

                {/* Description row */}
                <div className="px-4 py-3 flex items-center justify-between gap-3">
                  <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2">{meta.desc}</p>
                  <span className="text-neutral-600 group-hover:text-white transition-colors shrink-0 text-lg">→</span>
                </div>
              </Link>
            );
          })}
        </div>

      </main>
    </div>
  );
}
