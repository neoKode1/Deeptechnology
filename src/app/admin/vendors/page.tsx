'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink, Mail, Phone, ShoppingCart, MessageSquare, Plus, X, Loader2 } from 'lucide-react';
import type { VendorProspect } from '@/app/api/admin/vendors/prospects/route';
import {
  VENDORS,
  BUY_PATH_LABELS,
  BUY_PATH_COLORS,
  type Vendor,
} from '@/data/vendors';
import { VENDOR_IMAGES } from '@/data/vendor-images';
import { CATEGORY_META } from '@/data/categories';
import QuickInquiryMenu from '@/components/admin/QuickInquiryMenu';
import ProductInquiryButton from '@/components/admin/ProductInquiryButton';
import OutreachHistory from '@/components/admin/OutreachHistory';

const CATEGORY_LABELS: Record<Vendor['category'], string> = {
  humanoid:    '🤖 Humanoid',
  delivery:    '📦 Delivery',
  industrial:  '🏭 Industrial / AMR',
  drone:       '🚁 Drones',
  cobot:       '🦾 Cobots & Arms',
  surgical:    '🏥 Surgical',
  service:     '🍽️ Service',
  agricultural:'🌾 Agricultural',
  security:    '🔒 Security',
  cleaning:    '🧹 Cleaning',
  exoskeleton: '🦿 Exoskeletons',
  components:  '⚙️ Components',
  quadruped:   '🐕 Quadruped',
  underwater:  '🤿 Underwater',
  inspection:  '🔍 Inspection',
  defense:     '🛡️ Defense',
};

const CATEGORIES: Vendor['category'][] = [
  'humanoid', 'delivery', 'industrial', 'drone',
  'cobot', 'service', 'cleaning', 'security',
  'quadruped', 'agricultural', 'surgical',
  'inspection', 'underwater', 'exoskeleton', 'components', 'defense',
];

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

const PROSPECT_CATEGORIES: { value: VendorProspect['category']; label: string }[] = [
  { value: 'amr', label: 'AMR / Warehouse Robot' },
  { value: 'humanoid', label: 'Humanoid Robot' },
  { value: 'delivery', label: 'Delivery Robot' },
  { value: 'drone', label: 'Drone' },
  { value: 'software', label: 'Software / AI Platform' },
  { value: 'other', label: 'Other' },
];

const STATUS_BADGE: Record<VendorProspect['status'], string> = {
  prospect: 'bg-yellow-950 text-yellow-400',
  evaluating: 'bg-blue-950 text-blue-400',
  active: 'bg-green-950 text-green-400',
};

const EMPTY_FORM: Omit<VendorProspect, 'id' | 'createdAt'> = {
  companyName: '', productName: '', category: 'other',
  contactName: '', contactEmail: '', contactPhone: '',
  website: '', notes: '', status: 'prospect', metAt: '',
};

