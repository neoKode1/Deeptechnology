'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Mail, Clock } from 'lucide-react';
import type { ChatLead } from '@/app/api/admin/leads/route';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<ChatLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/leads');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json() as { leads: ChatLead[] };
      setLeads(data.leads ?? []);
    } catch {
      setError('Could not load chat leads. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-2">Deeptech · Admin</p>
            <h1 className="text-2xl font-semibold text-white">Chat Leads</h1>
            <p className="text-neutral-400 text-sm mt-1">
              Emails captured via the Nimbus AI gate · {leads.length} total
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchLeads}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs border border-neutral-700 px-3 py-1.5 rounded-lg text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link href="/admin" className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back
            </Link>
          </div>
        </div>

        {/* Content */}
        {loading && (
          <div className="text-neutral-500 text-sm text-center py-16">Loading…</div>
        )}

        {!loading && error && (
          <div className="bg-red-950/40 border border-red-900 rounded-xl p-5 text-red-300 text-sm">{error}</div>
        )}

        {!loading && !error && leads.length === 0 && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center">
            <Mail className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-400 text-sm">No chat leads yet.</p>
            <p className="text-neutral-600 text-xs mt-1">Leads appear here once visitors submit their email in the Nimbus chat gate.</p>
          </div>
        )}

        {!loading && !error && leads.length > 0 && (
          <div className="space-y-2">
            {leads.map((lead) => (
              <div
                key={lead.sessionId}
                className="flex items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Mail className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-sm text-white font-medium truncate">{lead.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 shrink-0">
                  <Clock className="w-3 h-3" />
                  {formatDate(lead.capturedAt)}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-[10px] text-neutral-700 mt-8 text-center">
          Leads are stored in Redis for 7 days · Session ID is anonymized
        </p>
      </div>
    </main>
  );
}
