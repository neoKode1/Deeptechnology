'use client';

import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
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
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Something went wrong.');
      }
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send. Please try again.');
    }
  };

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50 transition-colors text-sm';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Name *</label>
          <input name="name" type="text" required placeholder="Your name"
            value={form.name} onChange={handleChange} disabled={status === 'loading'} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Email *</label>
          <input name="email" type="email" required placeholder="you@example.com"
            value={form.email} onChange={handleChange} disabled={status === 'loading'} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Subject</label>
        <input name="subject" type="text" placeholder="What&apos;s this about?"
          value={form.subject} onChange={handleChange} disabled={status === 'loading'} className={inputClass} />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Message *</label>
        <textarea name="message" required rows={6} placeholder="Tell us about your project..."
          value={form.message} onChange={handleChange} disabled={status === 'loading'}
          className={`${inputClass} resize-none`} />
      </div>

      {status === 'error' && (
        <p className="text-red-400 text-sm">{errorMsg}</p>
      )}

      {status === 'success' ? (
        <div className="text-center py-4">
          <p className="text-amber-400 text-lg font-medium">Message sent!</p>
          <p className="text-white/50 text-sm mt-1">We&apos;ll get back to you shortly.</p>
        </div>
      ) : (
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-3 px-6 rounded-lg bg-amber-400 text-black font-semibold text-sm tracking-wide hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Sending…' : 'Send Message'}
        </button>
      )}
    </form>
  );
};

export default ContactForm;