export default function AdminVendorsPage() {
  const [activeCategory, setActiveCategory] = useState<Vendor['category'] | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [prospects, setProspects] = useState<VendorProspect[]>([]);

  function setF<K extends keyof typeof EMPTY_FORM>(k: K, v: typeof EMPTY_FORM[K]) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  useEffect(() => {
    fetch('/api/admin/vendors/prospects')
      .then(r => r.json())
      .then(d => setProspects(d.prospects ?? []))
      .catch(() => {});
  }, []);

  async function handleAddVendor(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/admin/vendors/prospects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const { prospect } = await res.json();
      setProspects(prev => [prospect, ...prev]);
      setForm({ ...EMPTY_FORM });
      setShowForm(false);
    }
    setSaving(false);
  }

  const displayed = activeCategory === 'all'
    ? VENDORS
    : VENDORS.filter(v => v.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <nav className="flex items-center gap-1 mb-8 text-xs">
          <Link href="/admin" className="text-zinc-500 hover:text-white transition-colors px-2 py-1 rounded">Toolbox</Link>
          <span className="text-zinc-700">/</span>
          <span className="text-white px-2 py-1">Vendor Intelligence</span>
          <span className="flex-1" />
          <Link href="/admin/assessment" className="text-zinc-500 hover:text-white transition-colors px-2 py-1 rounded">Assessment</Link>
          <Link href="/admin/quotes" className="text-zinc-500 hover:text-white transition-colors px-2 py-1 rounded">Quotes</Link>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Vendor Intelligence</h1>
            <p className="text-zinc-400 text-sm mt-1">{VENDORS.length} catalog vendors · {prospects.length} field prospects</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-neutral-100 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Vendor
          </button>
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

        {/* ── Field Prospects ───────────────────────────────────────────── */}
        {prospects.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-semibold">Field Prospects</h2>
              <span className="text-xs bg-yellow-950 text-yellow-400 px-2 py-0.5 rounded-full">{prospects.length} contacts</span>
            </div>
            <div className="space-y-4">
              {prospects.map(p => (
                <div key={p.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="font-semibold text-white">{p.companyName}</span>
                      {p.productName && <span className="text-neutral-400 text-sm ml-2">— {p.productName}</span>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${STATUS_BADGE[p.status]}`}>{p.status}</span>
                      <span className="text-[10px] uppercase tracking-widest text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-full">{p.category}</span>
                    </div>
                  </div>
                  <div className="text-sm text-neutral-400 space-y-0.5">
                    <p>👤 {p.contactName}{p.contactEmail && ` · ${p.contactEmail}`}{p.contactPhone && ` · ${p.contactPhone}`}</p>
                    {p.metAt && <p>📍 Met at: {p.metAt}</p>}
                    {p.website && <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs">{p.website}</a>}
                    {p.notes && <p className="text-neutral-500 text-xs mt-1 italic">{p.notes}</p>}
                  </div>
                  <p className="text-[10px] text-neutral-700 mt-2">{new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Add Vendor Slide-In Form ──────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowForm(false)} />
          <div className="relative bg-[#111] border-l border-neutral-800 w-full max-w-md h-full overflow-y-auto p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Add Vendor to List</h2>
              <button onClick={() => setShowForm(false)} className="text-neutral-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVendor} className="space-y-4 flex-1">
              {([
                ['Company / Org Name *', 'companyName', 'text', 'e.g. Acme Robotics'],
                ['Product / System Name', 'productName', 'text', 'e.g. Scout AMR v2'],
                ['Contact Name *', 'contactName', 'text', 'e.g. Jane Smith'],
                ['Contact Email', 'contactEmail', 'email', 'jane@acmerobotics.com'],
                ['Contact Phone', 'contactPhone', 'tel', '+1 415 000 0000'],
                ['Website', 'website', 'url', 'https://acmerobotics.com'],
                ['Where / How You Met', 'metAt', 'text', 'e.g. CES 2025, LinkedIn, cold outreach'],
              ] as [string, keyof typeof EMPTY_FORM, string, string][]).map(([label, field, type, placeholder]) => (
                <div key={field}>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-1">{label}</label>
                  <input type={type} value={form[field] as string} placeholder={placeholder}
                    required={label.includes('*')}
                    onChange={e => setF(field, e.target.value as never)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-white transition-colors" />
                </div>
              ))}

              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-1">Category *</label>
                <select value={form.category} onChange={e => setF('category', e.target.value as VendorProspect['category'])}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-white transition-colors">
                  {PROSPECT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-1">Status</label>
                <select value={form.status} onChange={e => setF('status', e.target.value as VendorProspect['status'])}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-white transition-colors">
                  <option value="prospect">Prospect — Just met</option>
                  <option value="evaluating">Evaluating — Reviewing their product</option>
                  <option value="active">Active — On our vendor list</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-1">Notes</label>
                <textarea value={form.notes} rows={3}
                  placeholder="What are they building? Stage? Pricing? Anything worth remembering."
                  onChange={e => setF('notes', e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-white transition-colors resize-none" />
              </div>

              <button type="submit" disabled={saving}
                className="w-full bg-white text-black rounded-lg py-3 text-sm font-semibold hover:bg-neutral-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Save Vendor →'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  const [expanded, setExpanded] = useState(false);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const pathColor = BUY_PATH_COLORS[vendor.buyPath];
  const pathLabel = BUY_PATH_LABELS[vendor.buyPath];
  const heroImage = VENDOR_IMAGES[vendor.id] ?? CATEGORY_META[vendor.category]?.image;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Vendor hero thumbnail — falls back to category image */}
          <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700">
            {heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={heroImage} alt={vendor.name} className="w-full h-full object-cover object-top" />
            ) : null}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h3 className="font-semibold text-white">
                <Link
                  href={`/robotics/${vendor.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                  title="Open public vendor page in a new tab"
                >
                  {vendor.name}
                  <ExternalLink size={12} className="text-zinc-500" />
                </Link>
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${pathColor}`}>{pathLabel}</span>
              <span className="text-xs text-zinc-500 capitalize">{vendor.category}</span>
            </div>
            {vendor.leadTime && (
              <p className="text-xs text-zinc-500">⏱ Lead time: {vendor.leadTime}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <QuickInquiryMenu vendor={vendor} onSent={() => { setHistoryRefresh(n => n + 1); setExpanded(true); }} />
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-xs text-zinc-400 hover:text-white transition"
          >
            {expanded ? 'Collapse ▲' : 'Details ▼'}
          </button>
        </div>
      </div>

      {/* Products table */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-zinc-500 border-b border-zinc-800">
              <th className="pb-2 pr-3 font-medium w-10"></th>
              <th className="text-left pb-2 pr-4 font-medium">Model</th>
              <th className="text-left pb-2 pr-4 font-medium">Price</th>
              <th className="text-left pb-2 pr-4 font-medium">Status</th>
              <th className="text-left pb-2 font-medium">Order</th>
            </tr>
          </thead>
          <tbody>
            {vendor.products.map((p, i) => (
              <tr key={i} className="border-b border-zinc-800/50 last:border-0">
                <td className="py-2 pr-3">
                  <div className="w-8 h-8 rounded-md overflow-hidden bg-zinc-900 border border-zinc-800">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover object-top" />
                    ) : null}
                  </div>
                </td>
                <td className="py-2 pr-4 text-zinc-200 font-medium">{p.name}</td>
                <td className="py-2 pr-4 text-zinc-300 font-mono text-xs">
                  {p.price}
                  {p.deposit && <span className="ml-2 text-yellow-400/80">· {p.deposit}</span>}
                </td>
                <td className={`py-2 pr-4 text-xs ${STATUS_COLORS[p.status]}`}>{STATUS_LABELS[p.status]}</td>
                <td className="py-2">
                  <div className="flex items-center gap-3">
                    {p.orderUrl ? (
                      <a href={p.orderUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition">
                        <ShoppingCart size={11} /> Order
                      </a>
                    ) : (
                      <span className="text-xs text-zinc-600">—</span>
                    )}
                    <ProductInquiryButton
                      vendor={vendor}
                      productName={p.name}
                      onSent={() => { setHistoryRefresh(n => n + 1); setExpanded(true); }}
                    />
                  </div>
                  {p.notes && <p className="text-[11px] text-zinc-600 mt-0.5 max-w-xs">{p.notes}</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contacts + outreach history */}
      {expanded && (
        <div className="border-t border-zinc-800 pt-4 space-y-4">
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
          <div className="pt-2 border-t border-zinc-800/50">
            <OutreachHistory vendorId={vendor.id} refreshKey={historyRefresh} />
          </div>
        </div>
      )}
    </div>
  );
}

