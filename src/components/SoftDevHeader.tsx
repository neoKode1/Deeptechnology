'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUp } from 'lucide-react';

/**
 * Universal header used across all three divisions.
 * - Adapts text colors based on division: light text for Robotics/Creative/sub-pages, dark for SoftDev.
 * - Always transparent — fades away (opacity-0) once the user scrolls past 60px, fades back at the top.
 * - /about, /gallery, /contact are treated as Creative sub-pages (dark theme).
 */
const SoftDevHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      // Fade the header away as soon as the user scrolls past 60px
      setIsHidden(window.scrollY > 60);

      // Show back-to-top when user is near the bottom (within 300px of footer)
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
      setShowBackToTop(scrolledToBottom);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isCreative =
    pathname.startsWith('/creative') ||
    pathname === '/about' ||
    pathname === '/gallery';
  const isRobotics = pathname.startsWith('/robotics');
  const isSoftware = pathname.startsWith('/software');
  const isSoftDev = !isCreative && !isRobotics;
  const isDark = isCreative;

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
        <div className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-3 items-center px-4 sm:px-6 py-4 sm:py-5 md:px-12 lg:px-20">

          {/* Col 1 — Brand (left-aligned) */}
          <div className="flex items-center">
            <Link
              href="/"
              className={`font-manrope text-xs sm:text-sm font-light tracking-[0.2em] sm:tracking-[0.25em] uppercase ${textColor}`}
            >
              Deeptech
            </Link>
          </div>

          {/* Col 2 — Division switcher (always centered) */}
          <div className="hidden sm:flex items-center justify-center gap-6">
            <Link href="/software" className={`text-xs transition-colors duration-200 ${isSoftware ? pillActive : pillInactive}`}>
              Software Dev
            </Link>
            <Link href="/robotics" className={`text-xs transition-colors duration-200 ${isRobotics ? pillActive : pillInactive}`}>
              Robotics
            </Link>
            <Link href="/creative" className={`text-xs transition-colors duration-200 ${isCreative ? pillActive : pillInactive}`}>
              Media
            </Link>
          </div>

          {/* Col 3 — Nav links + X icon + hamburger (right-aligned) */}
          <div className="flex items-center justify-end gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/#services" className={`transition-colors ${textMuted}`}>Services</Link>
              <Link href="/software#work" className={`transition-colors ${textMuted}`}>Work</Link>
              <Link href="/contact" className={`transition-colors ${textMuted}`}>Contact</Link>
            </div>
            <a
              href="https://x.com/JusChadneo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow on X"
              className={`transition-colors ${textMuted}`}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
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

      {/* Floating back-to-top button — appears near the footer */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[9997] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border border-white/20 bg-black/60 backdrop-blur-md text-white/60 hover:text-white hover:border-white/40 hover:bg-black/80 transition-all duration-300 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Mobile menu — minimal, no heavy bg */}
      {isMenuOpen && (
        <div className={`md:hidden fixed inset-0 top-[57px] sm:top-[65px] z-[9998] flex flex-col px-6 py-8 gap-6 ${isDark ? 'bg-black/90 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md'}`}>
          {/* Division switcher — only shown on xs screens where header doesn't already show it */}
          <div className="sm:hidden flex items-center gap-6">
            <Link href="/software" onClick={() => setIsMenuOpen(false)} className={`text-xs transition-colors ${isSoftware ? pillActive : pillInactive}`}>
              Software Dev
            </Link>
            <Link href="/robotics" onClick={() => setIsMenuOpen(false)} className={`text-xs transition-colors ${isRobotics ? pillActive : pillInactive}`}>
              Robotics
            </Link>
            <Link href="/creative" onClick={() => setIsMenuOpen(false)} className={`text-xs transition-colors ${isCreative ? pillActive : pillInactive}`}>
              Media
            </Link>
          </div>
          {/* Nav links — always shown on mobile */}
          {[['/#services', 'Services'], ['/software#work', 'Work'], ['/contact', 'Contact']].map(([href, label]) => (
            <Link key={href} href={href} className={`text-2xl font-manrope font-light ${textColor}`} onClick={() => setIsMenuOpen(false)}>
              {label}
            </Link>
          ))}

          {/* Social — X */}
          <a
            href="https://x.com/JusChadneo"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 text-sm transition-colors ${textMuted}`}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            @JusChadneo
          </a>
        </div>
      )}
    </>
  );
};

export default SoftDevHeader;

