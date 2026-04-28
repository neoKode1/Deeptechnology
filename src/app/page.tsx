import SoftDevHeader from '@/components/SoftDevHeader';
import ParallaxRobot from '@/components/ParallaxRobot';
import RoiCalculator from '@/components/RoiCalculator';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

/* ── Robot categories for browse section ── */
const ROBOT_CATEGORIES = [
  { slug: 'humanoid',    image: '/media/Unitree%20Robotics-G1.png',                              label: 'Humanoid',              count: '13 vendors' },
  { slug: 'industrial',  image: '/media/Robotic-Sorting-as-a-Service-B3A7940.webp',              label: 'Industrial / AMR',      count: '12 vendors' },
  { slug: 'cobot',       image: '/media/Universal%20Robots.png',                                 label: 'Cobots & Arms',         count: '7 vendors' },
  { slug: 'delivery',    image: '/media/Serve-Gen-2-left-and-Gen-3-robots.jpg',                  label: 'Delivery Robots',       count: '4 vendors' },
  { slug: 'drone',       image: '/media/DJI%20Enterprise.jpg',                                   label: 'Drones & UAVs',         count: '10 vendors' },
  { slug: 'service',     image: '/media/Bear%20Robotics.jpg',                                    label: 'Service & Hospitality', count: '5 vendors' },
  { slug: 'security',    image: '/media/Knightscope.webp',                                       label: 'Security',              count: '2 vendors' },
  { slug: 'cleaning',    image: '/media/Avidbots.png',                                           label: 'Floor Cleaning',        count: '3 vendors' },
  { slug: 'quadruped',   image: '/media/Boston%20Dynamics%20Spot.jpg',                           label: 'Quadruped',             count: '4 vendors' },
  { slug: 'agricultural',image: '/media/Carbon%20Robotics-LaserWeeder-G2-600.webp',              label: 'Agricultural',          count: '4 vendors' },
  { slug: 'surgical',    image: '/media/Intuitive%20Surgical.jpeg',                              label: 'Surgical',              count: '4 vendors' },
  { slug: 'inspection',  image: '/media/gecko_robot_1-header.jpg',                               label: 'Inspection',            count: '3 vendors' },
  { slug: 'underwater',  image: '/media/BlueROV2-remotely-operated-vehicle.png',                 label: 'Underwater ROVs',       count: '3 vendors' },
  { slug: 'exoskeleton', image: '/media/EksoNR-by-Ekso-Bionics-Exoskeleton-Catalog-600.jpg',    label: 'Exoskeletons',          count: '3 vendors' },
  { slug: 'components',  image: '/media/OS1-32%20LiDAR%20.png',                                  label: 'Components & Sensors',  count: '5 vendors' },
  { slug: 'defense',     image: '/media/Milrem%20Robotics.webp',                                 label: 'Defense',               count: '3 vendors' },
];

/* ── Marquee items ── */
const MARQUEE = [
  'Urban Street-Level', 'Warehouse Floor', 'Retail Environment', 'Campus & Multi-Building',
  'Last-Mile Residential', 'Food & Beverage', 'Distribution Center', 'Indoor Navigation',
  'Outdoor Terrain', 'Sidewalk Bots', 'Delivery Drones', 'AMRs', 'Fleet Integration',
  'Urban Street-Level', 'Warehouse Floor', 'Retail Environment', 'Campus & Multi-Building',
  'Last-Mile Residential', 'Food & Beverage', 'Distribution Center', 'Indoor Navigation',
  'Outdoor Terrain', 'Sidewalk Bots', 'Delivery Drones', 'AMRs', 'Fleet Integration',
];

/* ── Environment types ── */
const ENVIRONMENTS = [
  {
    env: 'Urban / Street-Level',
    fit: 'Sidewalk delivery bots, last-mile drones',
    detail: 'Narrow sidewalks, pedestrian traffic, weather exposure. We source ground bots and urban drone systems built for public thoroughfare.',
  },
  {
    env: 'Warehouse / Distribution',
    fit: 'AMRs, picking systems, conveyor integration',
    detail: 'High-traffic floor plans, shelf density, throughput targets. We match autonomous mobile robots to your layout and connect them to your WMS or ERP.',
  },
  {
    env: 'Retail Floor',
    fit: 'Service bots, shelf-scanning, front-of-house delivery',
    detail: 'Customer-facing environments need robots that navigate crowds, avoid obstacles, and stay on brand. We select for form factor, reliability, and minimal friction.',
  },
  {
    env: 'Food & Beverage',
    fit: 'In-venue delivery bots, kitchen integration',
    detail: 'From tabletop runners to back-of-house logistics, we evaluate payload, cleaning cycle, and floor surface to find the right fit for your service model.',
  },
  {
    env: 'Campus & Multi-Building',
    fit: 'Indoor-outdoor AMRs, autonomous carts',
    detail: 'Indoor-outdoor environments require robots that transition between surfaces and navigation modes. We spec and deploy systems that handle that handoff seamlessly.',
  },
  {
    env: 'Last-Mile Residential',
    fit: 'Sidewalk bots, secure drop-off systems',
    detail: 'Residential routes have variable terrain, package variety, and zero-failure tolerance. We match delivery hardware to route density, payload type, and local regulation.',
  },
];

