'use client';

import React, { useEffect, useRef } from 'react';

const SDK_SRC =
  'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.5/dist/unicornStudio.umd.js';

const SCENE_SRC = '/media/aurora_3d_remix-spinner.json';

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
 * Renders the Aurora 3D spinner Unicorn Studio scene.
 * Used as a decorative fill on the contact page right column.
 */
export default function AuroraCanvas({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
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
      style={{ display: 'block', width: '100%', height: '100%', pointerEvents: 'none', ...style }}
    />
  );
}

