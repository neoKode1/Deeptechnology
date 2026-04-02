import SoftDevHeader from '@/components/SoftDevHeader';
import ParallaxRobot from '@/components/ParallaxRobot';
import { ArrowUpRight } from 'lucide-react';

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

      {/* ── Parallax Spline 3D robot — pans from head to feet as you scroll ── */}
      <ParallaxRobot />

      {/* All content sits above the iframe — transparent so robot shows through */}
      <div className="relative" style={{ zIndex: 1 }}>
      <SoftDevHeader />

      {/* ── HERO ── */}
      <section className="relative w-full h-[100svh] flex flex-col justify-start sm:justify-end overflow-hidden">
        {/* Bottom gradient so text stays legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent pointer-events-none" />

        <div className="relative z-10 px-6 md:px-12 lg:px-20 pt-24 sm:pt-0 pb-8 sm:pb-16 md:pb-24 max-w-[82rem] mx-auto w-full">
          {/* Frosted backdrop on mobile so text stays readable over robot */}
          <div className="sm:bg-transparent bg-white/70 backdrop-blur-md sm:backdrop-blur-none rounded-2xl sm:rounded-none p-5 sm:p-0 -mx-1 sm:mx-0">
          <p className="text-black/40 text-xs tracking-widest uppercase mb-6 font-manrope">
            Deeptech · Robotics Division
          </p>
          <h1 className="font-manrope font-semibold text-[2.25rem] sm:text-[3.5rem] md:text-[6.5rem] leading-[1.02] tracking-tighter text-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
            The right deployment
          </h1>
          <h1 className="font-manrope font-semibold text-[2.25rem] sm:text-[3.5rem] md:text-[6.5rem] leading-[1.02] tracking-tighter text-black/30 drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]">
            for the right environment.
          </h1>
          <p className="mt-6 text-base md:text-lg text-black/60 max-w-xl leading-relaxed font-manrope font-light">
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
              href="#contact"
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
              ['6+', 'Environment types deployed'],
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

      {/* ── DELIVERY SYSTEMS ── */}
      <section id="delivery-systems" className="px-4 sm:px-6 md:px-12 lg:px-20 py-14 sm:py-20 max-w-[82rem] mx-auto border-t border-neutral-200">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 md:gap-8 items-start">
          {/* Left: description card */}
          <div className="lg:sticky lg:top-24 p-6 rounded-xl border border-neutral-200 bg-white/70 backdrop-blur-md shadow-sm">
            <p className="text-xs tracking-widest uppercase mb-3 font-manrope text-neutral-900 font-semibold">In the Field</p>
            <p className="text-sm leading-relaxed text-neutral-500">
              Sidewalk bots, road hybrids, and autonomous delivery vehicles — operating across urban corridors, bike lanes, and last-mile routes.
            </p>
          </div>
          {/* Right: image collage */}
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:grid-rows-2 gap-2" style={{ minHeight: 'clamp(320px, 55vw, 680px)' }}>
              <div className="sm:row-span-2 overflow-hidden rounded-lg robo-img-wrap" style={{ minHeight: '200px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/Serve-Gen-2-left-and-Gen-3-robots.jpg" alt="Sidewalk delivery robots — two generations side by side" className="robo-img" style={{ objectPosition: 'center' }} />
              </div>
              <div className="overflow-hidden rounded-lg robo-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/image.webp" alt="Autonomous delivery robot on urban route" className="robo-img" style={{ objectPosition: 'center' }} />
              </div>
              <div className="overflow-hidden rounded-lg robo-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/file-20180202-162066-1cj3sym.avif" alt="Aerial delivery drone in flight" className="robo-img" style={{ objectPosition: 'center' }} />
              </div>
              <div className="sm:col-span-2 overflow-hidden rounded-lg robo-img-wrap" style={{ minHeight: '160px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/DoorDash_Dot-04__1__1__1_.png" alt="Road-capable autonomous delivery bot" className="robo-img" style={{ objectPosition: 'center' }} />
              </div>
            </div>
            <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ height: 'clamp(180px, 22vw, 300px)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/del-bot-quad.webp" alt="Autonomous delivery robot — quad platform" className="robo-img" style={{ objectPosition: 'center' }} />
            </div>
          </div>
        </div>
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
          <div className="md:col-span-2 md:row-span-2 overflow-hidden rounded-lg robo-img-wrap" style={{ minHeight: '240px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/df9f333424ff6cc6164ce421b019fb94_a6f832b0-479e-4294-ac75-6516208b91f4_1296x.webp"
              alt="Humanoid robot in operational environment"
              className="robo-img"
            />
          </div>
          {/* Top right */}
          <div className="overflow-hidden rounded-lg robo-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/1_deeaa3cc-08f5-454f-bfcb-1a477b30adb4_900x.webp"
              alt="Humanoid robot navigating indoor space"
              className="robo-img"
            />
          </div>
          {/* Bottom right */}
          <div className="overflow-hidden rounded-lg robo-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/2_3769ceea-b323-4ebc-a1f4-e27a9624706b_900x.jpg"
              alt="Humanoid robot system detail"
              className="robo-img"
            />
          </div>
        </div>
        {/* Row 2: 3 equal-width images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2" style={{ minHeight: 'clamp(160px, 18vw, 240px)' }}>
          <div className="overflow-hidden rounded-lg robo-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/3_d9687814-d553-451b-9429-c224a20f3b3a_900x.webp"
              alt="Humanoid robot in service environment"
              className="robo-img"
            />
          </div>
          <div className="overflow-hidden rounded-lg robo-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/5_eb271a12-e794-439d-ade5-d60ec009e81a_900x.webp"
              alt="Humanoid robotics platform"
              className="robo-img"
            />
          </div>
          <div className="overflow-hidden rounded-lg backdrop-blur-md bg-white/70 border border-neutral-200">
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-center">
              <p className="text-xs uppercase tracking-widest font-manrope text-neutral-900 font-semibold">Your environment</p>
              <p className="text-neutral-400 text-xs leading-relaxed">We assess, source,<br />and integrate.</p>
            </div>
          </div>
        </div>
        {/* Row 3: 2 new humanoid images */}
        <div className="grid grid-cols-2 gap-2 mt-2" style={{ height: 'clamp(180px, 22vw, 300px)' }}>
          <div className="overflow-hidden rounded-lg robo-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/fauna_sprout_3.webp"
              alt="Humanoid robot — fauna sprout platform"
              className="robo-img"
            />
          </div>
          <div className="overflow-hidden rounded-lg robo-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/amazon1.jpg"
              alt="Humanoid robot in logistics environment"
              className="robo-img"
            />
          </div>
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
          <div className="md:col-span-2 md:row-span-2 overflow-hidden rounded-lg robo-img-wrap" style={{ minHeight: '240px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/drones_hero.webp"
              alt="Autonomous delivery drone in flight over urban area"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
          </div>
          {/* Top right */}
          <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ minHeight: '160px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/DHL_Drone_Delivery_855666c6-cb8b-4e34-841e-fffe73da729d_1400x.webp"
              alt="Drone making a commercial delivery"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
          </div>
          {/* Bottom right */}
          <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ minHeight: '160px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/Shutter2U___stock.adobe.com.62c8617809a24.avif"
              alt="Delivery drone descending to drop zone"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
          </div>
        </div>
        {/* Bottom: full-width banner */}
        <div className="mt-2 overflow-hidden rounded-lg robo-img-wrap" style={{ height: 'clamp(140px, 16vw, 220px)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/Fltrex-image3-e1723551928941.jpg"
            alt="Fleet of delivery drones in operation"
            className="robo-img"
            style={{ objectPosition: 'center' }}
          />
        </div>
      </section>

      {/* ── FORKLIFT BOTS COLLAGE ── */}
      <section id="forklift-bots" className="px-4 sm:px-6 md:px-12 lg:px-20 py-14 sm:py-20 max-w-[82rem] mx-auto border-t border-neutral-200">
        <p className="text-xs tracking-widest uppercase mb-3 font-manrope text-neutral-400">Warehouse Forklift &amp; Sorting Bots</p>
        <p className="text-neutral-500 text-sm max-w-lg leading-relaxed mb-12">
          Autonomous forklift and sorting systems for pallet movement, stacking, and high-throughput fulfillment — no driver required.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2" style={{ gridTemplateRows: 'auto' }}>
          {/* Hero — 2 cols × 2 rows on md+ */}
          <div className="md:col-span-2 md:row-span-2 overflow-hidden rounded-lg robo-img-wrap" style={{ minHeight: '240px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/Robotic-Sorting-as-a-Service-B3A7940.webp"
              alt="Robotic sorting system operating on warehouse floor"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
          </div>
          {/* Top right */}
          <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ minHeight: '160px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/de41b3ea93135793d5885b95c0005b8e.avif"
              alt="Autonomous forklift bot in operation"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
          </div>
          {/* Bottom right */}
          <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ minHeight: '160px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/f6f77a1616e27fc34eb1a81aa7dc6262.jpg"
              alt="Warehouse autonomous mobile robot"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
          </div>
        </div>
        {/* Bottom: full-width banner */}
        <div className="mt-2 overflow-hidden rounded-lg robo-img-wrap" style={{ height: 'clamp(140px, 16vw, 220px)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/DELIVERY-AUTOMATION-10-tzjm-jumbo.jpg"
            alt="Automated delivery and fulfillment system at scale"
            className="robo-img"
            style={{ objectPosition: 'center' }}
          />
        </div>
        {/* Row 3: 2 new warehouse images */}
        <div className="grid grid-cols-2 gap-2 mt-2" style={{ height: 'clamp(180px, 22vw, 300px)' }}>
          <div className="overflow-hidden rounded-lg robo-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/warehouse.jpeg"
              alt="Warehouse robot in distribution environment"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
          </div>
          <div className="overflow-hidden rounded-lg robo-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/warehouse2.webp"
              alt="Autonomous warehouse robot system"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-4 sm:px-6 md:px-12 lg:px-20 py-10 sm:py-12 max-w-[82rem] mx-auto border-t border-neutral-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-neutral-400">
          <div>© {new Date().getFullYear()} Deeptech Robotics. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="/" className="text-neutral-500 hover:text-neutral-900 transition-colors">Software Dev</a>
            <a href="/creative" className="text-neutral-500 hover:text-neutral-900 transition-colors">Creative</a>
          </div>
        </div>
      </footer>
      </div>{/* end content wrapper */}
    </div>
  );
}

