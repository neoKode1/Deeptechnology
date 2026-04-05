'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get('from') ?? '/admin';

  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret }),
    });

    setLoading(false);

    if (res.ok) {
      router.push(from);
    } else {
      setError('Invalid credentials. Try again.');
      setSecret('');
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-neutral-500 mb-2">Deeptech</p>
          <h1 className="text-2xl font-semibold text-white">Admin Sign In</h1>
          <p className="text-neutral-500 text-sm mt-2">Enter your admin password to continue.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-4"
        >
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">
              Password
            </label>
            <input
              type="password"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              placeholder="Enter your admin password"
              required
              autoFocus
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none focus:border-white transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black rounded-lg py-3 text-sm font-semibold hover:bg-neutral-100 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <p className="text-center text-xs text-neutral-700 mt-6">
          <a href="/" className="hover:text-neutral-500 transition-colors">← Back to site</a>
        </p>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
