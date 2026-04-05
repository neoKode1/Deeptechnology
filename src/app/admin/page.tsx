'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ClipboardList, Cpu, Store, ArrowRight } from 'lucide-react';

const TOOLS = [
  {
    href: '/admin/assessment',
    icon: Cpu,
    label: 'Assessment Engine',
    description: 'Run a site visit → get vendor matches, ROI model, deployment timeline, and convert to a quote.',
    badge: 'Field Tool',
    badgeColor: 'text-green-400 bg-green-950',
  },
  {
    href: '/admin/quotes',
    icon: ClipboardList,
    label: 'Quote Dashboard',
    description: 'Review incoming leads, send quotes, track payment status, and manage work orders.',
    badge: 'Core',
    badgeColor: 'text-blue-400 bg-blue-950',
  },
  {
    href: '/admin/vendors',
    icon: Store,
    label: 'Vendor Intelligence',
    description: 'Browse the full vendor catalog with contacts, pricing ranges, and procurement paths.',
    badge: 'Reference',
    badgeColor: 'text-neutral-400 bg-neutral-800',
  },
];

export default function AdminHub() {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret }),
    });
    setLoading(false);
    if (res.ok) {
      setAuthed(true);
    } else {
      setError('Invalid credentials.');
    }
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 w-full max-w-sm">
          <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-1">Deeptech</p>
          <h1 className="text-xl font-semibold text-white mb-6">Admin Access</h1>
          <input
            type="password"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            placeholder="Enter admin secret"
            required
            autoFocus
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none focus:border-white transition mb-3"
          />
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black rounded-lg py-3 text-sm font-semibold hover:bg-neutral-100 transition disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-2">Deeptech · Admin</p>
          <h1 className="text-3xl font-semibold text-white">Toolbox</h1>
          <p className="text-neutral-400 text-sm mt-2">Everything you need to run assessments, manage quotes, and source vendors.</p>
        </div>

        <div className="space-y-4">
          {TOOLS.map(({ href, icon: Icon, label, description, badge, badgeColor }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start justify-between gap-4 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-2xl p-6 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-neutral-800 group-hover:bg-neutral-700 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">{label}</span>
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
                  </div>
                  <p className="text-sm text-neutral-400">{description}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-white shrink-0 mt-1 transition-colors" />
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors">← Back to site</Link>
        </div>
      </div>
    </main>
  );
}