/* ── Services ── */
const SERVICES = [
  {
    num: '01.',
    title: 'Environmental Assessment',
    tags: ['Site Audit', 'Terrain Mapping', 'Use Case Analysis'],
    desc: 'We study your environment first — floor plan, terrain, traffic patterns, payload, weather, and customer proximity. The right robot starts with reading the room.',
  },
  {
    num: '02.',
    title: 'System Selection & Sourcing',
    tags: ['Vendor-Agnostic', 'Hardware Match', 'ROI Mapping'],
    desc: 'We cross-reference your environment profile against the full market — AMRs, drones, sidewalk bots, service robots — and select the system built for your conditions. No manufacturer bias.',
  },
  {
    num: '03.',
    title: 'Deployment & Integration',
    tags: ['Fleet Setup', 'POS · ERP · WMS', 'Go-Live Support'],
    desc: 'Hardware commissioning, route configuration, and fleet connection to your existing systems — POS, ERP, dashboards — with zero disruption to live operations.',
  },
  {
    num: '04.',
    title: 'Ongoing Fleet Optimization',
    tags: ['Performance Monitoring', 'Route Tuning', 'Scale Planning'],
    desc: 'After go-live, we track performance, tune routes, and plan for scale. As your environment evolves, we ensure your fleet stays matched to it.',
  },
];

/* ── Supplied Systems ── */
const SYSTEMS = [
  {
    type: 'SADRs',
    label: 'Sidewalk Autonomous Delivery Robots',
    when: 'High foot-traffic · Campus · Retail corridors · Last-mile residential',
    desc: 'Small, wheeled ground bots that navigate pedestrian walkways autonomously. Built for dense urban and campus environments where last-mile delivery happens at street level — food, groceries, and packages door to door without vehicle traffic.',
  },
  {
    type: 'RADRs',
    label: 'Road / Sidewalk Hybrid Robots',
    when: 'Mixed terrain · Bike lanes · Urban delivery routes · Higher-speed corridors',
    desc: 'Larger autonomous bots that transition between sidewalks, bike lanes, and low-speed roads. More coverage than a pure sidewalk bot — ideal for city blocks, food delivery corridors, and variable surface conditions.',
  },
  {
    type: 'UAVs',
    label: 'Aerial Delivery Drones',
    when: 'Suburban neighborhoods · Rural areas · Short flight corridors · Low-density zones',
    desc: 'Autonomous aerial systems for fast delivery of small, lightweight packages to a backyard, rooftop, or designated drop point. Deployed where ground routing is impractical — suburban and rural environments with clear airspace.',
  },
  {
    type: 'ADVs',
    label: 'Autonomous Delivery Vehicles',
    when: 'Urban roads · Suburban routes · B2B short-haul · Warehouse-to-store logistics',
    desc: 'Road-scale autonomous vehicles for larger payloads, longer routes, and B2B logistics. Deployed where volume and distance exceed what a sidewalk bot or drone can handle — warehouse-to-storefront runs, multi-stop urban routes, and short-haul freight.',
  },
];

