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
  { value: 'agriculture', label: 'Agriculture / Outdoor Farm' },
  { value: 'healthcare', label: 'Healthcare / Hospital' },
  { value: 'hospitality', label: 'Hospitality / Hotel' },
  { value: 'construction', label: 'Construction / Job Site' },
  { value: 'security', label: 'Security / Perimeter Patrol' },
];

const PROCESSES: { value: ProcessType; label: string }[] = [
  { value: 'picking_packing', label: 'Picking & Packing' },
  { value: 'goods_to_person', label: 'Goods-to-Person Transport' },
  { value: 'delivery_indoor', label: 'Indoor Delivery' },
  { value: 'delivery_outdoor', label: 'Outdoor / Sidewalk Delivery' },
  { value: 'inspection', label: 'Facility Inspection / Inventory Count' },
  { value: 'sorting', label: 'Sorting & Conveyor Assist' },
  { value: 'humanoid_general', label: 'General Humanoid Tasks' },
  { value: 'floor_cleaning', label: 'Floor Cleaning / Sanitation' },
  { value: 'security_patrol', label: 'Security Patrol / Monitoring' },
  { value: 'cobot_assembly', label: 'Cobot Assembly / Welding / Finishing' },
  { value: 'crop_monitoring', label: 'Crop Monitoring / Precision Agriculture' },
  { value: 'patient_assistance', label: 'Patient Assistance / Clinical Logistics' },
];

const SURFACES: { value: FloorSurface; label: string }[] = [
  { value: 'smooth_concrete', label: 'Smooth Concrete' },
  { value: 'epoxy', label: 'Epoxy-Coated' },
  { value: 'rough_concrete', label: 'Rough / Unfinished Concrete' },
  { value: 'outdoor_pavement', label: 'Outdoor Pavement / Sidewalk' },
  { value: 'mixed', label: 'Mixed / Multiple Surfaces' },
];

const STEP_LABELS = ['Client', 'Environment', 'Process & Labor', 'Constraints'];

const THROUGHPUT_LABEL: Record<ProcessType, string> = {
  picking_packing:    'Units Picked / hr (current)',
  goods_to_person:    'Totes / Pallets Moved / hr (current)',
  delivery_indoor:    'Deliveries / shift (current)',
  delivery_outdoor:   'Deliveries / day (current)',
  inspection:         'Inspections / shift (current)',
  sorting:            'Items Sorted / hr (current)',
  humanoid_general:   'Tasks Completed / hr (current)',
  floor_cleaning:     'Sq Ft Cleaned / shift (current)',
  security_patrol:    'Patrol Routes Completed / shift (current)',
  cobot_assembly:     'Parts Assembled / hr (current)',
  crop_monitoring:    'Acres Scanned / day (current)',
  patient_assistance: 'Patient Room Visits / shift (current)',
};

const DEFAULTS: AssessmentInput = {
  companyName: '', contactName: '', contactEmail: '',
  environment: 'warehouse', squareFootage: 50000, shiftsPerDay: 1, hoursPerShift: 8,
  process: 'picking_packing', workersOnProcess: 10, avgHourlyWage: 22,
  currentThroughput: 100, targetImprovement: 60,
  floorSurface: 'smooth_concrete', ceilingHeightFt: 20,
  hasWifi: true, hasDock: false, outdoorRequired: false,
  desiredUnits: 2, timeline: '1–3 months',
};

// ── Sub-components defined OUTSIDE AssessmentForm so React never remounts them ──

type Setter = <K extends keyof AssessmentInput>(k: K, v: AssessmentInput[K]) => void;

function Field({ label, hint, field, type = 'text', min, max, form, set }: {
  label: string; hint?: string; field: keyof AssessmentInput; type?: string; min?: number; max?: number;
  form: AssessmentInput; set: Setter;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-0.5">{label}</label>
      {hint && <p className="text-xs text-neutral-500 mb-1.5">{hint}</p>}
      <input type={type} min={min} max={max}
        value={form[field] as string | number}
        onChange={e => set(field, (type === 'number' ? Number(e.target.value) : e.target.value) as AssessmentInput[typeof field])}
        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white"
      />
    </div>
  );
}

