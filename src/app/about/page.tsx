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
      title: 'Short Film & Feature',
      description:
        'From concept to final cut — short films, cinematic narratives, and full-length productions that blend traditional camera work, Blender CGI, and AI-generated imagery into a single cohesive vision.',
    },
    {
      icon: Music,
      title: 'Music Videos',
      description:
        'Over 80 original music videos produced with AI-driven visuals. Whether it\'s a straightforward performance piece or an abstract cinematic world, every video is story-first.',
    },
    {
      icon: Camera,
      title: 'Image Enhancement & Photography',
      description:
        'From a single photo to an entire visual identity — AI enhancement, upscaling, style transfer, and concept art that starts with real images and ends somewhere unexpected.',
    },
    {
      icon: Wand2,
      title: 'Commercials & Brand Film',
      description:
        'Product spots, brand narratives, and promotional content produced at studio quality. AI handles the heavy lifting — traditional production discipline keeps it on-brief.',
    },
    {
      icon: Sparkles,
      title: 'Documentary & Educational',
      description:
        'Documentaries, educational series, and explainer content built with AI narration, archival enhancement, and generative b-roll. Complex subjects made visually compelling.',
    },
    {
      icon: Layers,
      title: 'Script to Screen',
      description:
        'Full creative pipeline from script development and storyboarding through final delivery. LLM-assisted writing shaped by a filmmaker\'s instinct — then visualized end-to-end.',
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
                A Dark Orchestra was born from a conviction that runs deeper than technology: the
                most powerful creative output comes from blending where you&apos;ve been with where
                you&apos;re going. Chad Neo brings traditional filmmaking instincts — real cameras,
                Blender CGI, cinematography fundamentals — directly into generative AI pipelines,
                building a creative process that neither approach could achieve alone.
              </p>
              <p>
                With over <strong className="text-white">80 original productions</strong>, hundreds
                of thousands of views, and a growing subscriber base, A Dark Orchestra has proven
                that AI-enhanced content can be cinematic, emotionally resonant, and endlessly
                inventive — across every format from music videos to full documentary productions.
              </p>
              <p>
                Every frame carries intention. Every score is composed. Every story is told through
                the lens of a filmmaker who treats AI not as a replacement, but as the most
                powerful collaborator in the room — amplifying craft, not replacing it.
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

