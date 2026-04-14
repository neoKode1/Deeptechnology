import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import SoftDevHeader from '@/components/SoftDevHeader';
import { VENDORS, BUY_PATH_LABELS, BUY_PATH_COLORS, type VendorCategory } from '@/data/vendors';

/* ── Category metadata ──────────────────────────────────────────────────── */
const CATEGORY_META: Record<VendorCategory, { label: string; emoji: string; desc: string }> = {
  humanoid:    { label: 'Humanoid Robots',        emoji: '🤖', desc: 'Full-body bipedal robots for general labor, research, and service applications.' },
  delivery:    { label: 'Delivery Robots',         emoji: '📦', desc: 'Sidewalk, road, and aerial platforms for last-mile and campus delivery.' },
  industrial:  { label: 'Industrial / Warehouse',  emoji: '🏭', desc: 'AMRs, forklifts, and sorting systems for distribution and manufacturing.' },
  drone:       { label: 'Drones & UAVs',           emoji: '🚁', desc: 'Commercial and industrial unmanned aerial systems for delivery, inspection, and mapping.' },
  cobot:       { label: 'Cobots & Robot Arms',     emoji: '🦾', desc: 'Collaborative robot arms designed to work safely alongside humans in assembly and manufacturing.' },
  surgical:    { label: 'Surgical Robots',         emoji: '🏥', desc: 'Robotic-assisted surgical systems for orthopedic, soft tissue, and minimally invasive procedures.' },
  service:     { label: 'Service & Hospitality',   emoji: '🍽️', desc: 'Delivery, disinfection, and guest-service robots for healthcare, hospitality, and retail.' },
  agricultural:{ label: 'Agricultural Robots',     emoji: '🌾', desc: 'Autonomous tractors, weeding robots, and crop-spraying drones for precision farming.' },
  security:    { label: 'Security Robots',         emoji: '🔒', desc: 'Autonomous patrol and monitoring robots for corporate campuses and public spaces.' },
  cleaning:    { label: 'Floor Cleaning Robots',   emoji: '🧹', desc: 'Autonomous scrubbers and sweepers for warehouses, airports, and commercial facilities.' },
  exoskeleton: { label: 'Exoskeletons',            emoji: '🦿', desc: 'Powered wearable robots for industrial worker assistance and medical rehabilitation.' },
  components:  { label: 'Components & Sensors',    emoji: '⚙️',  desc: 'LiDAR sensors, stereo cameras, grippers, and actuators for robot development.' },
  quadruped:   { label: 'Quadruped Robots',        emoji: '🐕', desc: 'Four-legged robots for inspection, security, and research in complex terrain.' },
  underwater:  { label: 'Underwater Robots',       emoji: '🤿', desc: 'ROVs and AUVs for subsea inspection, search & rescue, and scientific research.' },
  inspection:  { label: 'Inspection Robots',       emoji: '🔍', desc: 'Specialized robots for confined-space, wall-climbing, and aerial industrial inspection.' },
  defense:     { label: 'Defense Robots',          emoji: '🛡️', desc: 'Unmanned ground and aerial systems for defense, EOD, and government applications.' },
};

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
          <Link href="/robotics" className="hover:text-neutral-400 transition-colors">Robotics</Link>
          <span>/</span>
          <span className="hover:text-neutral-400 transition-colors">Categories</span>
          <span>/</span>
          <span className="text-neutral-400">{meta.label}</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <div className="text-5xl mb-4">{meta.emoji}</div>
          <h1 className="font-manrope font-semibold text-3xl sm:text-4xl text-white mb-3">{meta.label}</h1>
          <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed">{meta.desc}</p>
          <p className="text-neutral-600 text-sm mt-3 font-manrope">{vendors.length} vendor{vendors.length !== 1 ? 's' : ''} in catalog</p>
        </div>

        {/* Vendor grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendors.map((vendor) => {
            const hasSlugPage = ['unitree', 'boston-dynamics', 'agility', 'figure', 'apptronik', 'physical-intelligence',
              'sanctuary', 'fourier', 'kiwibot', 'serve', 'starship', 'coco', 'amazon-scout', 'locus',
              'berkshire-grey', '6river', 'geek-plus', 'mujin', 'hai-robotics', 'cyngn', 'dji', 'skydio',
              'zipline', 'wingcopter', 'percepto', 'freefly', 'matternet'].includes(vendor.id);

            const priceRange = (() => {
              const prices = vendor.products
                .map((p) => p.price)
                .filter((p) => !p.toLowerCase().includes('quote') && !p.toLowerCase().includes('raas') && !p.toLowerCase().includes('contact'));
              return prices.length > 0 ? prices[0] : null;
            })();

            return (
              <div key={vendor.id} className="bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-colors rounded-xl p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-manrope font-semibold text-white text-base">{vendor.name}</h2>
                    {priceRange && (
                      <p className="text-green-400 text-sm mt-0.5">{priceRange}</p>
                    )}
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full shrink-0 ${BUY_PATH_COLORS[vendor.buyPath] ?? 'bg-neutral-800 text-neutral-400'}`}>
                    {BUY_PATH_LABELS[vendor.buyPath]}
                  </span>
                </div>

                {/* Top products */}
                <div className="flex flex-col gap-1">
                  {vendor.products.slice(0, 3).map((p) => (
                    <div key={p.name} className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300">{p.name}</span>
                      <span className="text-neutral-500 font-mono">{p.price}</span>
                    </div>
                  ))}
                  {vendor.products.length > 3 && (
                    <p className="text-neutral-600 text-xs">+{vendor.products.length - 3} more products</p>
                  )}
                </div>

                {vendor.procurementNotes && (
                  <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2">{vendor.procurementNotes}</p>
                )}

                {/* CTAs */}
                <div className="flex gap-2 mt-auto pt-2">
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
            );
          })}
        </div>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-neutral-800">
          <Link href="/robotics" className="text-sm text-neutral-500 hover:text-white transition-colors font-manrope">
            &larr; Back to Robotics Division
          </Link>
        </div>
      </main>
    </div>
  );
}
