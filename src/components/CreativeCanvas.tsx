'use client';

import { useEffect, useRef } from 'react';

/**
 * Unicorn Studio SDK v2.1.5 — matches the version tag in effect_mask_remix.json.
 * Served via jsDelivr so no build-time download is required.
 */
const SDK_SRC =
  'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.5/dist/unicornStudio.umd.js';

/** The compiled scene JSON lives in /public/media/ → served at this URL. */
const SCENE_SRC = '/media/effect_mask_remix%20(1).json';

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
 * Renders the full Creative Division Unicorn Studio scene from
 * effect_mask_remix.json — all layers including gradient, mask effects,
 * sine-wave distortion, and chromatic aberration rendered by the official SDK.
 *
 * The SDK is loaded once from the CDN and initialised via data attributes so
 * React StrictMode double-invocations are handled gracefully.
 */
export default function CreativeCanvas({ className = '' }: { className?: string }) {
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
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
