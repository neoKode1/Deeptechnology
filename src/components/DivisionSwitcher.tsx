'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code2, Clapperboard, Bot } from 'lucide-react';

/**
 * Top bar that lets users switch between the three site divisions:
 * - Software Development Division  →  /
 * - Creative Division              →  /creative
 * - Robotics Division              →  /robotics
 */
const DivisionSwitcher = () => {
  const pathname = usePathname();

  const isCreative =
    pathname.startsWith('/creative') ||
    pathname === '/about' ||
    pathname === '/gallery' ||
    pathname === '/contact';

  const isRobotics = pathname.startsWith('/robotics');
  const isSoftDev = !isCreative && !isRobotics;

  // Light theme on Software Dev, dark theme on Robotics/Creative
  const isLight = isSoftDev;

  return (
    <div className={`w-full py-2 px-4 md:px-12 lg:px-20 flex items-center justify-center gap-2 text-xs z-50 relative ${
      isLight ? 'bg-[#fdfcfc] border-b border-[#eee]' : 'bg-transparent'
    }`}>
      <span className={`hidden sm:inline mr-3 font-light tracking-normal text-[11px] ${
        isLight ? 'text-[#111]/40' : 'text-white/50'
      }`}>
        Deeptech&nbsp;&nbsp;·&nbsp;&nbsp;Chad Neo
      </span>

      <div className={`flex items-center gap-1 rounded-full p-1 ${
        isLight ? 'bg-black/8 border border-[#ddd]' : 'bg-white/10'
      }`}>
        {/* Software Development Division */}
        <Link
          href="/"
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-all duration-200 ${
            isSoftDev
              ? 'bg-[#111] text-white font-medium'
              : isLight
                ? 'text-[#111]/60 hover:text-[#111]'
                : 'text-white/70 hover:text-white'
          }`}
        >
          <Code2 className="w-3 h-3" />
          <span className="hidden sm:inline">Software Dev</span>
          <span className="sm:hidden">Dev</span>
        </Link>

        {/* Robotics Division */}
        <Link
          href="/robotics"
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-all duration-200 ${
            isRobotics
              ? isLight ? 'bg-[#111] text-white font-medium' : 'bg-white text-[#111] font-medium'
              : isLight
                ? 'text-[#111]/60 hover:text-[#111]'
                : 'text-white/70 hover:text-white'
          }`}
        >
          <Bot className="w-3 h-3" />
          <span className="hidden sm:inline">Robotics</span>
          <span className="sm:hidden">Robots</span>
        </Link>

        {/* Creative Division */}
        <Link
          href="/creative"
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-all duration-200 ${
            isCreative
              ? isLight ? 'bg-[#111] text-white font-medium' : 'bg-white text-[#111] font-medium'
              : isLight
                ? 'text-[#111]/60 hover:text-[#111]'
                : 'text-white/70 hover:text-white'
          }`}
        >
          <Clapperboard className="w-3 h-3" />
          <span className="hidden sm:inline">Media</span>
          <span className="sm:hidden">Media</span>
        </Link>
      </div>
    </div>
  );
};

export default DivisionSwitcher;

