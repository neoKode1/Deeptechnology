import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import SoftDevHeader from '@/components/SoftDevHeader';

/* ─────────────────────────────────────────────
   Marquee label pill (scrolling inside a pill)
───────────────────────────────────────────── */
function MarqueePill({ label, speed = '5s' }: { label: string; speed?: string }) {
  return (
    <div
      className="border border-[#ccc] rounded-full px-4 py-1.5 overflow-hidden"
      style={{ width: `${label.length * 0.62 + 2}rem` }}
    >
      <div
        className="flex"
        style={{ width: '200%', animation: `marquee-scroll ${speed} linear infinite` }}
      >
        <span className="text-xs uppercase tracking-wider font-medium text-[#111] shrink-0 w-full text-center">
          {label}
        </span>
        <span className="text-xs uppercase tracking-wider font-medium text-[#111] shrink-0 w-full text-center">
          {label}
        </span>
      </div>
    </div>
  );
}

function SectionDivider({ label, speed }: { label: string; speed?: string }) {
  return (
    <div className="flex items-center gap-4 mb-14">
      <MarqueePill label={label} speed={speed} />
      <div className="h-[1px] bg-[#ccc] flex-grow" />
    </div>
  );
}

/* ── Tech marquee items ── */
const TECH_TAGS = [
  'TypeScript', 'React', 'Next.js', 'SvelteKit', 'Python', 'AI / ML',
  'Cloudflare Workers', 'Ollama', 'Anthropic SDK', 'Node.js',
  'Tailwind CSS', 'REST APIs', 'Quantum Computing', 'Edge Compute',
  'TypeScript', 'React', 'Next.js', 'SvelteKit', 'Python', 'AI / ML',
  'Cloudflare Workers', 'Ollama', 'Anthropic SDK', 'Node.js',
  'Tailwind CSS', 'REST APIs', 'Quantum Computing', 'Edge Compute',
];

/* ── Services ── */
const SERVICES = [
  {
    num: '01.',
    title: 'Full-Stack Development',
    tags: ['React', 'SvelteKit', 'Node.js', 'Cloudflare'],
    desc: 'End-to-end web application development from database design through to polished, performant front-end interfaces — built with modern TypeScript and cloud-native architecture deployed on Cloudflare Workers.',
  },
  {
    num: '02.',
    title: 'AI Product Engineering',
    tags: ['LLMs', 'Anthropic', 'Ollama', 'Agents'],
    desc: 'Building production AI systems — local agent brains with memory and vision, multi-agent orchestration platforms, voice synthesis studios, and LLM-powered content pipelines.',
  },
  {
    num: '03.',
    title: 'Creative Tech & Media',
    tags: ['Film AI', 'Video Gen', 'Audio'],
    desc: 'Bridging software and storytelling — AI-powered film studios, beat machines with 16-pad interfaces, music video platforms, and cinematic scene generators.',
  },
  {
    num: '04.',
    title: 'Deep Infrastructure',
    tags: ['Quantum', 'Edge Compute', 'APIs'],
    desc: 'Designing the infrastructure layer for cutting-edge compute — from quantum-as-a-service APIs connecting researchers to real superconducting hardware, to high-performance edge-deployed services.',
  },
];

