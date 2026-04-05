'use client';

import { useState } from 'react';
import Link from 'next/link';
import { runAssessment } from '@/lib/assessment/engine';
import type { AssessmentInput, AssessmentResult } from '@/lib/assessment/types';
import AssessmentForm from './AssessmentForm';
import AssessmentResults from './AssessmentResults';

function AdminNav() {
  return (
    <nav className="flex items-center gap-1 mb-8 text-xs">
      <Link href="/admin" className="text-neutral-500 hover:text-white transition-colors px-2 py-1 rounded">Toolbox</Link>
      <span className="text-neutral-700">/</span>
      <span className="text-white px-2 py-1">Assessment Engine</span>
      <span className="flex-1" />
      <Link href="/admin/quotes" className="text-neutral-500 hover:text-white transition-colors px-2 py-1 rounded">Quotes</Link>
      <Link href="/admin/vendors" className="text-neutral-500 hover:text-white transition-colors px-2 py-1 rounded">Vendors</Link>
    </nav>
  );
}

export default function AssessmentPage() {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [quoteCreated, setQuoteCreated] = useState<string | null>(null);

  function handleRun(input: AssessmentInput) {
    setResult(runAssessment(input));
    setQuoteCreated(null);
  }

  async function handleCreateQuote(result: AssessmentResult) {
    const top = result.vendors[0];
    if (!top) return;

    const res = await fetch('/api/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${prompt('Enter admin secret:')}`,
      },
      body: JSON.stringify({
        requestId: `assessment-${Date.now()}`,
        customerName: `${result.input.contactName} (${result.input.companyName})`,
        customerEmail: result.input.contactEmail,
        inquiryType: 'Autonomous solutions',
        summary: `30-day assessment: ${result.input.process.replace(/_/g, ' ')}, ${result.recommendedUnits} unit(s), ${result.input.environment}. Top match: ${top.vendor.name} by ${top.vendor.vendor}.`,
        lineItems: [{
          description: `30-Day Assessment & Pilot — ${top.vendor.name} (${result.recommendedUnits} unit${result.recommendedUnits > 1 ? 's' : ''})`,
          vendor: top.vendor.vendor,
          vendorCost: top.estimatedUnitCost * result.recommendedUnits / 1.15,
          markup: 0.15,
          billingCycle: 'one_time',
          notes: `Pilot fee credited toward fleet order. ROI payback: ${result.roi.paybackMonths} months. Annual savings: $${result.roi.projectedAnnualSavings.toLocaleString()}.`,
        }],
        notes: [
          `Company: ${result.input.companyName}`,
          `Environment: ${result.input.environment}`,
          `Process: ${result.input.process}`,
          `Recommended units: ${result.recommendedUnits}`,
          `Fleet estimate: $${top.estimatedFleetCost.toLocaleString()}`,
          `Annual savings: $${result.roi.projectedAnnualSavings.toLocaleString()}`,
          `Payback: ${result.roi.paybackMonths} months`,
          `Go-live: ~${result.timeline.goLiveWeeks} weeks from contract`,
        ].join('\n'),
      }),
    });

    const data = await res.json();
    if (data.quote?.id) setQuoteCreated(data.quote.id);
    else alert('Quote creation failed: ' + JSON.stringify(data));
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <AdminNav />
      <div className="mb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-1">Admin · Internal Tool</p>
          <h1 className="text-2xl font-semibold text-white">Assessment Engine</h1>
          <p className="text-neutral-400 text-sm mt-1">
            Enter site visit data → get vendor matches, ROI model, and deployment timeline → convert to a quote.
          </p>
        </div>

        {!result ? (
          <AssessmentForm onRun={handleRun} />
        ) : (
          <AssessmentResults
            result={result}
            quoteCreated={quoteCreated}
            onReset={() => setResult(null)}
            onCreateQuote={() => handleCreateQuote(result)}
          />
        )}
      </div>
    </div>
  );
}
