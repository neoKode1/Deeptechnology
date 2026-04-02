'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import SoftDevHeader from '@/components/SoftDevHeader';
import SoftwareHeroCanvas from '@/components/SoftwareHeroCanvas';

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

/* ── Featured projects ── */
const PROJECTS = [
  {
    title: '12 Monkeys',
    desc: 'Agent orchestration platform with cross-registry discovery via the NANDA Index — enabling teams to build, deploy, and interconnect AI agents across heterogeneous service registries through a unified conversational interface.',
    tags: ['Agents', 'TypeScript', 'NANDA', '2026'],
    link: 'https://github.com/neoKode1/plus12monkeys',
    domain: 'https://plus12monkeys.com',
    img: '/media/Plus 12 monkeys..png',
  },
  {
    title: 'TheNoelleApp',
    desc: 'AI-powered PR generation and MCP server tooling for developers. Paste a GitHub repo URL, describe a change in plain English, and Noelle opens a build-validated, review-ready pull request — no setup, no configuration. Also generates ready-to-use MCP servers from any repo so AI tools talk directly to your code.',
    tags: ['AI', 'MCP', 'GitHub', 'SvelteKit', '2026'],
    link: 'https://github.com/neoKode1/noelle',
    domain: 'https://thenoelle.app',
    img: '/media/theNoelleapp.png',
  },
  {
    title: 'Breach',
    desc: 'AI-first open intelligence platform — maps relationships between facilities, funding, research, equipment, and people. Public REST API, TypeScript & Python SDKs, MCP server with 27 tools, and an agentic AI assistant powered by knowledge-graph traversal. Open-source Palantir for builders.',
    tags: ['Intelligence', 'AI', 'Knowledge Graph', 'MCP', '2026'],
    link: 'https://github.com/neoKode1/breach',
    domain: 'https://94breach.com',
    img: '/media/breach_screenshot.png',
  },
  {
    title: 'EdgeQuanta',
    desc: 'Production-grade edge infrastructure with an integrated quantum compute layer. A unified API routes workloads to real 180-qubit superconducting chips — near-zero cold start, global multi-region failover, full TypeScript type safety.',
    tags: ['Cloudflare', 'Quantum', 'Edge Compute', 'TypeScript', '2025'],
    link: 'https://github.com/neoKode1/EdgeQuanta',
    img: '/media/Edge Quanta.png',
  },
  {
    title: 'Scam Likely',
    desc: 'Real-time check fraud detection and cross-branch intelligence sharing for community banks. Zero-knowledge architecture — only SHA-256 fingerprints stored, never customer PII. Python SDK with local ML models, FastAPI central hub with WebSocket alerts, and a React dashboard for live fraud monitoring. 196 tests passing.',
    tags: ['FinTech', 'Python', 'ML', 'React', 'FastAPI', '2026'],
    link: 'https://github.com/neoKode1/Scam-likely',
    img: '/media/scam-likely.png',
  },
  {
    title: "Director's Chair",
    desc: 'A browser-native cinematic AI studio. Describe a scene and the system generates synchronized images, video, and audio — full production-team capability with no timeline editors, no render queues.',
    tags: ['AI / Studio', 'SvelteKit', '2025'],
    link: 'https://github.com/neoKode1/DirectorchairAi',
    domain: 'https://directorchairai.com',
    img: '/media/DirectorChair.png',
  },
  {
    title: 'NEO',
    desc: 'Nexartis Eco Observability — powered by Nimbus, an autonomous Claude-based agent that lives inside the platform. Nimbus monitors every production system in real time, reads the actual source code when errors surface, and generates line-by-line fixes. It sweeps the entire GitHub org for open vulnerabilities and opens fix PRs in parallel — one click remediates the whole org. Issues auto-create Linear tickets pre-filled with AI diagnosis, severity, and a suggested patch.',
    tags: ['Observability', 'AI Agent', 'Security', 'Claude', '2025'],
    link: 'https://github.com/Nexartis/neo-observability',
    domain: 'https://www.28neo.com',
    img: '/media/Neo_nimbus.png',
  },
];