/* ── Featured projects ── */
const PROJECTS = [
  {
    title: 'EdgeQuanta',
    desc: 'Edge-native infrastructure stack combining high-performance Cloudflare Workers APIs with a quantum compute layer — single API for job submission to real 180-qubit chips, near-zero cold start, and seamless multi-region failover.',
    tags: ['Cloudflare', 'Quantum', 'Edge Compute', 'TypeScript', '2025'],
    link: 'https://github.com/neoKode1/EdgeQuanta',
    img: '/media/Edge Quanta.png',
  },
  {
    title: 'Breach',
    desc: 'Coming soon.',
    tags: ['In Development', '2026'],
    link: 'https://github.com/neoKode1/breach',
    img: '/media/breach_screenshot.png',
  },
  {
    title: '12 Monkeys',
    desc: 'Conversational agent builder platform with cross-registry discovery via the NANDA Index. Build, deploy, and connect AI agents across any service registry through a unified conversational interface.',
    tags: ['Agents', 'TypeScript', 'NANDA', '2026'],
    link: 'https://github.com/neoKode1/plus12monkeys',
    img: '/media/Plus 12 monkeys..png',
  },
  {
    title: "Director's Chair",
    desc: 'Cinematic AI studio where creators describe a scene in plain English and watch it come to life as images, videos, and audio. Full production-team power in a browser — no timelines, no rendering queues.',
    tags: ['AI / Studio', 'SvelteKit', '2025'],
    link: 'https://github.com/neoKode1/DirectorchairAi',
    img: '/media/DirectorChair.png',
  },
  {
    title: 'Noelapp',
    desc: 'Coming soon.',
    tags: ['In Development', '2026'],
    link: 'https://github.com/neoKode1/noelle',
    img: '/media/theNoelleapp.png',
  },
];

