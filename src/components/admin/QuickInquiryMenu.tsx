'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Mail, Send, Loader2, ChevronDown, X, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Vendor } from '@/data/vendors';

type TemplateId = 'spec_request' | 'quote_request' | 'availability_check' | 'demo_request';

const TEMPLATES: { id: TemplateId; label: string; blurb: string }[] = [
  { id: 'spec_request',       label: 'Spec sheet',       blurb: 'Datasheet + safety certs' },
  { id: 'quote_request',      label: 'Indicative quote', blurb: 'Per-unit + volume + lead time' },
  { id: 'availability_check', label: 'Stock & lead time', blurb: 'Allocation queue check' },
  { id: 'demo_request',       label: 'Remote demo',      blurb: 'Zoom walkthrough request' },
];

interface Props {
  vendor: Vendor;
}

type SendState = { status: 'idle' } | { status: 'sending' } | { status: 'sent'; toEmail: string } | { status: 'error'; message: string };

export default function QuickInquiryMenu({ vendor }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<TemplateId | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // Resolve default recipient — first mailto: contact on the vendor record
  const defaultEmail = useMemo(() => {
    const c = vendor.contacts.find(x => x.href?.startsWith('mailto:'));
    return c?.value ?? '';
  }, [vendor]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <>
      <div className="relative" ref={dropRef}>
        <button
          onClick={() => setOpen(o => !o)}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-emerald-700/50 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40 transition"
        >
          <Mail size={12} /> Quick Inquiry <ChevronDown size={12} />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-64 bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl z-20 overflow-hidden">
            <div className="px-3 py-2 border-b border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500">
              Blind first contact
            </div>
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => { setActive(t.id); setOpen(false); }}
                disabled={!defaultEmail}
                className="w-full text-left px-3 py-2 hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed border-b border-zinc-900 last:border-0"
              >
                <p className="text-xs text-zinc-200 font-medium">{t.label}</p>
                <p className="text-[10px] text-zinc-500">{t.blurb}</p>
              </button>
            ))}
            {!defaultEmail && (
              <p className="px-3 py-2 text-[10px] text-amber-400/80 border-t border-zinc-800">
                No mailto contact on file — add one to <code>vendor.contacts</code>.
              </p>
            )}
          </div>
        )}
      </div>

      {active && (
        <InquiryModal
          vendor={vendor}
          templateId={active}
          defaultEmail={defaultEmail}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}

function InquiryModal({ vendor, templateId, defaultEmail, onClose }: { vendor: Vendor; templateId: TemplateId; defaultEmail: string; onClose: () => void }) {
  const tmpl = TEMPLATES.find(t => t.id === templateId)!;
  const [productName, setProductName] = useState(vendor.products[0]?.name ?? '');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [region, setRegion] = useState('');
  const [timeline, setTimeline] = useState('');
  const [useCase, setUseCase] = useState('');
  const [toEmail, setToEmail] = useState(defaultEmail);
  const [state, setState] = useState<SendState>({ status: 'idle' });

  async function send() {
    setState({ status: 'sending' });
    try {
      const res = await fetch('/api/admin/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: vendor.id, templateId, toEmail,
          productName: productName || undefined,
          quantity: typeof quantity === 'number' ? quantity : undefined,
          region: region || undefined,
          timeline: timeline || undefined,
          useCase: useCase || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setState({ status: 'sent', toEmail });
    } catch (err) {
      setState({ status: 'error', message: err instanceof Error ? err.message : String(err) });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-12 px-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">Quick inquiry · {vendor.name}</p>
            <h3 className="text-sm font-semibold text-white">{tmpl.label}</h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-3">
          <Field label="To"><input value={toEmail} onChange={e => setToEmail(e.target.value)} className={inp} placeholder="vendor@example.com" /></Field>
          <Field label="Product (optional)">
            <select value={productName} onChange={e => setProductName(e.target.value)} className={inp}>
              <option value="">— Any / general —</option>
              {vendor.products.map((p, i) => <option key={i} value={p.name}>{p.name}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Quantity"><input type="number" min={1} value={quantity} onChange={e => setQuantity(e.target.value === '' ? '' : Number(e.target.value))} className={inp} placeholder="e.g. 5" /></Field>
            <Field label="Timeline"><input value={timeline} onChange={e => setTimeline(e.target.value)} className={inp} placeholder="e.g. Q3 2026" /></Field>
          </div>
          <Field label="Region"><input value={region} onChange={e => setRegion(e.target.value)} className={inp} placeholder="e.g. United States — Pacific Northwest" /></Field>
          <Field label="Use case (optional)"><textarea value={useCase} onChange={e => setUseCase(e.target.value)} rows={2} className={inp} placeholder="One-liner about the buyer's planned application" /></Field>

          {state.status === 'sent'  && <Banner ok msg={`Sent to ${state.toEmail}. Reply lands at sourcing@deeptechnologies.dev.`} />}
          {state.status === 'error' && <Banner msg={state.message} />}
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-zinc-800">
          <button onClick={onClose} className="text-xs px-3 py-1.5 text-zinc-400 hover:text-white">Cancel</button>
          <button onClick={send} disabled={state.status === 'sending' || state.status === 'sent' || !toEmail} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40">
            {state.status === 'sending' ? <><Loader2 size={12} className="animate-spin" /> Sending</> : <><Send size={12} /> Send inquiry</>}
          </button>
        </div>
      </div>
    </div>
  );
}

const inp = 'w-full bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-1">{label}</span>
      {children}
    </label>
  );
}

function Banner({ ok, msg }: { ok?: boolean; msg: string }) {
  const Icon = ok ? CheckCircle2 : AlertCircle;
  const style = ok ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' : 'bg-red-950/40 border-red-800/60 text-red-300';
  return (
    <div className={`flex items-start gap-2 text-xs px-3 py-2 rounded-md border ${style}`}>
      <Icon size={14} className="mt-0.5 shrink-0" /><span className="break-all">{msg}</span>
    </div>
  );
}
