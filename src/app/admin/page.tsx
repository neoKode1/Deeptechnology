'use client';

import Link from 'next/link';
import { ClipboardList, Cpu, Store, ArrowRight, LogOut } from 'lucide-react';

async function logout() {
  await fetch('/api/admin/logout', { method: 'POST' });
  window.location.href = '/admin/login';
}

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
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-2">Deeptech · Admin</p>
            <h1 className="text-3xl font-semibold text-white">Toolbox</h1>
            <p className="text-neutral-400 text-sm mt-2">Everything you need to run assessments, manage quotes, and source vendors.</p>
          </div>
          <button onClick={logout} className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-white transition-colors mt-1">
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
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
