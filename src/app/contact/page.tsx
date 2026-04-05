'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SoftDevHeader from '@/components/SoftDevHeader';
import AuroraCanvas from '@/components/AuroraCanvas';

type Status = 'idle' | 'loading' | 'success' | 'error';

/* ── Intake-field option sets (mirrors robotics page taxonomy) ── */
const ENVIRONMENT_TYPES = [
  'Urban / Street-Level', 'Warehouse / Distribution', 'Retail Floor',
  'Food & Beverage', 'Campus & Multi-Building', 'Last-Mile Residential',
] as const;

const SYSTEM_CATEGORIES = [
  'SADRs (Sidewalk Delivery Robots)', 'RADRs (Road/Sidewalk Hybrids)',
  'UAVs (Aerial Drones)', 'ADVs (Autonomous Delivery Vehicles)',
  'Humanoid / Service Robots', 'Forklift / Sorting Bots',
] as const;

const TERRAIN_SURFACES = [
  'Indoor flat', 'Sidewalk / pedestrian', 'Outdoor mixed',
  'Bike lane', 'Road (low-speed)', 'Multi-surface transition',
] as const;

const INTEGRATION_OPTIONS = [
  'POS', 'ERP', 'WMS', 'Dashboard / Analytics', 'Custom API', 'None / Unsure',
] as const;

const SOFTWARE_PROJECT_TYPES = [
  'Web application', 'Mobile app', 'API / Backend', 'AI / ML pipeline',
  'IoT / Embedded', 'DevOps / Infrastructure', 'Other',
] as const;

const INDUSTRIES = [
  'Manufacturing', 'Logistics & Warehousing', 'Healthcare',
  'Retail', 'Construction', 'Agriculture',
  'Defense & Security', 'Food & Beverage', 'Technology', 'Other',
] as const;

const EMPLOYEE_COUNTS = [
  '1–10', '11–50', '51–200', '201–1,000', '1,001–5,000', '5,000+',
] as const;

interface IntakeFields {
  /* Autonomous */
  environmentType: string;
  systemCategory: string;
  payloadDescription: string;
  terrainSurface: string;
  deploymentScale: string;
  integrationNeeds: string[];
  /* Software */
  projectType: string;
  techStack: string;
  /* Shared */
  budgetRange: string;
  timeline: string;
}

const EMPTY_INTAKE: IntakeFields = {
  environmentType: '', systemCategory: '', payloadDescription: '',
  terrainSurface: '', deploymentScale: '', integrationNeeds: [],
  projectType: '', techStack: '',
  budgetRange: '', timeline: '',
};

