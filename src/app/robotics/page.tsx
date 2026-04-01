import SoftDevHeader from '@/components/SoftDevHeader';
import NomaCanvas from '@/components/NomaCanvas';
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
    <div className="min-h-screen overflow-x-hidden text-white bg-transparent">

      {/* ── FIXED background canvas — stays centered during scroll ── */}
      <NomaCanvas className="fixed inset-0 w-full h-full -z-10" />

      <SoftDevHeader />

      {/* ── HERO ── */}
      <section className="relative w-full h-[100svh] flex flex-col justify-end overflow-hidden">
        {/* Bottom gradient so text stays legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        <div className="relative z-10 px-6 md:px-12 lg:px-20 pb-16 md:pb-24 max-w-[82rem] mx-auto w-full">
          <p className="text-white/40 text-xs tracking-widest uppercase mb-6 font-manrope">
            Deeptech · Robotics Division
          </p>
          <h1 className="font-manrope font-semibold text-[3.5rem] md:text-[6.5rem] leading-[1.02] tracking-tighter text-white">
            Built for your
          </h1>
          <h1 className="font-manrope font-semibold text-[3.5rem] md:text-[6.5rem] leading-[1.02] tracking-tighter text-white/25">
            environment.
          </h1>
          <p className="mt-6 text-base md:text-lg text-white/50 max-w-xl leading-relaxed font-manrope font-light">
            We read your space — terrain, traffic, payload, conditions — then source the autonomous system built for it.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href="#services"
              className="inline-flex items-center gap-2 bg-white/90 text-black rounded-full py-3 px-6 text-sm font-medium hover:bg-white transition-colors w-fit"
            >
              Our Services <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border border-white/25 text-white/80 rounded-full py-3 px-6 text-sm font-normal hover:border-white/50 hover:text-white transition-colors w-fit"
            >
              Start a Consultation
            </a>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="border-y py-4 overflow-hidden" style={{ borderColor: 'rgba(26,61,53,0.6)' }}>
        <div className="flex gap-8 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {MARQUEE.map((tag, i) => (
            <span key={i} className="text-sm font-manrope shrink-0" style={{ color: 'rgba(160,200,185,0.45)' }}>
              {tag} <span className="mx-3" style={{ color: 'rgba(160,200,185,0.2)' }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <section id="about" className="px-6 md:px-12 lg:px-20 py-24 max-w-[82rem] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs tracking-widest uppercase mb-4 font-manrope" style={{ color: 'rgba(160,210,190,0.85)' }}>Robotics Division</p>
            <h2 className="font-manrope text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
              We read the environment first.<br />Then we pick the machine.
            </h2>
            <p className="text-lg leading-relaxed mb-4" style={{ color: 'rgba(200,225,215,0.65)' }}>
              Every environment has its own rules — terrain, foot traffic, payload weight, weather exposure, customer proximity. The wrong robot in the wrong space fails. We source the best autonomous solutions for your environment.
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(200,225,215,0.45)' }}>
              We are not tied to any brand or platform. We assess your specific conditions, cross-reference the full hardware market, and integrate the system — drone, bot, or AMR — that is engineered for exactly where you need it to operate.
            </p>
          </div>
          {/* Stat grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              ['Environment-First', 'Our methodology'],
              ['Vendor-Agnostic', 'No manufacturer bias'],
              ['6+', 'Environment types deployed'],
              ['End-to-End', 'Assess · Source · Integrate'],
            ].map(([stat, label]) => (
              <div key={label} className="p-6 rounded-lg border border-[#1a3d35]/70 bg-[#0a1814]/60">
                <div className="font-manrope text-xl font-semibold text-white mb-1 leading-tight">{stat}</div>
                <div className="text-sm" style={{ color: 'rgba(160,200,185,0.55)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENVIRONMENTS ── */}
      <section id="environments" className="px-6 md:px-12 lg:px-20 py-16 max-w-[82rem] mx-auto" style={{ borderTop: '1px solid rgba(26,61,53,0.5)' }}>
        <p className="text-xs tracking-widest uppercase mb-3 font-manrope text-white">Environments We Deploy Into</p>
        <p className="text-white/30 text-sm max-w-lg leading-relaxed mb-12">
          Different environments demand different machines.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(26,61,53,0.35)' }}>
          {ENVIRONMENTS.map((e) => (
            <div key={e.env} className="p-7 flex flex-col gap-3" style={{ background: '#080e10' }}>
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-manrope text-base font-semibold text-white leading-snug">{e.env}</h3>
              </div>
              <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(130,185,165,0.6)' }}>{e.fit}</p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(190,220,210,0.45)' }}>{e.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="px-6 md:px-12 lg:px-20 py-16 max-w-[82rem] mx-auto" style={{ borderTop: '1px solid rgba(26,61,53,0.5)' }}>
        <p className="text-xs tracking-widest uppercase mb-12 font-manrope text-white">Capabilities</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((svc) => (
            <div key={svc.num} className="p-8 rounded-lg transition-colors duration-200 border border-[#1a3d35]/60 bg-[#080e10]/55 hover:border-[#285a48]/80">
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-manrope" style={{ color: 'rgba(130,185,165,0.4)' }}>{svc.num}</span>
                <div className="flex flex-wrap gap-2 justify-end">
                  {svc.tags.map((t) => (
                    <span key={t} className="rounded-full px-3 py-1 text-xs" style={{ border: '1px solid rgba(26,61,53,0.7)', color: 'rgba(160,200,185,0.6)' }}>{t}</span>
                  ))}
                </div>
              </div>
              <h3 className="font-manrope text-xl font-medium text-white mb-3">{svc.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(190,220,210,0.55)' }}>{svc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUPPLIED SYSTEMS ── */}
      <section id="systems" className="px-6 md:px-12 lg:px-20 py-20 max-w-[82rem] mx-auto" style={{ borderTop: '1px solid rgba(26,61,53,0.5)' }}>
        <p className="text-xs tracking-widest uppercase mb-3 font-manrope text-white">Systems We Source &amp; Supply</p>
        <p className="text-white/30 text-sm max-w-xl leading-relaxed mb-14">
          We know which system fits your operation and why. These are the categories in active deployment today.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: 'rgba(26,61,53,0.3)' }}>
          {SYSTEMS.map((sys) => (
            <div key={sys.type} className="p-8 flex flex-col gap-5" style={{ background: '#080e10' }}>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded" style={{ background: 'rgba(26,61,53,0.6)', color: 'rgba(130,185,165,0.85)', border: '1px solid rgba(26,61,53,0.9)' }}>
                  {sys.type}
                </span>
              </div>
              <h3 className="font-manrope text-lg font-semibold text-white leading-snug">{sys.label}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(190,220,210,0.5)' }}>{sys.desc}</p>
              <div className="pt-3" style={{ borderTop: '1px solid rgba(26,61,53,0.5)' }}>
                <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'rgba(130,185,165,0.35)' }}>Best for</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(160,200,185,0.5)' }}>{sys.when}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DELIVERY SYSTEMS COLLAGE ── */}
      <section id="delivery-systems" className="px-6 md:px-12 lg:px-20 py-20 max-w-[82rem] mx-auto" style={{ borderTop: '1px solid rgba(26,61,53,0.5)' }}>
        <p className="text-xs tracking-widest uppercase mb-3 font-manrope text-white">In the Field</p>
        <p className="text-white/30 text-sm max-w-lg leading-relaxed mb-12">
          Systems we assess, source, and integrate — operating across sidewalks, bike lanes, and urban corridors.
        </p>
        {/* Asymmetric collage grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-2 gap-2" style={{ height: 'clamp(420px, 55vw, 680px)' }}>
          {/* Large left — spans 2 rows */}
          <div className="row-span-2 overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/Serve-Gen-2-left-and-Gen-3-robots.jpg"
              alt="Sidewalk delivery robots — two generations side by side"
              className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700 ease-in-out"
            />
          </div>
          {/* Top center */}
          <div className="overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/image.webp"
              alt="Autonomous delivery robot on urban route"
              className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700 ease-in-out"
            />
          </div>
          {/* Top right */}
          <div className="overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/file-20180202-162066-1cj3sym.avif"
              alt="Aerial delivery drone in flight"
              className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700 ease-in-out"
            />
          </div>
          {/* Bottom center — spans 2 columns */}
          <div className="col-span-2 overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/DoorDash_Dot-04__1__1__1_.png"
              alt="Road-capable autonomous delivery bot"
              className="w-full h-full object-cover object-top opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700 ease-in-out"
            />
          </div>
        </div>
      </section>

      {/* ── WAREHOUSE SYSTEMS COLLAGE ── */}
      <section id="warehouse-systems" className="px-6 md:px-12 lg:px-20 py-20 max-w-[82rem] mx-auto" style={{ borderTop: '1px solid rgba(26,61,53,0.5)' }}>
        <p className="text-xs tracking-widest uppercase mb-3 font-manrope text-white">Warehouse &amp; Distribution</p>
        <p className="text-white/30 text-sm max-w-lg leading-relaxed mb-12">
          Autonomous systems inside distribution centers, fulfillment floors, and B2B logistics networks.
        </p>
        {/* Row 1: wide hero + 2 stacked | Row 2: 3 equal */}
        <div className="grid grid-cols-3 gap-2" style={{ gridTemplateRows: 'repeat(2, clamp(180px, 22vw, 300px))' }}>
          {/* Large hero — spans 2 cols, 2 rows */}
          <div className="col-span-2 row-span-2 overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/df9f333424ff6cc6164ce421b019fb94_a6f832b0-479e-4294-ac75-6516208b91f4_1296x.webp"
              alt="Warehouse autonomous mobile robot fleet"
              className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700 ease-in-out"
            />
          </div>
          {/* Top right */}
          <div className="overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/1_deeaa3cc-08f5-454f-bfcb-1a477b30adb4_900x.webp"
              alt="AMR navigating warehouse aisle"
              className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700 ease-in-out"
            />
          </div>
          {/* Bottom right */}
          <div className="overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/2_3769ceea-b323-4ebc-a1f4-e27a9624706b_900x.jpg"
              alt="Autonomous picking system in distribution center"
              className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700 ease-in-out"
            />
          </div>
        </div>
        {/* Row 2: 3 equal-width images */}
        <div className="grid grid-cols-3 gap-2 mt-2" style={{ height: 'clamp(160px, 18vw, 240px)' }}>
          <div className="overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/3_d9687814-d553-451b-9429-c224a20f3b3a_900x.webp"
              alt="Robotic fulfillment system"
              className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700 ease-in-out"
            />
          </div>
          <div className="overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/5_eb271a12-e794-439d-ade5-d60ec009e81a_900x.webp"
              alt="Warehouse drone fleet overhead view"
              className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700 ease-in-out"
            />
          </div>
          <div className="overflow-hidden rounded-lg" style={{ background: 'rgba(10,24,20,0.6)', border: '1px solid rgba(26,61,53,0.4)' }}>
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-center">
              <p className="text-xs uppercase tracking-widest font-manrope text-white">Your environment</p>
              <p className="text-white/20 text-xs leading-relaxed">We assess, source,<br />and integrate.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FLIGHT DRONES COLLAGE ── */}
      <section id="flight-drones" className="px-6 md:px-12 lg:px-20 py-20 max-w-[82rem] mx-auto" style={{ borderTop: '1px solid rgba(26,61,53,0.5)' }}>
        <p className="text-xs tracking-widest uppercase mb-3 font-manrope text-white">Aerial Delivery Systems</p>
        <p className="text-white/30 text-sm max-w-lg leading-relaxed mb-12">
          UAV systems for direct delivery — suburban neighborhoods, campuses, and short flight corridors where ground routing falls short.
        </p>
        {/* Top: hero wide + tall right */}
        <div className="grid grid-cols-3 gap-2" style={{ gridTemplateRows: 'repeat(2, clamp(180px, 22vw, 300px))' }}>
          {/* Hero — 2 cols × 2 rows */}
          <div className="col-span-2 row-span-2 overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/drones_hero.webp"
              alt="Autonomous delivery drone in flight over urban area"
              className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700 ease-in-out"
            />
          </div>
          {/* Top right */}
          <div className="overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/DHL_Drone_Delivery_855666c6-cb8b-4e34-841e-fffe73da729d_1400x.webp"
              alt="Drone making a commercial delivery"
              className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700 ease-in-out"
            />
          </div>
          {/* Bottom right */}
          <div className="overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/Shutter2U___stock.adobe.com.62c8617809a24.avif"
              alt="Delivery drone descending to drop zone"
              className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700 ease-in-out"
            />
          </div>
        </div>
        {/* Bottom: full-width banner */}
        <div className="mt-2 overflow-hidden rounded-lg" style={{ height: 'clamp(140px, 16vw, 220px)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/Fltrex-image3-e1723551928941.jpg"
            alt="Fleet of delivery drones in operation"
            className="w-full h-full object-cover object-center opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700 ease-in-out"
          />
        </div>
      </section>

      {/* ── FORKLIFT BOTS COLLAGE ── */}
      <section id="forklift-bots" className="px-6 md:px-12 lg:px-20 py-20 max-w-[82rem] mx-auto" style={{ borderTop: '1px solid rgba(26,61,53,0.5)' }}>
        <p className="text-xs tracking-widest uppercase mb-3 font-manrope text-white">Warehouse Forklift &amp; Sorting Bots</p>
        <p className="text-white/30 text-sm max-w-lg leading-relaxed mb-12">
          Autonomous forklift and sorting systems for pallet movement, stacking, and high-throughput fulfillment — no driver required.
        </p>
        <div className="grid grid-cols-3 gap-2" style={{ gridTemplateRows: 'repeat(2, clamp(180px, 22vw, 300px))' }}>
          {/* Hero — 2 cols × 2 rows */}
          <div className="col-span-2 row-span-2 overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/Robotic-Sorting-as-a-Service-B3A7940.webp"
              alt="Robotic sorting system operating on warehouse floor"
              className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700 ease-in-out"
            />
          </div>
          {/* Top right */}
          <div className="overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/de41b3ea93135793d5885b95c0005b8e.avif"
              alt="Autonomous forklift bot in operation"
              className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700 ease-in-out"
            />
          </div>
          {/* Bottom right */}
          <div className="overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/f6f77a1616e27fc34eb1a81aa7dc6262.jpg"
              alt="Warehouse autonomous mobile robot"
              className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700 ease-in-out"
            />
          </div>
        </div>
        {/* Bottom: full-width banner */}
        <div className="mt-2 overflow-hidden rounded-lg" style={{ height: 'clamp(140px, 16vw, 220px)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/DELIVERY-AUTOMATION-10-tzjm-jumbo.jpg"
            alt="Automated delivery and fulfillment system at scale"
            className="w-full h-full object-cover object-center opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700 ease-in-out"
          />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 md:px-12 lg:px-20 py-12 max-w-[82rem] mx-auto" style={{ borderTop: '1px solid rgba(26,61,53,0.5)' }}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs" style={{ color: 'rgba(130,185,165,0.4)' }}>
          <div>© {new Date().getFullYear()} Deeptech Robotics. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="/" className="hover:text-white transition-colors" style={{ color: 'rgba(160,200,185,0.55)' }}>Software Dev</a>
            <a href="/creative" className="hover:text-white transition-colors" style={{ color: 'rgba(160,200,185,0.55)' }}>Creative</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

