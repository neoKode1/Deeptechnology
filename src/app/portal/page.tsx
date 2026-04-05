'use client';

import { useState } from 'react';
import Link from 'next/link';
import SoftDevHeader from '@/components/SoftDevHeader';

export default function PortalPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/portal/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SoftDevHeader />

      <main className="flex flex-col items-center justify-center min-h-screen px-6 pb-16">
        <div className="w-full max-w-sm">

          {/* Brand eyelet */}
          <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-600 mb-6 font-manrope text-center">
            Deep Tech · Customer Portal
          </p>

          {status !== 'sent' ? (
            <>
              <h1 className="text-2xl font-semibold text-white font-manrope mb-2 text-center">
                Access your orders
              </h1>
              <p className="text-sm text-neutral-500 font-manrope text-center mb-8 leading-relaxed">
                Enter the email address you used when placing your order.<br />
                We'll send you a secure access link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors font-manrope"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-white text-black rounded-lg py-3 text-sm font-semibold font-manrope hover:bg-neutral-100 transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? 'Sending…' : 'Send Access Link →'}
                </button>
              </form>

              {status === 'error' && (
                <p className="text-red-400 text-xs font-manrope text-center mt-4">
                  Something went wrong. Please try again or{' '}
                  <a href="mailto:info@deeptechnologies.dev" className="underline">email us</a>.
                </p>
              )}
            </>
          ) : (
            /* Success state */
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-900/30 border border-emerald-800/50 flex items-center justify-center mx-auto mb-6">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white font-manrope mb-2">Check your inbox</h2>
              <p className="text-sm text-neutral-500 font-manrope leading-relaxed mb-8">
                We sent an access link to <strong className="text-neutral-300">{email}</strong>.
                It expires in 1 hour.
              </p>
              <button
                onClick={() => { setStatus('idle'); setEmail(''); }}
                className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors font-manrope underline"
              >
                Try a different email
              </button>
            </div>
          )}

          <p className="text-center mt-10 text-xs text-neutral-700 font-manrope">
            Don't have an order yet?{' '}
            <Link href="/contact" className="text-neutral-500 hover:text-neutral-300 transition-colors underline">
              Get in touch
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
