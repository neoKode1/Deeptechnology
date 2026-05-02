'use client';

import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Mail, Clock } from 'lucide-react';

interface OutreachRow {
  id: string;
  vendorId: string;
  template: string;
  toEmail: string;
  subject: string;
  status: 'sent' | 'failed';
  resendId?: string;
  error?: string;
  metadata?: { templateLabel?: string; source?: string; [k: string]: unknown };
  createdAt: number;
}

interface Props {
  vendorId: string;
  /** Auto-refresh trigger — bump to refetch (e.g. after a Quick Inquiry send). */
  refreshKey?: number;
}

const TEMPLATE_LABELS_LOCAL: Record<string, string> = {
  spec_request:           'Spec sheet',
  quote_request:          'Indicative quote',
  availability_check:     'Stock & lead time',
  demo_request:           'Remote demo',
  procurement_order:      'Procurement order',
  subscription_cancelled: 'Subscription cancelled',
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}

export default function OutreachHistory({ vendorId, refreshKey = 0 }: Props) {
  const [records, setRecords] = useState<OutreachRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/admin/outreach?vendorId=${encodeURIComponent(vendorId)}&limit=20`)
      .then(async r => {
        const body = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(body.error ?? `HTTP ${r.status}`);
        return body.records as OutreachRow[];
      })
      .then(rows => { if (!cancelled) setRecords(rows ?? []); })
      .catch(e => { if (!cancelled) setError(e instanceof Error ? e.message : String(e)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [vendorId, refreshKey]);

  if (loading && !records) {
    return (
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Loader2 size={12} className="animate-spin" /> Loading outreach history…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-2 text-xs text-amber-400/80">
        <AlertCircle size={13} className="mt-0.5 shrink-0" />
        <span>Couldn&apos;t load history: {error}</span>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <p className="text-xs text-zinc-600 italic">No outreach on record yet for this vendor.</p>
    );
  }

  const lastSent = records.find(r => r.status === 'sent');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-zinc-500">Outreach history</p>
        {lastSent && (
          <p className="text-[10px] text-zinc-600">
            Last contacted <span className="text-zinc-400">{timeAgo(lastSent.createdAt)}</span>
          </p>
        )}
      </div>
      <ul className="divide-y divide-zinc-800/60 border border-zinc-800/60 rounded-md overflow-hidden">
        {records.map(r => {
          const label = (r.metadata?.templateLabel as string | undefined) ?? TEMPLATE_LABELS_LOCAL[r.template] ?? r.template;
          const isAuto = r.metadata?.source === 'webhook_auto';
          const ok = r.status === 'sent';
          return (
            <li key={r.id} className="px-3 py-2 bg-zinc-950/40">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {ok ? (
                      <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    ) : (
                      <AlertCircle size={12} className="text-red-500 shrink-0" />
                    )}
                    <span className="text-xs text-zinc-200 font-medium">{label}</span>
                    {isAuto && (
                      <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-900/60">
                        Auto
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500">
                    <Mail size={10} className="shrink-0" />
                    <span className="truncate">{r.toEmail}</span>
                  </div>
                  {r.error && (
                    <p className="text-[11px] text-red-400/80 mt-1 break-all">↳ {r.error}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-600 shrink-0">
                  <Clock size={10} />
                  <span title={new Date(r.createdAt).toLocaleString()}>{timeAgo(r.createdAt)}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
