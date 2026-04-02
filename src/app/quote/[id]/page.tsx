'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, Package, MessageSquare, Mail, Cog, Truck, MapPin, Rocket, Send, XCircle } from 'lucide-react';
import type { Quote, QuoteMessage } from '@/lib/quotes/types';
import { FULFILLMENT_STAGES, STAGE_LABELS } from '@/lib/quotes/types';


type FetchState = 'loading' | 'ready' | 'error' | 'not_found';

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft:          { label: 'Draft',             color: 'text-yellow-400', icon: <Clock size={16} /> },
  pending_review: { label: 'Under Review',      color: 'text-blue-400',   icon: <Clock size={16} /> },
  sent:           { label: 'Awaiting Response',  color: 'text-cyan-400',   icon: <Clock size={16} /> },
  accepted:       { label: 'Accepted',           color: 'text-green-400',  icon: <CheckCircle2 size={16} /> },
  expired:        { label: 'Expired',            color: 'text-red-400',    icon: <AlertCircle size={16} /> },
  ordered:        { label: 'Order Confirmed',    color: 'text-green-400',  icon: <Package size={16} /> },
  procurement:    { label: 'Procurement',        color: 'text-green-400',  icon: <Package size={16} /> },
  shipped:        { label: 'Shipped',            color: 'text-green-400',  icon: <Package size={16} /> },
  in_transit:     { label: 'In Transit',         color: 'text-green-400',  icon: <Package size={16} /> },
  delivered:      { label: 'Delivered',          color: 'text-green-400',  icon: <CheckCircle2 size={16} /> },
  deployed:       { label: 'Deployed',           color: 'text-green-400',  icon: <CheckCircle2 size={16} /> },
  cancelled:      { label: 'Cancelled',          color: 'text-red-400',    icon: <AlertCircle size={16} /> },
  rejected:       { label: 'Declined',           color: 'text-red-400',    icon: <AlertCircle size={16} /> },
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

/** Decode a base64url-encoded quote payload from the URL */
function decodeQuotePayload(encoded: string): Quote | null {
  try {
    const json = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as Quote;
  } catch { return null; }
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">{children}</div>
    </main>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg px-4 py-3">
      <p className="text-xs text-zinc-500 uppercase tracking-wider">{label}</p>
      <p className="text-zinc-200 text-sm mt-0.5 truncate">{value}</p>
    </div>
  );
}

