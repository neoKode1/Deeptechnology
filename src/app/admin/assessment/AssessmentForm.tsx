'use client';

import { useState } from 'react';
import type { AssessmentInput, EnvironmentType, ProcessType, FloorSurface } from '@/lib/assessment/types';

const ENVS: { value: EnvironmentType; label: string }[] = [
  { value: 'warehouse', label: 'Warehouse / Distribution' },
  { value: 'manufacturing', label: 'Manufacturing Floor' },
  { value: 'campus', label: 'Campus / Multi-Building' },
  { value: 'last_mile', label: 'Last-Mile / Urban Sidewalk' },
  { value: 'retail', label: 'Retail Floor' },
  { value: 'food_beverage', label: 'Food & Beverage' },
  { value: 'cold_storage', label: 'Cold Storage / Freezer' },
];

const PROCESSES: { value: ProcessType; label: string }[] = [
  { value: 'picking_packing', label: 'Picking & Packing' },
  { value: 'goods_to_person', label: 'Goods-to-Person Transport' },
  { value: 'delivery_indoor', label: 'Indoor Delivery' },
  { value: 'delivery_outdoor', label: 'Outdoor / Sidewalk Delivery' },
  { value: 'inspection', label: 'Facility Inspection / Inventory Count' },
  { value: 'sorting', label: 'Sorting & Conveyor Assist' },
  { value: 'humanoid_general', label: 'General Humanoid Tasks' },
];

const SURFACES: { value: FloorSurface; label: string }[] = [
  { value: 'smooth_concrete', label: 'Smooth Concrete' },
  { value: 'epoxy', label: 'Epoxy-Coated' },
  { value: 'rough_concrete', label: 'Rough / Unfinished Concrete' },
  { value: 'outdoor_pavement', label: 'Outdoor Pavement / Sidewalk' },
  { value: 'mixed', label: 'Mixed / Multiple Surfaces' },
];

const STEP_LABELS = ['Client', 'Environment', 'Process & Labor', 'Constraints'];

const DEFAULTS: AssessmentInput = {
  companyName: '', contactName: '', contactEmail: '',
  environment: 'warehouse', squareFootage: 50000, shiftsPerDay: 1, hoursPerShift: 8,
  process: 'picking_packing', workersOnProcess: 10, avgHourlyWage: 22,
  currentThroughput: 100, targetImprovement: 60,
  floorSurface: 'smooth_concrete', ceilingHeightFt: 20,
  hasWifi: true, hasDock: false, outdoorRequired: false,
  desiredUnits: 2, timeline: '1–3 months',
};

export default function AssessmentForm({ onRun }: { onRun: (input: AssessmentInput) => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<AssessmentInput>(DEFAULTS);

  function set<K extends keyof AssessmentInput>(k: K, v: AssessmentInput[K]) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  function Field({ label, field, type = 'text', min, max }: {
    label: string; field: keyof AssessmentInput; type?: string; min?: number; max?: number;
  }) {
    return (
      <div>
        <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-1">{label}</label>
        <input type={type} min={min} max={max}
          value={form[field] as string | number}
          onChange={e => set(field, (type === 'number' ? Number(e.target.value) : e.target.value) as AssessmentInput[typeof field])}
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white"
        />
      </div>
    );
  }

  function Select<T extends string>({ label, field, options }: {
    label: string; field: keyof AssessmentInput; options: { value: T; label: string }[];
  }) {
    return (
      <div>
        <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-1">{label}</label>
        <select value={form[field] as string}
          onChange={e => set(field, e.target.value as AssessmentInput[typeof field])}
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white">
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    );
  }

  function Toggle({ label, field }: { label: string; field: keyof AssessmentInput }) {
    return (
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={!!form[field]}
          onChange={e => set(field, e.target.checked as AssessmentInput[typeof field])}
          className="w-4 h-4 accent-white" />
        <span className="text-sm text-neutral-300">{label}</span>
      </label>
    );
  }

  const steps = [
    // Step 0 — Client
    <div key="client" className="space-y-4">
      <Field label="Company Name" field="companyName" />
      <Field label="Contact Name" field="contactName" />
      <Field label="Contact Email" field="contactEmail" type="email" />
    </div>,

    // Step 1 — Environment
    <div key="env" className="space-y-4">
      <Select label="Environment Type" field="environment" options={ENVS} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Square Footage" field="squareFootage" type="number" min={500} />
        <Field label="Ceiling Height (ft)" field="ceilingHeightFt" type="number" min={6} max={60} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Shifts / Day" field="shiftsPerDay" type="number" min={1} max={3} />
        <Field label="Hours / Shift" field="hoursPerShift" type="number" min={4} max={12} />
      </div>
      <Select label="Floor Surface" field="floorSurface" options={SURFACES} />
    </div>,

    // Step 2 — Process & Labor
    <div key="process" className="space-y-4">
      <Select label="Process to Automate" field="process" options={PROCESSES} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Workers on This Process" field="workersOnProcess" type="number" min={1} />
        <Field label="Avg Hourly Wage ($/hr, fully loaded)" field="avgHourlyWage" type="number" min={10} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Current Throughput (units/hr)" field="currentThroughput" type="number" min={1} />
        <Field label="Target Improvement (%)" field="targetImprovement" type="number" min={10} max={90} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Desired Fleet Size (units)" field="desiredUnits" type="number" min={1} max={50} />
        <Field label="Timeline" field="timeline" />
      </div>
    </div>,

    // Step 3 — Constraints
    <div key="constraints" className="space-y-5">
      <Toggle label="Facility has reliable WiFi / LTE coverage" field="hasWifi" />
      <Toggle label="Loading dock or freight elevator access" field="hasDock" />
      <Toggle label="Outdoor operation required" field="outdoorRequired" />
    </div>,
  ];

  const isLast = step === STEP_LABELS.length - 1;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
      {/* Step indicator */}
      <div className="flex gap-2 mb-8">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex-1">
            <div className={`h-1 rounded-full mb-1.5 ${i <= step ? 'bg-white' : 'bg-neutral-700'}`} />
            <p className={`text-[10px] uppercase tracking-widest ${i === step ? 'text-white' : 'text-neutral-600'}`}>{label}</p>
          </div>
        ))}
      </div>

      {steps[step]}

      <div className="flex justify-between mt-8">
        <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
          className="px-4 py-2 text-sm border border-neutral-700 rounded-lg text-neutral-400 hover:text-white hover:border-neutral-500 disabled:opacity-30 transition-colors">
          Back
        </button>
        {isLast ? (
          <button onClick={() => onRun(form)}
            className="px-6 py-2 text-sm bg-white text-black rounded-lg font-semibold hover:bg-neutral-100 transition-colors">
            Run Assessment →
          </button>
        ) : (
          <button onClick={() => setStep(s => s + 1)}
            className="px-6 py-2 text-sm bg-white text-black rounded-lg font-semibold hover:bg-neutral-100 transition-colors">
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
