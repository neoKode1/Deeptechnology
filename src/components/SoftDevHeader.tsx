'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Code2, Clapperboard, Bot } from 'lucide-react';

/**
 * Universal header used across all three divisions.
 * - Adapts text colors based on division: light text for Robotics/Creative/sub-pages, dark for SoftDev.
 * - Always transparent — fades away (opacity-0) once the user scrolls past 60px, fades back at the top.
 * - /about, /gallery, /contact are treated as Creative sub-pages (dark theme).
 */
const SoftDevHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Fade the header away as soon as the user scrolls past 60px
    const onScroll = () => setIsHidden(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isCreative =
    pathname.startsWith('/creative') ||
    pathname === '/about' ||
    pathname === '/gallery';
  const isRobotics = pathname.startsWith('/robotics');
  const isSoftDev = !isCreative && !isRobotics;
  const isDark = isCreative || isRobotics;

  const textColor = isDark ? 'text-white/80' : 'text-[#111]';
  const textMuted = isDark ? 'text-white/40 hover:text-white/80' : 'text-[#111]/40 hover:text-[#111]';
  // Active = current page: subdued + underline so it reads as "you are here"
  // Inactive = other divisions: bright + hover, clearly inviting navigation
  const pillActive = isDark
    ? 'text-white/40 underline underline-offset-4 decoration-white/20 cursor-default'
    : 'text-[#111]/40 underline underline-offset-4 decoration-[#111]/20 cursor-default';
  const pillInactive = isDark
    ? 'text-white/85 hover:text-white'
    : 'text-[#111]/75 hover:text-[#111]';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[9999] bg-transparent border-b border-transparent transition-all duration-500 ease-in-out ${
          isHidden ? 'opacity-0 pointer-events-none -translate-y-1' : 'opacity-100 translate-y-0'
        }`}
      >
        {/* 3-column grid: left and right are equal width so the center is always pixel-perfect center */}
        <div className="grid grid-cols-3 items-center px-6 py-5 md:px-12 lg:px-20">

          {/* Col 1 — Brand (left-aligned) */}
          <div className="flex items-center">
            <Link
              href="/"
              className={`font-manrope text-sm font-light tracking-[0.25em] uppercase ${textColor}`}
            >
              Deeptech
            </Link>
          </div>

          {/* Col 2 — Division switcher (always centered) */}
          <div className="hidden sm:flex items-center justify-center gap-6">
            <Link href="/" className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${isSoftDev ? pillActive : pillInactive}`}>
              <Code2 className="w-3 h-3" />
              Software Dev
            </Link>
            <Link href="/robotics" className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${isRobotics ? pillActive : pillInactive}`}>
              <Bot className="w-3 h-3" />
              Robotics
            </Link>
            <Link href="/creative" className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${isCreative ? pillActive : pillInactive}`}>
              <Clapperboard className="w-3 h-3" />
              Media
            </Link>
          </div>

          {/* Col 3 — Nav links + CTA + hamburger (right-aligned) */}
          <div className="flex items-center justify-end gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/#services" className={`transition-colors ${textMuted}`}>Services</Link>
              <Link href="/#work" className={`transition-colors ${textMuted}`}>Work</Link>
              <Link href="/contact" className={`transition-colors ${textMuted}`}>Contact</Link>
            </div>
            <button
              className={`md:hidden ${textColor}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — minimal, no heavy bg */}
      {isMenuOpen && (
        <div className={`md:hidden fixed inset-0 top-[65px] z-[9998] flex flex-col px-6 py-8 gap-8 ${isDark ? 'bg-black/80 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'}`}>
          {/* Division switcher — only shown on xs screens where header doesn't already show it */}
          <div className="sm:hidden flex items-center gap-6">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-1.5 text-xs transition-colors ${isSoftDev ? pillActive : pillInactive}`}>
              <Code2 className="w-3 h-3" /> Software Dev
            </Link>
            <Link href="/robotics" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-1.5 text-xs transition-colors ${isRobotics ? pillActive : pillInactive}`}>
              <Bot className="w-3 h-3" /> Robotics
            </Link>
            <Link href="/creative" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-1.5 text-xs transition-colors ${isCreative ? pillActive : pillInactive}`}>
              <Clapperboard className="w-3 h-3" /> Media
            </Link>
          </div>
          {/* Nav links — software dev only */}
          {isSoftDev && [['/#services', 'Services'], ['/#work', 'Work'], ['/contact', 'Contact']].map(([href, label]) => (
            <Link key={href} href={href} className={`text-2xl font-manrope font-light ${textColor}`} onClick={() => setIsMenuOpen(false)}>
              {label}
            </Link>
          ))}

        </div>
      )}
    </>
  );
};

export default SoftDevHeader;