/** Detailed breakdown table showing how each line item is priced */
function LineItemsBreakdown({ lineItems, total }: { lineItems: Quote['lineItems']; total: number }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold text-white">Cost Breakdown</h2>
        <span className="text-xs text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full">{lineItems.length} item{lineItems.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="space-y-3">
        {lineItems.map((li, i) => (
          <div key={i} className="border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-zinc-200 font-medium">{li.description}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  via <span className="text-zinc-400">{li.vendor}</span>
                  {li.vendorUrl && <> · <a href={li.vendorUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-500/70 hover:text-cyan-400 underline">vendor site</a></>}
                </p>
                {li.notes && <p className="text-xs text-zinc-500 mt-1 italic">{li.notes}</p>}
              </div>
              <p className="text-white font-mono font-semibold text-lg whitespace-nowrap">{fmt(li.clientPrice)}</p>
            </div>

          </div>
        ))}
      </div>
      <div className="mt-4 border border-zinc-700 bg-zinc-900/60 rounded-lg p-4 flex justify-between items-center">
        <span className="text-zinc-300 font-semibold">Total</span>
        <span className="text-white font-mono font-bold text-2xl">{fmt(total)}</span>
      </div>
    </div>
  );
}

/** Fulfillment progress timeline for post-payment orders */
function FulfillmentTimeline({ status }: { status: string }) {
  const currentIdx = FULFILLMENT_STAGES.indexOf(status as typeof FULFILLMENT_STAGES[number]);
  const activeIdx = currentIdx >= 0 ? currentIdx : 0;
  const progress = activeIdx / (FULFILLMENT_STAGES.length - 1);
  const icons = [
    <CheckCircle2 key="o" size={18} />, <Cog key="p" size={18} />, <Package key="s" size={18} />,
    <Truck key="t" size={18} />, <MapPin key="d" size={18} />, <Rocket key="dep" size={18} />,
  ];
  const lerp = (p: number) => {
    const r = Math.round(249 + (34 - 249) * p), g = Math.round(115 + (197 - 115) * p), b = Math.round(22 + (94 - 22) * p);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className="mb-10">
      <h2 className="text-lg font-semibold text-white mb-6">Order Progress</h2>
      <div className="relative">
        <div className="absolute top-5 left-5 right-5 h-1 bg-zinc-800 rounded-full" />
        <div className="absolute top-5 left-5 h-1 rounded-full transition-all duration-700"
          style={{ width: `calc(${progress * 100}% - ${progress * 40}px)`, backgroundColor: lerp(progress) }} />
        <div className="relative flex justify-between">
          {FULFILLMENT_STAGES.map((stage, i) => {
            const done = i <= activeIdx;
            const isCurrent = i === activeIdx;
            const dotColor = done ? lerp(i / (FULFILLMENT_STAGES.length - 1)) : '#3f3f46';
            return (
              <div key={stage} className="flex flex-col items-center" style={{ width: 80 }}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isCurrent ? 'ring-2 ring-offset-2 ring-offset-[#0a0a0a]' : ''}`}
                  style={{ backgroundColor: dotColor, color: done ? '#fff' : '#71717a' } as React.CSSProperties}>
                  {icons[i]}
                </div>
                <span className={`text-[10px] mt-2 text-center leading-tight ${done ? 'text-zinc-200 font-medium' : 'text-zinc-600'}`}>
                  {STAGE_LABELS[stage]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Two-way messaging section — customer can send messages that log into the quote thread */
function ReplySection({ quote, onMessageSent }: { quote: Quote; onMessageSent?: () => void }) {
  const [open, setOpen] = useState(false);
  const [replyForm, setReplyForm] = useState({ name: quote.customerName || '', email: quote.customerEmail || '', message: '' });
  const [replyStatus, setReplyStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [replyError, setReplyError] = useState('');

  const messages = (quote.messages || []).filter((m: QuoteMessage) => m.from !== 'system');

  async function handleReplySubmit(e: React.FormEvent) {
    e.preventDefault();
    setReplyStatus('sending');
    setReplyError('');
    try {
      const res = await fetch(`/api/quotes/${quote.id}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: replyForm.name, email: replyForm.email, message: replyForm.message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send.');
      setReplyStatus('sent');
      setReplyForm(prev => ({ ...prev, message: '' }));
      onMessageSent?.();
    } catch (err: unknown) {
      setReplyStatus('error');
      setReplyError(err instanceof Error ? err.message : 'Failed to send. Please try again.');
    }
  }

  return (
    <div className="border border-zinc-800 rounded-lg p-6 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare size={18} className="text-zinc-400" />
        <h3 className="text-white font-semibold">Messages</h3>
        {messages.length > 0 && <span className="text-xs text-zinc-500">{messages.length} message{messages.length !== 1 ? 's' : ''}</span>}
      </div>

      {/* Message thread */}
      {messages.length > 0 && (
        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
          {messages.map((m: QuoteMessage) => (
            <div key={m.id} className={`text-sm p-3 rounded-lg ${m.from === 'customer' ? 'bg-zinc-800/50 border-l-2 border-blue-600' : 'bg-zinc-900 border-l-2 border-cyan-600'}`}>
              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                <span className="font-medium">{m.from === 'customer' ? 'You' : 'Deep Tech'}</span>
                <span>{new Date(m.sentAt).toLocaleString()}</span>
              </div>
              <p className="text-zinc-300 whitespace-pre-wrap">{m.body}</p>
            </div>
          ))}
        </div>
      )}

      {!open && replyStatus !== 'sent' && (
        <div>
          <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
            Have questions about this quote? Want to discuss pricing, adjust scope, or negotiate terms?
          </p>
          <button onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-6 py-3 rounded-lg transition text-sm">
            <Send size={16} /> Send a Message
          </button>
        </div>
      )}

      {replyStatus === 'sent' && (
        <div className="bg-green-950/30 border border-green-800/40 rounded-lg p-4 text-center">
          <CheckCircle2 className="mx-auto mb-2 text-green-400" size={24} />
          <p className="text-green-300 text-sm font-medium">Message sent! We&apos;ll get back to you shortly.</p>
          <button onClick={() => { setReplyStatus('idle'); setOpen(true); }} className="text-zinc-500 text-xs mt-2 underline hover:text-zinc-300">Send another</button>
        </div>
      )}

      {open && replyStatus !== 'sent' && (
        <form onSubmit={handleReplySubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500">Name *</label>
              <input required value={replyForm.name} onChange={e => setReplyForm(p => ({ ...p, name: e.target.value }))}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition" placeholder="Your name" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500">Email *</label>
              <input required type="email" value={replyForm.email} onChange={e => setReplyForm(p => ({ ...p, email: e.target.value }))}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition" placeholder="you@company.com" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500">Message *</label>
            <textarea required rows={4} value={replyForm.message} onChange={e => setReplyForm(p => ({ ...p, message: e.target.value }))}
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition resize-none" placeholder="Your question or feedback..." />
          </div>
          <p className="text-zinc-600 text-xs">Re: Quote {quote.id} — {fmt(quote.total)}</p>
          {replyStatus === 'error' && <p className="text-red-400 text-sm">{replyError}</p>}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={replyStatus === 'sending'}
              className="inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-2.5 rounded-lg hover:bg-zinc-200 transition text-sm disabled:opacity-50">
              {replyStatus === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="text-zinc-500 text-sm hover:text-zinc-300 transition">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}

/** Customer-initiated cancellation section for active work orders */
function CancelOrderSection({ quote, onCancelled }: { quote: Quote; onCancelled: () => void }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [reason, setReason] = useState('');
  const [email, setEmail] = useState(quote.customerEmail || '');
  const [status, setStatus] = useState<'idle' | 'cancelling' | 'error'>('idle');
  const [error, setError] = useState('');

  const vendorCostTotal = quote.lineItems.reduce((sum, li) => sum + li.vendorCost, 0);
  const serviceFee = Math.round((quote.total - vendorCostTotal) * 100) / 100;

  async function handleCancel(e: React.FormEvent) {
    e.preventDefault();
    setStatus('cancelling');
    setError('');
    try {
      const res = await fetch(`/api/quotes/${quote.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Cancellation failed');
      onCancelled();
    } catch (err: unknown) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  if (!showConfirm) {
    return (
      <div className="border border-zinc-800 rounded-lg p-6 mt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm">Need to cancel this order?</p>
            <p className="text-zinc-600 text-xs mt-1">Vendor costs will be refunded. Service fee is non-refundable.</p>
          </div>
          <button onClick={() => setShowConfirm(true)}
            className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 border border-red-800/50 hover:border-red-700 px-4 py-2 rounded-lg text-sm transition">
            <XCircle size={16} /> Cancel Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-red-800/40 bg-red-950/10 rounded-lg p-6 mt-6">
      <h3 className="text-red-400 font-semibold mb-4 flex items-center gap-2"><XCircle size={18} /> Cancel Order</h3>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 mb-4 text-sm">
        <div className="flex justify-between mb-1">
          <span className="text-zinc-500">You will be refunded (vendor costs)</span>
          <span className="text-green-400 font-mono">{fmt(vendorCostTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Service fee (non-refundable)</span>
          <span className="text-amber-400 font-mono">{fmt(serviceFee)}</span>
        </div>
      </div>
      <form onSubmit={handleCancel} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-widest text-zinc-500">Confirm your email *</label>
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition" placeholder="you@company.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-widest text-zinc-500">Reason for cancellation *</label>
          <textarea required rows={3} value={reason} onChange={e => setReason(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition resize-none" placeholder="Please let us know why you're cancelling..." />
        </div>
        {status === 'error' && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={status === 'cancelling'}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-lg transition text-sm disabled:opacity-50">
            {status === 'cancelling' ? 'Processing...' : 'Confirm Cancellation'}
          </button>
          <button type="button" onClick={() => setShowConfirm(false)} className="text-zinc-500 text-sm hover:text-zinc-300 transition">Go back</button>
        </div>
      </form>
    </div>
  );
}

function AcceptSection({ quote, canAccept, isExpired, accepting, onAccept, checkoutError }: {
  quote: Quote; canAccept: boolean; isExpired: boolean; accepting: boolean; onAccept: () => void; checkoutError?: string;
}) {
  if (canAccept) {
    return (
      <div className="border border-zinc-800 rounded-lg p-6 text-center">
        <p className="text-zinc-400 text-sm mb-4">By accepting this quote you agree to proceed. You&apos;ll be redirected to our secure payment page.</p>
        {checkoutError && <p className="text-red-400 text-sm mb-3">{checkoutError}</p>}
        <button onClick={onAccept} disabled={accepting}
          className="bg-white text-black font-semibold px-8 py-3 rounded-lg hover:bg-zinc-200 transition disabled:opacity-50">
          {accepting ? 'Redirecting to payment...' : `Pay ${fmt(quote.total)} — Accept Quote`}
        </button>
        <p className="text-zinc-600 text-xs mt-3">Powered by Stripe · Secure checkout</p>
      </div>
    );
  }
  if (quote.status === 'accepted') {
    return (
      <div className="border border-green-800/40 bg-green-950/20 rounded-lg p-6 text-center">
        <CheckCircle2 className="mx-auto mb-2 text-green-400" size={28} />
        <p className="text-green-300 font-medium">Quote accepted{quote.acceptedAt ? ' on ' + fmtDate(quote.acceptedAt) : ''}</p>
        <p className="text-zinc-400 text-sm mt-1">Our team will be in touch shortly.</p>
      </div>
    );
  }
  if (quote.status === 'cancelled') {
    const c = quote.cancellation;
    return (
      <div className="border border-red-800/40 bg-red-950/20 rounded-lg p-6">
        <div className="text-center mb-4">
          <AlertCircle className="mx-auto mb-2 text-red-400" size={28} />
          <p className="text-red-300 font-medium">This order has been cancelled</p>
          {quote.cancelledAt && <p className="text-zinc-500 text-xs mt-1">Cancelled on {fmtDate(quote.cancelledAt)}</p>}
        </div>
        {c && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 mt-4 text-sm">
            {c.reason && <p className="text-zinc-400 mb-3"><span className="text-zinc-500">Reason:</span> {c.reason}</p>}
            <div className="flex justify-between mb-1">
              <span className="text-zinc-500">Vendor costs refunded</span>
              <span className="text-green-400 font-mono">{fmt(c.vendorCostRefunded)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-zinc-500">Service fee (non-refundable)</span>
              <span className="text-amber-400 font-mono">{fmt(c.serviceFeeRetained)}</span>
            </div>
            <p className="text-zinc-500 text-xs mt-3">Refunds typically appear within 5–10 business days.</p>
          </div>
        )}
        <p className="text-center text-zinc-500 text-xs mt-4">Questions? <Link href="/contact" className="underline hover:text-white">Contact us</Link></p>
      </div>
    );
  }
  if (isExpired) {
    return (
      <div className="border border-red-800/40 bg-red-950/20 rounded-lg p-6 text-center">
        <AlertCircle className="mx-auto mb-2 text-red-400" size={28} />
        <p className="text-red-300 font-medium">This quote has expired</p>
        <p className="text-zinc-400 text-sm mt-1">Please <Link href="/contact" className="underline hover:text-white">contact us</Link> for an updated quote.</p>
      </div>
    );
  }
  return null;
}

export default function QuotePage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const id = params.id;
  const [state, setState] = useState<FetchState>('loading');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  useEffect(() => {
    // Try API first (works when storage is local), fall back to URL payload
    fetch('/api/quotes/' + id)
      .then((r) => {
        if (r.status === 404) throw new Error('not_found');
        if (!r.ok) throw new Error('fetch_error');
        return r.json();
      })
      .then((data) => { setQuote(data.quote); setState('ready'); })
      .catch(() => {
        // Fallback: decode quote from ?d= query param (works in production)
        const encoded = searchParams.get('d');
        if (encoded) {
          const decoded = decodeQuotePayload(encoded);
          if (decoded) { setQuote(decoded); setState('ready'); return; }
        }
        setState('not_found');
      });
  }, [id, searchParams]);

  async function handleAccept() {
    if (!quote || accepting) return;
    setAccepting(true);
    setCheckoutError('');
    try {
      // Redirect to Stripe Checkout
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId: quote.id }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return; // Don't setAccepting(false) — we're navigating away
      }
      // Fallback: if checkout API unavailable, use direct accept
      setCheckoutError(data.message || 'Payment unavailable. Please contact us.');
    } catch {
      setCheckoutError('Could not connect to payment service. Please try again.');
    } finally {
      setAccepting(false);
    }
  }

  if (state === 'loading') return <Shell><p className="text-center text-zinc-400 py-20">Loading quote...</p></Shell>;
  if (state === 'not_found') return <Shell><p className="text-center text-zinc-400 py-20">Quote not found.</p></Shell>;
  if (state === 'error' || !quote) return <Shell><p className="text-center text-red-400 py-20">Something went wrong.</p></Shell>;

  const status = STATUS_MAP[quote.status] ?? STATUS_MAP.draft;
  const isExpired = new Date(quote.expiresAt) < new Date() && quote.status === 'sent';
  const canAccept = quote.status === 'sent' && !isExpired;
  const isFulfillment = FULFILLMENT_STAGES.includes(quote.status as typeof FULFILLMENT_STAGES[number]);

  /** Re-fetch quote to get updated messages */
  function refreshQuote() {
    fetch('/api/quotes/' + id)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.quote) setQuote(data.quote); });
  }

  return (
    <Shell>
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition mb-8">
        <ArrowLeft size={14} /> Back to Deep Tech
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            {isFulfillment ? 'Order' : 'Quote'} for {quote.customerName}
          </h1>
          <p className="text-zinc-400 text-sm mt-1">{quote.summary}</p>
        </div>
        <div className={'flex items-center gap-2 text-sm font-medium ' + status.color}>
          {status.icon} {isExpired ? 'Expired' : status.label}
        </div>
      </div>

      {/* Fulfillment Timeline — shows for paid/ordered quotes */}
      {isFulfillment && <FulfillmentTimeline status={quote.status} />}

      {/* Meta cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-sm">
        <MetaCard label="Quote ID" value={quote.id} />
        <MetaCard label="Type" value={quote.inquiryType} />
        <MetaCard label="Created" value={fmtDate(quote.createdAt)} />
        <MetaCard label={isFulfillment ? 'Paid' : 'Valid Until'} value={fmtDate(quote.paidAt || quote.expiresAt)} />
      </div>

      {/* Detailed line items breakdown */}
      <LineItemsBreakdown lineItems={quote.lineItems} total={quote.total} />

      {/* Messages / Reply */}
      <ReplySection quote={quote} onMessageSent={refreshQuote} />

      {/* Accept / status */}
      <AcceptSection quote={quote} canAccept={canAccept} isExpired={isExpired} accepting={accepting} onAccept={handleAccept} checkoutError={checkoutError} />

      {/* Customer cancel — visible for active fulfillment orders */}
      {isFulfillment && quote.status !== 'cancelled' && (
        <CancelOrderSection quote={quote} onCancelled={refreshQuote} />
      )}

      {/* Footer note */}
      <p className="text-center text-zinc-600 text-xs mt-12">
        Deep Tech — Software, Robotics & Creative Technology
      </p>
    </Shell>
  );
}