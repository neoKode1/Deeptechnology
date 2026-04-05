'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

/**
 * Global error boundary — catches React rendering errors in the App Router
 * and reports them to Sentry. Required by Sentry for full error coverage.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body style={{ fontFamily: 'sans-serif', padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#111' }}>Something went wrong</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>
          Our team has been notified. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            background: '#111',
            color: '#fff',
            border: 'none',
            padding: '10px 24px',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
