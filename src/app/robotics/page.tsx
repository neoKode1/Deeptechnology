'use client';

import { useState } from 'react';
import SoftDevHeader from '@/components/SoftDevHeader';
import ParallaxRobot from '@/components/ParallaxRobot';
import RoiCalculator from '@/components/RoiCalculator';
import RobotInquiryModal, { type RobotInfo } from '@/components/RobotInquiryModal';
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
  const [selectedRobot, setSelectedRobot] = useState<RobotInfo | null>(null);
  const openModal = (info: RobotInfo) => setSelectedRobot(info);
  const closeModal = () => setSelectedRobot(null);

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
        <p className="text-xs tracking-widest uppercase mb-3 font-manrope text-neutral-400">In the Field</p>
        <p className="text-neutral-500 text-sm max-w-lg leading-relaxed mb-12">
          Sidewalk bots, road hybrids, and autonomous delivery vehicles — operating across urban corridors, bike lanes, and last-mile routes.
        </p>
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:grid-rows-2 gap-2" style={{ minHeight: 'clamp(320px, 55vw, 680px)' }}>
              <div className="sm:row-span-2 overflow-hidden rounded-lg robo-img-wrap" style={{ minHeight: '200px', cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Serve Robotics', name: 'Gen-3 Delivery Robot', price: 'From $25,645 / unit', systemCategory: 'SADRs (Sidewalk Delivery Robots)', image: '/media/Serve-Gen-2-left-and-Gen-3-robots.jpg' })}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/Serve-Gen-2-left-and-Gen-3-robots.jpg" alt="Sidewalk delivery robots — two generations side by side" className="robo-img" style={{ objectPosition: 'center' }} />
                <div className="robo-overlay">
                  <p className="robo-overlay-vendor">Serve Robotics</p>
                  <p className="robo-overlay-name">Gen-3 Delivery Robot</p>
                  <p className="robo-overlay-price">From $25,645 / unit · 3-unit fleet $76,935</p>
                  <button className="robo-overlay-cta">Get Quote</button>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Kiwibot', name: 'S3 Sidewalk Delivery Robot', price: 'From $897 / mo lease', systemCategory: 'SADRs (Sidewalk Delivery Robots)', image: '/media/image.webp' })}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/image.webp" alt="Autonomous delivery robot on urban route" className="robo-img" style={{ objectPosition: 'center' }} />
                <div className="robo-overlay">
                  <p className="robo-overlay-vendor">Kiwibot</p>
                  <p className="robo-overlay-name">S3 Sidewalk Delivery Robot</p>
                  <p className="robo-overlay-price">From $897 / mo lease</p>
                  <button className="robo-overlay-cta">Get Quote</button>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Wing (Google)', name: 'Aerial Delivery UAV', price: 'Contact for Pricing', systemCategory: 'UAVs (Aerial Drones)', image: '/media/file-20180202-162066-1cj3sym.avif' })}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/file-20180202-162066-1cj3sym.avif" alt="Aerial delivery drone in flight" className="robo-img" style={{ objectPosition: 'center' }} />
                <div className="robo-overlay">
                  <p className="robo-overlay-vendor">Wing (Google)</p>
                  <p className="robo-overlay-name">Aerial Delivery UAV</p>
                  <p className="robo-overlay-price">Suburban &amp; Campus · Contact for Pricing</p>
                  <button className="robo-overlay-cta">Get Quote</button>
                </div>
              </div>
              <div className="sm:col-span-2 overflow-hidden rounded-lg robo-img-wrap" style={{ minHeight: '160px', cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Segway Robotics', name: 'E1 Outdoor Delivery Robot', price: 'From $11,385 / unit', systemCategory: 'RADRs (Road/Sidewalk Hybrids)', image: '/media/DoorDash_Dot-04__1__1__1_.png' })}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/DoorDash_Dot-04__1__1__1_.png" alt="Road-capable autonomous delivery bot" className="robo-img" style={{ objectPosition: 'center' }} />
                <div className="robo-overlay">
                  <p className="robo-overlay-vendor">Segway Robotics</p>
                  <p className="robo-overlay-name">E1 Outdoor Delivery Robot</p>
                  <p className="robo-overlay-price">From $11,385 / unit · 2-unit fleet $22,770</p>
                  <button className="robo-overlay-cta">Get Quote</button>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ height: 'clamp(180px, 22vw, 300px)', cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Starship Technologies', name: 'Delivery Robot — Quad Platform', price: 'From $2,000 / mo · Fleet RaaS', systemCategory: 'SADRs (Sidewalk Delivery Robots)', image: '/media/del-bot-quad.webp' })}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/del-bot-quad.webp" alt="Autonomous delivery robot — quad platform" className="robo-img" style={{ objectPosition: 'center' }} />
              <div className="robo-overlay">
                <p className="robo-overlay-vendor">Starship Technologies</p>
                <p className="robo-overlay-name">Delivery Robot — Quad Platform</p>
                <p className="robo-overlay-price">From $2,000 / mo · Fleet RaaS</p>
                <button className="robo-overlay-cta">Get Quote</button>
              </div>
            </div>
        </div>
      </section>

      {/* ── ROI CALCULATOR ── */}
      <section id="roi-calculator" className="px-4 sm:px-6 md:px-12 lg:px-20 py-14 sm:py-20 max-w-[82rem] mx-auto border-t border-neutral-200">
        <p className="text-[10px] sm:text-xs tracking-widest uppercase mb-3 font-manrope text-neutral-400">Model Your Deployment</p>
        <p className="text-neutral-500 text-sm max-w-lg leading-relaxed mb-10">
          Use the calculator below to estimate monthly profit from skid commission earnings against your fleet lease or purchase cost — before you ever talk to us.
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
          <div className="md:col-span-2 md:row-span-2 overflow-hidden rounded-lg robo-img-wrap" style={{ minHeight: '240px', cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Unitree Robotics', name: 'G1 EDU Standard Humanoid', price: 'From $13,500', systemCategory: 'Humanoid / Service Robots', image: '/media/df9f333424ff6cc6164ce421b019fb94_a6f832b0-479e-4294-ac75-6516208b91f4_1296x.webp' })}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/df9f333424ff6cc6164ce421b019fb94_a6f832b0-479e-4294-ac75-6516208b91f4_1296x.webp"
              alt="Humanoid robot in operational environment"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Unitree Robotics</p>
              <p className="robo-overlay-name">G1 EDU Standard Humanoid</p>
              <p className="robo-overlay-price">From $13,500</p>
              <button className="robo-overlay-cta">Get Quote</button>
            </div>
          </div>
          {/* Top right */}
          <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ cursor: 'pointer' }} onClick={() => openModal({ vendor: '1X Technologies', name: 'NEO Humanoid Robot', price: 'From $23,000 · Early Access', systemCategory: 'Humanoid / Service Robots', image: '/media/1_deeaa3cc-08f5-454f-bfcb-1a477b30adb4_900x.webp' })}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/1_deeaa3cc-08f5-454f-bfcb-1a477b30adb4_900x.webp"
              alt="Humanoid robot navigating indoor space"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">1X Technologies</p>
              <p className="robo-overlay-name">NEO Humanoid Robot</p>
              <p className="robo-overlay-price">From $23,000 · Early Access</p>
              <button className="robo-overlay-cta">Get Quote</button>
            </div>
          </div>
          {/* Bottom right */}
          <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Unitree Robotics', name: 'G1 EDU Standard Humanoid', price: 'From $13,500', systemCategory: 'Humanoid / Service Robots', image: '/media/2_3769ceea-b323-4ebc-a1f4-e27a9624706b_900x.jpg' })}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/2_3769ceea-b323-4ebc-a1f4-e27a9624706b_900x.jpg"
              alt="Unitree G1 humanoid robot"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Unitree Robotics</p>
              <p className="robo-overlay-name">G1 EDU Standard Humanoid</p>
              <p className="robo-overlay-price">From $13,500</p>
              <button className="robo-overlay-cta">Get Quote</button>
            </div>
          </div>
        </div>
        {/* Row 2: 3 equal-width images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2" style={{ minHeight: 'clamp(160px, 18vw, 240px)' }}>
          <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Unitree Robotics', name: 'H2 — Advanced Humanoid', price: 'From $29,900', systemCategory: 'Humanoid / Service Robots', image: '/media/3_d9687814-d553-451b-9429-c224a20f3b3a_900x.webp' })}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/3_d9687814-d553-451b-9429-c224a20f3b3a_900x.webp"
              alt="Unitree H2 humanoid robot"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Unitree Robotics</p>
              <p className="robo-overlay-name">H2 — Advanced Humanoid</p>
              <p className="robo-overlay-price">From $29,900</p>
              <button className="robo-overlay-cta">Get Quote</button>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Unitree Robotics', name: 'R1 — Entry Humanoid', price: 'From $4,900 · Pre-sale', systemCategory: 'Humanoid / Service Robots', image: '/media/5_eb271a12-e794-439d-ade5-d60ec009e81a_900x.webp' })}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/5_eb271a12-e794-439d-ade5-d60ec009e81a_900x.webp"
              alt="Unitree R1 humanoid robot"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Unitree Robotics</p>
              <p className="robo-overlay-name">R1 — Entry Humanoid</p>
              <p className="robo-overlay-price">From $4,900 · Pre-sale</p>
              <button className="robo-overlay-cta">Get Quote</button>
            </div>
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
          <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Fauna Robotics · Amazon', name: 'Sprout Creator Edition', price: 'Contact for Pricing', systemCategory: 'Humanoid / Service Robots', image: '/media/fauna_sprout_3.webp' })}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/fauna_sprout_3.webp"
              alt="Fauna Robotics Sprout — consumer humanoid, an Amazon company"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Fauna Robotics · Amazon</p>
              <p className="robo-overlay-name">Sprout Creator Edition</p>
              <p className="robo-overlay-price">Consumer Humanoid · Contact for Pricing</p>
              <button className="robo-overlay-cta">Get Quote</button>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Agility Robotics', name: 'Digit — Warehouse Humanoid', price: 'Enterprise Pricing · RaaS Available', systemCategory: 'Humanoid / Service Robots', image: '/media/amazon1.jpg' })}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/amazon1.jpg"
              alt="Agility Robotics Digit — Amazon warehouse humanoid"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Agility Robotics</p>
              <p className="robo-overlay-name">Digit — Warehouse Humanoid</p>
              <p className="robo-overlay-price">Enterprise Pricing · RaaS Available</p>
              <button className="robo-overlay-cta">Get Quote</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRENDING ROBOTS ── */}
      <section id="trending" className="px-4 sm:px-6 md:px-12 lg:px-20 py-14 sm:py-20 max-w-[82rem] mx-auto border-t border-neutral-200">
        <p className="text-xs tracking-widest uppercase mb-3 font-manrope text-neutral-400">Trending · Most Requested</p>
        <p className="text-neutral-500 text-sm max-w-lg leading-relaxed mb-12">
          The most-searched platforms in enterprise robotics right now — from Tesla&apos;s Optimus to Boston Dynamics&apos; full commercial lineup.
        </p>
        {/* Row 1: Optimus hero (col-span-2) + Figure 02 + Digit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2" style={{ gridTemplateRows: 'auto' }}>
          {/* Tesla Optimus — hero */}
          <div className="md:col-span-2 md:row-span-2 overflow-hidden rounded-lg robo-img-wrap" style={{ minHeight: '240px', cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Tesla', name: 'Optimus Gen 2', price: 'Target $20K–$30K · Early Access est. 2026', systemCategory: 'Humanoid / Service Robots', image: '/media/tesla-optimus-auAwknG6.png' })}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/tesla-optimus-auAwknG6.png"
              alt="Tesla Optimus Gen 2 humanoid robot"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Tesla</p>
              <p className="robo-overlay-name">Optimus Gen 2</p>
              <p className="robo-overlay-price">Target $20K–$30K · Early Access est. 2026</p>
              <button className="robo-overlay-cta">Get Quote</button>
            </div>
          </div>
          {/* Figure 02 */}
          <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ minHeight: '160px', cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Figure AI', name: 'Figure 02', price: '~$130,000 est. · Enterprise', systemCategory: 'Humanoid / Service Robots', image: '/media/Figure%2002.jpg' })}>
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
              <button className="robo-overlay-cta">Get Quote</button>
            </div>
          </div>
          {/* Agility Digit */}
          <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ minHeight: '160px', cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Agility Robotics', name: 'Digit', price: 'Enterprise Pricing · RaaS Available', systemCategory: 'Humanoid / Service Robots', image: '/media/Agility%20Robotics%20Digit.jpg' })}>
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
              <button className="robo-overlay-cta">Get Quote</button>
            </div>
          </div>
        </div>
        {/* Row 2: Boston Dynamics trio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2" style={{ minHeight: 'clamp(200px, 24vw, 340px)' }}>
          {/* Spot */}
          <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Boston Dynamics', name: 'Spot — Quadruped', price: 'From $74,500 · Full kit to $195K', systemCategory: 'Humanoid / Service Robots', image: '/media/Boston%20Dynamics%20Spot.jpg' })}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/Boston%20Dynamics%20Spot.jpg"
              alt="Boston Dynamics Spot quadruped robot"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Boston Dynamics</p>
              <p className="robo-overlay-name">Spot — Quadruped</p>
              <p className="robo-overlay-price">From $74,500 · Full kit to $195K</p>
              <button className="robo-overlay-cta">Get Quote</button>
            </div>
          </div>
          {/* Atlas HD */}
          <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Boston Dynamics', name: 'Atlas HD — Humanoid', price: 'Enterprise Pricing · Contact for Quote', systemCategory: 'Humanoid / Service Robots', image: '/media/atlas2-Pre-Launch-Thumbnail.webp' })}>
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
              <button className="robo-overlay-cta">Get Quote</button>
            </div>
          </div>
          {/* Stretch */}
          <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Boston Dynamics', name: 'Stretch — Warehouse Unloader', price: 'Enterprise Pricing · Contact for Quote', systemCategory: 'Forklift / Sorting Bots', image: '/media/Boston%20Dynamics%20Stretch.jpg' })}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/Boston%20Dynamics%20Stretch.jpg"
              alt="Boston Dynamics Stretch warehouse unloading robot"
              className="robo-img"
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Boston Dynamics</p>
              <p className="robo-overlay-name">Stretch — Warehouse Unloader</p>
              <p className="robo-overlay-price">Enterprise Pricing · Contact for Quote</p>
              <button className="robo-overlay-cta">Get Quote</button>
            </div>
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
          <div className="md:col-span-2 md:row-span-2 overflow-hidden rounded-lg robo-img-wrap" style={{ minHeight: '240px', cursor: 'pointer' }} onClick={() => openModal({ vendor: 'DJI Enterprise', name: 'Matrice 400 — Full Inspection Kit', price: 'From $12,017', systemCategory: 'UAVs (Aerial Drones)', image: '/media/drones_hero.webp' })}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/drones_hero.webp"
              alt="Autonomous delivery drone in flight over urban area"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">DJI Enterprise</p>
              <p className="robo-overlay-name">Matrice 400 — Full Inspection Kit</p>
              <p className="robo-overlay-price">From $12,017 · Zenmuse H30T payload available</p>
              <button className="robo-overlay-cta">Get Quote</button>
            </div>
          </div>
          {/* Top right */}
          <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ minHeight: '160px', cursor: 'pointer' }} onClick={() => openModal({ vendor: 'DJI Enterprise', name: 'Mavic 3E Thermal Edition', price: 'From $5,185', systemCategory: 'UAVs (Aerial Drones)', image: '/media/DHL_Drone_Delivery_855666c6-cb8b-4e34-841e-fffe73da729d_1400x.webp' })}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/DHL_Drone_Delivery_855666c6-cb8b-4e34-841e-fffe73da729d_1400x.webp"
              alt="Drone making a commercial delivery"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">DJI Enterprise</p>
              <p className="robo-overlay-name">Mavic 3E Thermal Edition</p>
              <p className="robo-overlay-price">From $5,185</p>
              <button className="robo-overlay-cta">Get Quote</button>
            </div>
          </div>
          {/* Bottom right */}
          <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ minHeight: '160px', cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Skydio', name: 'X10 Enterprise · 2-Unit Kit', price: 'From $19,895 / unit · Kit $39,790', systemCategory: 'UAVs (Aerial Drones)', image: '/media/Shutter2U___stock.adobe.com.62c8617809a24.avif' })}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/Shutter2U___stock.adobe.com.62c8617809a24.avif"
              alt="Delivery drone descending to drop zone"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Skydio</p>
              <p className="robo-overlay-name">X10 Enterprise · 2-Unit Kit</p>
              <p className="robo-overlay-price">From $19,895 / unit · Kit $39,790</p>
              <button className="robo-overlay-cta">Get Quote</button>
            </div>
          </div>
        </div>
        {/* Bottom: full-width banner */}
        <div className="mt-2 overflow-hidden rounded-lg robo-img-wrap" style={{ height: 'clamp(140px, 16vw, 220px)', cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Fltrex', name: 'Urban Delivery Fleet', price: 'Contact for Pricing', systemCategory: 'UAVs (Aerial Drones)', image: '/media/Fltrex-image3-e1723551928941.jpg' })}>
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
            <button className="robo-overlay-cta">Get Quote</button>
          </div>
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
          <div className="md:col-span-2 md:row-span-2 overflow-hidden rounded-lg robo-img-wrap" style={{ minHeight: '240px', cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Berkshire Grey', name: 'Robotic Sortation System', price: 'Enterprise Pricing · RaaS Available', systemCategory: 'Forklift / Sorting Bots', image: '/media/Robotic-Sorting-as-a-Service-B3A7940.webp' })}>
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
              <button className="robo-overlay-cta">Get Quote</button>
            </div>
          </div>
          {/* Top right */}
          <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ minHeight: '160px', cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Seegrid', name: 'Palion Lift — Autonomous Forklift', price: 'From $85,000 · Enterprise Fleet', systemCategory: 'Forklift / Sorting Bots', image: '/media/de41b3ea93135793d5885b95c0005b8e.avif' })}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/de41b3ea93135793d5885b95c0005b8e.avif"
              alt="Autonomous forklift bot in operation"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Seegrid</p>
              <p className="robo-overlay-name">Palion Lift — Autonomous Forklift</p>
              <p className="robo-overlay-price">From $85,000 · Enterprise Fleet</p>
              <button className="robo-overlay-cta">Get Quote</button>
            </div>
          </div>
          {/* Bottom right */}
          <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ minHeight: '160px', cursor: 'pointer' }} onClick={() => openModal({ vendor: 'MiR Robotics', name: 'MiR600 Pallet AMR', price: 'From $45,000 · Fleet Pricing Available', systemCategory: 'Forklift / Sorting Bots', image: '/media/f6f77a1616e27fc34eb1a81aa7dc6262.jpg' })}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/f6f77a1616e27fc34eb1a81aa7dc6262.jpg"
              alt="Warehouse autonomous mobile robot"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">MiR Robotics</p>
              <p className="robo-overlay-name">MiR600 Pallet AMR</p>
              <p className="robo-overlay-price">From $45,000 · Fleet Pricing Available</p>
              <button className="robo-overlay-cta">Get Quote</button>
            </div>
          </div>
        </div>
        {/* Bottom: full-width banner */}
        <div className="mt-2 overflow-hidden rounded-lg robo-img-wrap" style={{ height: 'clamp(140px, 16vw, 220px)', cursor: 'pointer' }} onClick={() => openModal({ vendor: '6 River Systems', name: 'Chuck AMR — Fulfillment at Scale', price: 'Enterprise Pricing · Contact for Quote', systemCategory: 'Forklift / Sorting Bots', image: '/media/DELIVERY-AUTOMATION-10-tzjm-jumbo.jpg' })}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/DELIVERY-AUTOMATION-10-tzjm-jumbo.jpg"
            alt="Automated delivery and fulfillment system at scale"
            className="robo-img"
            style={{ objectPosition: 'center' }}
          />
          <div className="robo-overlay">
            <p className="robo-overlay-vendor">6 River Systems</p>
            <p className="robo-overlay-name">Chuck AMR — Fulfillment at Scale</p>
            <p className="robo-overlay-price">Enterprise Pricing · Contact for Quote</p>
            <button className="robo-overlay-cta">Get Quote</button>
          </div>
        </div>
        {/* Row 3: 2 new warehouse images */}
        <div className="grid grid-cols-2 gap-2 mt-2" style={{ height: 'clamp(180px, 22vw, 300px)' }}>
          <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ cursor: 'pointer' }} onClick={() => openModal({ vendor: 'Locus Robotics', name: 'LocusBot — Warehouse AMR', price: 'From $1,200 / mo · RaaS Available', systemCategory: 'Forklift / Sorting Bots', image: '/media/warehouse.jpeg' })}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/warehouse.jpeg"
              alt="Warehouse robot in distribution environment"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">Locus Robotics</p>
              <p className="robo-overlay-name">LocusBot — Warehouse AMR</p>
              <p className="robo-overlay-price">From $1,200 / mo · RaaS Available</p>
              <button className="robo-overlay-cta">Get Quote</button>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg robo-img-wrap" style={{ cursor: 'pointer' }} onClick={() => openModal({ vendor: 'OTTO Motors', name: 'OTTO 1500 — Heavy Payload AMR', price: 'From $120,000 · Fleet Pricing Available', systemCategory: 'Forklift / Sorting Bots', image: '/media/warehouse2.webp' })}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/warehouse2.webp"
              alt="Autonomous warehouse robot system"
              className="robo-img"
              style={{ objectPosition: 'center' }}
            />
            <div className="robo-overlay">
              <p className="robo-overlay-vendor">OTTO Motors</p>
              <p className="robo-overlay-name">OTTO 1500 — Heavy Payload AMR</p>
              <p className="robo-overlay-price">From $120,000 · Fleet Pricing Available</p>
              <button className="robo-overlay-cta">Get Quote</button>
            </div>
          </div>
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
        <p className="text-[10px] tracking-widest uppercase font-manrope text-neutral-400 mb-6">Platforms We Source &amp; Deploy</p>
        <div className="flex flex-wrap gap-x-8 gap-y-4 items-center mb-16">
          {['Unitree Robotics', 'Boston Dynamics', 'Agility Robotics', 'Figure AI', 'Serve Robotics', 'Kiwibot', 'DJI Enterprise', 'Skydio'].map((name) => (
            <span key={name} className="text-sm font-semibold text-neutral-300 tracking-tight font-manrope">{name}</span>
          ))}
        </div>

        {/* Case study + quote grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Case study card */}
          <div className="rounded-2xl border border-neutral-200 bg-white/60 backdrop-blur-sm p-7">
            <p className="text-[10px] tracking-widest uppercase text-neutral-400 font-manrope mb-4">Case Study · Q1 2026 Pilot</p>
            <h3 className="font-manrope font-semibold text-xl text-neutral-900 mb-2 leading-snug">
              Sidewalk delivery fleet deployed in 18 days
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6">
              A food-and-grocery chain needed last-mile coverage across a 0.4 mi campus loop. We assessed the terrain, sourced three Kiwibot Leap units, configured routes, and had the fleet live inside 18 days — including POS integration.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                ['18 days', 'Deployment time'],
                ['3 robots', 'Fleet size'],
                ['$2,697/mo', 'All-in fleet cost'],
              ].map(([stat, label]) => (
                <div key={label}>
                  <p className="text-lg font-bold text-neutral-900 font-manrope">{stat}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-neutral-300 italic">Pilot customer · Confidential · Food &amp; Grocery, US</p>
          </div>

          {/* Quote card */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-900 p-7 flex flex-col justify-between">
            <div>
              <p className="text-[10px] tracking-widest uppercase text-neutral-500 font-manrope mb-6">What Clients Say</p>
              <blockquote className="text-white text-lg font-manrope font-light leading-relaxed mb-6">
                &ldquo;We evaluated four vendors ourselves and couldn&rsquo;t get a straight answer on pricing or lead time from any of them. Deep Tech had three units spec&rsquo;d and quoted within 48 hours. That alone was worth it.&rdquo;
              </blockquote>
            </div>
            <div>
              <p className="text-sm text-white font-semibold font-manrope">Operations Director</p>
              <p className="text-xs text-neutral-400 mt-0.5">Logistics &amp; Fulfillment, Southwest US · 2026</p>
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
            <a href="/" className="text-neutral-500 hover:text-neutral-900 transition-colors font-manrope">Software Dev</a>
          </div>
        </div>
        <div className="border-t border-neutral-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
          <div>© {new Date().getFullYear()} Deeptech Robotics. All rights reserved.</div>
          <a href="mailto:info@deeptechnologies.dev" className="hover:text-neutral-900 transition-colors">info@deeptechnologies.dev</a>
        </div>
      </footer>
      </div>{/* end content wrapper */}

      {/* ── Robot Inquiry Modal ── */}
      <RobotInquiryModal robot={selectedRobot} onClose={closeModal} />
    </div>
  );
}

