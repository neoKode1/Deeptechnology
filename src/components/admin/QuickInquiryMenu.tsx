'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Send, ChevronDown } from 'lucide-react';
import type { Vendor } from '@/data/vendors';
import type { TemplateId } from '@/lib/outreach/templates';
import { TEMPLATE_LABELS } from '@/lib/outreach/templates';
import { defaultRecipient, DEFAULT_TEMPLATE } from '@/lib/outreach/defaults';
import InquiryComposer from './InquiryComposer';

const ALT_TEMPLATES: { id: TemplateId; blurb: string }[] = [
  { id: 'spec_request',       blurb: 'Datasheet + safety certs' },
  { id: 'availability_check', blurb: 'Stock & lead time' },
  { id: 'demo_request',       blurb: 'Zoom walkthrough' },
];

interface Props {
  vendor: Vendor;
  /** Pre-select a specific product (forwarded to the composer). */
  initialProductName?: string;
  /** Bumped after a successful send so parents can refresh outreach history. */
  onSent?: () => void;
}

export default function QuickInquiryMenu({ vendor, initialProductName, onSent }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<TemplateId | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const defaultEmail = useMemo(() => defaultRecipient(vendor), [vendor]);
  const hasEmail = !!defaultEmail;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <>
      <div className="relative inline-block" ref={dropRef}>
        <div className="inline-flex items-stretch rounded-full border border-emerald-700/50 bg-emerald-950/30 overflow-hidden">
          <button
            onClick={() => setActive(DEFAULT_TEMPLATE)}
            disabled={!hasEmail}
            title={hasEmail ? `Open pre-filled ${TEMPLATE_LABELS[DEFAULT_TEMPLATE]} for ${vendor.name}` : 'No mailto contact on file'}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 text-emerald-300 hover:bg-emerald-900/40 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <Send size={12} /> Send Inquiry
          </button>
          <button
            onClick={() => setOpen(o => !o)}
            disabled={!hasEmail}
            aria-label="More inquiry templates"
            className="inline-flex items-center px-2 border-l border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/40 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronDown size={12} />
          </button>
        </div>
        {open && (
          <div className="absolute right-0 mt-2 w-64 bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl z-20 overflow-hidden">
            <div className="px-3 py-2 border-b border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500">
              Other templates
            </div>
            {ALT_TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => { setActive(t.id); setOpen(false); }}
                className="w-full text-left px-3 py-2 hover:bg-zinc-900 border-b border-zinc-900 last:border-0"
              >
                <p className="text-xs text-zinc-200 font-medium">{TEMPLATE_LABELS[t.id]}</p>
                <p className="text-[10px] text-zinc-500">{t.blurb}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {!hasEmail && (
        <p className="text-[10px] text-amber-400/80 mt-1">No mailto on file</p>
      )}

      {active && (
        <InquiryComposer
          vendor={vendor}
          initialTemplate={active}
          initialProductName={initialProductName}
          onClose={() => setActive(null)}
          onSent={onSent}
        />
      )}
    </>
  );
}


