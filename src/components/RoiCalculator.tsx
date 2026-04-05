'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Delivery-bot ROI / skid-commission calculator.
 * Sliders are always interactive. The 4-metric results panel is gated
 * behind an email capture — on submission, the report is revealed and
 * a D+0 email is sent via POST /api/roi-capture.
 */
export default function RoiCalculator() {
  const [units, setUnits] = useState(3);
  const [deliveries, setDeliveries] = useState(60);   // per bot per day
  const [commission, setCommission] = useState(3.99); // $ per delivery (skid commission)
  const [daysPerMonth, setDaysPerMonth] = useState(26);
  const [leaseCost, setLeaseCost] = useState(897);    // $ / unit / month

  // Gate state
  const [email, setEmail] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [gateStatus, setGateStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [gateError, setGateError] = useState('');

  const monthlyDeliveries = units * deliveries * daysPerMonth;
  const monthlyRevenue    = monthlyDeliveries * commission;
  const monthlyCost       = units * leaseCost;
  const monthlyProfit     = monthlyRevenue - monthlyCost;
  const roi               = monthlyCost > 0 ? ((monthlyProfit / monthlyCost) * 100) : 0;
  const breakEvenDays     = monthlyProfit > 0
    ? Math.ceil(monthlyCost / (monthlyRevenue / daysPerMonth))
    : null;

  const fmt = (n: number) =>
    n >= 1000
      ? '$' + (n / 1000).toFixed(1) + 'k'
      : '$' + n.toFixed(0);

  const pct = (n: number) => (n >= 0 ? '+' : '') + n.toFixed(0) + '%';

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) {
      setGateError('Please enter a valid email address.');
      return;
    }
    setGateStatus('loading');
    setGateError('');
    try {
      const res = await fetch('/api/roi-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          roiParams: {
            units, deliveries, commission, daysPerMonth, leaseCost,
            monthlyRevenue, monthlyCost, monthlyProfit, roi, breakEvenDays,
          },
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setUnlocked(true);
      setGateStatus('idle');
    } catch {
      setGateStatus('error');
      setGateError('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="border border-neutral-200 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm p-6 sm:p-8 max-w-[820px] mx-auto">
      <div className="mb-6">
        <p className="text-[10px] tracking-widest uppercase text-neutral-400 mb-1 font-manrope">ROI Calculator</p>
        <h3 className="font-manrope font-semibold text-lg sm:text-xl text-neutral-900">Skid Commission Earnings vs. Fleet Cost</h3>
        <p className="text-sm text-neutral-500 mt-1">Adjust the sliders to model your deployment — see break-even before you call sales.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Sliders */}
        {[
          { label: 'Fleet size (bots)', value: units, min: 1, max: 20, step: 1, display: `${units} robot${units > 1 ? 's' : ''}`, set: setUnits },
          { label: 'Deliveries / bot / day', value: deliveries, min: 10, max: 200, step: 5, display: `${deliveries} deliveries`, set: setDeliveries },
          { label: 'Skid commission per delivery', value: commission, min: 0.5, max: 10, step: 0.25, display: `$${commission.toFixed(2)}`, set: setCommission },
          { label: 'Operating days per month', value: daysPerMonth, min: 1, max: 31, step: 1, display: `${daysPerMonth} days`, set: setDaysPerMonth },
          { label: 'Lease cost / bot / month', value: leaseCost, min: 200, max: 5000, step: 50, display: `$${leaseCost.toLocaleString()}`, set: setLeaseCost },
        ].map(({ label, value, min, max, step, display, set }) => (
          <div key={label}>
            <div className="flex justify-between mb-1.5">
              <span className="text-xs text-neutral-500 font-manrope">{label}</span>
              <span className="text-xs font-semibold text-neutral-800 font-manrope tabular-nums">{display}</span>
            </div>
            <input
              type="range" min={min} max={max} step={step} value={value}
              onChange={e => set(Number(e.target.value))}
              className="w-full accent-neutral-900 h-1.5 rounded-full"
            />
          </div>
        ))}
      </div>

      {/* Results — gated behind email capture */}
      {unlocked ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Monthly Revenue', value: fmt(monthlyRevenue), color: 'text-green-700', bg: 'bg-green-50 border-green-100' },
              { label: 'Fleet Cost / mo', value: fmt(monthlyCost), color: 'text-neutral-700', bg: 'bg-neutral-50 border-neutral-200' },
              { label: 'Monthly Profit', value: fmt(monthlyProfit), color: monthlyProfit >= 0 ? 'text-green-700' : 'text-red-600', bg: monthlyProfit >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100' },
              { label: 'ROI on Fleet Cost', value: pct(roi), color: roi >= 0 ? 'text-green-700' : 'text-red-600', bg: roi >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`rounded-xl border p-4 ${bg}`}>
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1 font-manrope">{label}</p>
                <p className={`text-xl font-semibold font-manrope tabular-nums ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {breakEvenDays !== null && (
            <p className="text-xs text-neutral-400 mt-4 text-center">
              Break-even in <strong className="text-neutral-700">{breakEvenDays} operating day{breakEvenDays !== 1 ? 's' : ''}</strong> per month ·{' '}
              {monthlyDeliveries.toLocaleString()} total deliveries / month
            </p>
          )}

          <p className="text-xs text-neutral-400 mt-2 text-center">
            Report sent to <strong className="text-neutral-600">{email}</strong>
          </p>

          <div className="mt-5 flex justify-center">
            <a href="#contact"
              className="inline-flex items-center gap-2 bg-neutral-900 text-white rounded-full py-2.5 px-6 text-sm font-medium hover:bg-neutral-700 transition-colors">
              Talk to a Deployment Specialist →
            </a>
          </div>
        </>
      ) : (
        /* Email gate */
        <div className="border border-neutral-200 rounded-xl p-6 bg-neutral-50 text-center">
          <p className="text-sm font-semibold text-neutral-800 font-manrope mb-1">See your full ROI report</p>
          <p className="text-xs text-neutral-500 font-manrope mb-4">
            Enter your work email and we&apos;ll send you the complete breakdown — including monthly profit, break-even timeline, and vendor recommendations.
          </p>
          <form onSubmit={handleUnlock} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="flex-1 border border-neutral-300 rounded-lg px-4 py-2.5 text-sm font-manrope focus:outline-none focus:ring-2 focus:ring-neutral-400 bg-white"
            />
            <button
              type="submit"
              disabled={gateStatus === 'loading'}
              className="inline-flex items-center justify-center gap-2 bg-neutral-900 text-white rounded-lg px-5 py-2.5 text-sm font-medium font-manrope hover:bg-neutral-700 transition-colors disabled:opacity-60"
            >
              {gateStatus === 'loading' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
              ) : (
                'Get Report →'
              )}
            </button>
          </form>
          {gateError && (
            <p className="text-xs text-red-600 mt-2 font-manrope">{gateError}</p>
          )}
          <p className="text-[10px] text-neutral-400 mt-3 font-manrope">No spam. One report, then relevant follow-ups only.</p>
        </div>
      )}
    </div>
  );
}

