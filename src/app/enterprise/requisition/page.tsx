'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

const ROBOT_TYPES = [
  'Sidewalk Delivery Bots (SADRs)',
  'Road / Sidewalk Hybrid Robots (RADRs)',
  'Aerial Delivery Drones (UAVs)',
  'Autonomous Delivery Vehicles (ADVs)',
  'Warehouse AMRs / Forklift Bots',
  'Humanoid Robots',
  'Mixed / Not Sure Yet',
];

const FLEET_SIZES = ['1–3 units', '4–10 units', '11–25 units', '26–50 units', '50+ units'];
const TIMELINES   = ['ASAP (under 30 days)', '1–3 months', '3–6 months', '6–12 months', 'Planning only'];
const BUDGETS     = ['Under $25k', '$25k–$75k', '$75k–$250k', '$250k–$1M', '$1M+', 'Lease / RaaS preferred'];

const FIELD_CLS = 'bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300 transition w-full font-manrope';
const LABEL_CLS = 'text-[10px] tracking-widest uppercase text-neutral-500 mb-1.5 font-manrope block';

export default function EnterpriseRequisitionPage() {
  const [form, setForm] = useState({
    companyName: '', contactName: '', email: '', phone: '',
    robotType: '', fleetSize: '', environment: '', timeline: '', budget: '', notes: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/enterprise/requisition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submission failed');
      setStatus('done');
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (status === 'done') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center py-20">
          <CheckCircle2 className="mx-auto mb-4 text-green-600" size={44} />
          <h2 className="font-manrope font-semibold text-2xl text-neutral-900 mb-3">Requisition Received</h2>
          <p className="text-neutral-500 text-sm leading-relaxed mb-6">
            Our team will review your requirements and reach out with a preliminary term sheet — typically within a few hours during business days.
          </p>
          <Link href="/robotics" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition">
            <ArrowLeft size={15} /> Back to Robotics Division
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[760px] mx-auto px-6 py-16 sm:py-24">
        {/* Header */}
        <Link href="/robotics" className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-neutral-700 transition mb-10">
          <ArrowLeft size={14} /> Robotics Division
        </Link>
        <p className="text-[10px] tracking-widest uppercase text-neutral-400 mb-3 font-manrope">Enterprise</p>
        <h1 className="font-manrope font-semibold text-3xl sm:text-4xl text-neutral-900 mb-3 tracking-tight">Fast Requisition</h1>
        <p className="text-neutral-500 text-sm leading-relaxed mb-10 max-w-lg">
          Skip the full quote pipeline. Fill this out and we&apos;ll respond with a preliminary term sheet — pricing, lead time, and deployment scope — within hours. No big contract required.
        </p>

        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 sm:p-10 space-y-6">
          {/* Company + Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div><label className={LABEL_CLS}>Company Name *</label><input required value={form.companyName} onChange={set('companyName')} className={FIELD_CLS} placeholder="Acme Logistics Co." /></div>
            <div><label className={LABEL_CLS}>Your Name *</label><input required value={form.contactName} onChange={set('contactName')} className={FIELD_CLS} placeholder="Jane Smith" /></div>
            <div><label className={LABEL_CLS}>Work Email *</label><input required type="email" value={form.email} onChange={set('email')} className={FIELD_CLS} placeholder="jane@acme.com" /></div>
            <div><label className={LABEL_CLS}>Phone (optional)</label><input type="tel" value={form.phone} onChange={set('phone')} className={FIELD_CLS} placeholder="+1 (555) 000-0000" /></div>
          </div>

          <hr className="border-neutral-100" />

          {/* Robotics requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={LABEL_CLS}>Robot Type *</label>
              <select required value={form.robotType} onChange={set('robotType')} className={FIELD_CLS}>
                <option value="">Select type…</option>
                {ROBOT_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Fleet Size *</label>
              <select required value={form.fleetSize} onChange={set('fleetSize')} className={FIELD_CLS}>
                <option value="">Select size…</option>
                {FLEET_SIZES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Timeline *</label>
              <select required value={form.timeline} onChange={set('timeline')} className={FIELD_CLS}>
                <option value="">Select timeline…</option>
                {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Budget *</label>
              <select required value={form.budget} onChange={set('budget')} className={FIELD_CLS}>
                <option value="">Select budget…</option>
                {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={LABEL_CLS}>Deployment Environment *</label>
            <input required value={form.environment} onChange={set('environment')} className={FIELD_CLS}
              placeholder="e.g. Urban sidewalks in Chicago · 3 square mile radius · mixed weather" />
          </div>

          <div>
            <label className={LABEL_CLS}>Additional Notes</label>
            <textarea rows={3} value={form.notes} onChange={set('notes')} className={`${FIELD_CLS} resize-none`}
              placeholder="Payload requirements, regulatory constraints, existing infrastructure, integration needs…" />
          </div>

          {status === 'error' && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <button type="submit" disabled={status === 'submitting'}
            className="w-full bg-neutral-900 hover:bg-neutral-700 text-white font-semibold text-sm py-3.5 rounded-xl transition disabled:opacity-50 font-manrope">
            {status === 'submitting' ? 'Sending…' : 'Submit Requisition — Get Term Sheet'}
          </button>
          <p className="text-center text-xs text-neutral-400">Our team typically responds within 2–4 hours on business days.</p>
        </form>
      </div>
    </div>
  );
}

