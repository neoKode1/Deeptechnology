'use client';

import type { AssessmentResult } from '@/lib/assessment/types';

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function AssessmentResults({
  result, quoteCreated, onReset, onCreateQuote,
}: {
  result: AssessmentResult;
  quoteCreated: string | null;
  onReset: () => void;
  onCreateQuote: () => void;
}) {
  const { vendors, roi, timeline, pilotFee, recommendedUnits, input } = result;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{input.companyName || 'Assessment'} — Results</h2>
          <p className="text-neutral-400 text-sm">{input.contactName} · {input.environment.replace('_', ' ')} · {recommendedUnits} unit{recommendedUnits > 1 ? 's' : ''} recommended</p>
        </div>
        <button onClick={onReset} className="text-xs border border-neutral-700 px-3 py-1.5 rounded-lg text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors">
          ← New Assessment
        </button>
      </div>

      {/* ROI Summary */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-4">ROI Model</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Current Labor Cost', value: fmt(roi.currentAnnualLaborCost), sub: 'per year' },
            { label: 'Projected Savings', value: fmt(roi.projectedAnnualSavings), sub: 'per year', highlight: true },
            { label: 'Payback Period', value: `${roi.paybackMonths} mo`, sub: 'from go-live' },
            { label: '3-Year Net Savings', value: fmt(roi.threeYearNetSavings), sub: 'after fleet cost', highlight: roi.threeYearNetSavings > 0 },
          ].map(({ label, value, sub, highlight }) => (
            <div key={label}>
              <p className="text-xs text-neutral-500 mb-0.5">{label}</p>
              <p className={`text-xl font-bold ${highlight ? 'text-green-400' : 'text-white'}`}>{value}</p>
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
            <div key={i} className="flex justify-between items-center text-sm">
              <span className="text-neutral-300">{phase.label}</span>
              <span className="text-neutral-500 font-mono text-xs">{phase.weeks}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vendor Matches */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-4">Vendor Shortlist (ranked by fit)</p>
        {vendors.length === 0 && (
          <p className="text-neutral-500 text-sm">No matching vendors found — adjust constraints and try again.</p>
        )}
        <div className="space-y-4">
          {vendors.map((match, i) => (
            <div key={match.vendor.id} className={`border rounded-xl p-4 ${i === 0 ? 'border-white/20 bg-white/5' : 'border-neutral-800'}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  {i === 0 && <span className="text-[10px] uppercase tracking-widest text-green-400 mr-2">Top Match</span>}
                  <span className="font-semibold text-white">{match.vendor.name}</span>
                  <span className="text-neutral-400 text-sm ml-2">by {match.vendor.vendor}</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{fmt(match.estimatedUnitCost)}<span className="text-neutral-500 text-xs font-normal"> /unit</span></p>
                  <p className="text-neutral-400 text-xs">{fmt(match.estimatedFleetCost)} fleet ({recommendedUnits} units)</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {match.fitReasons.map(r => (
                  <span key={r} className="text-[11px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full">✓ {r}</span>
                ))}
              </div>
              {match.concerns.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {match.concerns.map(c => (
                    <span key={c} className="text-[11px] bg-yellow-950 text-yellow-400 px-2 py-0.5 rounded-full">⚠ {c}</span>
                  ))}
                </div>
              )}
              <p className="text-xs text-neutral-500 mt-2 italic">{match.vendor.notes}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Convert to Quote */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Next Step</p>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-white font-semibold">Pilot fee: {fmt(pilotFee)} <span className="text-green-400 text-sm font-normal">(credited toward fleet)</span></p>
            <p className="text-neutral-400 text-sm">Creates a pre-filled quote for {input.contactName} and sends a payment link.</p>
          </div>
          {quoteCreated ? (
            <a href={`/admin?quote=${quoteCreated}`}
              className="px-5 py-2.5 bg-green-500 text-black text-sm font-semibold rounded-lg hover:bg-green-400 transition-colors">
              View Quote →
            </a>
          ) : (
            <button onClick={onCreateQuote}
              className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-neutral-100 transition-colors">
              Create Quote & Send →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
