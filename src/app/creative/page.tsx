'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Icon } from '@iconify/react';
import movieOpenIcon from '@iconify/icons-mdi/movie-open';
import musicNoteIcon from '@iconify/icons-mdi/music-note';
import cameraIcon from '@iconify/icons-mdi/camera';
import videoCamIcon from '@iconify/icons-mdi/video';
import SoftDevHeader from '@/components/SoftDevHeader';
import CreativeCanvas from '@/components/CreativeCanvas';

/* ── Generative AI models marquee ── */
const AI_MODELS_ROW1 = [
  // Video models
  'Luma Dream Machine', 'Luma Ray2', 'Runway Gen-4', 'Kling 2.0', 'Google Veo 3',
  'Pika 2.0', 'HailuoAI MiniMax', 'Sora', 'Wan (Alibaba)', 'Vidu',
  'Genmo Mochi', 'Hotshot', 'Morph Studio', 'Haiper',
  // Duplicate for seamless loop
  'Luma Dream Machine', 'Luma Ray2', 'Runway Gen-4', 'Kling 2.0', 'Google Veo 3',
  'Pika 2.0', 'HailuoAI MiniMax', 'Sora', 'Wan (Alibaba)', 'Vidu',
  'Genmo Mochi', 'Hotshot', 'Morph Studio', 'Haiper',
];
const AI_MODELS_ROW2 = [
  // Image models
  'Midjourney', 'DALL·E 3', 'Stable Diffusion XL', 'Flux Pro', 'Ideogram',
  'Leonardo AI', 'Adobe Firefly', 'Playground',
  // Audio / Music models
  'ElevenLabs', 'Suno', 'Udio',
  // Duplicate for seamless loop
  'Midjourney', 'DALL·E 3', 'Stable Diffusion XL', 'Flux Pro', 'Ideogram',
  'Leonardo AI', 'Adobe Firefly', 'Playground',
  'ElevenLabs', 'Suno', 'Udio',
];

/**
 * Creative Division home — A Dark Orchestra Films.
 * This is the original film/multimedia content, now accessible
 * via the division switcher under /creative.
 */
