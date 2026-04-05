'use client';

/**
 * GDPR / CCPA cookie consent banner.
 *
 * On "Accept": sets the `deeptech-cookie-consent=true` cookie (1 year) so
 * Analytics.tsx can gate Meta Pixel + LinkedIn behind explicit consent.
 *
 * On "Decline": sets the cookie to `false` so the banner doesn't re-appear,
 * and third-party pixels are not loaded.
 *
 * PostHog is treated as a product analytics tool (legitimate interest) and
 * initialises regardless, but you can gate it too by checking the cookie there.
 */

import CookieConsent from 'react-cookie-consent';

export default function CookieBanner() {
  return (
    <CookieConsent
      cookieName="deeptech-cookie-consent"
      cookieValue="true"
      declineCookieValue="false"
      enableDeclineButton
      // Keep banner visible until user makes a choice
      expires={365}
      // Style — minimal dark strip matching the site palette
      style={{
        background: '#0a0a0a',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        fontFamily: "'Manrope', 'Helvetica Neue', sans-serif",
        fontSize: '12px',
        color: 'rgba(255,255,255,0.55)',
        padding: '12px 24px',
        alignItems: 'center',
        gap: '16px',
        zIndex: 99999,
      }}
      contentStyle={{ margin: 0, flex: 1 }}
      buttonStyle={{
        background: '#fff',
        color: '#111',
        fontFamily: "'Manrope', 'Helvetica Neue', sans-serif",
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '0.05em',
        borderRadius: '4px',
        padding: '6px 16px',
        margin: '0 0 0 12px',
        cursor: 'pointer',
      }}
      declineButtonStyle={{
        background: 'transparent',
        color: 'rgba(255,255,255,0.3)',
        fontFamily: "'Manrope', 'Helvetica Neue', sans-serif",
        fontSize: '11px',
        letterSpacing: '0.05em',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '4px',
        padding: '6px 16px',
        margin: '0 0 0 8px',
        cursor: 'pointer',
      }}
      buttonText="Accept"
      declineButtonText="Decline"
    >
      We use cookies to understand how visitors use our site and to serve
      relevant ads. See our{' '}
      <a href="/privacy" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}>
        Privacy Policy
      </a>
      .
    </CookieConsent>
  );
}