export default function SoftwareDivisionHome() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#4d4d4d]">
      <SoftDevHeader />

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden px-6 md:px-12 lg:px-20 pt-16 md:pt-24 pb-20"
        style={{ maxWidth: '82rem', margin: '0 auto', minHeight: '92vh' }}
      >
        {/* Spline 3D animation — right-of-center, non-blocking */}
        <div
          className="absolute top-0 pointer-events-none select-none"
          aria-hidden="true"
          style={{
            left: '42%',
            right: '-8%',
            top: 0,
            bottom: 0,
            zIndex: 0,
          }}
        >
          <iframe
            src="https://my.spline.design/animatedshapeblend-1gCFHvLukjcmK6imbIAFLY2d/"
            frameBorder="0"
            width="100%"
            height="100%"
            title="Animated 3D Spline background"
            style={{ border: 'none', display: 'block' }}
          />
        </div>

        {/* Text content — DOM order ensures it paints above the iframe;
            no z-index here so mix-blend-mode composites against the full
            section stacking context (including the iframe behind it). */}
        <div className="relative flex flex-col mb-16">
          {/* Oversized headline — mix-blend-mode: difference
              white text on white bg → renders black;
              white text on black blob → inverts to white */}
          <h1
            className="font-manrope font-semibold leading-none tracking-tighter"
            style={{
              fontSize: 'clamp(5rem, 16vw, 14rem)',
              color: '#fff',
              mixBlendMode: 'difference',
              letterSpacing: '-0.03em',
            }}
          >
            Engineer
          </h1>
          <h1
            className="font-manrope font-semibold leading-none tracking-tighter"
            style={{
              fontSize: 'clamp(5rem, 16vw, 14rem)',
              color: '#fff',
              mixBlendMode: 'difference',
              letterSpacing: '-0.03em',
            }}
          >
            your
          </h1>
          <h1
            className="font-manrope font-semibold leading-none tracking-tighter"
            style={{
              fontSize: 'clamp(5rem, 16vw, 14rem)',
              color: '#fff',
              mixBlendMode: 'difference',
              letterSpacing: '-0.03em',
            }}
          >
            future.
          </h1>
          <p
            className="font-manrope font-light tracking-tighter mt-3"
            style={{
              fontSize: 'clamp(1.75rem, 5vw, 4rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#fff',
              mixBlendMode: 'difference',
              opacity: 0.45,
            }}
          >
            Start building.
          </p>

          {/* Body copy + buttons — normal rendering below the blend-mode headlines */}
          <p className="mt-10 text-lg md:text-xl text-[#333] max-w-xl font-normal leading-relaxed" style={{ position: 'relative', zIndex: 2 }}>
            Deeptech is a technology company spanning software engineering, AI deployment,
            systems integration, robotics, prototyping, and R&amp;D — built for founders and
            organizations who demand infrastructure that performs at every layer.
          </p>
          <div className="mt-8 flex gap-4 flex-wrap" style={{ position: 'relative', zIndex: 2 }}>
            <Link href="/#work" className="sd-btn-primary">
              Explore Our Work <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link href="/#contact" className="sd-btn-outline">
              Work With Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Tech-stack marquee */}
        <div className="w-full overflow-hidden" style={{ position: 'relative', zIndex: 2 }}>
          <div
            className="flex"
            style={{ width: 'max-content', animation: 'marquee-scroll 25s linear infinite' }}
          >
            {TECH_TAGS.map((tag, i) => (
              <span
                key={i}
                className="font-manrope text-[#111]/20 text-[2rem] md:text-[3rem] font-semibold tracking-tight whitespace-nowrap px-6"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="px-6 md:px-12 lg:px-20 py-20 max-w-[82rem] mx-auto">
        <SectionDivider label="Services" />

        <div className="flex flex-col">
          {SERVICES.map((svc, i) => (
            <div
              key={svc.num}
              className={`flex flex-col lg:flex-row lg:items-center gap-6 py-10 group hover:bg-[#fafafa] transition-colors -mx-6 px-6 md:-mx-12 md:px-12 lg:-mx-20 lg:px-20 cursor-pointer ${
                i < SERVICES.length - 1 ? 'border-b border-[#ccc]' : ''
              }`}
            >
              <div className="sd-heading text-[2rem] font-medium w-16 shrink-0">{svc.num}</div>
              <div className="sd-heading text-[2rem] font-medium w-full lg:w-1/3 tracking-tight">
                {svc.title}
              </div>
              <div className="flex-grow flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {svc.tags.map((t) => (
                    <span key={t} className="sd-pill">{t}</span>
                  ))}
                </div>
                <p className="text-[#333] text-base max-w-lg leading-relaxed">{svc.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="px-6 md:px-12 lg:px-20 py-24 max-w-[82rem] mx-auto">
        <SectionDivider label="About" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left — name hero */}
          <div className="lg:col-span-5">
            <h2
              className="leading-none text-[#111] tracking-tight font-semibold"
              style={{ fontSize: 'clamp(3rem, 9vw, 7rem)' }}
            >
              Chad
              <br />
              Neo
            </h2>
            <div className="mt-6 flex flex-col gap-2">
              {['Software Engineer', 'AI Systems Builder', 'Creative Director'].map((role) => (
                <span
                  key={role}
                  className="text-xs uppercase tracking-[0.18em] text-[#999] font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
            <a
              href="https://github.com/neoKode1"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 border border-[#ccc] rounded-full px-5 py-2 text-xs text-[#111] hover:bg-[#111] hover:text-white hover:border-[#111] transition-colors"
            >
              github.com/neoKode1 <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Right — bio */}
          <div className="lg:col-span-7 flex flex-col gap-8 pt-2">
            <p className="text-[1.25rem] md:text-[1.5rem] leading-relaxed text-[#222] tracking-tight">
              I build at the intersection of AI, edge compute, and creative technology — turning ambitious ideas into production systems that ship.
            </p>
            <p className="text-base leading-relaxed text-[#555]">
              From quantum-as-a-service APIs running on real 180-qubit hardware, to multi-agent platforms that coordinate AI across service registries, to cinematic AI studios where a sentence becomes a scene — my work spans the full stack. I write TypeScript and Python, deploy on Cloudflare Workers, and integrate large language models from Anthropic, Ollama, and open-source communities.
            </p>
            <p className="text-base leading-relaxed text-[#555]">
              Outside of software, I direct AI-assisted film and music video productions and consult on robotic deployment strategy for distribution and last-mile delivery — helping companies match the right autonomous system to their environment, from sidewalk bots to warehouse AMRs.
            </p>

            {/* Stat row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#e5e5e5]">
              {[
                { n: '30+', label: 'Public Repos' },
                { n: '3', label: 'Divisions' },
                { n: '∞', label: 'In Production' },
              ].map(({ n, label }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="font-manrope text-[2rem] font-semibold tracking-tight text-[#111]">{n}</span>
                  <span className="text-xs uppercase tracking-widest text-[#999]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS (dark) ── */}
      <section id="work" className="bg-[#0a0a0a] text-white px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-[82rem] mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <div className="border border-[#4d4d4d] rounded-full px-4 py-1.5 overflow-hidden w-24">
              <div style={{ display: 'flex', width: '200%', animation: 'marquee-scroll 5s linear infinite' }}>
                <span className="text-xs uppercase tracking-wider font-medium text-white shrink-0 w-full text-center">Works</span>
                <span className="text-xs uppercase tracking-wider font-medium text-white shrink-0 w-full text-center">Works</span>
              </div>
            </div>
            <div className="h-[1px] bg-[#4d4d4d] flex-grow" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {PROJECTS.map((proj) => (
              <a
                key={proj.title}
                href={proj.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col border border-[#2d2c2c] bg-[#262626] group overflow-hidden hover:border-[#4d4d4d] transition-colors"
              >
                <div className="w-full h-52 overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proj.img}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                </div>
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {proj.tags.map((t) => (
                      <span key={t} className="border border-[#4d4d4d] rounded-full px-3 py-1 text-xs text-[#999]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs text-white/60 group-hover:text-white transition-colors shrink-0">
                    GitHub <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT MARQUEE ── */}
      <section id="contact" className="bg-[#eee] py-16 md:py-20 overflow-hidden">
        <div style={{ display: 'flex', width: 'max-content', animation: 'marquee-scroll 20s linear infinite' }}>
          {['Get in Touch', 'Get in Touch', 'Get in Touch', 'Get in Touch'].map((t, i) => (
            <span
              key={i}
              className="font-manrope font-medium text-[4rem] md:text-[6rem] uppercase tracking-tighter text-[#111] whitespace-nowrap px-8"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0a0a0a] text-white pt-24 pb-8 px-6 md:px-12 lg:px-20">
        <div className="max-w-[82rem] mx-auto flex flex-col">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-24">
            <div className="flex flex-col gap-8 max-w-lg">
              <h2 className="font-manrope text-[2rem] md:text-[2.5rem] font-medium tracking-tight leading-snug">
                Let&apos;s build something great together.
              </h2>
              <a
                href="mailto:1deeptechnology@gmail.com"
                className="inline-flex items-center gap-2 border border-white text-white rounded-full py-2.5 px-6 hover:bg-white hover:text-[#111] transition-colors w-max group text-sm"
              >
                1deeptechnology@gmail.com
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-12 lg:gap-24">
              <div className="flex flex-col gap-6">
                <h4 className="font-manrope text-lg font-medium">Navigate</h4>
                <div className="flex flex-col gap-3 text-sm text-[#999]">
                  <Link href="/" className="hover:text-white transition-colors">Home</Link>
                  <Link href="/#about" className="hover:text-white transition-colors">About</Link>
                  <Link href="/#services" className="hover:text-white transition-colors">Services</Link>
                  <Link href="/#work" className="hover:text-white transition-colors">Work</Link>
                  <Link href="/creative" className="hover:text-white transition-colors">Creative Division</Link>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <h4 className="font-manrope text-lg font-medium">Connect</h4>
                <div className="flex flex-col gap-3 text-sm text-[#999]">
                  <a href="https://x.com/JusChadneo" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter / X</a>
                  <a href="https://www.instagram.com/a_dark_orchestra/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                  <a href="https://linkedin.com/company/deeptech-ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                  <a href="https://github.com/neoKode1" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
                </div>
              </div>
            </div>
          </div>

          {/* Big wordmark */}
          <div className="text-center w-full mt-10 overflow-hidden">
            <span className="font-manrope font-medium text-[15vw] md:text-[10vw] tracking-tighter leading-none block w-full text-center text-white/10">
              Deeptech
            </span>
          </div>

          <div className="h-[1px] w-full bg-[#2d2c2c] my-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-[#999]">
            <div>© {new Date().getFullYear()} Deeptech. All rights reserved.</div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/creative" className="hover:text-white transition-colors">Creative Division</Link>
            </div>
            <a href="#" className="hover:text-white transition-colors">Back to Top ↑</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
