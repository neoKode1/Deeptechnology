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
    domain: 'https://scamlikely.app',
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
            Full<br />Stack
          </h1>
          <p className="mt-6 text-lg md:text-xl text-[#555] max-w-2xl leading-relaxed">
            Production systems enhanced with AI integrations — from legacy retooling to autonomous end-to-end orchestration. Elegant, robust, and radically simple.
          </p>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="bg-white px-6 md:px-12 lg:px-20 py-24 border-b border-[#e5e5e5]">
        <div className="max-w-[82rem] mx-auto">

          {/* Power headline */}
          <div className="flex flex-col md:flex-row md:items-end gap-10 mb-20">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.25em] text-[#999] font-manrope mb-5">What we do</p>
              <h2 className="font-manrope font-semibold text-[#111] tracking-tighter leading-[1.05]" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                Retool for the next generation.<br />Without rebuilding from scratch.
              </h2>
            </div>
            {/* Jensen Huang */}
            <div className="shrink-0 w-56 md:w-64 lg:w-72 rounded-2xl overflow-hidden self-stretch md:self-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/Jensen%20Huang.jpeg"
                alt="Jensen Huang, CEO of NVIDIA"
                className="block w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Capability grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e5e5e5] border border-[#e5e5e5] rounded-xl overflow-hidden">
            {[
              {
                num: '01',
                title: 'Legacy Retooling',
                body: 'Broken dependencies, forced API migrations, outdated frameworks. We audit your existing workflows first — identify what can be optimized in place vs. what needs replacing — and fix the rot without disturbing what works.',
              },
              {
                num: '02',
                title: 'Agentic AI Integration',
                body: 'We design and implement multi-agent orchestration layers — supervisor/subagent patterns, tool-calling loops, structured output validation, and human-in-the-loop gates. Claude Code configured with project-specific CLAUDE.md, MCP servers wired to your codebase, APIs, and databases. Pipelines that route intelligently between models based on task complexity.',
              },
              {
                num: '03',
                title: 'Workflow Automation',
                body: 'Existing manual processes audited, mapped, and automated — webhook-triggered agent chains, cron-scheduled AI jobs, Slack/Discord bots with agentic backends, and AI decision points dropped into n8n, Make, or custom pipelines. We connect the tools you already have rather than replace them.',
              },
              {
                num: '04',
                title: 'Production Hardening',
                body: 'CI/CD pipelines, observability, security audits, and webhook infrastructure. Claude Code slash commands for repetitive dev tasks. Retry logic, fallback chains, and parallel tool-call architecture for latency and reliability under load.',
              },
            ].map(({ num, title, body }) => (
              <div key={num} className="bg-white p-8 flex flex-col gap-4 hover:bg-[#fafafa] transition-colors">
                <span className="text-xs font-mono text-[#bbb]">{num}</span>
                <h3 className="font-manrope text-base font-semibold text-[#111] tracking-tight">{title}</h3>
                <p className="text-sm text-[#666] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          {/* CTA strip */}
          <div className="mt-14 flex justify-end border-t border-[#e5e5e5] pt-10">
            <a
              href="mailto:info@deeptechnologies.dev"
              className="inline-flex items-center gap-2 bg-[#111] text-white rounded-full py-3 px-7 text-sm font-manrope hover:bg-[#333] transition-colors"
            >
              Start a conversation ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── SUNDAR PICHAI IMAGE ── */}
      <div className="px-6 md:px-12 lg:px-20 py-8">
        <div className="max-w-[82rem] mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/Sundar%20Pichai.png"
            alt="Sundar Pichai, CEO of Google"
            className="block w-full rounded-2xl object-cover object-top"
            style={{ maxHeight: '320px' }}
          />
        </div>
      </div>

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

      {/* ── SATYA NADELLA IMAGE ── */}
      <div className="px-6 md:px-12 lg:px-20 py-8">
        <div className="max-w-[82rem] mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/Satya%20Nadella.jpg"
            alt="Satya Nadella, CEO of Microsoft"
            className="block w-full rounded-2xl object-cover object-top"
            style={{ maxHeight: '320px' }}
          />
        </div>
      </div>

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



      {/* ── AGENTIC PRACTICES ── */}
      <section className="bg-white px-6 md:px-12 lg:px-20 py-24 border-b border-[#e5e5e5]">
        <div className="max-w-[82rem] mx-auto">
          <div className="max-w-4xl mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-[#999] font-manrope mb-5">How we build</p>
            <h2 className="font-manrope font-semibold text-[#111] tracking-tighter leading-[1.05]" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              Agentic orchestration<br />is not a buzzword here.
            </h2>
            <p className="mt-6 text-base text-[#666] leading-relaxed max-w-2xl">
              We have built production multi-agent systems, configured Claude Code end-to-end, and designed pipelines that connect heterogeneous AI tools into coherent, reliable workflows. This is the actual practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e5e5e5] border border-[#e5e5e5] rounded-xl overflow-hidden">
            {[
              {
                label: 'Orchestration Layer Design',
                detail: 'Supervisor agents that decompose goals, delegate to specialized subagents, collect structured outputs, and re-plan on failure. Built with Claude\'s tool-use API, extended thinking for complex reasoning, and interrupt points for human confirmation at high-stakes decision gates.',
              },
              {
                label: 'Claude Code Configuration',
                detail: 'Full project setup with CLAUDE.md for persistent context injection, custom slash commands for team-specific workflows, MCP servers so Claude reads your actual codebase and calls your APIs directly, and pre/post-tool hooks for linting, validation, and formatting on every action.',
              },
              {
                label: 'Multi-Tool Pipeline Design',
                detail: 'We connect the right model to the right task — fast/cheap models for triage and routing, reasoning models for decision-making, specialized models for code or vision. Structured JSON schemas enforce clean handoffs between stages. Retry logic and fallback chains handle failure without manual intervention.',
              },
              {
                label: 'Existing Workflow Optimization',
                detail: 'Audit of your current processes to identify where AI reasoning replaces manual steps — not a rebuild, an overlay. We map the decision points, add intelligence where it creates leverage, and measure time-to-value before recommending anything larger.',
              },
              {
                label: 'Workflow Automation',
                detail: 'Webhook-triggered agent chains, cron-scheduled AI jobs (reports, monitoring, digest emails), and AI decision nodes inside your existing n8n, Make, or Zapier flows. GitHub Actions with AI-powered code review. Slack and Discord bots backed by real agent logic — not canned responses.',
              },
              {
                label: 'MCP Server Development',
                detail: 'Custom MCP servers that give AI agents direct, structured access to your databases, internal APIs, file systems, and third-party services. Used in production in 12 Monkeys, Breach, and TheNoelleApp — enabling Claude and other LLMs to operate as true system actors, not just chatbots.',
              },
            ].map(({ label, detail }) => (
              <div key={label} className="bg-white p-8 flex flex-col gap-3 hover:bg-[#fafafa] transition-colors">
                <h3 className="font-manrope text-sm font-semibold text-[#111] tracking-tight">{label}</h3>
                <p className="text-sm text-[#666] leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="px-4 sm:px-6 md:px-12 lg:px-20 py-20 sm:py-28 max-w-[82rem] mx-auto">
        <SectionDivider label="Pricing" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sprint */}
          <div className="border border-[#e5e5e5] rounded-2xl p-8 flex flex-col">
            <p className="text-xs uppercase tracking-widest text-[#999] font-manrope mb-3">Sprint</p>
            <p className="text-3xl font-semibold text-[#111] font-manrope mb-1">From $4,500</p>
            <p className="text-sm text-[#999] font-manrope mb-6">Quick-turn builds · 2–4 weeks</p>
            <ul className="space-y-2 text-sm text-[#555] font-manrope mb-8 flex-1">
              {['Landing page or marketing site', 'API integration or workflow automation', 'LLM-powered feature add-on', 'Claude Code setup + MCP server wiring'].map(f => (
                <li key={f} className="flex items-start gap-2"><span className="text-[#111] mt-0.5">—</span>{f}</li>
              ))}
            </ul>
            <Link href="/contact?inquiry=software-sprint"
              className="inline-flex items-center justify-center border border-[#ccc] rounded-full py-2.5 px-6 text-sm text-[#111] hover:border-[#111] transition-colors font-manrope">
              Get Started →
            </Link>
          </div>

          {/* Build — highlighted */}
          <div className="border border-[#111] rounded-2xl p-8 flex flex-col bg-[#0a0a0a] text-white">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-widest text-white/50 font-manrope">Build</p>
              <span className="text-[10px] uppercase tracking-widest border border-white/20 rounded-full px-2.5 py-1 text-white/60 font-manrope">Popular</span>
            </div>
            <p className="text-3xl font-semibold text-white font-manrope mb-1">From $12,000</p>
            <p className="text-sm text-white/40 font-manrope mb-6">Production-grade apps · 4–10 weeks</p>
            <ul className="space-y-2 text-sm text-white/60 font-manrope mb-8 flex-1">
              {['Full-stack SaaS or internal tool', 'Agentic orchestration layer + pipeline design', 'Auth, billing, and admin panel', 'CI/CD + Cloudflare Workers deploy'].map(f => (
                <li key={f} className="flex items-start gap-2"><span className="text-white/80 mt-0.5">—</span>{f}</li>
              ))}
            </ul>
            <Link href="/contact?inquiry=software-build"
              className="inline-flex items-center justify-center bg-white text-[#111] rounded-full py-2.5 px-6 text-sm font-semibold hover:bg-white/90 transition-colors font-manrope">
              Get Started →
            </Link>
          </div>

          {/* Scale */}
          <div className="border border-[#e5e5e5] rounded-2xl p-8 flex flex-col">
            <p className="text-xs uppercase tracking-widest text-[#999] font-manrope mb-3">Scale</p>
            <p className="text-3xl font-semibold text-[#111] font-manrope mb-1">Custom</p>
            <p className="text-sm text-[#999] font-manrope mb-6">Enterprise AI &amp; infrastructure</p>
            <ul className="space-y-2 text-sm text-[#555] font-manrope mb-8 flex-1">
              {['Multi-model AI platforms + agent networks', 'Existing workflow optimization audit', 'Data pipelines, RAG &amp; MCP infrastructure', 'Dedicated engineer + SLA'].map(f => (
                <li key={f} className="flex items-start gap-2"><span className="text-[#111] mt-0.5">—</span><span dangerouslySetInnerHTML={{ __html: f }} /></li>
              ))}
            </ul>
            <Link href="/contact?inquiry=software-scale"
              className="inline-flex items-center justify-center border border-[#ccc] rounded-full py-2.5 px-6 text-sm text-[#111] hover:border-[#111] transition-colors font-manrope">
              Talk to the Team →
            </Link>
          </div>
        </div>
        <p className="text-xs text-[#bbb] text-center mt-8 font-manrope">All projects start with a scoping call — no commitment required.</p>
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
                href="mailto:info@deeptechnologies.dev"
                className="inline-flex items-center gap-2 border border-white text-white rounded-full py-2.5 px-4 sm:px-6 hover:bg-white hover:text-[#111] transition-colors w-max group text-xs sm:text-sm"
              >
                <span className="truncate">info@deeptechnologies.dev</span>
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
                  <Link href="/robotics" className="hover:text-white transition-colors">Robotics</Link>
                  <Link href="/pilot" className="hover:text-white transition-colors">30-Day Pilot</Link>
                  <Link href="/portal" className="hover:text-white transition-colors">Customer Portal</Link>
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
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}