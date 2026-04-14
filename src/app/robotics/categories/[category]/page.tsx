import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import SoftDevHeader from '@/components/SoftDevHeader';
import { VENDORS, BUY_PATH_LABELS, BUY_PATH_COLORS, type VendorCategory } from '@/data/vendors';
import { CATEGORY_META } from '@/data/categories';

/* ── Per-vendor product photos (CC / public domain / local) ─────────────── */
const VENDOR_IMAGES: Record<string, string> = {
  // ── Humanoid ────────────────────────────────────────────────────────────
  'unitree':            '/media/Unitree%20Robotics-G1.png',
  'agility':            '/media/Agility%20Robotics.jpeg',
  'tesla':              '/media/tesla-optimus-auAwknG6.png',
  'figure':             '/media/Figure%2002.jpg',
  'boston-dynamics':    '/media/atlas2-Pre-Launch-Thumbnail.webp',
  'apptronik':          '/media/Apptronik.jpg',
  'sanctuary':          '/media/Sanctuary%20AI.webp',
  'ubtech':             '/media/UBTECH%20Robotics.webp',
  'fourier':            '/media/Fourier%20Intelligence.webp',
  'neura':              '/media/4NE-1%20Neura%20Robotics.webp',
  'kepler':             '/media/Kepler%20Robotics.jpg',
  'agibot':             '/media/AgiBot1.png',
  'pal-robotics':       '/media/PAL%20Robotics-TIAGo-Robot.webp',
  '1x':                 '/media/1X%20Technologies.avif',
  // ── Delivery / Service ──────────────────────────────────────────────────
  'serve':              '/media/Serve-Gen-2-left-and-Gen-3-robots.jpg',
  'starship':           'https://upload.wikimedia.org/wikipedia/commons/3/36/Starship_food_delivery_robot_in_Niittykumpu.jpg',
  // ── Industrial / Warehouse ──────────────────────────────────────────────
  'boston-dynamics-stretch': '/media/Boston%20Dynamics%20Stretch.jpg',
  'seegrid':            '/media/Seegrid-Palion-AMR-Fleet-2024_Palion-Tow-Palion-Lift-RS1-Palion-Lift-CR1.webp',
  'mir':                '/media/MiR-AMR-lineup-1500x1000-1-1024x683.webp',
  'locus':              '/media/Locus-3.png',
  'greyorange':         '/media/greyorange-warehouse-robots.jpg',
  'geekplus':           '/media/IMG-Geekplus-robotics-solution-3-670x510-1.png',
  'otto-motors':        '/media/OTTO%20Motors.png',
  'omron':              '/media/Omron%20Mobile%20Robotics-fleet-bg.jpg',
  'hai-robotics':       '/media/Hai-Robotics-ASRS-bots-670x510-1.png',
  'clearpath':          '/media/clearpath-ros.jpg',
  '6rs':                '/media/6-river-systems-shopify.png',
  'invia':              '/media/inVia-robot-product-shot-image-1.png',
  // ── Quadruped ───────────────────────────────────────────────────────────
  'boston-dynamics-spot':    '/media/Boston%20Dynamics%20Spot.jpg',
  'spot':               '/media/Boston%20Dynamics%20Spot.jpg',
  'unitree-quadruped':  '/media/Unitree%20(Quadruped)%20.webp',
  'anybotics':          '/media/ANYbotics-ANYmal.webp',
  'deep-robotics':      '/media/DEEP%20Robotics.jpg',
  // ── Security ────────────────────────────────────────────────────────────
  'knightscope':        '/media/Knightscope.webp',
  'cobalt-robotics':    '/media/Cobalt%20Robotics.jpg',
  // ── Cleaning ────────────────────────────────────────────────────────────
  'avidbots':           '/media/Avidbots.png',
  'tennant':            '/media/Tennant%20.jpeg',
  'ice-cobotics':       '/media/ICE%20Cobotics.png',
  // ── Surgical ────────────────────────────────────────────────────────────
  'intuitive':          '/media/Intuitive%20Surgical.jpeg',
  'intuitive-surgical': '/media/Intuitive%20Surgical.jpeg',
  'medtronic-hugo':     '/media/Hugo%20RAS.jpg',
  'stryker-mako':       '/media/Mako%204%20Family%204%204K%20with%20shadow4.png',
  'cmr-surgical':       '/media/CMR%20Surgical.webp',
  // ── Agricultural ────────────────────────────────────────────────────────
  'monarch-tractor':    '/media/Monarch%20Tractor.webp',
  'carbon-robotics':    '/media/Carbon%20Robotics-LaserWeeder-G2-600.webp',
  'dji-agras':          '/media/DJI%20Agras-Dronak_nekazaritzan_(cropped).jpg',
  'burro':              '/media/Burro%20Autonomous%20Field%20Vehicle.png',
  // ── Service & Hospitality ────────────────────────────────────────────────
  'aethon':             '/media/Aethon_Website_Robot_T3.png',
  'bear-robotics':      '/media/Bear%20Robotics.jpg',
  'pudu-robotics':      '/media/PUDU%20Robotics-Bellabot-1-2.webp',
  'xenex':              '/media/Xenex-XenL.jpg',
  'lg-cloi':            '/media/LG%20CLOi.jpg',
  // ── Defense ─────────────────────────────────────────────────────────────
  'ghost-robotics':     '/media/Ghost-Robotics-featured.jpg',
  // ── Exoskeleton ──────────────────────────────────────────────────────────
  'ekso-bionics':       '/media/EksoNR-by-Ekso-Bionics-Exoskeleton-Catalog-600.jpg',
  'sarcos':             '/media/Guardian%20XO%20',
  'german-bionic':      '/media/Cray-X-5th-Gen-German-Bionics-Exoskeleton-Catalog-2022.jpg',
  // ── Inspection ──────────────────────────────────────────────────────────
  'flyability':         '/media/Elios%203%20(collision-tolerant%20indoor%20drone).jpg',
  'gecko-robotics':     '/media/Gecko%20Robotics.webp',
  'airobotics':         '/media/Airobotics%20Optimus%20(drone-in-a-box%2C%20BVLOS).jpeg',
  // ── Underwater ──────────────────────────────────────────────────────────
  'blue-robotics':      'https://upload.wikimedia.org/wikipedia/commons/4/4a/BlueROV2_flying_with_ArduSub.jpg',
  // ── Drone ───────────────────────────────────────────────────────────────
  'dji-enterprise':     '/media/DJI%20Enterprise.jpg',
  'skydio':             '/media/Skydio.avif',
  'zipline':            '/media/zipline.jpg',
  'wing':               '/media/Wing%20(Alphabet).webp',
  'autel':              '/media/Autel%20Robotics.jpg',
  'parrot':             '/media/Parrot%20ANAFI%20USA%20.png',
  'percepto':           '/media/Percepto-1.jpg',
  'american-robotics':  '/media/American%20robot%20scout-system.webp',
  'freefly':            '/media/Freefly%20Systems-alta-x-signoff2.jpg',
  'matternet':          '/media/Matternet_System_018.webp',
  // ── Cobots & Robot Arms ──────────────────────────────────────────────────
  'universal-robots':   '/media/Universal%20Robots.png',
  'fanuc':              '/media/FANUC.jpeg',
  'kuka':               '/media/KUKA.avif',
  'franka':             '/media/Franka%20Robotics-franka-research-3.png',
  'igus':               '/media/igus.jpg',
  'doosan-robotics':    '/media/Doosan%20Robotics-A-Series-1.png',
  // ── Components & Sensors ────────────────────────────────────────────────
  'onrobot':            '/media/OnRobot-Products_2021.jpg',
  'robotiq':            '/media/Robotiq%202F-85%20Adaptive%20Gripper%20.jpg',
  'ouster':             '/media/OS1-32%20LiDAR%20.png',
  'stereolabs':         '/media/ZED%202i%20.webp',
  'robotis':            '/media/ROBOTIS%20%3A%20Dynamixel.jpg',
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
          <Link href="/robotics" className="text-sm text-neutral-500 hover:text-white transition-colors font-manrope">
            &larr; Back to Robotics Division
          </Link>
        </div>
      </main>
    </div>
  );
}
