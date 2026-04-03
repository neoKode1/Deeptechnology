'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ArrowUpRight, Loader2, CheckCircle } from 'lucide-react';

export interface RobotInfo {
  vendor: string;
  name: string;
  price: string;
  systemCategory: string; // maps to intake.systemCategory
  image?: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

interface Props {
  robot: RobotInfo | null;
  onClose: () => void;
}

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France',
  'Japan', 'Australia', 'Singapore', 'UAE', 'Other',
];

export default function RobotInquiryModal({ robot, onClose }: Props) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', company: '',
    jobTitle: '', country: '', message: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  /* Reset form + status whenever the modal opens for a new robot */
  useEffect(() => {
    if (robot) {
      setForm((prev) => ({
        ...prev,
        message: `Hi, I'm interested in the ${robot.vendor} ${robot.name} (${robot.price}). Please send me availability, lead time, and a formal quote.`,
      }));
      setStatus('idle');
      setErrorMsg('');
    }
  }, [robot]);

  /* Close on Escape */
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); },
    [onClose]
  );
  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          company: form.company,
          jobTitle: form.jobTitle,
          country: form.country,
          message: form.message,
          inquiry: 'Autonomous solutions',
          intake: {
            systemCategory: robot?.systemCategory ?? '',
            environmentType: '',
            payloadDescription: `${robot?.vendor} ${robot?.name}`,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Something went wrong.');
      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send. Please try again.');
    }
  };

  if (!robot) return null;

  const inp =
    'w-full border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors rounded-none font-manrope';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Inquire about ${robot.name}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full sm:max-w-lg bg-white shadow-2xl flex flex-col max-h-[92svh] overflow-y-auto">
        {/* Robot summary bar */}
        <div className="flex items-center gap-4 px-5 py-4 border-b border-neutral-100 bg-neutral-50">
          {robot.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={robot.image}
              alt={robot.name}
              className="w-14 h-14 object-cover rounded-md flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-manrope mb-0.5">{robot.vendor}</p>
            <p className="text-sm font-semibold text-neutral-900 font-manrope truncate">{robot.name}</p>
            <p className="text-xs text-neutral-500 font-manrope">{robot.price}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success state */}
        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center gap-4 px-5 py-14 text-center">
            <CheckCircle className="w-10 h-10 text-neutral-900" />
            <p className="font-manrope font-semibold text-neutral-900 text-lg">Inquiry received.</p>
            <p className="text-sm text-neutral-500 max-w-xs leading-relaxed font-manrope">
              Our sourcing team will reach out within 1 business day with availability, lead time, and a formal quote.
            </p>
            <button
              onClick={onClose}
              className="mt-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors font-manrope"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-manrope mb-3">Quick Inquiry</p>
            </div>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <input name="firstName" required placeholder="First name" value={form.firstName} onChange={handleChange} className={inp} />
              <input name="lastName" required placeholder="Last name" value={form.lastName} onChange={handleChange} className={inp} />
            </div>

            <input name="email" type="email" required placeholder="Work email" value={form.email} onChange={handleChange} className={inp} />

            {/* Company + Title row */}
            <div className="grid grid-cols-2 gap-3">
              <input name="company" required placeholder="Company" value={form.company} onChange={handleChange} className={inp} />
              <input name="jobTitle" required placeholder="Job title" value={form.jobTitle} onChange={handleChange} className={inp} />
            </div>

            <select name="country" required value={form.country} onChange={handleChange} className={inp}>
              <option value="">Country</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <textarea
              name="message"
              required
              rows={4}
              value={form.message}
              onChange={handleChange}
              className={`${inp} resize-none`}
            />

            {status === 'error' && (
              <p className="text-xs text-red-600 font-manrope">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex items-center justify-center gap-2 w-full bg-neutral-900 text-white py-3 px-6 text-sm font-medium hover:bg-black transition-colors disabled:opacity-60 font-manrope"
            >
              {status === 'loading' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
              ) : (
                <>Request Quote <ArrowUpRight className="w-4 h-4" /></>
              )}
            </button>

            <p className="text-[10px] text-neutral-400 text-center leading-relaxed font-manrope">
              Our team reviews every submission. We typically respond within 1 business day.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

