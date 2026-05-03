'use client';

import { useState, useMemo } from 'react';
import { Send, Loader2, X, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import type { Vendor } from '@/data/vendors';
import { renderTemplate, TEMPLATE_LABELS, type TemplateId } from '@/lib/outreach/templates';
import { SOURCING_FROM, SOURCING_REPLY_TO, SOURCING_SIGNATURE_TEXT } from '@/lib/outreach/identity';
import { buildDefaults } from '@/lib/outreach/defaults';

/**
 * Pre-populated, send-on-one-click admin inquiry composer.
 *
 * Opens with every field already filled in (template, recipient, product,
 * quantity, region, timeline, use case), shows a live preview of the email
 * that will go out, and exposes a primary Send button enabled immediately —
 * the operator only needs to click Send unless they want to tweak something.
 */

const TEMPLATE_OPTIONS: { id: TemplateId; blurb: string }[] = [
  { id: 'quote_request',      blurb: 'Per-unit + volume + lead time' },
  { id: 'spec_request',       blurb: 'Datasheet + safety certs' },
  { id: 'availability_check', blurb: 'Stock & lead time check' },
  { id: 'demo_request',       blurb: 'Zoom walkthrough request' },
];

type SendState =
  | { status: 'idle' }
  | { status: 'sending' }
  | { status: 'sent'; toEmail: string }
  | { status: 'error'; message: string };

interface Props {
  vendor: Vendor;
  initialTemplate?: TemplateId;
  /** Pre-select a specific product (e.g. when opened from a product row). */
  initialProductName?: string;
  onClose: () => void;
  onSent?: () => void;
}

export default function InquiryComposer({ vendor, initialTemplate, initialProductName, onClose, onSent }: Props) {
  const initial = useMemo(
    () => buildDefaults(vendor, initialTemplate, initialProductName),
    [vendor, initialTemplate, initialProductName],
  );
  const [templateId, setTemplateId] = useState<TemplateId>(initial.templateId);
  const [toEmail, setToEmail] = useState(initial.toEmail);
  const [productName, setProductName] = useState(initial.productName);
  const [quantity, setQuantity] = useState<number>(initial.quantity);
  const [region, setRegion] = useState(initial.region);
  const [timeline, setTimeline] = useState(initial.timeline);
  const [useCase, setUseCase] = useState(initial.useCase);
  const [showPreview, setShowPreview] = useState(true);
  const [state, setState] = useState<SendState>({ status: 'idle' });

  // Live preview — re-renders as fields change so the operator sees exactly
  // what's about to be sent. Same renderTemplate the API route uses, so
  // there's no client/server drift.
  const preview = useMemo(() => renderTemplate(templateId, {
    vendor,
    productName: productName || undefined,
    quantity: quantity > 0 ? quantity : undefined,
    region: region || undefined,
    timeline: timeline || undefined,
    useCase: useCase || undefined,
  }), [templateId, vendor, productName, quantity, region, timeline, useCase]);

  const fullBody = preview.body + SOURCING_SIGNATURE_TEXT;

  async function send() {
    setState({ status: 'sending' });
    try {
      const res = await fetch('/api/admin/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: vendor.id, templateId, toEmail,
          productName: productName || undefined,
          quantity: quantity > 0 ? quantity : undefined,
          region: region || undefined,
          timeline: timeline || undefined,
          useCase: useCase || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setState({ status: 'sent', toEmail });
      onSent?.();
    } catch (err) {
      setState({ status: 'error', message: err instanceof Error ? err.message : String(err) });
    }
  }

  const sending = state.status === 'sending';
  const sent = state.status === 'sent';
  const canSend = !!toEmail && !sending && !sent;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 px-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-2xl shadow-2xl">
        <header className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">Sourcing inquiry · {vendor.name}</p>
            <h3 className="text-sm font-semibold text-white">{TEMPLATE_LABELS[templateId]}</h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white" aria-label="Close"><X size={16} /></button>
        </header>

        <div className="p-5 space-y-3">
          <Field label="Template">
            <select value={templateId} onChange={e => setTemplateId(e.target.value as TemplateId)} className={inp}>
              {TEMPLATE_OPTIONS.map(t => (
                <option key={t.id} value={t.id}>{TEMPLATE_LABELS[t.id]} — {t.blurb}</option>
              ))}
            </select>
          </Field>
          <Field label="To"><input value={toEmail} onChange={e => setToEmail(e.target.value)} className={inp} placeholder="vendor-sales@example.com" /></Field>
          <Field label="Product">
            <select value={productName} onChange={e => setProductName(e.target.value)} className={inp}>
              <option value="">— Any / general —</option>
              {vendor.products.map((p, i) => <option key={i} value={p.name}>{p.name}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Quantity"><input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value) || 0)} className={inp} /></Field>
            <Field label="Timeline"><input value={timeline} onChange={e => setTimeline(e.target.value)} className={inp} /></Field>
          </div>
          <Field label="Region"><input value={region} onChange={e => setRegion(e.target.value)} className={inp} /></Field>
          <Field label="Use case"><textarea value={useCase} onChange={e => setUseCase(e.target.value)} rows={2} className={inp} /></Field>

          {state.status === 'sent'  && <Banner ok msg={`Sent to ${state.toEmail}. Reply lands at ${SOURCING_REPLY_TO}.`} />}
          {state.status === 'error' && <Banner msg={state.message} />}

          <button onClick={() => setShowPreview(s => !s)} className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-zinc-300">
            {showPreview ? <EyeOff size={11} /> : <Eye size={11} />}
            {showPreview ? 'Hide preview' : 'Show preview'}
          </button>
          {showPreview && (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-md p-3 space-y-1.5 max-h-64 overflow-y-auto">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">From</p>
              <p className="text-xs text-zinc-300 font-mono">{SOURCING_FROM}</p>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-2">Subject</p>
              <p className="text-xs text-zinc-100 font-medium">{preview.subject}</p>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-2">Body</p>
              <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">{fullBody}</pre>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-end gap-2 px-5 py-3 border-t border-zinc-800">
          <button onClick={onClose} className="text-xs px-3 py-1.5 text-zinc-400 hover:text-white">Close</button>
          <button onClick={send} disabled={!canSend} className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 disabled:cursor-not-allowed font-medium">
            {sending ? <><Loader2 size={14} className="animate-spin" /> Sending…</> : sent ? <><CheckCircle2 size={14} /> Sent</> : <><Send size={14} /> Send now</>}
          </button>
        </footer>
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