function FormSelect<T extends string>({ label, hint, field, options, form, set }: {
  label: string; hint?: string; field: keyof AssessmentInput; options: { value: T; label: string }[];
  form: AssessmentInput; set: Setter;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-0.5">{label}</label>
      {hint && <p className="text-xs text-neutral-500 mb-1.5">{hint}</p>}
      <select value={form[field] as string}
        onChange={e => set(field, e.target.value as AssessmentInput[typeof field])}
        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Toggle({ label, hint, field, form, set }: {
  label: string; hint?: string; field: keyof AssessmentInput; form: AssessmentInput; set: Setter;
}) {
  return (
    <div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={!!form[field]}
          onChange={e => set(field, e.target.checked as AssessmentInput[typeof field])}
          className="w-4 h-4 accent-white" />
        <span className="text-sm text-white">{label}</span>
      </label>
      {hint && <p className="text-xs text-neutral-500 mt-1 ml-7">{hint}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AssessmentForm({ onRun }: { onRun: (input: AssessmentInput) => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<AssessmentInput>(DEFAULTS);

  function set<K extends keyof AssessmentInput>(k: K, v: AssessmentInput[K]) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  const steps = [
    // Step 0 — Client
    <div key="client" className="space-y-5">
      <Field label="What's the company name?" field="companyName" form={form} set={set} />
      <Field label="Who are you talking to?" hint="Name of your contact at the company" field="contactName" form={form} set={set} />
      <Field label="What's their email?" field="contactEmail" type="email" form={form} set={set} />
    </div>,

    // Step 1 — Environment
    <div key="env" className="space-y-5">
      <FormSelect label="What kind of facility is it?" field="environment" options={ENVS} form={form} set={set} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="How big is the space?" hint="Approximate sq ft" field="squareFootage" type="number" min={500} form={form} set={set} />
        <Field label="How high are the ceilings?" hint="Feet — important for drones and tall AMRs" field="ceilingHeightFt" type="number" min={6} max={60} form={form} set={set} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="How many shifts do they run?" hint="Per day" field="shiftsPerDay" type="number" min={1} max={3} form={form} set={set} />
        <Field label="How long is each shift?" hint="Hours" field="hoursPerShift" type="number" min={4} max={12} form={form} set={set} />
      </div>
      <FormSelect label="What's the floor like?" hint="Affects which robots can operate safely" field="floorSurface" options={SURFACES} form={form} set={set} />
    </div>,

    // Step 2 — Process & Labor
    <div key="process" className="space-y-5">
      <FormSelect label="What do they want to automate?" hint="Pick the closest match — we'll spec the right robot" field="process" options={PROCESSES} form={form} set={set} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="How many people are doing this today?" hint="Headcount on this specific task" field="workersOnProcess" type="number" min={1} form={form} set={set} />
        <Field label="What do they pay per hour?" hint="Per worker, fully loaded (wages + benefits). Estimate 1.3× base if unsure." field="avgHourlyWage" type="number" min={10} form={form} set={set} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label={THROUGHPUT_LABEL[form.process]} hint="What they're doing right now — robots will beat this number" field="currentThroughput" type="number" min={1} form={form} set={set} />
        <Field label="How much faster do they want to be?" hint="% improvement. 50–70% is typical for AMRs." field="targetImprovement" type="number" min={10} max={90} form={form} set={set} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="How many robots are they thinking?" hint="Not sure? Put 1–3 and we'll recommend based on volume." field="desiredUnits" type="number" min={1} max={50} form={form} set={set} />
        <Field label="When do they want this running?" hint='e.g. "ASAP", "Q3", "1–3 months"' field="timeline" form={form} set={set} />
      </div>
    </div>,

    // Step 3 — Constraints
    <div key="constraints" className="space-y-6">
      <Toggle label="Do they have WiFi or LTE throughout the facility?"
        hint="Robots need connectivity to navigate and report. No WiFi = major deployment risk."
        field="hasWifi" form={form} set={set} />
      <Toggle label="Is there a loading dock or freight elevator?"
        hint="Required for robots that need to move between floors or load from trailers."
        field="hasDock" form={form} set={set} />
      <Toggle label="Does the robot need to operate outdoors?"
        hint="Outdoor = weather-rated hardware and potentially FAA/city permits."
        field="outdoorRequired" form={form} set={set} />
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
