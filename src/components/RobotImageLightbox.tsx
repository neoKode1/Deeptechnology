'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface Props {
  src: string;
  alt: string;
}

export default function RobotImageLightbox({ src, alt }: Props) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, close]);

  /* Prevent body scroll when open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Thumbnail — clickable */}
      <button
        onClick={() => setOpen(true)}
        className="group relative flex items-center justify-center w-full h-full rounded-2xl bg-neutral-950 border border-neutral-900 overflow-hidden"
        style={{ minHeight: '400px' }}
        aria-label={`Enlarge image of ${alt}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full max-h-[560px] object-contain p-6 transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {/* Hover hint */}
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 border border-white/10 backdrop-blur-sm text-white/60 text-[10px] font-manrope rounded-full px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <ZoomIn className="w-3 h-3" />
          Click to enlarge
        </span>
      </button>

      {/* Lightbox overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`Full view of ${alt}`}
        >
          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Image — stop propagation so clicking the image doesn't close */}
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />

          {/* Caption */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/40 font-manrope pointer-events-none">
            {alt} &nbsp;·&nbsp; Press <kbd className="text-white/60">Esc</kbd> to close
          </p>
        </div>
      )}
    </>
  );
}