export default function CreativeDivisionHome() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [ytStats, setYtStats] = useState<{ viewCount: string; subscriberCount: string; videoCount: string } | null>(null);
  // card width (500px) + gap (32px = gap-8)
  const scrollAmount = 532;

  const videos = [
    // Newest first — A DARK ORCHESTRA catalog
    { src: 'https://www.youtube.com/embed/tsQ1Stusfcc', href: 'https://youtu.be/tsQ1Stusfcc', title: 'People Speakin' },
    { src: 'https://www.youtube.com/embed/9MJO6GuT5b0', href: 'https://youtu.be/9MJO6GuT5b0', title: 'WUrd' },
    { src: 'https://www.youtube.com/embed/HgtDZbiS1aM', href: 'https://youtu.be/HgtDZbiS1aM', title: 'Glory' },
    { src: 'https://www.youtube.com/embed/2pLbNZBnOXU', href: 'https://youtu.be/2pLbNZBnOXU', title: 'pHArma' },
    { src: 'https://www.youtube.com/embed/1mPGmDVPgXY', href: 'https://youtu.be/1mPGmDVPgXY', title: 'like it was' },
    { src: 'https://www.youtube.com/embed/qGJ5q4JncTg', href: 'https://youtu.be/qGJ5q4JncTg', title: 'T H E  S P R A W L  S2 pt2 + pt3' },
    { src: 'https://www.youtube.com/embed/qmmGS7xbefo', href: 'https://youtu.be/qmmGS7xbefo', title: 'A DArk ANThoLogy' },
    { src: 'https://www.youtube.com/embed/ddjMtqDMcL4', href: 'https://youtu.be/ddjMtqDMcL4', title: 'krem də lə ˈkrem' },
    { src: 'https://www.youtube.com/embed/boG0HRXlmrw', href: 'https://youtu.be/boG0HRXlmrw', title: 'boat' },
    { src: 'https://www.youtube.com/embed/HoWyrFbpQmc', href: 'https://youtu.be/HoWyrFbpQmc', title: 'Sleepwalkerz' },
    { src: 'https://www.youtube.com/embed/SWslJcws7MY', href: 'https://youtu.be/SWslJcws7MY', title: 'SWitch' },
    { src: 'https://www.youtube.com/embed/QbD8e8h7KU8', href: 'https://youtu.be/QbD8e8h7KU8', title: 'Dreamin Big' },
    { src: 'https://www.youtube.com/embed/V5EUTsyIPFw', href: 'https://youtu.be/V5EUTsyIPFw', title: 'OTD' },
    { src: 'https://www.youtube.com/embed/db8-XM4IfI0', href: 'https://youtu.be/db8-XM4IfI0', title: 'Liquid' },
    { src: 'https://www.youtube.com/embed/q-MAtVddHDs', href: 'https://youtu.be/q-MAtVddHDs', title: 'Criminal' },
    { src: 'https://www.youtube.com/embed/GI_oVVu_Nhk', href: 'https://youtu.be/GI_oVVu_Nhk', title: 'Fingerwaves' },
    { src: 'https://www.youtube.com/embed/vA9E202p2Bc', href: 'https://youtu.be/vA9E202p2Bc', title: 'N W O (NEW WORLD OVER)' },
    { src: 'https://www.youtube.com/embed/PAfe79u8T3U', href: 'https://youtu.be/PAfe79u8T3U', title: 'Kremlin (Return to The Wiz)' },
    // ── Music Videos playlist ──
    { src: 'https://www.youtube.com/embed/0FdlEEQA_pw', href: 'https://youtu.be/0FdlEEQA_pw', title: 'Swat Day' },
    { src: 'https://www.youtube.com/embed/18GWo28sMUI', href: 'https://youtu.be/18GWo28sMUI', title: 'Cruel Favor' },
    { src: 'https://www.youtube.com/embed/2FJ90SfcVdc', href: 'https://youtu.be/2FJ90SfcVdc', title: 'COMPOSITION' },
    { src: 'https://www.youtube.com/embed/3-vaVf3vLCA', href: 'https://youtu.be/3-vaVf3vLCA', title: 'No Road' },
    { src: 'https://www.youtube.com/embed/6Bh2kbZC3Ew', href: 'https://youtu.be/6Bh2kbZC3Ew', title: 'Dirty VICE' },
    { src: 'https://www.youtube.com/embed/6FTP_rzBPG4', href: 'https://youtu.be/6FTP_rzBPG4', title: 'Garden' },
    { src: 'https://www.youtube.com/embed/6nS2s2b5Ezs', href: 'https://youtu.be/6nS2s2b5Ezs', title: 'No one Knows' },
    { src: 'https://www.youtube.com/embed/7vMxQ6NBkvw', href: 'https://youtu.be/7vMxQ6NBkvw', title: 'WIN MYNAMESHOW' },
    { src: 'https://www.youtube.com/embed/B7G2O7sSOOo', href: 'https://youtu.be/B7G2O7sSOOo', title: 'Tiime' },
    { src: 'https://www.youtube.com/embed/C1vNqCDizrU', href: 'https://youtu.be/C1vNqCDizrU', title: 'Swimmin' },
    { src: 'https://www.youtube.com/embed/EEs48_AKRR4', href: 'https://youtu.be/EEs48_AKRR4', title: 'M A X E D  O U T' },
    { src: 'https://www.youtube.com/embed/EKADSUlGK2Y', href: 'https://youtu.be/EKADSUlGK2Y', title: 'No stress Flexx' },
    { src: 'https://www.youtube.com/embed/EheweLIpGNE', href: 'https://youtu.be/EheweLIpGNE', title: 'Collision' },
    { src: 'https://www.youtube.com/embed/EnOo_Q3-M7Y', href: 'https://youtu.be/EnOo_Q3-M7Y', title: 'Casual (Purple Rain)' },
    { src: 'https://www.youtube.com/embed/F9rYinLSJ44', href: 'https://youtu.be/F9rYinLSJ44', title: 'Cupid sucks' },
    { src: 'https://www.youtube.com/embed/GNsfm-MrXbo', href: 'https://youtu.be/GNsfm-MrXbo', title: 'Bagz N Rackz' },
    { src: 'https://www.youtube.com/embed/I0B8-V1_GyI', href: 'https://youtu.be/I0B8-V1_GyI', title: 'Smalltown' },
    { src: 'https://www.youtube.com/embed/I0nFXJ61x28', href: 'https://youtu.be/I0nFXJ61x28', title: 'It Bends the Void' },
    { src: 'https://www.youtube.com/embed/IwSolzt0eIY', href: 'https://youtu.be/IwSolzt0eIY', title: 'Smoke' },
    { src: 'https://www.youtube.com/embed/MYJnqREjLKw', href: 'https://youtu.be/MYJnqREjLKw', title: 'Demons ans Angels' },
    { src: 'https://www.youtube.com/embed/NoqTLz9_MTE', href: 'https://youtu.be/NoqTLz9_MTE', title: 'Dead Meat' },
    { src: 'https://www.youtube.com/embed/ODMhESU4r3U', href: 'https://youtu.be/ODMhESU4r3U', title: 'Slop' },
    { src: 'https://www.youtube.com/embed/Ok9CjuUvIT4', href: 'https://youtu.be/Ok9CjuUvIT4', title: 'France' },
    { src: 'https://www.youtube.com/embed/PRDWXpmEzWQ', href: 'https://youtu.be/PRDWXpmEzWQ', title: 'LEGEND' },
    { src: 'https://www.youtube.com/embed/RmOyLGVzfl0', href: 'https://youtu.be/RmOyLGVzfl0', title: 'WET' },
    { src: 'https://www.youtube.com/embed/TjgzQ45veZM', href: 'https://youtu.be/TjgzQ45veZM', title: 'Sirens' },
    { src: 'https://www.youtube.com/embed/Tp5uHDfYR-Y', href: 'https://youtu.be/Tp5uHDfYR-Y', title: 'Separation' },
    { src: 'https://www.youtube.com/embed/UHk3XyG5fGI', href: 'https://youtu.be/UHk3XyG5fGI', title: 'Fever Dream' },
    { src: 'https://www.youtube.com/embed/UghbHwRiWEY', href: 'https://youtu.be/UghbHwRiWEY', title: 'Fade' },
    { src: 'https://www.youtube.com/embed/VPVMztPQGeM', href: 'https://youtu.be/VPVMztPQGeM', title: 'Twisted' },
    { src: 'https://www.youtube.com/embed/VpCMxguQ0ko', href: 'https://youtu.be/VpCMxguQ0ko', title: 'Lemon Drop Dream' },
    { src: 'https://www.youtube.com/embed/W1ZIo7P3nNo', href: 'https://youtu.be/W1ZIo7P3nNo', title: 'The Algo (King Of Pop)' },
    { src: 'https://www.youtube.com/embed/Y2iH0xhLz-k', href: 'https://youtu.be/Y2iH0xhLz-k', title: 'The Shallow' },
    { src: 'https://www.youtube.com/embed/Z-nAnS588Mw', href: 'https://youtu.be/Z-nAnS588Mw', title: 'The Art of the Hustle ft. Equipto' },
    { src: 'https://www.youtube.com/embed/ZIpUfcYDGdE', href: 'https://youtu.be/ZIpUfcYDGdE', title: 'Jimmy' },
    { src: 'https://www.youtube.com/embed/a-z8ArznQIk', href: 'https://youtu.be/a-z8ArznQIk', title: 'Frsh' },
    { src: 'https://www.youtube.com/embed/d7LVTG79spU', href: 'https://youtu.be/d7LVTG79spU', title: 'Triumph' },
    { src: 'https://www.youtube.com/embed/dOCrzAoyfSM', href: 'https://youtu.be/dOCrzAoyfSM', title: 'uNALIvE' },
    { src: 'https://www.youtube.com/embed/djp0bFZq6xE', href: 'https://youtu.be/djp0bFZq6xE', title: 'Heavy' },
    { src: 'https://www.youtube.com/embed/eSsEm24fdmg', href: 'https://youtu.be/eSsEm24fdmg', title: 'The Low End' },
    { src: 'https://www.youtube.com/embed/eTNc1xTC30Q', href: 'https://youtu.be/eTNc1xTC30Q', title: 'Parallel' },
    { src: 'https://www.youtube.com/embed/f59jZldwh7o', href: 'https://youtu.be/f59jZldwh7o', title: 'Mirage' },
    { src: 'https://www.youtube.com/embed/fh7-6cZ4ZQk', href: 'https://youtu.be/fh7-6cZ4ZQk', title: 'City of ghost' },
    { src: 'https://www.youtube.com/embed/hFJU0b52dLs', href: 'https://youtu.be/hFJU0b52dLs', title: 'A Dark Orchestra' },
    { src: 'https://www.youtube.com/embed/iZa2GJQNkOo', href: 'https://youtu.be/iZa2GJQNkOo', title: 'Icey Heart' },
    { src: 'https://www.youtube.com/embed/k81jUGX-Kuc', href: 'https://youtu.be/k81jUGX-Kuc', title: 'Schemes' },
    { src: 'https://www.youtube.com/embed/mENq1C-KIOQ', href: 'https://youtu.be/mENq1C-KIOQ', title: 'Dread' },
    { src: 'https://www.youtube.com/embed/mmsmUbx33Sc', href: 'https://youtu.be/mmsmUbx33Sc', title: 'Chemical' },
    { src: 'https://www.youtube.com/embed/o_vwKYmyQco', href: 'https://youtu.be/o_vwKYmyQco', title: 'Shawty Lo' },
    { src: 'https://www.youtube.com/embed/oonEKJrtN5Y', href: 'https://youtu.be/oonEKJrtN5Y', title: 'THEM' },
    { src: 'https://www.youtube.com/embed/pHMEaVJIehY', href: 'https://youtu.be/pHMEaVJIehY', title: 'Align' },
    { src: 'https://www.youtube.com/embed/rFMat_rLbfs', href: 'https://youtu.be/rFMat_rLbfs', title: 'Suicide Hearts' },
    { src: 'https://www.youtube.com/embed/rwcvojmw1oM', href: 'https://youtu.be/rwcvojmw1oM', title: 'Entropy' },
    { src: 'https://www.youtube.com/embed/rzwrUH_SEio', href: 'https://youtu.be/rzwrUH_SEio', title: 'Over & Over' },
    { src: 'https://www.youtube.com/embed/su0fTDIH2Ss', href: 'https://youtu.be/su0fTDIH2Ss', title: 'LeftRight' },
    { src: 'https://www.youtube.com/embed/t4CHU8S5gjM', href: 'https://youtu.be/t4CHU8S5gjM', title: 'Jellybeans' },
    { src: 'https://www.youtube.com/embed/uV1F-LLWHZU', href: 'https://youtu.be/uV1F-LLWHZU', title: 'Murderbot' },
    { src: 'https://www.youtube.com/embed/vEM71Apij0Q', href: 'https://youtu.be/vEM71Apij0Q', title: '2 Die 4' },
    { src: 'https://www.youtube.com/embed/w9jz8r8_eG8', href: 'https://youtu.be/w9jz8r8_eG8', title: 'Twilight' },
    { src: 'https://www.youtube.com/embed/yLur3j2spNE', href: 'https://youtu.be/yLur3j2spNE', title: 'No Sleep hustle (KANYE-I)' },
    { src: 'https://www.youtube.com/embed/yYXXB73BQc8', href: 'https://youtu.be/yYXXB73BQc8', title: 'iNFINITEHUSTLE' },
    { src: 'https://www.youtube.com/embed/yyT6SXtHzi4', href: 'https://youtu.be/yyT6SXtHzi4', title: 'Pressure' },
    // ── Short Films playlist ──
    { src: 'https://www.youtube.com/embed/FmqRZQwQV84', href: 'https://youtu.be/FmqRZQwQV84', title: 'Aliens THE WOMAN IN THE DARK' },
    { src: 'https://www.youtube.com/embed/MBY4pEk1gk8', href: 'https://youtu.be/MBY4pEk1gk8', title: 'DEAD SPACE LOST' },
  ];

  // Translate vertical wheel/trackpad scroll into horizontal glide
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      // Only hijack when there's meaningful vertical intent
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.2;
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Fetch YouTube channel stats
  useEffect(() => {
    fetch('/api/youtube-stats')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d && !d.error) setYtStats(d); })
      .catch(() => {});
  }, []);

  /** Format large numbers: 1234567 → "1.2M", 12345 → "12.3K" */
  const fmt = (n: string | undefined) => {
    if (!n) return '—';
    const v = parseInt(n, 10);
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
    return v.toLocaleString();
  };

  // Trigger fade-in after a short delay to let the canvas initialize
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="transition-opacity duration-1000 ease-out"
      style={{ opacity: ready ? 1 : 0 }}
    >
      {/* ── FIXED background canvas — stays centered during scroll ── */}
      <CreativeCanvas className="fixed inset-0 w-full h-full -z-10" />

      <div className="min-h-screen overflow-x-hidden text-white">
        <SoftDevHeader />
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-end sm:items-center justify-center overflow-hidden pt-24 sm:pt-0 pb-12 sm:pb-0">
          {/* Subtle vignette so text stays readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6">
          <div className="w-full">
            <div className="mb-6 sm:mb-8">
              <h1 className="mega-title font-heading font-black text-red-500/70 leading-none text-left" style={{ textShadow: '0 0 30px rgba(239, 68, 68, 0.8)' }}>
                A DARK<br />ORCHESTRA
              </h1>
            </div>

            <p className="font-body text-sm sm:text-lg md:text-xl text-white/70 mb-6 sm:mb-12 max-w-3xl leading-relaxed text-left">
              Revolutionary multimedia AI film company creating cutting-edge content through artificial intelligence.
              Created by The AI Visionary Filmmaker Chad Neo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start mb-10 sm:mb-16">
              <Link href="/about" className="button-primary group flex items-center space-x-2 text-sm sm:text-base">
                <span>Discover Our Vision</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link href="/gallery" className="button-secondary group flex items-center space-x-2 text-sm sm:text-base">
                <Icon icon={videoCamIcon} width={18} height={18} />
                <span>View Gallery</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-8 max-w-2xl">
              <div className="glass-effect rounded-lg p-3 sm:p-6 text-center">
                <Icon icon={videoCamIcon} width={24} height={24} className="mx-auto mb-2 sm:mb-3 w-5 h-5 sm:w-8 sm:h-8" style={{ color: 'oklch(84.1% 0.238 128.85)' }} />
                <div className="font-heading text-lg sm:text-2xl font-bold text-white mb-1">{ytStats ? fmt(ytStats.viewCount) : '—'}</div>
                <div className="font-body text-white/70 text-[10px] sm:text-sm">Total Views</div>
              </div>
              <div className="glass-effect rounded-lg p-3 sm:p-6 text-center">
                <Icon icon={musicNoteIcon} width={24} height={24} className="mx-auto mb-2 sm:mb-3 w-5 h-5 sm:w-8 sm:h-8" style={{ color: 'oklch(84.1% 0.238 128.85)' }} />
                <div className="font-heading text-lg sm:text-2xl font-bold text-white mb-1">{ytStats ? fmt(ytStats.subscriberCount) : '—'}</div>
                <div className="font-body text-white/70 text-[10px] sm:text-sm">Subscribers</div>
              </div>
              <div className="glass-effect rounded-lg p-3 sm:p-6 text-center">
                <Icon icon={movieOpenIcon} width={24} height={24} className="mx-auto mb-2 sm:mb-3 w-5 h-5 sm:w-8 sm:h-8" style={{ color: 'oklch(84.1% 0.238 128.85)' }} />
                <div className="font-heading text-lg sm:text-2xl font-bold text-white mb-1">{ytStats ? fmt(ytStats.videoCount) : '—'}</div>
                <div className="font-body text-white/70 text-[10px] sm:text-sm">Videos</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/40 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ── AI MODELS MARQUEE ── */}
      <section className="relative z-10 py-12 overflow-hidden border-y border-white/10">
        <p className="text-center text-xs font-mono tracking-[0.3em] uppercase text-white/30 mb-8">
          Powered by generative AI
        </p>

        {/* Row 1 — Video models (scroll left) */}
        <div className="mb-4 overflow-hidden">
          <div
            className="flex whitespace-nowrap"
            style={{ width: 'max-content', animation: 'marquee-scroll 40s linear infinite' }}
          >
            {AI_MODELS_ROW1.map((m, i) => (
              <span key={i} className="font-manrope text-white/15 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight px-4 sm:px-6">
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Row 2 — Image & audio models (scroll right) */}
        <div className="overflow-hidden">
          <div
            className="flex whitespace-nowrap"
            style={{ width: 'max-content', animation: 'marquee-scroll 35s linear infinite reverse' }}
          >
            {AI_MODELS_ROW2.map((m, i) => (
              <span key={i} className="font-manrope text-white/15 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight px-4 sm:px-6">
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST PRODUCTIONS — Dark Feature Carousel ── */}
      <section className="pt-24 pb-24 px-6 relative z-10">
        <div className="w-full max-w-[1800px] mx-auto">

          {/* Section header */}
          <div className="mb-14">
            {/* Label row */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-6 h-px" style={{ backgroundColor: 'oklch(84.1% 0.238 128.85 / 0.7)' }} />
              <span className="text-xs font-mono tracking-[0.3em] uppercase" style={{ color: 'oklch(84.1% 0.238 128.85 / 0.7)' }}>A Dark Orchestra Films</span>
            </div>

            {/* Headline — two stacked lines */}
            <h2 className="font-manrope font-semibold tracking-tighter uppercase leading-[0.88]">
              <span className="block text-5xl md:text-7xl lg:text-8xl text-white">
                Cinematic
              </span>
              <span className="block text-5xl md:text-7xl lg:text-8xl mt-1" style={{
                WebkitTextStroke: '1.5px rgba(255,255,255,0.5)',
                color: 'transparent',
              }}>
                Universe.
              </span>
            </h2>

            {/* Divider with teal accent */}
            <div className="flex items-center gap-0 mt-10">
              <div className="h-px flex-1 bg-white/8" />
              <div className="w-16 h-px" style={{ backgroundColor: 'oklch(84.1% 0.238 128.85 / 0.5)' }} />
            </div>

            {/* Prev / Next controls — right under title */}
            <div className="flex justify-end mt-6">
              <div className="flex">
                <button
                  onClick={() => carouselRef.current?.scrollBy({ left: -scrollAmount, behavior: 'smooth' })}
                  aria-label="Previous"
                  className="w-16 h-16 border border-white/10 flex items-center justify-center text-white/50 hover:bg-neutral-900 hover:text-white hover:border-white/30 transition-all duration-300 group bg-black z-20"
                >
                  <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                </button>
                <button
                  onClick={() => carouselRef.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' })}
                  aria-label="Next"
                  className="w-16 h-16 border-t border-b border-r border-white/10 flex items-center justify-center text-white/50 hover:bg-neutral-900 hover:text-white hover:border-white/30 transition-all duration-300 group bg-black z-20"
                >
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Carousel track */}
          <div className="relative w-full">
            <div
              ref={carouselRef}
              className="flex gap-8 overflow-x-auto pb-8 snap-x snap-proximity scroll-smooth [&::-webkit-scrollbar]:hidden"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' } as React.CSSProperties}
            >
              {videos.map((v) => (
                <div key={v.src} className="min-w-[85vw] md:min-w-[450px] lg:min-w-[500px] snap-center shrink-0 flex flex-col">

                  {/* Video tile */}
                  <div className="w-full aspect-video border border-white/10 p-2 bg-[#050505] group cursor-pointer">
                    <div className="relative w-full h-full overflow-hidden border border-white/5 transition-colors duration-500 group-hover:border-white/40">
                      <iframe
                        src={v.src}
                        title={v.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  {/* Card info */}
                  <div className="mt-4 sm:mt-6 pl-2 flex flex-col flex-grow min-h-[120px] sm:min-h-[140px]">
                    <h3 className="text-white font-semibold tracking-[0.2em] uppercase text-lg mb-3">{v.title}</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed max-w-sm mb-6 line-clamp-2">
                      A Dark Orchestra original — AI-generated cinematic production.
                    </p>
                    <div className="mt-auto">
                      <a
                        href={v.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn flex items-center justify-between gap-4 w-full md:w-auto px-6 py-4 border border-white/20 text-white text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:text-black"
                        style={{ '--hover-bg': 'oklch(84.1% 0.238 128.85)' } as React.CSSProperties}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'oklch(84.1% 0.238 128.85)'; e.currentTarget.style.borderColor = 'oklch(84.1% 0.238 128.85)'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.borderColor = ''; }}
                      >
                        Watch on YouTube
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </a>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Experience the Future of Film?
            </h2>
            <p className="font-body text-xl text-white/80 mb-8">
              Join us in creating the next generation of AI-powered multimedia content.
              Let&apos;s bring your vision to life.
            </p>
            <Link href="/contact" className="button-primary inline-flex items-center space-x-2">
              <span>Start Your Project</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0a0a0a] text-white pt-16 sm:pt-24 pb-8 px-4 sm:px-6 md:px-12 lg:px-20 relative z-10">
        <div className="max-w-[82rem] mx-auto flex flex-col">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-10 sm:gap-16 mb-16 sm:mb-24">
            <div className="flex flex-col gap-6 sm:gap-8 max-w-lg">
              <h2 className="font-manrope text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] font-medium tracking-tight leading-snug">
                Let&apos;s create something unforgettable.
              </h2>
              <a
                href="mailto:1deeptechnology@gmail.com"
                className="inline-flex items-center gap-2 border border-white text-white rounded-full py-2.5 px-4 sm:px-6 hover:bg-white hover:text-[#111] transition-colors w-max group text-xs sm:text-sm"
              >
                1deeptechnology@gmail.com
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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

          <div className="h-[1px] w-full bg-[#2d2c2c] my-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-[#999]">
            <div>© {new Date().getFullYear()} Deeptech. All rights reserved.</div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/" className="hover:text-white transition-colors">Software Division</Link>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}

