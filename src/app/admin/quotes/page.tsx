'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, RefreshCw, MessageSquare, Play, X, Send, Ban } from 'lucide-react';
import type { Quote, QuoteStatus, QuoteRouting, QuoteMessage } from '@/lib/quotes/types';

const STATUSES: { value: string; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending_review', label: 'Under Review' },
  { value: 'sent', label: 'Sent' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'ordered', label: 'Ordered' },
  { value: 'procurement', label: 'Procurement' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'deployed', label: 'Deployed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'expired', label: 'Expired' },
  { value: 'rejected', label: 'Rejected' },
];

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-yellow-900/30 text-yellow-400 border-yellow-800/40',
  pending_review: 'bg-blue-900/30 text-blue-400 border-blue-800/40',
  sent: 'bg-cyan-900/30 text-cyan-400 border-cyan-800/40',
  accepted: 'bg-green-900/30 text-green-400 border-green-800/40',
  ordered: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/40',
  procurement: 'bg-purple-900/30 text-purple-400 border-purple-800/40',
  shipped: 'bg-blue-900/30 text-blue-300 border-blue-700/40',
  in_transit: 'bg-blue-900/30 text-blue-300 border-blue-700/40',
  delivered: 'bg-teal-900/30 text-teal-400 border-teal-800/40',
  deployed: 'bg-green-900/40 text-green-300 border-green-700/40',
  cancelled: 'bg-red-900/40 text-red-300 border-red-700/50',
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
  const [authed, setAuthed] = useState(false);
  const [loginSecret, setLoginSecret] = useState('');
  const [loginError, setLoginError] = useState('');
  const [replyQuote, setReplyQuote] = useState<Quote | null>(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [replySending, setReplySending] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);
  const [cancelQuote, setCancelQuote] = useState<Quote | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelSending, setCancelSending] = useState(false);

  const fetchQuotes = useCallback(() => {
    setLoading(true);
    const url = filter ? '/api/quotes?status=' + filter : '/api/quotes';
    fetch(url)
      .then((r) => {
        if (r.status === 401) { setAuthed(false); setLoading(false); return null; }
        return r.json();
      })
      .then((data) => { if (data) { setQuotes(data.quotes || []); setAuthed(true); } setLoading(false); })
      .catch(() => setLoading(false));
  }, [filter]);

  useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

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
      fetchQuotes();
    } else {
      setLoginError('Invalid credentials');
    }
  }

  if (!authed && !loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 w-full max-w-sm">
          <h2 className="text-lg font-semibold mb-4">Admin Access</h2>
          <input type="password" value={loginSecret} onChange={e => setLoginSecret(e.target.value)}
            placeholder="Enter admin secret" required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition mb-3" />
          {loginError && <p className="text-red-400 text-sm mb-3">{loginError}</p>}
          <button type="submit" className="w-full bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-zinc-200 transition text-sm">
            Sign In
          </button>
        </form>
      </main>
    );
  }

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

  function openReply(q: Quote) {
    setReplyQuote(q);
    setReplySubject(`Re: Quote ${q.id} — ${q.summary}`);
    setReplyBody('');
    setReplySuccess(false);
  }

  async function sendReply() {
    if (!replyQuote || !replySubject || !replyBody) return;
    setReplySending(true);
    try {
      const res = await fetch(`/api/quotes/${replyQuote.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: replySubject, body: replyBody }),
      });
      if (res.ok) {
        setReplySuccess(true);
        setReplyBody('');
        fetchQuotes();
        setTimeout(() => { setReplyQuote(null); setReplySuccess(false); }, 1500);
      }
    } finally {
      setReplySending(false);
    }
  }

  async function startWorkOrder(id: string) {
    if (!confirm('Start work order? This will advance the quote to procurement and trigger the automation pipeline.')) return;
    setActionQuote(id);
    try {
      const res = await fetch(`/api/quotes/${id}/start-work-order`, { method: 'POST' });
      if (res.ok) fetchQuotes();
    } finally {
      setActionQuote(null);
    }
  }

  function openCancel(q: Quote) {
    setCancelQuote(q);
    setCancelReason('');
    setCancelSending(false);
  }

  async function handleCancel(e: React.FormEvent) {
    e.preventDefault();
    if (!cancelQuote || !cancelReason.trim()) return;
    const vendorTotal = cancelQuote.lineItems.reduce((s, li) => s + li.vendorCost, 0);
    const serviceFee = cancelQuote.total - vendorTotal;
    if (!confirm(`Cancel this order?\n\nRefund to customer: $${vendorTotal.toFixed(2)} (vendor costs)\nDeep Tech keeps: $${serviceFee.toFixed(2)} (service fee)\n\nThis will issue a Stripe refund.`)) return;
    setCancelSending(true);
    try {
      const res = await fetch(`/api/quotes/${cancelQuote.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason }),
      });
      if (res.ok) {
        setCancelQuote(null);
        fetchQuotes();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to cancel');
      }
    } finally {
      setCancelSending(false);
    }
  }

  const workOrders = quotes.filter(q => q.status === 'ordered');
  const activeOrders = quotes.filter(q => ['procurement', 'shipped', 'in_transit', 'delivered', 'deployed'].includes(q.status));

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

        {/* Work Orders Ready — paid quotes awaiting start */}
        {!loading && workOrders.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
              <Play size={18} /> Work Orders Ready ({workOrders.length})
            </h2>
            <div className="space-y-4">
              {workOrders.map((q) => (
                <QuoteRow key={q.id} quote={q} busy={actionQuote === q.id}
                  onUpdateStatus={updateStatus} onRoute={routeQuote}
                  onReply={openReply} onStartWorkOrder={startWorkOrder} onCancel={openCancel} />
              ))}
            </div>
          </div>
        )}

        {/* Active Orders — in fulfillment pipeline */}
        {!loading && activeOrders.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-purple-400 mb-4">Active Orders ({activeOrders.length})</h2>
            <div className="space-y-4">
              {activeOrders.map((q) => (
                <QuoteRow key={q.id} quote={q} busy={actionQuote === q.id}
                  onUpdateStatus={updateStatus} onRoute={routeQuote}
                  onReply={openReply} onStartWorkOrder={startWorkOrder} onCancel={openCancel} />
              ))}
            </div>
          </div>
        )}

        {/* All Quotes */}
        {!loading && quotes.length === 0 && <p className="text-center text-zinc-500 py-12">No quotes found.</p>}
        {!loading && quotes.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-zinc-400 mb-4">All Quotes</h2>
            <div className="space-y-4">
              {quotes.map((q) => (
                <QuoteRow key={q.id} quote={q} busy={actionQuote === q.id}
                  onUpdateStatus={updateStatus} onRoute={routeQuote}
                  onReply={openReply} onStartWorkOrder={startWorkOrder} onCancel={openCancel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyQuote && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Reply to {replyQuote.customerName}</h3>
              <button onClick={() => setReplyQuote(null)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>
            <p className="text-xs text-zinc-500 mb-4">To: {replyQuote.customerEmail}</p>
            <input
              value={replySubject} onChange={(e) => setReplySubject(e.target.value)}
              placeholder="Subject"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-500 mb-3"
            />
            <textarea
              value={replyBody} onChange={(e) => setReplyBody(e.target.value)}
              placeholder="Write your message..."
              rows={6}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-500 resize-none mb-4"
            />
            {replySuccess ? (
              <p className="text-green-400 text-sm">✓ Reply sent!</p>
            ) : (
              <button onClick={sendReply} disabled={replySending || !replyBody}
                className="inline-flex items-center gap-2 bg-white text-black font-semibold py-2 px-5 rounded-lg hover:bg-zinc-200 transition text-sm disabled:opacity-50">
                <Send size={14} /> {replySending ? 'Sending...' : 'Send Reply'}
              </button>
            )}

            {/* Message thread */}
            {replyQuote.messages && replyQuote.messages.length > 0 && (
              <div className="mt-6 border-t border-zinc-800 pt-4">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Message History</p>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {replyQuote.messages.map((m: QuoteMessage) => {
                    const borderColor = m.from === 'admin' ? 'border-cyan-600' : m.from === 'customer' ? 'border-blue-500' : 'border-zinc-600';
                    const label = m.from === 'admin' ? 'You' : m.from === 'customer' ? `💬 ${m.sentBy || 'Customer'}` : 'System';
                    return (
                      <div key={m.id} className={`text-xs p-3 rounded-lg bg-zinc-800/50 border-l-2 ${borderColor}`}>
                        <div className="flex justify-between text-zinc-500 mb-1">
                          <span className={`font-medium ${m.from === 'customer' ? 'text-blue-400' : ''}`}>{label}</span>
                          <span>{new Date(m.sentAt).toLocaleString()}</span>
                        </div>
                        <p className="text-zinc-300 whitespace-pre-wrap">{m.body}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelQuote && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-red-800/50 rounded-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-red-400">Cancel Work Order</h3>
              <button onClick={() => setCancelQuote(null)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>
            <p className="text-sm text-zinc-400 mb-2">Quote: <span className="text-white">{cancelQuote.summary}</span></p>
            <p className="text-sm text-zinc-400 mb-4">Customer: <span className="text-white">{cancelQuote.customerName}</span></p>

            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-4 text-sm">
              <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Refund Breakdown</p>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-400">Vendor costs (refunded)</span>
                <span className="text-green-400 font-mono">${cancelQuote.lineItems.reduce((s, li) => s + li.vendorCost, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-400">Service fee (retained)</span>
                <span className="text-amber-400 font-mono">${(cancelQuote.total - cancelQuote.lineItems.reduce((s, li) => s + li.vendorCost, 0)).toFixed(2)}</span>
              </div>
              <hr className="border-zinc-700 my-2" />
              <div className="flex justify-between">
                <span className="text-zinc-300 font-medium">Original total</span>
                <span className="text-white font-mono">${cancelQuote.total.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleCancel}>
              <textarea
                value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation..."
                rows={3} required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-red-700 resize-none mb-4"
              />
              <button type="submit" disabled={cancelSending || !cancelReason.trim()}
                className="inline-flex items-center gap-2 bg-red-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-700 transition text-sm disabled:opacity-50">
                <Ban size={14} /> {cancelSending ? 'Processing...' : 'Cancel & Refund'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function QuoteRow({ quote: q, busy, onUpdateStatus, onRoute, onReply, onStartWorkOrder, onCancel }: {
  quote: Quote; busy: boolean;
  onUpdateStatus: (id: string, s: QuoteStatus) => void;
  onRoute: (id: string, d: QuoteRouting['destination']) => void;
  onReply: (q: Quote) => void;
  onStartWorkOrder: (id: string) => void;
  onCancel: (q: Quote) => void;
}) {
  const colorClass = STATUS_COLORS[q.status] || STATUS_COLORS.draft;
  const canSend = q.status === 'draft' || q.status === 'pending_review';
  const canOrder = q.status === 'accepted';
  const isWorkOrderReady = q.status === 'ordered';
  const isCancellable = ['procurement', 'shipped', 'in_transit', 'delivered'].includes(q.status);
  const msgCount = q.messages?.length || 0;

  return (
    <div className={`bg-zinc-900/50 border rounded-lg p-5 ${isWorkOrderReady ? 'border-emerald-800/60' : 'border-zinc-800'}`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-medium text-white truncate">{q.customerName}</h3>
            <span className={'text-xs px-2 py-0.5 rounded-full border ' + colorClass}>
              {q.status.replace('_', ' ')}
            </span>
            {q.paidAt && <span className="text-xs text-green-500">💰 Paid</span>}
            {msgCount > 0 && <span className="text-xs text-zinc-500">{msgCount} msg{msgCount !== 1 ? 's' : ''}</span>}
          </div>
          <p className="text-sm text-zinc-400 truncate">{q.summary}</p>
          <div className="flex flex-wrap gap-4 mt-2 text-xs text-zinc-500">
            <span>{q.inquiryType}</span>
            <span>{q.customerEmail}</span>
            <span>Created {fmtDate(q.createdAt)}</span>
            {q.paidAt && <span className="text-green-500">Paid {fmtDate(q.paidAt)}</span>}
            {q.workOrderStartedAt && <span className="text-purple-400">WO started {fmtDate(q.workOrderStartedAt)}</span>}
            {q.routing && <span className="text-cyan-500">→ {q.routing.destination}</span>}
            {q.cancelledAt && <span className="text-red-400">❌ Cancelled {fmtDate(q.cancelledAt)}</span>}
            {q.cancellation && <span className="text-red-400/70">Refunded ${q.cancellation.refundTotal.toFixed(2)}</span>}
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

        {/* Reply to User */}
        <button onClick={() => onReply(q)} disabled={busy}
          className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition disabled:opacity-50">
          <MessageSquare size={12} /> Reply
        </button>

        {/* Start Work Order — only for paid/ordered quotes */}
        {isWorkOrderReady && (
          <button onClick={() => onStartWorkOrder(q.id)} disabled={busy}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded bg-emerald-900/50 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900/70 transition disabled:opacity-50 font-medium">
            <Play size={12} /> Start Work Order
          </button>
        )}

        {/* Cancel Work Order — active fulfillment stages */}
        {(isWorkOrderReady || isCancellable) && (
          <button onClick={() => onCancel(q)} disabled={busy}
            className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded bg-red-900/30 text-red-400 border border-red-800/40 hover:bg-red-900/50 transition disabled:opacity-50">
            <Ban size={12} /> Cancel Order
          </button>
        )}

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

        {(q.status !== 'rejected' && q.status !== 'expired' && !['ordered', 'procurement', 'shipped', 'in_transit', 'delivered', 'deployed'].includes(q.status)) && (
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

