'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Mail, Phone, ShoppingCart, MessageSquare } from 'lucide-react';
import {
  VENDORS,
  BUY_PATH_LABELS,
  BUY_PATH_COLORS,
  type Vendor,
} from '@/data/vendors';

const CATEGORY_LABELS: Record<Vendor['category'], string> = {
  humanoid: '🤖 Humanoid Robots',
  delivery: '📦 Delivery Robots',
  industrial: '🏭 Industrial / Warehouse',
  drone: '🚁 Drones',
};

const CATEGORIES: Vendor['category'][] = ['humanoid', 'delivery', 'industrial', 'drone'];

const STATUS_COLORS: Record<string, string> = {
  in_stock: 'text-emerald-400',
  pre_order: 'text-yellow-400',
  raas: 'text-cyan-400',
  not_available: 'text-red-400',
  quote_required: 'text-zinc-400',
};

const STATUS_LABELS: Record<string, string> = {
  in_stock: 'In Stock',
  pre_order: 'Pre-Order',
  raas: 'RaaS',
  not_available: 'N/A',
  quote_required: 'Quote Required',
};

export default function AdminVendorsPage() {
  const [authed, setAuthed] = useState(false);
  const [loginSecret, setLoginSecret] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeCategory, setActiveCategory] = useState<Vendor['category'] | 'all'>('all');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: loginSecret }),
    });
    if (res.ok) {
      setAuthed(true);
    } else {
      setLoginError('Invalid credentials');
    }
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 w-full max-w-sm">
          <h2 className="text-lg font-semibold mb-4">Admin Access</h2>
          <input
            type="password"
            value={loginSecret}
            onChange={e => setLoginSecret(e.target.value)}
            placeholder="Enter admin secret"
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition mb-3"
          />
          {loginError && <p className="text-red-400 text-sm mb-3">{loginError}</p>}
          <button type="submit" className="w-full bg-white text-black rounded-lg py-2.5 text-sm font-medium hover:bg-zinc-200 transition">
            Sign In
          </button>
        </form>
      </main>
    );
  }

  const displayed = activeCategory === 'all'
    ? VENDORS
    : VENDORS.filter(v => v.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link href="/admin/quotes" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition mb-6">
          <ArrowLeft size={14} /> Quote Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Vendor Intelligence</h1>
            <p className="text-zinc-400 text-sm mt-1">{VENDORS.length} vendors · contacts, pricing &amp; procurement paths</p>
          </div>
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {(['all', ...CATEGORIES] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  activeCategory === cat
                    ? 'bg-white text-black border-white'
                    : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {displayed.map(vendor => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </div>
    </main>
  );
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  const [expanded, setExpanded] = useState(false);
  const pathColor = BUY_PATH_COLORS[vendor.buyPath];
  const pathLabel = BUY_PATH_LABELS[vendor.buyPath];

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h3 className="font-semibold text-white">{vendor.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${pathColor}`}>{pathLabel}</span>
            <span className="text-xs text-zinc-500 capitalize">{vendor.category}</span>
          </div>
          {vendor.leadTime && (
            <p className="text-xs text-zinc-500">⏱ Lead time: {vendor.leadTime}</p>
          )}
        </div>
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-xs text-zinc-400 hover:text-white transition shrink-0"
        >
          {expanded ? 'Collapse ▲' : 'Details ▼'}
        </button>
      </div>

      {/* Products table */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-zinc-500 border-b border-zinc-800">
              <th className="text-left pb-2 pr-4 font-medium">Model</th>
              <th className="text-left pb-2 pr-4 font-medium">Price</th>
              <th className="text-left pb-2 pr-4 font-medium">Status</th>
              <th className="text-left pb-2 font-medium">Order</th>
            </tr>
          </thead>
          <tbody>
            {vendor.products.map((p, i) => (
              <tr key={i} className="border-b border-zinc-800/50 last:border-0">
                <td className="py-2 pr-4 text-zinc-200 font-medium">{p.name}</td>
                <td className="py-2 pr-4 text-zinc-300 font-mono text-xs">
                  {p.price}
                  {p.deposit && <span className="ml-2 text-yellow-400/80">· {p.deposit}</span>}
                </td>
                <td className={`py-2 pr-4 text-xs ${STATUS_COLORS[p.status]}`}>{STATUS_LABELS[p.status]}</td>
                <td className="py-2">
                  {p.orderUrl ? (
                    <a href={p.orderUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition">
                      <ShoppingCart size={11} /> Order
                    </a>
                  ) : (
                    <span className="text-xs text-zinc-600">—</span>
                  )}
                  {p.notes && <p className="text-[11px] text-zinc-600 mt-0.5 max-w-xs">{p.notes}</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contacts */}
      {expanded && (
        <div className="border-t border-zinc-800 pt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {vendor.contacts.map((c, i) => {
              const isEmail = c.href?.startsWith('mailto:');
              const isPhone = c.href?.startsWith('tel:');
              const Icon = isEmail ? Mail : isPhone ? Phone : ExternalLink;
              return (
                <div key={i} className="flex items-start gap-2">
                  <Icon size={13} className="text-zinc-500 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-zinc-500">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-zinc-300 hover:text-white transition break-all">
                        {c.value}
                      </a>
                    ) : (
                      <p className="text-xs text-zinc-300 break-all">{c.value}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-start gap-2 pt-2 border-t border-zinc-800/50">
            <MessageSquare size={13} className="text-zinc-500 mt-0.5 shrink-0" />
            <p className="text-xs text-zinc-500">{vendor.procurementNotes}</p>
          </div>
        </div>
      )}
    </div>
  );
}

