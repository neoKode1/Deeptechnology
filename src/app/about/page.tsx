'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Film, Music, Camera, Wand2, Sparkles, Layers } from 'lucide-react';
import SoftDevHeader from '@/components/SoftDevHeader';
import CreativeCanvas from '@/components/CreativeCanvas';

export default function AboutPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const capabilities = [
    {
      icon: Film,
      title: 'AI Film Production',
      description:
        'Full-length AI-generated films and cinematic shorts using cutting-edge generative video models. From script to screen — every frame crafted by artificial intelligence.',
    },
    {
      icon: Music,
      title: 'Music Videos',
      description:
        'Over 80 original music videos produced with AI-driven visuals, each pushing the boundary of what\'s possible in generative filmmaking. A catalog that rivals traditional studios.',
    },
    {
      icon: Camera,
      title: 'Visual Art & Stills',
      description:
        'Hyper-detailed AI artwork spanning afrofuturism, sci-fi, character design, and cinematic portraiture. Every piece generated, curated, and art-directed by Chad Neo.',
    },
    {
      icon: Wand2,
      title: 'Generative Workflows',
      description:
        'Proprietary pipelines combining Midjourney, Runway, Kling, Sora, and custom tooling to produce consistent characters, worlds, and narratives across productions.',
    },
    {
      icon: Sparkles,
      title: 'AI-Assisted Storytelling',
      description:
        'Narrative design powered by large language models. World-building, dialogue, and plot structure augmented by AI — then shaped by a human creative vision.',
    },
    {
      icon: Layers,
      title: 'Multi-Platform Distribution',
      description:
        'Content engineered for YouTube, streaming platforms, and social media. Optimized thumbnails, SEO-driven titles, and audience analytics built into the creative process.',
    },
  ];

  return (
    <div
      className="transition-opacity duration-1000 ease-out"
      style={{ opacity: ready ? 1 : 0 }}
    >
      <CreativeCanvas className="fixed inset-0 w-full h-full -z-10" />

      <div className="min-h-screen overflow-x-hidden text-white">
        <SoftDevHeader />

        {/* ── HERO ── */}
        <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-end pb-12 sm:pb-20 pt-20 sm:pt-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
          <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-6 sm:w-8 h-px" style={{ backgroundColor: 'oklch(84.1% 0.238 128.85 / 0.7)' }} />
              <span className="text-[10px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.3em] uppercase" style={{ color: 'oklch(84.1% 0.238 128.85 / 0.7)' }}>
                A Dark Orchestra Films
              </span>
            </div>
            <h1 className="font-manrope font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl tracking-tighter text-white leading-[0.92] mb-4 sm:mb-6">
              Our Vision
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed">
              Redefining cinema through artificial intelligence. A Dark Orchestra is the creative
              division of Deeptech — an AI-first multimedia studio founded by filmmaker and
              technologist Chad Neo.
            </p>
          </div>
        </section>

        {/* ── THE STORY ── */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 lg:px-20 relative z-10">
          <div className="max-w-[82rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-start">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-6 h-px" style={{ backgroundColor: 'oklch(84.1% 0.238 128.85 / 0.7)' }} />
                <span className="text-xs font-mono tracking-[0.3em] uppercase" style={{ color: 'oklch(84.1% 0.238 128.85 / 0.7)' }}>
                  The Story
                </span>
              </div>
              <h2 className="font-manrope font-semibold text-3xl md:text-5xl tracking-tight text-white mb-8 leading-tight">
                AI filmmaking<br />isn&apos;t the future.<br />
                <span className="text-white/40">It&apos;s already here.</span>
              </h2>
            </div>
            <div className="flex flex-col gap-6 text-white/70 text-base md:text-lg leading-relaxed">
              <p>
                A Dark Orchestra was born from a simple conviction: the most powerful creative tool
                ever invented — artificial intelligence — should be in the hands of artists, not
                just engineers. Chad Neo has been at that intersection since the earliest days of
                generative media, building an entire cinematic universe with AI.
              </p>
              <p>
                With over <strong className="text-white">80 original productions</strong>, hundreds
                of thousands of views, and a growing subscriber base, A Dark Orchestra has proven
                that AI-generated content can be cinematic, emotionally resonant, and endlessly
                inventive.
              </p>
              <p>
                Every frame is generated. Every score is composed. Every story is told through the
                lens of a filmmaker who treats AI not as a shortcut, but as a collaborator — a
                dark orchestra of algorithms conducting light, motion, and narrative.
              </p>
            </div>
          </div>
        </section>

        {/* ── WHAT WE DO ── */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 lg:px-20 relative z-10">
          <div className="max-w-[82rem] mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-6 h-px" style={{ backgroundColor: 'oklch(84.1% 0.238 128.85 / 0.7)' }} />
              <span className="text-xs font-mono tracking-[0.3em] uppercase" style={{ color: 'oklch(84.1% 0.238 128.85 / 0.7)' }}>
                Capabilities
              </span>
            </div>
            <h2 className="font-manrope font-semibold text-3xl md:text-5xl tracking-tight text-white mb-16">
              What we build.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {capabilities.map((cap) => (
                <div
                  key={cap.title}
                  className="glass-effect rounded-xl p-8 hover:border-white/25 transition-all duration-300 group"
                >
                  <cap.icon className="w-8 h-8 mb-5 transition-colors duration-300" style={{ color: 'oklch(84.1% 0.238 128.85 / 0.7)' }} />
                  <h3 className="font-manrope font-semibold text-lg text-white mb-3 tracking-tight">{cap.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{cap.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 relative z-10">
          <div className="container mx-auto px-6 md:px-12 lg:px-20 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-manrope font-bold text-4xl md:text-5xl mb-6 text-white tracking-tight">
                Let&apos;s create something unprecedented.
              </h2>
              <p className="text-xl text-white/60 mb-10 leading-relaxed">
                Whether you need an AI-generated music video, a cinematic short, or a full
                creative campaign — A Dark Orchestra is ready to bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/contact" className="button-primary inline-flex items-center space-x-2">
                  <span>Start a Project</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/gallery" className="button-secondary inline-flex items-center space-x-2">
                  <span>View the Gallery</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>


    </div>
  );
}

