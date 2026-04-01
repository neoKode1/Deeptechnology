'use client';

import { useEffect, useRef } from 'react';

/**
 * Unicorn Studio SDK v2.1.5 — same version as the Creative canvas.
 */
const SDK_SRC =
  'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.5/dist/unicornStudio.umd.js';

/** The compiled scene JSON for the Software hero background. */
const SCENE_SRC = '/media/arsa_remix.json';

declare global {
  interface Window {
    UnicornStudio: {
      isInitialized?: boolean;
      init: () => Promise<Array<{ destroy: () => void }>>;
      destroy: () => void;
    };
  }
}

/**
 * Renders the Software Division Unicorn Studio hero background
 * from arsa_remix.json using the official SDK.
 */
export default function SoftwareHeroCanvas({ className = '' }: { className?: string }) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = () => {
      window.UnicornStudio?.init().catch(console.error);
    };

    if (window.UnicornStudio?.isInitialized) {
      init();
      return () => { window.UnicornStudio?.destroy(); };
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', init, { once: true });
      return () => {
        existing.removeEventListener('load', init);
        window.UnicornStudio?.destroy();
      };
    }

    const script = document.createElement('script');
    script.src = SDK_SRC;
    script.onload = () => {
      window.UnicornStudio.isInitialized = true;
      init();
    };
    document.head.appendChild(script);

    return () => {
      window.UnicornStudio?.destroy();
    };
  }, []);

  return (
    <div
      ref={divRef}
      data-us-project-src={SCENE_SRC}
      data-us-scale="1"
      data-us-dpi="1.5"
      data-us-fps="60"
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}

