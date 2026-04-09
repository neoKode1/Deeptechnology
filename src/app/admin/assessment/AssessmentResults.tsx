'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { calcROI } from '@/lib/assessment/engine';
import type { AssessmentResult, VendorMatch } from '@/lib/assessment/types';

const CATEGORY_EMOJI: Record<string, string> = {
  amr: '🤖', humanoid: '🦾', delivery: '📦', drone: '🚁', forklift: '🏗️',
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function AssessmentResults({ result, quoteCreated, onReset, onCreateQuote }: {
  result: AssessmentResult; quoteCreated: string | null; onReset: () => void; onCreateQuote: () => void;
}) {
  const { vendors, timeline, pilotFee, recommendedUnits, input } = result;
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected: VendorMatch | undefined = vendors[selectedIdx];
  const topCategory = vendors[0]?.vendor.category;
  const alternatives = vendors.filter((m, i) => i !== selectedIdx && m.vendor.category === topCategory);
  const otherClasses = vendors.filter((m, i) => i !== selectedIdx && m.vendor.category !== topCategory);

  const roi = useMemo(() => {
    if (!selected) return result.roi;
    return calcROI(input, selected.estimatedUnitCost * recommendedUnits);
  }, [selected, input, recommendedUnits, result.roi]);

  if (!selected) return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-neutral-400 text-sm">
      No matching vendors found. Adjust constraints and try again.
      <button onClick={onReset} className="ml-4 text-white underline">← Back</button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{input.companyName || 'Assessment'} — Results</h2>
          <p className="text-neutral-400 text-sm">{input.contactName} · {input.environment.replace(/_/g, ' ')} · {recommendedUnits} unit{recommendedUnits > 1 ? 's' : ''} recommended</p>
        </div>
        <button onClick={onReset} className="text-xs border border-neutral-700 px-3 py-1.5 rounded-lg text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors">← New Assessment</button>
      </div>

      {/* Primary recommendation */}
      <div className="bg-neutral-900 border border-white/20 rounded-xl overflow-hidden">
        {/* Thumbnail banner */}
        <div className="relative w-full h-44 bg-neutral-800 flex items-center justify-center">
          {selected.vendor.imageUrl ? (
            <Image
              key={selected.vendor.id}
              src={selected.vendor.imageUrl}
              alt={selected.vendor.name}
              fill
              className="object-contain p-4"
              unoptimized
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          ) : null}
          {/* Always-visible fallback behind the image */}
          <span className="text-6xl select-none absolute" style={{ zIndex: 0 }}>
            {CATEGORY_EMOJI[selected.vendor.category] ?? '🤖'}
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-green-400 block mb-1">
                {selectedIdx === 0 ? '⭐ Top Match' : '🔄 Selected'} · {selected.fitScore}/100 fit score
              </span>
              <h3 className="text-xl font-bold text-white">{selected.vendor.name}</h3>
              <p className="text-neutral-400 text-sm">by {selected.vendor.vendor}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-white font-bold text-lg">{fmt(selected.estimatedUnitCost)}<span className="text-neutral-500 text-xs font-normal"> /unit</span></p>
              <p className="text-neutral-400 text-xs">{fmt(selected.estimatedUnitCost * recommendedUnits)} for {recommendedUnits} unit{recommendedUnits > 1 ? 's' : ''}</p>
            </div>
          </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[{ label: 'Speed', value: `${selected.vendor.speedMph} mph` }, { label: 'Payload', value: `${selected.vendor.payloadKg} kg` }, { label: 'Deploy', value: `~${selected.vendor.deployWeeks} wks` }].map(({ label, value }) => (
            <div key={label} className="bg-neutral-800 rounded-lg px-3 py-2 text-center">
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.fitReasons.map(r => <span key={r} className="text-[11px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full">✓ {r}</span>)}
        </div>
        {selected.concerns.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {selected.concerns.map(c => <span key={c} className="text-[11px] bg-yellow-950 text-yellow-400 px-2 py-0.5 rounded-full">⚠ {c}</span>)}
          </div>
        )}
        <p className="text-xs text-neutral-500 italic mt-1">{selected.vendor.notes}</p>
        </div>{/* end p-5 */}
      </div>{/* end card */}

      {/* Swap palette — same class */}
      {alternatives.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">
            Swap to another {topCategory?.toUpperCase()} — ROI updates automatically
          </p>
          <div className="flex flex-wrap gap-3">
            {alternatives.map(m => {
              const idx = vendors.indexOf(m);
              return (
                <button key={m.vendor.id} onClick={() => setSelectedIdx(idx)}
                  className="flex-1 min-w-[150px] bg-neutral-900 border border-neutral-700 hover:border-white rounded-xl overflow-hidden text-left transition-colors">
                  {/* Mini thumbnail */}
                  <div className="relative w-full h-24 bg-neutral-800 flex items-center justify-center">
                    {m.vendor.imageUrl && (
                      <Image src={m.vendor.imageUrl} alt={m.vendor.name} fill
                        className="object-contain p-2" unoptimized
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                    )}
                    <span className="text-3xl select-none absolute" style={{ zIndex: 0 }}>{CATEGORY_EMOJI[m.vendor.category] ?? '🤖'}</span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-neutral-500 mb-0.5">{m.fitScore}/100 fit</p>
                    <p className="text-sm font-semibold text-white">{m.vendor.name}</p>
                    <p className="text-xs text-neutral-400">{m.vendor.vendor}</p>
                    <p className="text-xs text-neutral-300 mt-1.5">{fmt(m.estimatedUnitCost)}/unit · {fmt(m.estimatedUnitCost * recommendedUnits)} fleet</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Other robot classes — collapsed */}
      {otherClasses.length > 0 && (
        <details className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <summary className="text-xs uppercase tracking-widest text-neutral-500 cursor-pointer select-none">
            {otherClasses.length} option{otherClasses.length > 1 ? 's' : ''} from other robot classes
          </summary>
          <div className="flex flex-wrap gap-3 mt-3">
            {otherClasses.map(m => {
              const idx = vendors.indexOf(m);
              return (
                <button key={m.vendor.id} onClick={() => setSelectedIdx(idx)}
                  className="flex-1 min-w-[150px] bg-neutral-800 border border-neutral-700 hover:border-white rounded-xl p-4 text-left transition-colors">
                  <p className="text-[10px] text-neutral-500 mb-0.5 uppercase tracking-widest">{m.vendor.category} · {m.fitScore}/100</p>
                  <p className="text-sm font-semibold text-white">{m.vendor.name}</p>
                  <p className="text-xs text-neutral-400">{m.vendor.vendor}</p>
                  <p className="text-xs text-neutral-300 mt-2">{fmt(m.estimatedUnitCost)}/unit</p>
                </button>
              );
            })}
          </div>
        </details>
      )}

      {/* ROI — recalculates on swap */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-4">ROI — based on {selected.vendor.name}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Current Labor Cost', value: fmt(roi.currentAnnualLaborCost), sub: 'per year', hi: false },
            { label: 'Projected Savings', value: fmt(roi.projectedAnnualSavings), sub: 'per year', hi: true },
            { label: 'Payback Period', value: `${roi.paybackMonths} mo`, sub: 'from go-live', hi: false },
            { label: '3-Year Net Savings', value: fmt(roi.threeYearNetSavings), sub: 'after fleet cost', hi: roi.threeYearNetSavings > 0 },
          ].map(({ label, value, sub, hi }) => (
            <div key={label}>
              <p className="text-xs text-neutral-500 mb-0.5">{label}</p>
              <p className={`text-xl font-bold ${hi ? 'text-green-400' : 'text-white'}`}>{value}</p>
              <p className="text-xs text-neutral-600">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-4">Deployment Timeline — ~{timeline.goLiveWeeks} weeks total</p>
        <div className="space-y-2">
          {timeline.phases.map((phase, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-neutral-300">{phase.label}</span>
              <span className="text-neutral-500 font-mono text-xs">{phase.weeks}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Convert to quote */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Next Step</p>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-white font-semibold">Pilot fee: {fmt(pilotFee)} <span className="text-green-400 text-sm font-normal">(credited toward fleet)</span></p>
            <p className="text-neutral-400 text-sm">Creates a pre-filled quote for {selected.vendor.name} — sends payment link to {input.contactName}.</p>
          </div>
          {quoteCreated ? (
            <a href="/admin/quotes" className="px-5 py-2.5 bg-green-500 text-black text-sm font-semibold rounded-lg hover:bg-green-400 transition-colors">View Quote →</a>
          ) : (
            <button onClick={onCreateQuote} className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-neutral-100 transition-colors">Create Quote & Send →</button>
          )}
        </div>
      </div>
    </div>
  );
}
