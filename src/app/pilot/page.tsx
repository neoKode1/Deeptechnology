'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import SoftDevHeader from '@/components/SoftDevHeader';
import AuroraCanvas from '@/components/AuroraCanvas';

const ROBOT_TYPES = [
  'Sidewalk Delivery Robot', 'Warehouse AMR', 'Humanoid Robot',
  'Industrial Inspection Drone', 'Aerial Delivery Drone', 'Forklift / Sorting Bot',
  'Other / Not Sure',
] as const;

const ENVIRONMENTS = [
  'Urban / Street-Level', 'Warehouse / Distribution', 'Campus & Multi-Building',
  'Last-Mile Residential', 'Retail Floor', 'Food & Beverage', 'Other',
] as const;

const TIMELINES = [
  'ASAP (within 2 weeks)', '1 month', '1–3 months', '3–6 months', 'Just exploring',
] as const;

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function PilotPage() {
  const [form, setForm] = useState({
    companyName: '', contactName: '', email: '', phone: '',
    environment: '', robotType: '', fleetSize: '1', timeline: '', useCase: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const pilotFee = parseInt(form.fleetSize) === 1 ? '$2,500' : '$5,000';

  function set(field: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/pilot-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
    } catch {
      setStatus('error');
      setError('Something went wrong. Please try again or email us directly.');
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Aurora — decorative background, locked behind all content */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-60">
        <AuroraCanvas className="w-full h-full" />
      </div>
      <SoftDevHeader />

      <main className="relative z-10 max-w-2xl mx-auto px-6 pt-32 pb-24">

        {/* Hero */}
        <div className="mb-12 text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-neutral-300 mb-4 font-manrope">
            Robotics · Pilot Program
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight mb-4 font-manrope">
            30-Day Assessment &amp; Pilot
          </h1>
          <p className="text-neutral-200 text-base max-w-lg mx-auto font-manrope">
            We assess your environment, shortlist the right vendors, model your ROI,
            and deliver a deployment-ready specification — so you know exactly what to order and why.
            Your pilot fee is fully credited toward your fleet order.
          </p>
        </div>

        {/* What's included */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-4 font-manrope">What the pilot includes</p>
          <ul className="space-y-2 text-sm text-neutral-300 font-manrope">
            {[
              'Environment assessment — on-site or remote via video walkthrough',
              'Vendor shortlist matched to your workflow, floor plan, and budget',
              'ROI projection with your actual labor cost and throughput numbers',
              'Deployment-ready specification document ready to execute',
              "Fleet order consultation — we handle vendor coordination when you're ready",
            ].map(item => (
              <li key={item} className="flex gap-2 items-start">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          {[
            { label: '1 Unit', price: '$2,500', note: 'Single-unit assessment' },
            { label: '2–3 Units', price: '$5,000', note: 'Small fleet assessment' },
          ].map(({ label, price, note }) => (
            <div key={label} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
              <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1 font-manrope">{label}</p>
              <p className="text-2xl font-bold text-white font-manrope">{price}</p>
              <p className="text-xs text-neutral-500 mt-1 font-manrope">{note}</p>
              <p className="text-xs text-green-500 mt-2 font-manrope">Credited toward full fleet order</p>
            </div>
          ))}
        </div>

        {/* Form or success */}
        {status === 'success' ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center">
            <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white font-manrope mb-2">Request received.</h2>
            <p className="text-neutral-400 text-sm font-manrope">
              We'll review your submission and reach out within <strong className="text-white">24 hours</strong> to
              schedule your kickoff call. Check your email for a confirmation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-6">
            <p className="text-sm text-neutral-400 font-manrope">Tell us about your deployment.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Company Name *" value={form.companyName} onChange={v => set('companyName', v)} placeholder="Acme Logistics" />
              <Field label="Your Name *" value={form.contactName} onChange={v => set('contactName', v)} placeholder="Jane Smith" />
              <Field label="Work Email *" type="email" value={form.email} onChange={v => set('email', v)} placeholder="jane@acme.com" />
              <Field label="Phone" value={form.phone} onChange={v => set('phone', v)} placeholder="+1 (415) 000-0000" />
            </div>

            <Select label="Robot Type *" value={form.robotType} onChange={v => set('robotType', v)} options={ROBOT_TYPES} />
            <Select label="Deployment Environment *" value={form.environment} onChange={v => set('environment', v)} options={ENVIRONMENTS} />

            {/* Fleet size + live fee */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2 font-manrope">Fleet Size *</label>
              <div className="flex gap-3">
                {['1', '2', '3'].map(n => (
                  <button key={n} type="button" onClick={() => set('fleetSize', n)}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-manrope font-medium transition-colors ${
                      form.fleetSize === n
                        ? 'bg-white text-black border-white'
                        : 'border-neutral-700 text-neutral-400 hover:border-neutral-500'
                    }`}>
                    {n} unit{n !== '1' ? 's' : ''}
                  </button>
                ))}
              </div>
              <p className="text-xs text-green-500 mt-2 font-manrope">
                Pilot fee: <strong>{pilotFee}</strong> — credited toward your full fleet order
              </p>
            </div>

            <Select label="Timeline *" value={form.timeline} onChange={v => set('timeline', v)} options={TIMELINES} />

            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2 font-manrope">
                Describe your use case <span className="text-neutral-600">(optional)</span>
              </label>
              <textarea value={form.useCase} onChange={e => set('useCase', e.target.value)} rows={3}
                placeholder="What will the robots do? What problem are you solving?"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 font-manrope focus:outline-none focus:ring-2 focus:ring-neutral-500 resize-none" />
            </div>

            {error && <p className="text-sm text-red-500 font-manrope">{error}</p>}

            <button type="submit" disabled={status === 'loading'}
              className="w-full bg-white text-black rounded-lg py-3 text-sm font-semibold font-manrope hover:bg-neutral-100 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {status === 'loading' ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : `Request Pilot — ${pilotFee}`}
            </button>

            <p className="text-[11px] text-neutral-600 text-center font-manrope">
              Assessment fee non-refundable · No commitment to fleet order required · Pilot fee credited in full if you proceed
            </p>
          </form>
        )}
      </main>
    </div>
  );
}

// ── Reusable field components ────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2 font-manrope">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={label.includes('*')}
        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-600 font-manrope focus:outline-none focus:ring-2 focus:ring-neutral-500" />
    </div>
  );
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: readonly string[];
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2 font-manrope">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} required={label.includes('*')}
        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white font-manrope focus:outline-none focus:ring-2 focus:ring-neutral-500">
        <option value="">Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