export default function SoftwareDivisionPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-white text-[#4d4d4d] transition-opacity duration-1000 ease-out"
      style={{ opacity: ready ? 1 : 0 }}
    >
      <SoftDevHeader />

      {/* ── HERO — Unicorn background slot ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '60vh' }}>
        <div id="software-hero-bg" className="absolute inset-0 z-0">
          <SoftwareHeroCanvas className="w-full h-full" />
        </div>

        {/* Text overlay */}
        <div
          className="relative z-10 flex flex-col justify-end px-6 md:px-12 lg:px-20 pt-32 pb-16"
          style={{ maxWidth: '82rem', margin: '0 auto', minHeight: '60vh' }}
        >
          <h1
            className="font-manrope font-semibold tracking-tighter text-[#111] leading-[0.92]"
            style={{ fontSize: 'clamp(3.5rem, 12vw, 10rem)' }}
          >
            Software
          </h1>
          <p className="mt-6 text-lg md:text-xl text-[#555] max-w-2xl leading-relaxed">
            Production systems enhanced with AI integrations — from legacy retooling to autonomous end-to-end orchestration. Elegant, robust, and radically simple.
          </p>
        </div>
      </section>

      {/* ── WORKS ── */}
      <section id="work" className="bg-[#e5e5e5] px-6 md:px-12 lg:px-20 py-20">
        <div className="max-w-[82rem] mx-auto">
          <SectionDivider label="Works" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {PROJECTS.map((proj) => (
              <div
                key={proj.title}
                className="flex flex-col border border-[#e5e5e5] bg-white rounded-lg group overflow-hidden hover:border-[#ccc] hover:shadow-lg transition-all duration-300"
              >
                {/* Image area — links to deployed domain if available, otherwise GitHub */}
                <a
                  href={proj.domain || proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block w-full h-52 overflow-hidden shrink-0 cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proj.img}
                    alt={proj.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                  {proj.domain && (
                    <span className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Visit site ↗
                    </span>
                  )}
                </a>
                {/* Details area — shows info, links to GitHub */}
                <div className="p-5 flex flex-col gap-3">
                  <h3 className="font-manrope text-lg font-semibold text-[#111] tracking-tight">{proj.title}</h3>
                  <p className="text-sm text-[#555] leading-relaxed">{proj.desc}</p>
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <div className="flex flex-wrap gap-2">
                      {proj.tags.map((t) => (
                        <span key={t} className="sd-pill">{t}</span>
                      ))}
                    </div>
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#999] hover:text-[#111] transition-colors shrink-0"
                    >
                      GitHub <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LLM CAROUSEL ── */}
      <section className="bg-[#fafafa] border-t border-b border-[#e5e5e5] py-16 md:py-20 overflow-hidden">
        <p className="text-center text-xs uppercase tracking-[0.25em] text-[#999] font-manrope mb-8">
          Models &amp; Platforms We Integrate
        </p>
        <div style={{ display: 'flex', width: 'max-content', animation: 'marquee-scroll 30s linear infinite' }}>
          {[
            'Claude', 'GPT-4o', 'Gemini', 'Llama 3', 'Mistral', 'Grok',
            'DeepSeek', 'Phi-4', 'Command R+', 'Qwen', 'Stable Diffusion', 'DALL·E',
            'Claude', 'GPT-4o', 'Gemini', 'Llama 3', 'Mistral', 'Grok',
            'DeepSeek', 'Phi-4', 'Command R+', 'Qwen', 'Stable Diffusion', 'DALL·E',
          ].map((model, i) => (
            <span
              key={i}
              className="font-manrope font-medium text-[2.5rem] sm:text-[4rem] md:text-[6rem] uppercase tracking-tighter text-[#111]/15 whitespace-nowrap px-4 sm:px-8"
            >
              {model}
            </span>
          ))}
        </div>
      </section>



      {/* ── FOOTER ── */}
      <footer className="bg-[#0a0a0a] text-white pt-16 sm:pt-24 pb-8 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-[82rem] mx-auto flex flex-col">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-10 sm:gap-16 mb-16 sm:mb-24">
            <div className="flex flex-col gap-6 sm:gap-8 max-w-lg">
              <h2 className="font-manrope text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] font-medium tracking-tight leading-snug">
                Ready to modernize your stack?
              </h2>
              <a
                href="mailto:1deeptechnology@gmail.com"
                className="inline-flex items-center gap-2 border border-white text-white rounded-full py-2.5 px-4 sm:px-6 hover:bg-white hover:text-[#111] transition-colors w-max group text-xs sm:text-sm"
              >
                <span className="truncate">1deeptechnology@gmail.com</span>
                <ArrowUpRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:gap-12 lg:gap-24">
              <div className="flex flex-col gap-6">
                <h4 className="font-manrope text-lg font-medium">Navigate</h4>
                <div className="flex flex-col gap-3 text-sm text-[#999]">
                  <Link href="/" className="hover:text-white transition-colors">Home</Link>
                  <Link href="/#about" className="hover:text-white transition-colors">About</Link>
                  <Link href="/#services" className="hover:text-white transition-colors">Services</Link>
                  <Link href="/software#work" className="hover:text-white transition-colors">Work</Link>
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

          </div>
        </div>
      </footer>
    </div>
  );
}