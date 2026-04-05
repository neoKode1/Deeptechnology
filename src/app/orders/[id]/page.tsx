'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Bot, User, Package, Truck, CheckCircle2, Cog, MapPin, Rocket } from 'lucide-react';
import type { Quote } from '@/lib/quotes/types';
import { FULFILLMENT_STAGES, STAGE_LABELS } from '@/lib/quotes/types';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const STAGE_ICONS = [
  <CheckCircle2 key="o" size={18} />,
  <Cog key="p" size={18} />,
  <Package key="s" size={18} />,
  <Truck key="t" size={18} />,
  <MapPin key="d" size={18} />,
  <Rocket key="dep" size={18} />,
];

/** Interpolate from orange (#f97316) to green (#22c55e) based on progress 0–1 */
function progressColor(progress: number): string {
  const r = Math.round(249 + (34 - 249) * progress);
  const g = Math.round(115 + (197 - 115) * progress);
  const b = Math.round(22 + (94 - 22) * progress);
  return `rgb(${r},${g},${b})`;
}

type ChatMsg = { role: 'user' | 'assistant'; text: string };

function FulfillmentTimeline({ status }: { status: string }) {
  const currentIdx = FULFILLMENT_STAGES.indexOf(status as typeof FULFILLMENT_STAGES[number]);
  const activeIdx = currentIdx >= 0 ? currentIdx : 0;
  const progress = activeIdx / (FULFILLMENT_STAGES.length - 1);
  const color = progressColor(progress);

  return (
    <div className="mb-10">
      <h2 className="text-lg font-semibold text-white mb-6">Order Progress</h2>
      <div className="relative">
        {/* Background track */}
        <div className="absolute top-5 left-5 right-5 h-1 bg-zinc-800 rounded-full" />
        {/* Active track */}
        <div
          className="absolute top-5 left-5 h-1 rounded-full transition-all duration-700"
          style={{ width: `calc(${progress * 100}% - ${progress * 40}px)`, backgroundColor: color }}
        />
        {/* Stage dots */}
        <div className="relative flex justify-between">
          {FULFILLMENT_STAGES.map((stage, i) => {
            const done = i <= activeIdx;
            const isCurrent = i === activeIdx;
            const dotColor = done ? progressColor(i / (FULFILLMENT_STAGES.length - 1)) : '#3f3f46';
            return (
              <div key={stage} className="flex flex-col items-center" style={{ width: 80 }}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isCurrent ? 'ring-2 ring-offset-2 ring-offset-[#0a0a0a]' : ''}`}
                  style={{ backgroundColor: dotColor, color: done ? '#fff' : '#71717a', outlineColor: isCurrent ? dotColor : undefined } as React.CSSProperties}
                >
                  {STAGE_ICONS[i]}
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

function ChatWidget({ orderId }: { orderId: string }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load stored conversation history on mount so the UI persists across refreshes
  useEffect(() => {
    fetch(`/api/chat?orderId=${encodeURIComponent(orderId)}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.history) && data.history.length > 0) {
          // Server uses { role, content }; client uses { role, text }
          setMsgs(data.history.map((m: { role: 'user' | 'assistant'; content: string }) => ({
            role: m.role, text: m.content,
          })));
        }
      })
      .catch(() => {/* silent — fresh chat is fine */})
      .finally(() => setHistoryLoading(false));
  }, [orderId]);

  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [msgs]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMsgs(prev => [...prev, { role: 'user', text }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, orderId }),
      });
      const data = await res.json();
      setMsgs(prev => [...prev, { role: 'assistant', text: data.reply || data.error || 'No response.' }]);
    } catch {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'Connection error. Please try again.' }]);
    } finally { setLoading(false); }
  }

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden">
      <div className="bg-zinc-900 px-4 py-3 flex items-center gap-2 border-b border-zinc-800">
        <Bot size={18} className="text-cyan-400" />
        <span className="text-sm font-medium text-zinc-200">Deep Tech Concierge</span>
        <span className="text-[10px] text-zinc-500 ml-auto">AI-powered support</span>
      </div>
      <div ref={scrollRef} className="h-72 overflow-y-auto p-4 space-y-3 bg-zinc-950/50">
        {historyLoading && (
          <p className="text-zinc-700 text-sm text-center py-8">Loading conversation…</p>
        )}
        {!historyLoading && msgs.length === 0 && (
          <p className="text-zinc-600 text-sm text-center py-8">Ask about your order status, delivery timeline, or anything else.</p>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && <Bot size={16} className="text-cyan-400 mt-1 shrink-0" />}
            <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.role === 'user' ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-900 text-zinc-300 border border-zinc-800'}`}>
              {m.text}
            </div>
            {m.role === 'user' && <User size={16} className="text-zinc-500 mt-1 shrink-0" />}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <Bot size={16} className="text-cyan-400 mt-1" />
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-500">Typing...</div>
          </div>
        )}
      </div>
      <form onSubmit={e => { e.preventDefault(); send(); }} className="flex border-t border-zinc-800">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about your order..."
          className="flex-1 bg-transparent text-zinc-200 text-sm px-4 py-3 outline-none placeholder:text-zinc-600" />
        <button type="submit" disabled={loading || !input.trim()} className="px-4 text-cyan-400 hover:text-cyan-300 disabled:text-zinc-700 transition">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

export default function OrderTrackingPage() {
  const params = useParams<{ id: string }>();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'not_found'>('loading');

  useEffect(() => {
    fetch(`/api/quotes/${params.id}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { setQuote(d.quote); setState('ready'); })
      .catch(() => setState('not_found'));
  }, [params.id]);

  if (state === 'loading') return <Shell><p className="text-center text-zinc-400 py-20">Loading order...</p></Shell>;
  if (state === 'not_found' || !quote) return <Shell><p className="text-center text-zinc-400 py-20">Order not found.</p></Shell>;

  const isFulfillment = FULFILLMENT_STAGES.includes(quote.status as typeof FULFILLMENT_STAGES[number]);

  return (
    <Shell>
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition mb-8">
        <ArrowLeft size={14} /> Back to Deep Tech
      </Link>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Order Tracking</h1>
          <p className="text-zinc-400 text-sm mt-1">{quote.summary}</p>
        </div>
        <span className="text-sm font-mono text-zinc-500">{quote.id}</span>
      </div>
      {isFulfillment && <FulfillmentTimeline status={quote.status} />}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-sm">
        <MetaCard label="Total Paid" value={fmt(quote.total)} />
        <MetaCard label="Order Date" value={fmtDate(quote.createdAt)} />
        <MetaCard label="Status" value={STAGE_LABELS[quote.status] || quote.status} />
        <MetaCard label="Items" value={String(quote.lineItems.length)} />
      </div>
      <ChatWidget orderId={quote.id} />
      <p className="text-center text-zinc-600 text-xs mt-12">Deep Tech — Software, Robotics & Creative Technology</p>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#0a0a0a] text-white"><div className="max-w-3xl mx-auto px-6 py-16">{children}</div></main>;
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg px-4 py-3">
      <p className="text-xs text-zinc-500 uppercase tracking-wider">{label}</p>
      <p className="text-zinc-200 text-sm mt-0.5 truncate">{value}</p>
    </div>
  );
}

