import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import SoftDevHeader from '@/components/SoftDevHeader';
import { VENDORS, BUY_PATH_LABELS, BUY_PATH_COLORS, type VendorCategory } from '@/data/vendors';

/* ── Category metadata ──────────────────────────────────────────────────── */
const CATEGORY_META: Record<VendorCategory, { label: string; image: string; desc: string }> = {
  humanoid:    { label: 'Humanoid Robots',        image: '/media/Agility%20Robotics%20Digit.jpg',                                                                                           desc: 'Full-body bipedal robots for general labor, research, and service applications.' },
  delivery:    { label: 'Delivery Robots',         image: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Starship_food_delivery_robot_in_Niittykumpu.jpg',                             desc: 'Sidewalk, road, and aerial platforms for last-mile and campus delivery.' },
  industrial:  { label: 'Industrial / Warehouse',  image: '/media/Robotic-Sorting-as-a-Service-B3A7940.webp',                                                                                desc: 'AMRs, forklifts, and sorting systems for distribution and manufacturing.' },
  drone:       { label: 'Drones & UAVs',           image: '/media/drones_hero.webp',                                                                                                        desc: 'Commercial and industrial unmanned aerial systems for delivery, inspection, and mapping.' },
  cobot:       { label: 'Cobots & Robot Arms',     image: '/media/Boston%20Dynamics%20Stretch.jpg',                                                                                         desc: 'Collaborative robot arms designed to work safely alongside humans in assembly and manufacturing.' },
  surgical:    { label: 'Surgical Robots',         image: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Laproscopic_Surgery_Robot.jpg',                                              desc: 'Robotic-assisted surgical systems for orthopedic, soft tissue, and minimally invasive procedures.' },
  service:     { label: 'Service & Hospitality',   image: '/media/Serve-Gen-2-left-and-Gen-3-robots.jpg',                                                                                   desc: 'Delivery, disinfection, and guest-service robots for healthcare, hospitality, and retail.' },
  agricultural:{ label: 'Agricultural Robots',     image: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Crops_grown_on_the_FarmBot_Genesis.jpg',                                     desc: 'Autonomous tractors, weeding robots, and crop-spraying drones for precision farming.' },
  security:    { label: 'Security Robots',         image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Knightscope_security_robot.jpg',                                             desc: 'Autonomous patrol and monitoring robots for corporate campuses and public spaces.' },
  cleaning:    { label: 'Floor Cleaning Robots',   image: 'https://upload.wikimedia.org/wikipedia/commons/4/40/AvidbotsNeo1.jpg',                                                           desc: 'Autonomous scrubbers and sweepers for warehouses, airports, and commercial facilities.' },
  exoskeleton: { label: 'Exoskeletons',            image: 'https://upload.wikimedia.org/wikipedia/commons/9/94/LAEVO_exoskeleton.jpg',                                                      desc: 'Powered wearable robots for industrial worker assistance and medical rehabilitation.' },
  components:  { label: 'Components & Sensors',    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Velodyne_Lidar_Alpha_Prime_Ultra_Puck_Puck_Sensor_Family.jpg',               desc: 'LiDAR sensors, stereo cameras, grippers, and actuators for robot development.' },
  quadruped:   { label: 'Quadruped Robots',        image: '/media/Boston%20Dynamics%20Spot.jpg',                                                                                            desc: 'Four-legged robots for inspection, security, and research in complex terrain.' },
  underwater:  { label: 'Underwater Robots',       image: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/BlueROV2_flying_with_ArduSub.jpg',                                          desc: 'ROVs and AUVs for subsea inspection, search & rescue, and scientific research.' },
  inspection:  { label: 'Inspection Robots',       image: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/ExR-2_Inspection_Robot_%2802%29.jpg',                                        desc: 'Specialized robots for confined-space, wall-climbing, and aerial industrial inspection.' },
  defense:     { label: 'Defense Robots',          image: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Ghost_Robotics_Vision_60_Q-UGV_Demo_%287351259%29.jpeg',                    desc: 'Unmanned ground and aerial systems for defense, EOD, and government applications.' },
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
          <div className="relative h-48 sm:h-64 w-full overflow-hidden rounded-2xl mb-6 bg-neutral-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={meta.image}
              alt={meta.label}
              className="w-full h-full object-cover opacity-80"
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
