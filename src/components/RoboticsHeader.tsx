'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import DivisionSwitcher from './DivisionSwitcher';

/**
 * Navigation header for the Robotics Division.
 * Dark theme matching the Deeptech / robotics aesthetic.
 */
const RoboticsHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Fixed header overlays the hero so the full viewport shows the shader */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <DivisionSwitcher />
        <nav className="w-full flex items-center justify-between px-6 py-5 md:px-12 lg:px-20 bg-transparent border-b border-white/10 relative z-40">
        {/* Brand */}
        <Link
          href="/robotics"
          className="font-manrope text-2xl font-semibold tracking-tight text-white"
        >
          Chad Neo
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-normal text-white/70">
          <Link href="/robotics" className="hover:text-white transition-colors">Home</Link>
          <Link href="/robotics#about" className="hover:text-white transition-colors">About</Link>
          <Link href="/robotics#projects" className="hover:text-white transition-colors">Projects</Link>
          <Link href="/robotics#contact" className="hover:text-white transition-colors">Contact</Link>
        </div>

        {/* Desktop CTA + mobile hamburger */}
        <div className="flex items-center gap-4">
          <Link
            href="/robotics#contact"
            className="hidden md:flex items-center gap-2 bg-white text-[#111] rounded-full py-2 px-5 text-sm font-normal hover:bg-white/90 transition-colors"
          >
            <span>Let&apos;s build</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[calc(2.75rem+4.25rem)] bg-black/90 backdrop-blur-md z-40 flex flex-col px-6 py-8 gap-6 border-t border-white/10">
          {['/robotics', '/robotics#about', '/robotics#projects', '/robotics#contact'].map((href, i) => {
            const labels = ['Home', 'About', 'Projects', 'Contact'];
            return (
              <Link
                key={href}
                href={href}
                className="text-xl font-manrope text-white border-b border-white/10 pb-4"
                onClick={() => setIsMenuOpen(false)}
              >
                {labels[i]}
              </Link>
            );
          })}
          <Link
            href="/robotics#contact"
            className="flex items-center gap-2 bg-white text-[#111] rounded-full py-2 px-5 text-sm font-normal self-start mt-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <span>Let&apos;s build</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </>
  );
};

export default RoboticsHeader;

