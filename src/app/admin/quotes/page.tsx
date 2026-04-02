'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, Package, ExternalLink, RefreshCw } from 'lucide-react';
import type { Quote, QuoteStatus, QuoteRouting } from '@/lib/quotes/types';

const STATUSES: { value: string; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending_review', label: 'Under Review' },
  { value: 'sent', label: 'Sent' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'ordered', label: 'Ordered' },
  { value: 'expired', label: 'Expired' },
  { value: 'rejected', label: 'Rejected' },
];

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-yellow-900/30 text-yellow-400 border-yellow-800/40',
  pending_review: 'bg-blue-900/30 text-blue-400 border-blue-800/40',
  sent: 'bg-cyan-900/30 text-cyan-400 border-cyan-800/40',
  accepted: 'bg-green-900/30 text-green-400 border-green-800/40',
  ordered: 'bg-green-900/30 text-green-300 border-green-700/40',
  expired: 'bg-red-900/30 text-red-400 border-red-800/40',
  rejected: 'bg-red-900/30 text-red-400 border-red-800/40',
};

const ROUTING_OPTIONS: { value: QuoteRouting['destination']; label: string }[] = [
  { value: 'noelle', label: 'Route to Noelle (auto-build)' },
  { value: 'vendor_order', label: 'Vendor Order (hardware)' },
  { value: 'manual', label: 'Manual / Custom Build' },
  { value: 'production', label: 'Production Pipeline' },
];

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionQuote, setActionQuote] = useState<string | null>(null);

  const fetchQuotes = useCallback(() => {
    setLoading(true);
    const url = filter ? '/api/quotes?status=' + filter : '/api/quotes';
    fetch(url)
      .then((r) => r.json())
      .then((data) => { setQuotes(data.quotes || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filter]);

  useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

  async function updateStatus(id: string, status: QuoteStatus) {
    setActionQuote(id);
    try {
      const res = await fetch('/api/quotes/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchQuotes();
    } finally {
      setActionQuote(null);
    }
  }

  async function routeQuote(id: string, destination: QuoteRouting['destination']) {
    setActionQuote(id);
    try {
      const res = await fetch('/api/quotes/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routing: { destination } }),
      });
      if (res.ok) fetchQuotes();
    } finally {
      setActionQuote(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition mb-6">
          <ArrowLeft size={14} /> Back to site
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Quote Dashboard</h1>
            <p className="text-zinc-400 text-sm mt-1">{quotes.length} quote{quotes.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-sm rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-500">
              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <button onClick={fetchQuotes} className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {loading && <p className="text-center text-zinc-500 py-12">Loading...</p>}
        {!loading && quotes.length === 0 && <p className="text-center text-zinc-500 py-12">No quotes found.</p>}

        {!loading && quotes.length > 0 && (
          <div className="space-y-4">
            {quotes.map((q) => (
              <QuoteRow key={q.id} quote={q} busy={actionQuote === q.id}
                onUpdateStatus={updateStatus} onRoute={routeQuote} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function QuoteRow({ quote: q, busy, onUpdateStatus, onRoute }: {
  quote: Quote; busy: boolean;
  onUpdateStatus: (id: string, s: QuoteStatus) => void;
  onRoute: (id: string, d: QuoteRouting['destination']) => void;
}) {
  const colorClass = STATUS_COLORS[q.status] || STATUS_COLORS.draft;
  const canSend = q.status === 'draft' || q.status === 'pending_review';
  const canOrder = q.status === 'accepted';

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-medium text-white truncate">{q.customerName}</h3>
            <span className={'text-xs px-2 py-0.5 rounded-full border ' + colorClass}>
              {q.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-zinc-400 truncate">{q.summary}</p>
          <div className="flex flex-wrap gap-4 mt-2 text-xs text-zinc-500">
            <span>{q.inquiryType}</span>
            <span>{q.customerEmail}</span>
            <span>Created {fmtDate(q.createdAt)}</span>
            <span>Expires {fmtDate(q.expiresAt)}</span>
            {q.routing && <span className="text-cyan-500">→ {q.routing.destination}</span>}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-semibold font-mono text-white">{fmt(q.total)}</p>
          <p className="text-xs text-zinc-500">{q.lineItems.length} item{q.lineItems.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-800/60">
        <Link href={'/quote/' + q.id} target="_blank"
          className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition px-2 py-1 rounded bg-zinc-800/50">
          <ExternalLink size={12} /> View
        </Link>

        {canSend && (
          <button onClick={() => onUpdateStatus(q.id, 'sent')} disabled={busy}
            className="text-xs px-3 py-1 rounded bg-cyan-900/40 text-cyan-400 border border-cyan-800/40 hover:bg-cyan-900/60 transition disabled:opacity-50">
            Mark as Sent
          </button>
        )}

        {canOrder && (
          <button onClick={() => onUpdateStatus(q.id, 'ordered')} disabled={busy}
            className="text-xs px-3 py-1 rounded bg-green-900/40 text-green-400 border border-green-800/40 hover:bg-green-900/60 transition disabled:opacity-50">
            Place Order
          </button>
        )}

        {(q.status !== 'rejected' && q.status !== 'expired' && q.status !== 'ordered') && (
          <button onClick={() => onUpdateStatus(q.id, 'rejected')} disabled={busy}
            className="text-xs px-3 py-1 rounded bg-red-900/20 text-red-400/70 border border-red-900/30 hover:bg-red-900/40 transition disabled:opacity-50">
            Reject
          </button>
        )}

        <div className="ml-auto">
          <select
            value={q.routing?.destination || ''}
            onChange={(e) => { if (e.target.value) onRoute(q.id, e.target.value as QuoteRouting['destination']); }}
            disabled={busy}
            className="bg-zinc-800/60 border border-zinc-700/50 text-xs rounded px-2 py-1 text-zinc-300 focus:outline-none disabled:opacity-50"
          >
            <option value="">Route to...</option>
            {ROUTING_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

