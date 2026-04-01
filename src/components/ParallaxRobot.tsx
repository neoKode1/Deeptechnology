'use client';

import { useEffect, useRef } from 'react';

/**
 * Parallax Spline 3D robot background.
 * The iframe is taller than the viewport (200vh). As the user scrolls
 * from top to bottom of the page, the iframe translates upward so you
 * scan from the robot's head down to its feet.
 */
export default function ParallaxRobot() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let target = 0;   // where scroll wants us (px)
    let current = 0;  // where we actually are (px) — lerps toward target
    let rafId = 0;

    const EASE = 0.06; // lower = silkier glide (0.04–0.1 sweet spot)

    // Runs every frame — smoothly interpolates toward the target
    const tick = () => {
      const el = iframeRef.current;
      if (el) {
        current += (target - current) * EASE;
        // Snap when close enough to avoid infinite micro-updates
        if (Math.abs(target - current) < 0.5) current = target;
        el.style.transform = `translateY(-${current}px)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollMax > 0 ? window.scrollY / scrollMax : 0;
      target = progress * window.innerHeight;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="https://my.spline.design/nexbotrobotcharacterconcept-FDt7cww2KDcL0RxmRfz1cZG7/"
      className="fixed top-0 left-0 w-full pointer-events-none will-change-transform"
      style={{ border: 'none', zIndex: 0, height: '200vh' }}
      title="3D Robot Scene"
      loading="eager"
    />
  );
}