export default function RoboticsDivisionHome() {


  return (
    // Page bg uses the NOMA shader's darkest teal-black tone
    <div className="min-h-screen overflow-x-hidden text-neutral-900" style={{ background: 'transparent' }}>
      {/* Override the opaque body bg so the fixed Spline iframe shows through */}
      <style>{`body { background: transparent !important; }`}</style>

      {/* ── Parallax Spline 3D robot — pans from head to feet as you scroll ── */}
      <ParallaxRobot />

      {/* All content sits above the iframe — transparent so robot shows through */}
      <div className="relative" style={{ zIndex: 1 }}>
      <SoftDevHeader />

      {/* ── HERO ── */}
      <section className="relative w-full h-[100svh] flex flex-col justify-center sm:justify-end overflow-hidden">
        {/* Bottom gradient so text stays legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent pointer-events-none" />

        <div className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 pt-20 sm:pt-0 pb-8 sm:pb-16 md:pb-24 max-w-[82rem] mx-auto w-full">
          {/* Frosted backdrop on mobile so text stays readable over robot */}
          <div className="sm:bg-transparent bg-white/70 backdrop-blur-md sm:backdrop-blur-none rounded-2xl sm:rounded-none p-5 sm:p-0 -mx-1 sm:mx-0">
          <p className="text-black/40 text-xs tracking-widest uppercase mb-6 font-manrope">
            Deeptech · Robotics Division
          </p>
          <h1 className="font-manrope font-semibold leading-[1.02] tracking-tighter text-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]" style={{ fontSize: 'clamp(2rem, 8vw, 6.5rem)' }}>
            The right deployment
          </h1>
          <h1 className="font-manrope font-semibold leading-[1.02] tracking-tighter text-black/40 drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]" style={{ fontSize: 'clamp(2rem, 8vw, 6.5rem)' }}>
            for the right environment.
          </h1>
          <p className="mt-6 text-sm sm:text-base md:text-lg text-black/60 max-w-xl leading-relaxed font-manrope font-light">
            We read your space — terrain, traffic, payload, conditions — then source the right robotics platform for it.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href="#services"
              className="inline-flex items-center gap-2 bg-black/90 text-white rounded-full py-3 px-6 text-sm font-medium hover:bg-black transition-colors w-fit"
            >
              Our Services <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 border border-black/25 text-black/80 rounded-full py-3 px-6 text-sm font-normal hover:border-black/50 hover:text-black transition-colors w-fit"
            >
              Start a Consultation
            </a>
          </div>
          </div>{/* end frosted backdrop */}
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="border-y border-neutral-200 py-4 overflow-hidden">
        <div className="flex gap-8 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {MARQUEE.map((tag, i) => (
            <span key={i} className="text-sm font-manrope shrink-0 text-neutral-400">
              {tag} <span className="mx-3 text-neutral-300">·</span>
            </span>
          ))}
        </div>
      </div>



      {/* ── ABOUT ── */}
      <section id="about" className="px-4 sm:px-6 md:px-12 lg:px-20 py-16 sm:py-24 max-w-[82rem] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 items-start">
          <div>
            <p className="text-[10px] sm:text-xs tracking-widest uppercase mb-3 sm:mb-4 font-manrope text-neutral-400">Robotics Division</p>
            <h2 className="font-manrope text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 mb-4 sm:mb-6">
              We read your environment first,<br className="hidden sm:block" /> then source the right machine.
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4 text-neutral-600">
              Every environment has its own rules — terrain, foot traffic, payload weight, weather exposure, customer proximity. The wrong robot in the wrong space fails. We source the best autonomous solutions for your environment.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-neutral-500">
              We are not tied to any brand or platform. We assess your specific conditions, cross-reference the full hardware market, and integrate the system — drone, bot, or AMR — that is engineered for exactly where you need it to operate.
            </p>
          </div>
          {/* Stat grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              ['Environment-First', 'Our methodology'],
              ['Vendor-Agnostic', 'No manufacturer bias'],
              ['6+', 'Environment types we source for'],
              ['End-to-End', 'Assess · Source · Integrate'],
            ].map(([stat, label]) => (
              <div key={label} className="p-4 sm:p-6 rounded-xl border border-neutral-200 bg-white/70 backdrop-blur-md shadow-sm">
                <div className="font-manrope text-base sm:text-xl font-semibold text-neutral-900 mb-1 leading-tight">{stat}</div>
                <div className="text-xs sm:text-sm text-neutral-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="px-4 sm:px-6 md:px-12 lg:px-20 py-12 sm:py-16 max-w-[82rem] mx-auto border-t border-neutral-200">
        <p className="text-[10px] sm:text-xs tracking-widest uppercase mb-8 sm:mb-12 font-manrope text-neutral-400">Capabilities</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {SERVICES.map((svc) => (
            <div key={svc.num} className="p-5 sm:p-8 rounded-xl transition-all duration-200 border border-neutral-200 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md hover:border-neutral-300">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <span className="text-xs sm:text-sm font-manrope text-neutral-300 font-medium">{svc.num}</span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-end">
                  {svc.tags.map((t) => (
                    <span key={t} className="rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs border border-neutral-200 text-neutral-500 bg-neutral-50/80">{t}</span>
                  ))}
                </div>
              </div>
              <h3 className="font-manrope text-lg sm:text-xl font-semibold text-neutral-900 mb-2 sm:mb-3">{svc.title}</h3>
              <p className="text-xs sm:text-sm leading-relaxed text-neutral-500">{svc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── INDUSTRY SIGNAL ── */}
      <section className="bg-neutral-50 border-t border-b border-neutral-200 px-4 sm:px-6 md:px-12 lg:px-20 py-16 sm:py-24">
        <div className="max-w-[82rem] mx-auto">

          <p className="text-[10px] tracking-widest uppercase font-manrope text-neutral-400 mb-10">The Market Is Moving</p>

          {/* Big quote */}
          <blockquote className="mb-14 max-w-4xl">
            <p className="font-manrope font-semibold text-neutral-900 leading-tight mb-5" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}>
              &ldquo;Physical AI has arrived — every industrial company will become a robotics company.&rdquo;
            </p>
            <cite className="not-italic text-xs uppercase tracking-widest text-neutral-400 font-manrope">
              Jensen Huang · CEO, NVIDIA · GTC 2026
            </cite>
          </blockquote>

          {/* Deal cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                co: 'Toyota Motor Canada × Agility Robotics',
                tag: 'Humanoid · Manufacturing',
                stat: 'Commercial deal signed',
                detail: 'Toyota deployed Digit humanoid robots on a live production line following a year-long pilot — the first major automaker to reach a signed RaaS agreement.',
                date: 'Feb 2026',
              },
              {
                co: 'DHL Group × Boston Dynamics',
                tag: 'Logistics · Warehousing',
                stat: '1,000+ robots',
                detail: 'DHL signed an MOU for over 1,000 additional robot deployments. They already run 7,500 robots across their global network.',
                date: 'May 2025',
              },
              {
                co: 'Figure AI × BMW',
                tag: 'Humanoid · Automotive',
                stat: '90,000 parts unloaded',
                detail: 'After a 10-month factory trial — the largest publicly documented humanoid output in any automotive plant to date.',
                date: '2025',
              },
            ].map(({ co, tag, stat, detail, date }) => (
              <div key={co} className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-manrope">{tag}</span>
                  <span className="text-[10px] text-neutral-300 font-manrope shrink-0">{date}</span>
                </div>
                <p className="font-manrope font-semibold text-neutral-900 leading-tight" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)' }}>{stat}</p>
                <p className="text-xs font-semibold text-neutral-600 font-manrope">{co}</p>
                <p className="text-sm text-neutral-500 leading-relaxed font-manrope">{detail}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── DELIVERY SYSTEMS ── */}
      <section id="delivery-systems" className="px-4 sm:px-6 md:px-12 lg:px-20 py-14 sm:py-20 max-w-[82rem] mx-auto border-t border-neutral-200">
        <p className="text-xs tracking-widest uppercase mb-3 font-manrope text-neutral-400">What We Source</p>
        <p className="text-neutral-500 text-sm max-w-lg leading-relaxed mb-12">
          Sidewalk bots, road hybrids, and autonomous delivery vehicles — operating across urban corridors, bike lanes, and last-mile routes.
        </p>
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:grid-rows-2 gap-2" style={{ minHeight: 'clamp(320px, 55vw, 680px)' }}>
              <Link href="/robotics/serve" className="sm:row-span-2 overflow-hidden rounded-lg robo-img-wrap block" style={{ minHeight: '200px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/Serve-Gen-2-left-and-Gen-3-robots.jpg" alt="Sidewalk delivery robots — two generations side by side" className="robo-img" style={{ objectPosition: 'center' }} />
                <div className="robo-overlay">
                  <p className="robo-overlay-vendor">Serve Robotics</p>
                  <p className="robo-overlay-name">Gen-3 Delivery Robot</p>
                  <p className="robo-overlay-price">From $25,645 / unit · 3-unit fleet $76,935</p>
                  <span className="robo-overlay-cta">View Details →</span>
                </div>
              </Link>
              <Link href="/robotics/kiwibot" className="overflow-hidden rounded-lg robo-img-wrap block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/Kiwibot.jpg" alt="Kiwibot S3 sidewalk delivery robot" className="robo-img" style={{ objectPosition: 'center' }} />
                <div className="robo-overlay">
                  <p className="robo-overlay-vendor">Kiwibot</p>
                  <p className="robo-overlay-name">S3 Sidewalk Delivery Robot</p>
                  <p className="robo-overlay-price">From $897 / mo lease</p>
                  <span className="robo-overlay-cta">View Details →</span>
                </div>
              </Link>
              <Link href="/robotics/wing" className="overflow-hidden rounded-lg robo-img-wrap block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/Wing%20(Alphabet).webp" alt="Wing aerial delivery drone in flight" className="robo-img" style={{ objectPosition: 'center' }} />
                <div className="robo-overlay">
                  <p className="robo-overlay-vendor">Wing (Google)</p>
                  <p className="robo-overlay-name">Aerial Delivery UAV</p>
                  <p className="robo-overlay-price">Suburban &amp; Campus · Contact for Pricing</p>
                  <span className="robo-overlay-cta">View Details →</span>
                </div>
              </Link>
              <Link href="/robotics/segway" className="sm:col-span-2 overflow-hidden rounded-lg robo-img-wrap block" style={{ minHeight: '160px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/Segway%20Robotics.jpeg" alt="Segway Robotics E1 outdoor delivery robot" className="robo-img" style={{ objectPosition: 'center' }} />
                <div className="robo-overlay">
                  <p className="robo-overlay-vendor">Segway Robotics</p>
                  <p className="robo-overlay-name">E1 Outdoor Delivery Robot</p>
                  <p className="robo-overlay-price">From $11,385 / unit · 2-unit fleet $22,770</p>
                  <span className="robo-overlay-cta">View Details →</span>
                </div>
              </Link>
            </div>
            <Link href="/robotics/matternet" className="overflow-hidden rounded-lg robo-img-wrap block" style={{ height: 'clamp(180px, 22vw, 300px)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/Matternet_System_018.webp" alt="Matternet M2 medical drone delivery system" className="robo-img" style={{ objectPosition: 'center' }} />
              <div className="robo-overlay">
                <p className="robo-overlay-vendor">Matternet</p>
                <p className="robo-overlay-name">M2 Medical Delivery Drone</p>
                <p className="robo-overlay-price">Enterprise Fleet · Contact for Pricing</p>
                <span className="robo-overlay-cta">View Details →</span>
              </div>
            </Link>
        </div>
      </section>

      {/* ── ROI CALCULATOR ── */}
      <section id="roi-calculator" className="px-4 sm:px-6 md:px-12 lg:px-20 py-14 sm:py-20 max-w-[82rem] mx-auto border-t border-neutral-200">
        <p className="text-[10px] sm:text-xs tracking-widest uppercase mb-3 font-manrope text-neutral-400">Model Your Deployment</p>
        <p className="text-neutral-500 text-sm max-w-lg leading-relaxed mb-10">
          Model your deployment economics — estimate revenue potential against fleet lease or purchase cost before you ever talk to us.
        </p>
        <RoiCalculator />
      </section>

      {/* ── HUMANOID ROBOTICS COLLAGE ── */}
      <section id="humanoid-systems" className="px-4 sm:px-6 md:px-12 lg:px-20 py-14 sm:py-20 max-w-[82rem] mx-auto border-t border-neutral-200">
        <p className="text-xs tracking-widest uppercase mb-3 font-manrope text-neutral-400">Humanoid Robotics</p>
        <p className="text-neutral-500 text-sm max-w-lg leading-relaxed mb-12">
          Bipedal and humanoid systems designed for environments built around people — retail floors, hospitality, and customer-facing operations.
        </p>
        {/* Row 1: wide hero + 2 stacked | Row 2: 3 equal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2" style={{ gridTemplateRows: 'auto' }}>
          {/* Large hero — spans 2 cols, 2 rows on md+ */}
          <Link href="/robotics/unitree" className="md:col-span-2 md:row-span-2 overflow-hidden rounded-lg robo-img-wrap block" style={{ minHeight: '240px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/Unitree%20Robotics-G1.png"
              alt="Unitree G1 humanoid robot"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Unitree Robotics</p>
              <p className="robo-overlay-name">G1 EDU Standard Humanoid</p>
              <p className="robo-overlay-price">From $13,500</p>
              <span className="robo-overlay-cta">View Details →</span>
            </div>
          </Link>
          {/* Top right */}
          <Link href="/robotics/1x" className="overflow-hidden rounded-lg robo-img-wrap block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/1X%20Technologies.avif"
              alt="1X Technologies NEO humanoid robot"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">1X Technologies</p>
              <p className="robo-overlay-name">NEO Humanoid Robot</p>
              <p className="robo-overlay-price">From $23,000 · Early Access</p>
              <span className="robo-overlay-cta">View Details →</span>
            </div>
          </Link>
          {/* Bottom right */}
          <Link href="/robotics/apptronik" className="overflow-hidden rounded-lg robo-img-wrap block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/Apptronik.jpg"
              alt="Apptronik Apollo humanoid robot"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Apptronik</p>
              <p className="robo-overlay-name">Apollo — Industrial Humanoid</p>
              <p className="robo-overlay-price">RaaS / Enterprise — Contact · Partners: GE Aerospace, Mercedes-Benz</p>
              <span className="robo-overlay-cta">View Details →</span>
            </div>
          </Link>
        </div>
        {/* Row 2: 3 equal-width images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2" style={{ minHeight: 'clamp(160px, 18vw, 240px)' }}>
          <Link href="/robotics/sanctuary" className="overflow-hidden rounded-lg robo-img-wrap block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/Sanctuary%20AI.webp"
              alt="Sanctuary AI Phoenix Gen 7 humanoid robot"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Sanctuary AI</p>
              <p className="robo-overlay-name">Phoenix Gen 7</p>
              <p className="robo-overlay-price">Enterprise — Contact · Est. $65K–$250K</p>
              <span className="robo-overlay-cta">View Details →</span>
            </div>
          </Link>
          <Link href="/robotics/ubtech" className="overflow-hidden rounded-lg robo-img-wrap block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/UBTECH%20Robotics.webp"
              alt="UBTECH Walker S2 humanoid robot"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">UBTECH Robotics</p>
              <p className="robo-overlay-name">Walker S2</p>
              <p className="robo-overlay-price">$180,000 purchase · $5,000/mo RaaS · BYD, Foxconn deployments</p>
              <span className="robo-overlay-cta">View Details →</span>
            </div>
          </Link>
          <div className="overflow-hidden rounded-lg backdrop-blur-md bg-white/70 border border-neutral-200">
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-center">
              <p className="text-xs uppercase tracking-widest font-manrope text-neutral-900 font-semibold">Your environment</p>
              <p className="text-neutral-400 text-xs leading-relaxed">We assess, source,<br />and integrate.</p>
            </div>
          </div>
        </div>
        {/* Row 3: 2 new humanoid images */}
        <div className="grid grid-cols-2 gap-2 mt-2" style={{ height: 'clamp(180px, 22vw, 300px)' }}>
          <Link href="/robotics/fauna" className="overflow-hidden rounded-lg robo-img-wrap block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/fauna_sprout_3.webp"
              alt="Fauna Robotics Sprout — consumer humanoid, assembled in America"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Fauna Robotics</p>
              <p className="robo-overlay-name">Sprout Creator Edition</p>
              <p className="robo-overlay-price">Consumer Humanoid · Contact for Pricing</p>
              <span className="robo-overlay-cta">View Details →</span>
            </div>
          </Link>
          <Link href="/robotics/agility" className="overflow-hidden rounded-lg robo-img-wrap block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/Agility%20Robotics.jpeg"
              alt="Agility Robotics Digit warehouse humanoid"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Agility Robotics</p>
              <p className="robo-overlay-name">Digit — Warehouse Humanoid</p>
              <p className="robo-overlay-price">Enterprise Pricing · RaaS Available</p>
              <span className="robo-overlay-cta">View Details →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── TRENDING ROBOTS ── */}
      <section id="trending" className="px-4 sm:px-6 md:px-12 lg:px-20 py-14 sm:py-20 max-w-[82rem] mx-auto border-t border-neutral-200">
        <p className="text-xs tracking-widest uppercase mb-3 font-manrope text-neutral-400">Trending · Most Requested</p>
        <p className="text-neutral-500 text-sm max-w-lg leading-relaxed mb-12">
          The most-searched humanoid platforms in enterprise robotics right now — from Boston Dynamics Atlas to next-generation bipedal systems entering mass production.
        </p>
        {/* Row 1: Atlas hero (col-span-2) + Figure 02 + Digit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2" style={{ gridTemplateRows: 'auto' }}>
          {/* Boston Dynamics Atlas — hero */}
          <Link href="/robotics/boston-dynamics" className="md:col-span-2 md:row-span-2 overflow-hidden rounded-lg robo-img-wrap block" style={{ minHeight: '240px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/atlas2-Pre-Launch-Thumbnail.webp"
              alt="Boston Dynamics Atlas humanoid robot"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Boston Dynamics</p>
              <p className="robo-overlay-name">Atlas</p>
              <p className="robo-overlay-price">Enterprise RaaS · Contact for Pricing</p>
              <span className="robo-overlay-cta">View Details →</span>
            </div>
          </Link>
          {/* Figure 02 */}
          <Link href="/robotics/figure" className="overflow-hidden rounded-lg robo-img-wrap block" style={{ minHeight: '160px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/Figure%2002.jpg"
              alt="Figure 02 humanoid robot"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Figure AI</p>
              <p className="robo-overlay-name">Figure 02</p>
              <p className="robo-overlay-price">~$130,000 est. · Enterprise Deployment</p>
              <span className="robo-overlay-cta">View Details →</span>
            </div>
          </Link>
          {/* Agility Digit */}
          <Link href="/robotics/agility" className="overflow-hidden rounded-lg robo-img-wrap block" style={{ minHeight: '160px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/Agility%20Robotics%20Digit.jpg"
              alt="Agility Robotics Digit humanoid robot"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Agility Robotics</p>
              <p className="robo-overlay-name">Digit</p>
              <p className="robo-overlay-price">Enterprise Pricing · RaaS Available</p>
              <span className="robo-overlay-cta">View Details →</span>
            </div>
          </Link>
        </div>
        {/* Row 2: 3 more humanoids */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2" style={{ minHeight: 'clamp(200px, 24vw, 340px)' }}>
          {/* Fourier GR-1 */}
          <Link href="/robotics/fourier" className="overflow-hidden rounded-lg robo-img-wrap block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/Fourier%20Intelligence.webp"
              alt="Fourier Intelligence GR-1 humanoid robot"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Fourier Intelligence</p>
              <p className="robo-overlay-name">GR-1 Research Humanoid</p>
              <p className="robo-overlay-price">~$149,999 · 42 DOF · Mass production 2026</p>
              <span className="robo-overlay-cta">View Details →</span>
            </div>
          </Link>
          {/* Atlas HD */}
          <Link href="/robotics/boston-dynamics" className="overflow-hidden rounded-lg robo-img-wrap block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/atlas2-Pre-Launch-Thumbnail.webp"
              alt="Boston Dynamics Atlas HD humanoid robot"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Boston Dynamics</p>
              <p className="robo-overlay-name">Atlas HD — Humanoid</p>
              <p className="robo-overlay-price">Enterprise Pricing · Contact for Quote</p>
              <span className="robo-overlay-cta">View Details →</span>
            </div>
          </Link>
          {/* Kepler K2 */}
          <Link href="/robotics/kepler" className="overflow-hidden rounded-lg robo-img-wrap block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/Kepler%20Robotics.jpg"
              alt="Kepler Robotics Forerunner K2 humanoid robot"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Kepler Robotics</p>
              <p className="robo-overlay-name">Forerunner K2</p>
              <p className="robo-overlay-price">~$30,000 target · Ant Group mass production</p>
              <span className="robo-overlay-cta">View Details →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── FLIGHT DRONES COLLAGE ── */}
      <section id="flight-drones" className="px-4 sm:px-6 md:px-12 lg:px-20 py-14 sm:py-20 max-w-[82rem] mx-auto border-t border-neutral-200">
        <p className="text-xs tracking-widest uppercase mb-3 font-manrope text-neutral-400">Aerial Delivery Systems</p>
        <p className="text-neutral-500 text-sm max-w-lg leading-relaxed mb-12">
          UAV systems for direct delivery — suburban neighborhoods, campuses, and short flight corridors where ground routing falls short.
        </p>
        {/* Top: hero wide + tall right */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2" style={{ gridTemplateRows: 'auto' }}>
          {/* Hero — 2 cols × 2 rows on md+ */}
          <Link href="/robotics/dji-enterprise" className="md:col-span-2 md:row-span-2 overflow-hidden rounded-lg robo-img-wrap block" style={{ minHeight: '240px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/DJI%20Enterprise.jpg"
              alt="DJI Enterprise drone in operation"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">DJI Enterprise</p>
              <p className="robo-overlay-name">Matrice 400 — Full Inspection Kit</p>
              <p className="robo-overlay-price">From $12,017 · Zenmuse H30T payload available</p>
              <span className="robo-overlay-cta">View Details →</span>
            </div>
          </Link>
          {/* Top right */}
          <Link href="/robotics/zipline" className="overflow-hidden rounded-lg robo-img-wrap block" style={{ minHeight: '160px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/zipline.jpg"
              alt="Zipline P2 autonomous delivery drone"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Zipline</p>
              <p className="robo-overlay-name">Platform 2 (P2) Delivery Drone</p>
              <p className="robo-overlay-price">Enterprise · Healthcare &amp; Retail delivery</p>
              <span className="robo-overlay-cta">View Details →</span>
            </div>
          </Link>
          {/* Bottom right */}
          <Link href="/robotics/skydio" className="overflow-hidden rounded-lg robo-img-wrap block" style={{ minHeight: '160px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/Skydio.avif"
              alt="Skydio X10 enterprise autonomous drone"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Skydio</p>
              <p className="robo-overlay-name">X10 Enterprise · 2-Unit Kit</p>
              <p className="robo-overlay-price">From $19,895 / unit · Kit $39,790</p>
              <span className="robo-overlay-cta">View Details →</span>
            </div>
          </Link>
        </div>
        {/* Bottom: full-width banner */}
        <Link href="/robotics/categories/drone" className="mt-2 overflow-hidden rounded-lg robo-img-wrap block" style={{ height: 'clamp(140px, 16vw, 220px)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/Fltrex-image3-e1723551928941.jpg"
            alt="Fleet of delivery drones in operation"
            className="robo-img"
            style={{ objectPosition: 'center' }}
          />
          <div className="robo-overlay">
            <p className="robo-overlay-vendor">Fltrex</p>
            <p className="robo-overlay-name">Urban Delivery Fleet</p>
            <p className="robo-overlay-price">Enterprise UAV · Contact for Pricing</p>
            <span className="robo-overlay-cta">View Details →</span>
          </div>
        </Link>
      </section>

      {/* ── FORKLIFT BOTS COLLAGE ── */}
      <section id="forklift-bots" className="px-4 sm:px-6 md:px-12 lg:px-20 py-14 sm:py-20 max-w-[82rem] mx-auto border-t border-neutral-200">
        <p className="text-xs tracking-widest uppercase mb-3 font-manrope text-neutral-400">Warehouse Forklift &amp; Sorting Bots</p>
        <p className="text-neutral-500 text-sm max-w-lg leading-relaxed mb-12">
          Autonomous forklift and sorting systems for pallet movement, stacking, and high-throughput fulfillment — no driver required.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2" style={{ gridTemplateRows: 'auto' }}>
          {/* Hero — 2 cols × 2 rows on md+ */}
          <Link href="/robotics/categories/industrial" className="md:col-span-2 md:row-span-2 overflow-hidden rounded-lg robo-img-wrap block" style={{ minHeight: '240px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/Robotic-Sorting-as-a-Service-B3A7940.webp"
              alt="Robotic sorting system operating on warehouse floor"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Berkshire Grey</p>
              <p className="robo-overlay-name">Robotic Sortation System</p>
              <p className="robo-overlay-price">Enterprise Pricing · RaaS Available</p>
              <span className="robo-overlay-cta">View Details →</span>
            </div>
          </Link>
          {/* Top right */}
          <Link href="/robotics/seegrid" className="overflow-hidden rounded-lg robo-img-wrap block" style={{ minHeight: '160px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/Seegrid-Palion-AMR-Fleet-2024_Palion-Tow-Palion-Lift-RS1-Palion-Lift-CR1.webp"
              alt="Seegrid Palion AMR fleet — Tow, Lift, and CR1"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Seegrid</p>
              <p className="robo-overlay-name">Palion Lift — Autonomous Forklift</p>
              <p className="robo-overlay-price">From $85,000 · Enterprise Fleet</p>
              <span className="robo-overlay-cta">View Details →</span>
            </div>
          </Link>
          {/* Bottom right */}
          <Link href="/robotics/mir" className="overflow-hidden rounded-lg robo-img-wrap block" style={{ minHeight: '160px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/MiR-AMR-lineup-1500x1000-1-1024x683.webp"
              alt="MiR autonomous mobile robot lineup"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">MiR Robotics</p>
              <p className="robo-overlay-name">MiR600 Pallet AMR</p>
              <p className="robo-overlay-price">From $45,000 · Fleet Pricing Available</p>
              <span className="robo-overlay-cta">View Details →</span>
            </div>
          </Link>
        </div>
        {/* Bottom: full-width banner */}
        <Link href="/robotics/6rs" className="mt-2 overflow-hidden rounded-lg robo-img-wrap block" style={{ height: 'clamp(140px, 16vw, 220px)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/6-river-systems-shopify.png"
            alt="6 River Systems Chuck AMR in fulfillment center"
            className="robo-img"
            style={{ objectPosition: 'center' }}
          />
          <div className="robo-overlay">
            <p className="robo-overlay-vendor">6 River Systems</p>
            <p className="robo-overlay-name">Chuck AMR — Fulfillment at Scale</p>
            <p className="robo-overlay-price">Enterprise Pricing · Contact for Quote</p>
            <span className="robo-overlay-cta">View Details →</span>
          </div>
        </Link>
        {/* Row 3: 2 new warehouse images */}
        <div className="grid grid-cols-2 gap-2 mt-2" style={{ height: 'clamp(180px, 22vw, 300px)' }}>
          <Link href="/robotics/locus" className="overflow-hidden rounded-lg robo-img-wrap block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/Locus-3.png"
              alt="Locus Robotics LocusBot warehouse AMR"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Locus Robotics</p>
              <p className="robo-overlay-name">LocusBot — Warehouse AMR</p>
              <p className="robo-overlay-price">From $1,200 / mo · RaaS Available</p>
              <span className="robo-overlay-cta">View Details →</span>
            </div>
          </Link>
          <Link href="/robotics/otto-motors" className="overflow-hidden rounded-lg robo-img-wrap block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/OTTO%20Motors.png"
              alt="OTTO Motors 1500 heavy payload AMR"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">OTTO Motors</p>
              <p className="robo-overlay-name">OTTO 1500 — Heavy Payload AMR</p>
              <p className="robo-overlay-price">From $120,000 · Fleet Pricing Available</p>
              <span className="robo-overlay-cta">View Details →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── COMPARE STRIP ── */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-20 py-12 max-w-[82rem] mx-auto border-t border-neutral-200">
        <p className="text-[10px] tracking-widest uppercase font-manrope text-neutral-400 mb-5">Not sure which platform? Compare side-by-side →</p>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Unitree G1 vs Boston Dynamics Spot', href: '/compare/unitree-vs-boston-dynamics' },
            { label: 'Agility Digit vs Figure 03', href: '/compare/agility-vs-figure' },
            { label: 'Kiwibot Leap vs Serve Gen 3', href: '/compare/kiwibot-vs-serve' },
            { label: 'Atlas vs Figure 03', href: '/compare/atlas-vs-figure-03' },
            { label: 'MiR 600 vs OTTO 750', href: '/compare/mir-vs-otto' },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="inline-flex items-center gap-1.5 border border-neutral-300 text-neutral-600 rounded-full px-4 py-2 text-xs font-manrope hover:border-neutral-900 hover:text-neutral-900 transition-colors"
            >
              {label} <ArrowUpRight className="w-3 h-3" />
            </a>
          ))}
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-20 py-16 sm:py-24 max-w-[82rem] mx-auto border-t border-neutral-200">

        {/* Vendor logo bar */}
        <p className="text-[10px] tracking-widest uppercase font-manrope text-neutral-400 mb-6">Platforms We Source</p>
        <div className="flex flex-wrap gap-x-8 gap-y-4 items-center mb-16">
          {['Unitree Robotics', 'Boston Dynamics', 'Agility Robotics', 'Figure AI', 'Serve Robotics', 'Kiwibot', 'DJI Enterprise', 'Skydio'].map((name) => (
            <span key={name} className="text-sm font-semibold text-neutral-300 tracking-tight font-manrope">{name}</span>
          ))}
        </div>

        {/* Case study + quote grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* How it works card */}
          <div className="rounded-2xl border border-neutral-200 bg-white/60 backdrop-blur-sm p-7">
            <p className="text-[10px] tracking-widest uppercase text-neutral-400 font-manrope mb-4">Example Scenario · Sidewalk Delivery</p>
            <h3 className="font-manrope font-semibold text-xl text-neutral-900 mb-2 leading-snug">
              From briefing to fleet-live in under 3 weeks
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6">
              A food-and-grocery operator needs last-mile coverage across a 0.4 mi campus loop. We assess the terrain, source 3 sidewalk robots, configure routes, and commission the fleet — including point-of-sale integration.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                ['< 3 weeks', 'Fleet live'],
                ['3 robots', 'Typical fleet'],
                ['From $900/mo', 'All-in est.'],
              ].map(([stat, label]) => (
                <div key={label}>
                  <p className="text-lg font-bold text-neutral-900 font-manrope">{stat}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-neutral-300 italic">Illustrative scenario · Actual timelines and costs vary by environment</p>
          </div>

          {/* How we work card */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-900 p-7 flex flex-col justify-between">
            <div>
              <p className="text-[10px] tracking-widest uppercase text-neutral-500 font-manrope mb-6">How We Work</p>
              <p className="text-white text-lg font-manrope font-light leading-relaxed mb-6">
                Most operators spend weeks chasing vendor quotes that don&rsquo;t account for their actual environment. We start with your space — terrain, traffic, payload, conditions — and deliver a sourced, priced proposal within 48 hours.
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-400 font-manrope">No retainer. No commitment. Just a straight answer.</p>
              <a
                href="/pilot"
                className="mt-5 inline-flex items-center gap-2 border border-white/20 text-white rounded-full py-2 px-5 text-xs hover:border-white/50 transition-colors"
              >
                Start a 30-Day Pilot <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── BROWSE BY CATEGORY ── */}
      <section id="browse-categories" className="px-4 sm:px-6 md:px-12 lg:px-20 py-14 sm:py-20 max-w-[82rem] mx-auto border-t border-neutral-200">
        <p className="text-[10px] sm:text-xs tracking-widest uppercase mb-3 font-manrope text-neutral-400">Full Catalog</p>
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-manrope font-semibold text-2xl sm:text-3xl text-neutral-900 mb-2">Browse by Robot Type</h2>
            <p className="text-neutral-500 text-sm max-w-xl leading-relaxed">
              From surgical systems to agricultural drones — our catalog spans the full spectrum of commercial robotics. Click a category to see vendors, specs, and pricing.
            </p>
          </div>
          <Link href="/contact" className="hidden sm:flex items-center gap-1.5 text-xs border border-neutral-300 hover:border-neutral-600 px-4 py-2 rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors shrink-0 font-manrope">
            Request Custom Sourcing <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {ROBOT_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/robotics/categories/${cat.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm hover:shadow-md hover:border-neutral-400 transition-all duration-200"
            >
              <div className="relative h-32 overflow-hidden bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="block w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-3 sm:p-4 flex flex-col gap-1">
                <p className="font-manrope font-semibold text-neutral-900 text-sm group-hover:text-black transition-colors leading-snug">{cat.label}</p>
                <p className="text-neutral-400 text-xs">{cat.count}</p>
                <span className="text-neutral-400 group-hover:text-neutral-700 text-xs flex items-center gap-0.5 transition-colors mt-1.5">
                  Browse <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-4 sm:px-6 md:px-12 lg:px-20 py-12 sm:py-16 max-w-[82rem] mx-auto border-t border-neutral-200">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12 text-sm">
          <div className="flex flex-col gap-3">
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-manrope mb-1">Offerings</p>
            <a href="/pilot" className="text-neutral-500 hover:text-neutral-900 transition-colors font-manrope">30-Day Pilot Program</a>
            <a href="/contact?inquiry=robotics" className="text-neutral-500 hover:text-neutral-900 transition-colors font-manrope">Get a Quote</a>
            <a href="/enterprise/requisition" className="text-neutral-500 hover:text-neutral-900 transition-colors font-manrope">Enterprise Requisition</a>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-manrope mb-1">Compare Vendors</p>
            <a href="/compare/unitree-vs-boston-dynamics" className="text-neutral-500 hover:text-neutral-900 transition-colors font-manrope">Unitree vs Boston Dynamics</a>
            <a href="/compare/agility-vs-figure" className="text-neutral-500 hover:text-neutral-900 transition-colors font-manrope">Agility vs Figure</a>
            <a href="/compare/kiwibot-vs-serve" className="text-neutral-500 hover:text-neutral-900 transition-colors font-manrope">Kiwibot vs Serve</a>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-manrope mb-1">Vendor Catalog</p>
            <a href="/robotics/unitree" className="text-neutral-500 hover:text-neutral-900 transition-colors font-manrope">Unitree Robotics</a>
            <a href="/robotics/boston-dynamics" className="text-neutral-500 hover:text-neutral-900 transition-colors font-manrope">Boston Dynamics</a>
            <a href="/robotics/agility" className="text-neutral-500 hover:text-neutral-900 transition-colors font-manrope">Agility Robotics</a>
            <a href="/robotics/figure" className="text-neutral-500 hover:text-neutral-900 transition-colors font-manrope">Figure AI</a>
            <a href="/robotics/kiwibot" className="text-neutral-500 hover:text-neutral-900 transition-colors font-manrope">Kiwibot</a>
            <a href="/robotics/serve" className="text-neutral-500 hover:text-neutral-900 transition-colors font-manrope">Serve Robotics</a>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-manrope mb-1">Account</p>
            <a href="/portal" className="text-neutral-500 hover:text-neutral-900 transition-colors font-manrope">Customer Portal</a>
            <a href="/contact" className="text-neutral-500 hover:text-neutral-900 transition-colors font-manrope">Contact Us</a>
            <a href="/software" className="text-neutral-500 hover:text-neutral-900 transition-colors font-manrope">Software Dev</a>
          </div>
        </div>
        <div className="border-t border-neutral-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
          <div>© {new Date().getFullYear()} Deeptech Robotics. All rights reserved.</div>
          <div className="flex flex-wrap justify-center gap-5">
            <a href="/admin/assessment" className="hover:text-neutral-900 transition-colors">Assessment Tool</a>
            <a href="mailto:info@deeptechnologies.dev" className="hover:text-neutral-900 transition-colors">info@deeptechnologies.dev</a>
          </div>
        </div>
      </footer>
      </div>{/* end content wrapper */}


    </div>
  );
}

