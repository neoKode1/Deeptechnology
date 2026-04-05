'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import posthog from 'posthog-js';

/** Read the consent cookie set by CookieBanner (react-cookie-consent) */
function hasConsent(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some((c) => c.trim() === 'deeptech-cookie-consent=true');
}

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const LINKEDIN_PARTNER_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;

/**
 * PostHog page-view tracker.
 * Fires a $pageview event on every client-side route change.
 */
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!POSTHOG_KEY) return;
    if (pathname) {
      let url = window.location.origin + pathname;
      if (searchParams?.toString()) url += '?' + searchParams.toString();
      posthog.capture('$pageview', { $current_url: url });
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * Analytics — single component that boots all three tracking tools.
 *
 * Gating: each tool only initialises when its env var is present.
 * Safe to include in layout with placeholder/missing vars — no errors thrown.
 *
 * Tools:
 *   PostHog   — NEXT_PUBLIC_POSTHOG_KEY
 *   Meta Pixel — NEXT_PUBLIC_META_PIXEL_ID
 *   LinkedIn  — NEXT_PUBLIC_LINKEDIN_PARTNER_ID
 */
export default function Analytics() {
  const [consent, setConsent] = useState(false);

  // Boot PostHog once on mount (legitimate interest — no consent gate)
  useEffect(() => {
    if (!POSTHOG_KEY) return;
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false, // We handle this manually via PostHogPageView
      capture_pageleave: true,
    });
  }, []);

  // Listen for consent cookie — fires when user clicks Accept in CookieBanner
  useEffect(() => {
    setConsent(hasConsent());
    const id = setInterval(() => setConsent(hasConsent()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* PostHog page-view tracker */}
      {POSTHOG_KEY && <PostHogPageView />}

      {/* ── Meta Pixel — only after explicit consent ─────────────────────────── */}
      {consent && META_PIXEL_ID && (
        <>
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');
fbq('track','PageView');`,
            }}
          />
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* ── LinkedIn Insight Tag — only after explicit consent ───────────────── */}
      {consent && LINKEDIN_PARTNER_ID && (
        <Script
          id="linkedin-insight"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
_linkedin_partner_id="${LINKEDIN_PARTNER_ID}";
window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];
var b=document.createElement("script");b.type="text/javascript";b.async=true;
b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b,s)})(window.lintrk);`,
          }}
        />
      )}
    </>
  );
}
