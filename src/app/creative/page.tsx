'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Icon } from '@iconify/react';
import movieOpenIcon from '@iconify/icons-mdi/movie-open';
import musicNoteIcon from '@iconify/icons-mdi/music-note';
import cameraIcon from '@iconify/icons-mdi/camera';
import videoCamIcon from '@iconify/icons-mdi/video';
import SoftDevHeader from '@/components/SoftDevHeader';
import CreativeCanvas from '@/components/CreativeCanvas';

/**
 * Creative Division home — A Dark Orchestra Films.
 * This is the original film/multimedia content, now accessible
 * via the division switcher under /creative.
 */
export default function CreativeDivisionHome() {
  const carouselRef = useRef<HTMLDivElement>(null);
  // card width (500px) + gap (32px = gap-8)
  const scrollAmount = 532;

  const videos = [
    // Newest first
    { src: 'https://www.youtube.com/embed/HoWyrFbpQmc?si=6cIIlF5HmukDwwrz', href: 'https://youtu.be/HoWyrFbpQmc?si=6cIIlF5HmukDwwrz', title: 'Featured Production 14' },
    { src: 'https://www.youtube.com/embed/SWslJcws7MY?si=w4Tm-WgHChyMIrlr', href: 'https://youtu.be/SWslJcws7MY?si=w4Tm-WgHChyMIrlr', title: 'Featured Production 13' },
    { src: 'https://www.youtube.com/embed/QbD8e8h7KU8?si=4wikUUWQmYQNSlH1', href: 'https://youtu.be/QbD8e8h7KU8?si=4wikUUWQmYQNSlH1', title: 'Featured Production 12' },
    { src: 'https://www.youtube.com/embed/boG0HRXlmrw?si=U9rVqHHKh3yVoiNK', href: 'https://youtu.be/boG0HRXlmrw?si=U9rVqHHKh3yVoiNK', title: 'Featured Production 11' },
    { src: 'https://www.youtube.com/embed/ddjMtqDMcL4?si=1QX8rJSa32TTVVwQ', href: 'https://youtu.be/ddjMtqDMcL4?si=1QX8rJSa32TTVVwQ', title: 'Featured Production 10' },
    { src: 'https://www.youtube.com/embed/tsQ1Stusfcc?si=wcKLqWmJOVw3ncix', href: 'https://youtu.be/tsQ1Stusfcc?si=wcKLqWmJOVw3ncix', title: 'Featured Production 9' },
    { src: 'https://www.youtube.com/embed/HgtDZbiS1aM?si=EUqUUlFx6juNtM_r', href: 'https://youtu.be/HgtDZbiS1aM?si=EUqUUlFx6juNtM_r', title: 'Featured Production 8' },
    { src: 'https://www.youtube.com/embed/9MJO6GuT5b0?si=-kEESQiLL_wTL2dN', href: 'https://youtu.be/9MJO6GuT5b0?si=-kEESQiLL_wTL2dN', title: 'Featured Production 7' },
    { src: 'https://www.youtube.com/embed/V5EUTsyIPFw?si=egh-ZL1rczI9OoZ6', href: 'https://youtu.be/V5EUTsyIPFw?si=egh-ZL1rczI9OoZ6', title: 'Featured Production 6' },
    { src: 'https://www.youtube.com/embed/db8-XM4IfI0?si=NRDMGk69gCDJZOMR', href: 'https://youtu.be/db8-XM4IfI0?si=NRDMGk69gCDJZOMR', title: 'Featured Production 5' },
    { src: 'https://www.youtube.com/embed/q-MAtVddHDs?si=tHFMGM-z1Es3-AmB', href: 'https://youtu.be/q-MAtVddHDs?si=tHFMGM-z1Es3-AmB', title: 'Featured Production 4' },
    { src: 'https://www.youtube.com/embed/GI_oVVu_Nhk?si=bjLhxnf0LPeLKB7J', href: 'https://youtu.be/GI_oVVu_Nhk?si=bjLhxnf0LPeLKB7J', title: 'Featured Production 3' },
    { src: 'https://www.youtube.com/embed/vA9E202p2Bc?si=E_FNXAlHf9YI3PaH', href: 'https://youtu.be/vA9E202p2Bc?si=E_FNXAlHf9YI3PaH', title: 'Featured Production 2' },
    { src: 'https://www.youtube.com/embed/PAfe79u8T3U?si=QnvrXfM-T7_0OvR-', href: 'https://youtu.be/PAfe79u8T3U?si=QnvrXfM-T7_0OvR-', title: 'Featured Production 1' },
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

  return (
    <>
      {/* ── FIXED background canvas — stays centered during scroll ── */}
      <CreativeCanvas className="fixed inset-0 w-full h-full -z-10" />

      <div className="min-h-screen overflow-x-hidden text-white">
        <SoftDevHeader />
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Subtle vignette so text stays readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        <div className="relative z-10 container mx-auto px-4">
          <div className="w-full">
            <div className="mb-8">
              <h1 className="mega-title font-heading font-black text-red-500/70 leading-none text-left" style={{ textShadow: '0 0 30px rgba(239, 68, 68, 0.8)' }}>
                A DARK<br />ORCHESTRA
              </h1>
            </div>

            <p className="font-body text-lg md:text-xl text-white/70 mb-12 max-w-3xl leading-relaxed px-4 text-left">
              Revolutionary multimedia AI film company creating cutting-edge content through artificial intelligence.
              Created by The AI Visionary Filmmaker Chad Neo.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-start mb-16 px-4">
              <Link href="/about" className="button-primary group flex items-center space-x-2">
                <span>Discover Our Vision</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link href="/gallery" className="button-secondary group flex items-center space-x-2">
                <Icon icon={videoCamIcon} width={20} height={20} />
                <span>View Gallery</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl px-4">
              <div className="glass-effect rounded-lg p-6 text-center">
                <Icon icon={movieOpenIcon} width={32} height={32} className="text-yellow-400 mx-auto mb-3" />
                <div className="font-heading text-2xl font-bold text-white mb-1">100+</div>
                <div className="font-body text-white/70 text-sm">AI Films</div>
              </div>
              <div className="glass-effect rounded-lg p-6 text-center">
                <Icon icon={musicNoteIcon} width={32} height={32} className="text-yellow-400 mx-auto mb-3" />
                <div className="font-heading text-2xl font-bold text-white mb-1">50+</div>
                <div className="font-body text-white/70 text-sm">Soundtracks</div>
              </div>
              <div className="glass-effect rounded-lg p-6 text-center">
                <Icon icon={cameraIcon} width={32} height={32} className="text-yellow-400 mx-auto mb-3" />
                <div className="font-heading text-2xl font-bold text-white mb-1">24/7</div>
                <div className="font-body text-white/70 text-sm">Production</div>
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

      {/* ── LATEST PRODUCTIONS — Dark Feature Carousel ── */}
      <section className="bg-[#050505]/80 backdrop-blur-sm pt-24 pb-24 px-6 relative z-10">
        <div className="w-full max-w-[1800px] mx-auto">

          {/* Section header */}
          <div className="mb-14">
            {/* Label row */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-6 h-px bg-amber-400/70" />
              <span className="text-xs font-mono text-amber-400/70 tracking-[0.3em] uppercase">A Dark Orchestra Films</span>
            </div>

            {/* Headline — two stacked lines */}
            <h2 className="font-manrope font-semibold tracking-tighter uppercase leading-[0.88]">
              <span className="block text-5xl md:text-7xl lg:text-8xl text-white">
                Latest Productions.
              </span>
              <span className="block text-5xl md:text-7xl lg:text-8xl mt-1" style={{
                WebkitTextStroke: '1px rgba(251,191,36,0.35)',
                color: 'transparent',
              }}>
                Cinematic AI.
              </span>
            </h2>

            {/* Divider with amber accent */}
            <div className="flex items-center gap-0 mt-10">
              <div className="h-px flex-1 bg-white/8" />
              <div className="w-16 h-px bg-amber-400/50" />
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
                  <div className="mt-6 pl-2 flex flex-col flex-grow min-h-[140px]">
                    <h3 className="text-white font-semibold tracking-[0.2em] uppercase text-lg mb-3">{v.title}</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed max-w-sm mb-6 line-clamp-2">
                      A Dark Orchestra original — AI-generated cinematic production.
                    </p>
                    <div className="mt-auto">
                      <a
                        href={v.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn flex items-center justify-between gap-4 w-full md:w-auto px-6 py-4 border border-white/20 text-white text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:bg-amber-400 hover:text-black hover:border-amber-400"
                      >
                        Watch on YouTube
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </a>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Prev / Next controls */}
            <div className="flex justify-end mt-12 pr-6">
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
      </div>
    </>
  );
}