function ContactPageInner() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    company: '', jobTitle: '', country: '', industry: '', employeeCount: '',
    inquiry: '', message: '',
  });
  const [intake, setIntake] = useState<IntakeFields>({ ...EMPTY_INTAKE });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const searchParams = useSearchParams();

  /* Pre-fill inquiry type from URL — e.g. /contact?inquiry=robotics */
  useEffect(() => {
    const param = searchParams.get('inquiry');
    if (param === 'robotics') {
      setForm((prev) => ({ ...prev, inquiry: 'Autonomous solutions' }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    /* Reset intake when inquiry type changes */
    if (name === 'inquiry') setIntake({ ...EMPTY_INTAKE });
  };

  const handleIntake = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setIntake((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleIntakeCheckbox = (field: keyof IntakeFields, value: string) => {
    setIntake((prev) => {
      const current = prev[field] as string[];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [field]: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, intake }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Something went wrong.');
      setStatus('success');
      setForm({
        firstName: '', lastName: '', email: '', phone: '',
        company: '', jobTitle: '', country: '', industry: '', employeeCount: '',
        inquiry: '', message: '',
      });
      setIntake({ ...EMPTY_INTAKE });
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send. Please try again.');
    }
  };

  const inputClass =
    'w-full border border-[#ccc] rounded-none px-4 py-3 text-[#111] placeholder-[#bbb] focus:outline-none focus:border-[#111] transition-colors text-sm bg-white font-manrope';

  return (
    <div className="min-h-screen bg-white text-[#4d4d4d]">
      <SoftDevHeader />

      <section className="px-4 sm:px-6 md:px-12 lg:px-20 pt-24 sm:pt-32 pb-16 sm:pb-24 max-w-[82rem] mx-auto">

        {/* Heading + Aurora side-by-side */}
        <div className="mb-10 sm:mb-16 border-b border-[#eee] pb-8 sm:pb-12 grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
          {/* Left — heading copy */}
          <div>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#999] font-manrope mb-3 sm:mb-4">
              Contact
            </p>
            <h1
              className="font-manrope font-semibold text-[#111] leading-none tracking-tight"
              style={{ fontSize: 'clamp(2.5rem, 9vw, 7rem)' }}
            >
              Get in touch.
            </h1>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base text-[#777] max-w-md leading-relaxed font-manrope">
              Tell us about your project, or reach us directly at{' '}
              <a href="mailto:info@deeptechnologies.dev" className="text-[#111] underline underline-offset-4 break-all">
                info@deeptechnologies.dev
              </a>.
            </p>
          </div>

          {/* Right — Aurora spinner */}
          <div className="hidden lg:block" style={{ height: '400px' }}>
            <AuroraCanvas className="w-full h-full" />
          </div>
        </div>

        {/* Form */}
        {status === 'success' ? (
          <div className="py-20">
            <p className="font-manrope text-2xl font-semibold text-[#111]">Message received.</p>
            <p className="mt-3 text-[#999] text-sm font-manrope">We&apos;ll be in touch shortly.</p>
            <button onClick={() => setStatus('idle')} className="mt-10 sd-btn-outline">
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl">

            {/* Row 1: First / Last name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">First Name *</label>
                <input
                  name="firstName" type="text" required placeholder="First name"
                  value={form.firstName} onChange={handleChange}
                  disabled={status === 'loading'} className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Last Name *</label>
                <input
                  name="lastName" type="text" required placeholder="Last name"
                  value={form.lastName} onChange={handleChange}
                  disabled={status === 'loading'} className={inputClass}
                />
              </div>
            </div>

            {/* Row 2: Business Email / Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Business Email *</label>
                <input
                  name="email" type="email" required placeholder="you@company.com"
                  value={form.email} onChange={handleChange}
                  disabled={status === 'loading'} className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Phone Number</label>
                <input
                  name="phone" type="tel" placeholder="+1 (555) 000-0000"
                  value={form.phone} onChange={handleChange}
                  disabled={status === 'loading'} className={inputClass}
                />
              </div>
            </div>

            {/* Row 3: Company / Job Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Company Name *</label>
                <input
                  name="company" type="text" required placeholder="Your company"
                  value={form.company} onChange={handleChange}
                  disabled={status === 'loading'} className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Job Title *</label>
                <input
                  name="jobTitle" type="text" required placeholder="e.g. VP of Operations"
                  value={form.jobTitle} onChange={handleChange}
                  disabled={status === 'loading'} className={inputClass}
                />
              </div>
            </div>

            {/* Row 4: Country / Industry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Country *</label>
                <input
                  name="country" type="text" required placeholder="e.g. United States"
                  value={form.country} onChange={handleChange}
                  disabled={status === 'loading'} className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Industry *</label>
                <select
                  name="industry" required
                  value={form.industry} onChange={handleChange}
                  disabled={status === 'loading'}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="" disabled>Select industry…</option>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>

            {/* Row 5: Employee Count / Inquiry Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Number of Employees</label>
                <select
                  name="employeeCount"
                  value={form.employeeCount} onChange={handleChange}
                  disabled={status === 'loading'}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="">Please select…</option>
                  {EMPLOYEE_COUNTS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Inquiry Type *</label>
                <select
                  name="inquiry" required
                  value={form.inquiry} onChange={handleChange}
                  disabled={status === 'loading'}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="" disabled>Select a service…</option>
                  <option value="Software solutions">Software solutions</option>
                  <option value="Autonomous solutions">Autonomous solutions</option>
                </select>
              </div>
            </div>

            {/* ── Conditional intake fields per inquiry type ── */}
            {form.inquiry === 'Autonomous solutions' && (
              <div className="flex flex-col gap-4 sm:gap-6 border border-[#eee] rounded-sm p-4 sm:p-6 bg-[#fafafa]">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#999] font-manrope font-semibold">Autonomous Sourcing Details</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Environment Type</label>
                    <select name="environmentType" value={intake.environmentType} onChange={handleIntake} disabled={status === 'loading'} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="">Select environment…</option>
                      {ENVIRONMENT_TYPES.map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">System Category</label>
                    <select name="systemCategory" value={intake.systemCategory} onChange={handleIntake} disabled={status === 'loading'} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="">Select system type…</option>
                      {SYSTEM_CATEGORIES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Payload Description</label>
                  <input name="payloadDescription" type="text" placeholder="e.g. 10kg parcels, hot food containers, pallets" value={intake.payloadDescription} onChange={handleIntake} disabled={status === 'loading'} className={inputClass} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Terrain / Surface</label>
                    <select name="terrainSurface" value={intake.terrainSurface} onChange={handleIntake} disabled={status === 'loading'} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="">Select terrain…</option>
                      {TERRAIN_SURFACES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Deployment Scale</label>
                    <select name="deploymentScale" value={intake.deploymentScale} onChange={handleIntake} disabled={status === 'loading'} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="">Select scale…</option>
                      <option value="Single unit pilot">Single unit pilot</option>
                      <option value="Small fleet (2-10)">Small fleet (2–10)</option>
                      <option value="Large fleet (10+)">Large fleet (10+)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Integration Needs</label>
                  <div className="flex flex-wrap gap-3">
                    {INTEGRATION_OPTIONS.map((opt) => (
                      <button key={opt} type="button" disabled={status === 'loading'}
                        onClick={() => toggleIntakeCheckbox('integrationNeeds', opt)}
                        className={`text-xs px-3 py-1.5 border rounded-sm font-manrope transition-colors ${intake.integrationNeeds.includes(opt) ? 'bg-[#111] text-white border-[#111]' : 'bg-white text-[#666] border-[#ccc] hover:border-[#999]'}`}
                      >{opt}</button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Budget Range</label>
                    <select name="budgetRange" value={intake.budgetRange} onChange={handleIntake} disabled={status === 'loading'} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="">Select range…</option>
                      <option value="Under $25K">Under $25K</option>
                      <option value="$25K – $100K">$25K – $100K</option>
                      <option value="$100K – $500K">$100K – $500K</option>
                      <option value="$500K+">$500K+</option>
                      <option value="Not sure yet">Not sure yet</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Timeline</label>
                    <select name="timeline" value={intake.timeline} onChange={handleIntake} disabled={status === 'loading'} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="">Select timeline…</option>
                      <option value="ASAP">ASAP</option>
                      <option value="1-3 months">1–3 months</option>
                      <option value="3-6 months">3–6 months</option>
                      <option value="6+ months">6+ months</option>
                      <option value="Exploratory">Exploratory / no timeline</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {form.inquiry === 'Software solutions' && (
              <div className="flex flex-col gap-4 sm:gap-6 border border-[#eee] rounded-sm p-4 sm:p-6 bg-[#fafafa]">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#999] font-manrope font-semibold">Software Project Details</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Project Type</label>
                    <select name="projectType" value={intake.projectType} onChange={handleIntake} disabled={status === 'loading'} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="">Select type…</option>
                      {SOFTWARE_PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Tech Stack / Preferences</label>
                    <input name="techStack" type="text" placeholder="e.g. React, Node, Python, AWS" value={intake.techStack} onChange={handleIntake} disabled={status === 'loading'} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Budget Range</label>
                    <select name="budgetRange" value={intake.budgetRange} onChange={handleIntake} disabled={status === 'loading'} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="">Select range…</option>
                      <option value="Under $10K">Under $10K</option>
                      <option value="$10K – $50K">$10K – $50K</option>
                      <option value="$50K – $150K">$50K – $150K</option>
                      <option value="$150K+">$150K+</option>
                      <option value="Not sure yet">Not sure yet</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Timeline</label>
                    <select name="timeline" value={intake.timeline} onChange={handleIntake} disabled={status === 'loading'} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="">Select timeline…</option>
                      <option value="ASAP">ASAP</option>
                      <option value="1-3 months">1–3 months</option>
                      <option value="3-6 months">3–6 months</option>
                      <option value="6+ months">6+ months</option>
                      <option value="Exploratory">Exploratory / no timeline</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.18em] text-[#999] font-manrope">Message *</label>
              <textarea
                name="message" required rows={7}
                placeholder="Tell us about your project or what you need..."
                value={form.message} onChange={handleChange}
                disabled={status === 'loading'}
                className={`${inputClass} resize-none`}
              />
            </div>

            {status === 'error' && (
              <p className="text-red-500 text-sm font-manrope">{errorMsg}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="sd-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Sending…' : 'Send Message'}
              </button>
            </div>
          </form>
        )}


      </section>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactPageInner />
    </Suspense>
  );
}