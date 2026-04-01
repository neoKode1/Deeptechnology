'use client';

import { useState } from 'react';
import SoftDevHeader from '@/components/SoftDevHeader';
import AuroraCanvas from '@/components/AuroraCanvas';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Something went wrong.');
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send. Please try again.');
    }
  };

  const inputClass =
    'w-full border border-[#ccc] rounded-none px-4 py-3 text-[#111] placeholder-[#bbb] focus:outline-none focus:border-[#111] transition-colors text-sm bg-white font-manrope';

  return (
    <div className="min-h-screen bg-white text-[#4d4d4d]">
      <SoftDevHeader />

      <section className="px-6 md:px-12 lg:px-20 pt-32 pb-24 max-w-[82rem] mx-auto">

        {/* Heading */}
        <div className="mb-16 border-b border-[#eee] pb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-[#999] font-manrope mb-4">
            Contact
          </p>
          <h1
            className="font-manrope font-semibold text-[#111] leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 9vw, 7rem)' }}
          >
            Get in touch.
          </h1>
          <p className="mt-6 text-base text-[#777] max-w-md leading-relaxed font-manrope">
            Tell us about your project. We&apos;ll get back to you at{' '}
            <a href="mailto:1deeptechnology@gmail.com" className="text-[#111] underline underline-offset-4">
              1deeptechnology@gmail.com
            </a>
          </p>
        </div>

        {/* Form + Animation side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — Form */}
          <div>
            {status === 'success' ? (
              <div className="py-20">
                <p className="font-manrope text-2xl font-semibold text-[#111]">Message received.</p>
                <p className="mt-3 text-[#999] text-sm font-manrope">We&apos;ll be in touch shortly.</p>
                <button onClick={() => setStatus('idle')} className="mt-10 sd-btn-outline">
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Name *</label>
                    <input
                      name="name" type="text" required placeholder="Your name"
                      value={form.name} onChange={handleChange}
                      disabled={status === 'loading'} className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Email *</label>
                    <input
                      name="email" type="email" required placeholder="you@company.com"
                      value={form.email} onChange={handleChange}
                      disabled={status === 'loading'} className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Message *</label>
                  <textarea
                    name="message" required rows={7}
                    placeholder="Tell us about your project or what you need..."
                    value={form.message} onChange={handleChange}
                    disabled={status === 'loading'}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-500 text-sm font-manrope">{errorMsg}</p>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="sd-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Sending…' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right — Aurora spinner animation */}
          <div className="hidden lg:block relative" style={{ height: '520px' }}>
            <AuroraCanvas className="absolute inset-0 w-full h-full" />
          </div>

        </div>
      </section>
    </div>
  );
}