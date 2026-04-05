'use client';

import { useState, useEffect, FormEvent } from 'react';
import type { Comparison } from '@/data/comparisons';

const TEASER_COUNT = 3; // rows always visible before the gate

interface Props {
  comparison: Comparison;
}

function WinnerBadge({ winner }: { winner: 'a' | 'b' | 'tie' | undefined }) {
  if (!winner || winner === 'tie') return null;
  return (
    <span className="ml-1.5 inline-block text-[10px] font-semibold uppercase tracking-widest text-emerald-400 border border-emerald-800/50 bg-emerald-900/20 rounded px-1.5 py-0.5">
      ✓ Wins
    </span>
  );
}

export default function ComparisonGate({ comparison }: Props) {
  const { slug, vendorALabel, vendorBLabel, criteria, verdict } = comparison;
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUnlocked(localStorage.getItem(`unlocked:${slug}`) === 'true');
    }
  }, [slug]);

  async function handleUnlock(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/compare/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, slug }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong');
      }
      localStorage.setItem(`unlocked:${slug}`, 'true');
      setUnlocked(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const teaser = criteria.slice(0, TEASER_COUNT);
  const locked = criteria.slice(TEASER_COUNT);

  return (
    <div className="mt-10">
      {/* Column headers */}
      <div className="grid grid-cols-3 gap-px mb-1 text-xs font-semibold uppercase tracking-widest text-neutral-500 px-1">
        <span>Criterion</span>
        <span className="text-center text-white">{vendorALabel}</span>
        <span className="text-center text-white">{vendorBLabel}</span>
      </div>

      {/* Always-visible teaser rows */}
      {teaser.map((row) => (
        <div key={row.label} className="grid grid-cols-3 gap-px border-t border-white/5 py-3 px-1">
          <span className="text-xs text-neutral-400 self-center">{row.label}</span>
          <span className="text-xs text-center text-white font-medium self-center">
            {row.a}
            {row.winner === 'a' && <WinnerBadge winner="a" />}
          </span>
          <span className="text-xs text-center text-white font-medium self-center">
            {row.b}
            {row.winner === 'b' && <WinnerBadge winner="b" />}
          </span>
        </div>
      ))}

      {/* Gate */}
      <div className="relative">
        {/* Blurred rows */}
        <div className={unlocked ? '' : 'blur-sm pointer-events-none select-none'}>
          {locked.map((row) => (
            <div key={row.label} className="grid grid-cols-3 gap-px border-t border-white/5 py-3 px-1">
              <span className="text-xs text-neutral-400 self-center">{row.label}</span>
              <span className="text-xs text-center text-white font-medium self-center">
                {row.a}
                {row.winner === 'a' && <WinnerBadge winner="a" />}
              </span>
              <span className="text-xs text-center text-white font-medium self-center">
                {row.b}
                {row.winner === 'b' && <WinnerBadge winner="b" />}
              </span>
            </div>
          ))}
        </div>

        {/* Email gate overlay */}
        {!unlocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-sm rounded-lg p-6">
            <p className="text-xs uppercase tracking-widest text-neutral-400 mb-2">
              {locked.length} more criteria
            </p>
            <h3 className="text-white font-semibold text-lg mb-1 text-center">
              Unlock the full breakdown
            </h3>
            <p className="text-neutral-400 text-sm mb-5 text-center max-w-xs">
              Enter your work email to reveal all criteria, scoring, and the deployment verdict — free.
            </p>
            <form onSubmit={handleUnlock} className="flex flex-col sm:flex-row gap-2 w-full max-w-sm">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-white text-[#111] rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-neutral-200 transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {loading ? 'Sending…' : 'Unlock →'}
              </button>
            </form>
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            <p className="text-neutral-600 text-xs mt-3">No spam. Unsubscribe anytime.</p>
          </div>
        )}
      </div>

      {/* Verdict — shown after unlock */}
      {unlocked && (
        <div className="mt-8 border border-white/10 rounded-xl p-6 bg-white/3">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Deployment Verdict</p>
          <p className="text-sm text-neutral-300 leading-relaxed mb-4">{verdict.summary}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="border border-white/10 rounded-lg p-4">
              <p className="text-xs text-neutral-500 mb-1">Choose {vendorALabel}</p>
              <p className="text-sm text-white leading-relaxed">{verdict.chooseA}</p>
            </div>
            <div className="border border-white/10 rounded-lg p-4">
              <p className="text-xs text-neutral-500 mb-1">Choose {vendorBLabel}</p>
              <p className="text-sm text-white leading-relaxed">{verdict.chooseB}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/contact?inquiry=robotics"
              className="inline-block bg-white text-[#111] rounded-full px-5 py-2 text-sm font-semibold hover:bg-neutral-200 transition-colors"
            >
              Get a Quote →
            </a>
            <a
              href="/pilot"
              className="inline-block border border-white/20 text-white rounded-full px-5 py-2 text-sm hover:border-white/50 transition-colors"
            >
              Start a Pilot
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
