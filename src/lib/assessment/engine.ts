import { VENDOR_CATALOG } from './vendors';
import type {
  AssessmentInput, AssessmentResult, VendorMatch,
  ROIResult, TimelineResult,
} from './types';

// ── Vendor Matching ───────────────────────────────────────────────────────────

function scoreVendor(input: AssessmentInput, vendor: typeof VENDOR_CATALOG[0]): VendorMatch | null {
  const reasons: string[] = [];
  const concerns: string[] = [];
  let score = 0;

  // Hard disqualifiers
  if (!vendor.environments.includes(input.environment)) return null;
  if (!vendor.processes.includes(input.process)) return null;
  if (input.outdoorRequired && !vendor.outdoorCapable) return null;
  if (input.hasDock === false && vendor.requiresDock) return null;
  if (input.ceilingHeightFt < vendor.minCeilingFt) return null;
  if (!vendor.surfaces.includes(input.floorSurface)) {
    // Soft disqualifier — flag as concern but allow
    concerns.push(`Floor surface (${input.floorSurface}) may need assessment`);
  }

  // Environment fit
  score += 25;
  reasons.push(`Designed for ${input.environment.replace('_', ' ')} environments`);

  // Process fit
  score += 25;
  reasons.push(`Handles ${input.process.replace(/_/g, ' ')}`);

  // Outdoor capability match
  if (input.outdoorRequired && vendor.outdoorCapable) {
    score += 10;
    reasons.push('Outdoor-capable platform');
  }

  // Fleet size scoring
  const units = input.desiredUnits;
  if (units <= 3 && vendor.unitCostMin < 35000) { score += 10; reasons.push('Cost-efficient for small fleets'); }
  if (units > 5 && vendor.unitCostMax > 50000) { score += 5; reasons.push('Scales well for larger fleets'); }

  // Speed fit
  if (vendor.speedMph >= 3 && input.process !== 'inspection') {
    score += 10;
    reasons.push(`${vendor.speedMph} mph throughput speed`);
  }

  // Deploy speed bonus
  if (vendor.deployWeeks <= 6) { score += 10; reasons.push('Fast deployment (under 6 weeks)'); }
  else if (vendor.deployWeeks <= 10) { score += 5; }
  else { concerns.push(`Longer lead time (~${vendor.deployWeeks} weeks from order to live)`); }

  // Budget tension
  const midCost = (vendor.unitCostMin + vendor.unitCostMax) / 2 * units;
  if (midCost > 500000) concerns.push('High fleet investment — phased rollout recommended');

  const estimatedUnitCost = Math.round((vendor.unitCostMin + vendor.unitCostMax) / 2);
  const estimatedFleetCost = estimatedUnitCost * units;

  return { vendor, fitScore: Math.min(score, 100), fitReasons: reasons, concerns, estimatedUnitCost, estimatedFleetCost };
}

// ── ROI Calculator ────────────────────────────────────────────────────────────

function calcROI(input: AssessmentInput, fleetCost: number): ROIResult {
  const hoursPerYear = input.shiftsPerDay * input.hoursPerShift * 250; // ~250 working days
  const currentAnnualLaborCost = input.workersOnProcess * input.avgHourlyWage * hoursPerYear;

  // Conservative: robots replace ~50-70% of manual work for the automated process
  const automationRate = Math.min(input.targetImprovement / 100, 0.70);
  const projectedAnnualSavings = Math.round(currentAnnualLaborCost * automationRate);

  const paybackMonths = projectedAnnualSavings > 0
    ? Math.round((fleetCost / projectedAnnualSavings) * 12)
    : 999;

  const threeYearNetSavings = Math.round(projectedAnnualSavings * 3 - fleetCost);
  const annualROIPercent = fleetCost > 0
    ? Math.round((projectedAnnualSavings / fleetCost) * 100)
    : 0;

  return { currentAnnualLaborCost, projectedAnnualSavings, fleetCostEstimate: fleetCost, paybackMonths, threeYearNetSavings, annualROIPercent };
}

// ── Timeline Estimator ────────────────────────────────────────────────────────

function calcTimeline(input: AssessmentInput, bestVendor: typeof VENDOR_CATALOG[0] | null): TimelineResult {
  const deployWeeks = bestVendor?.deployWeeks ?? 10;
  const assessmentWeeks = 4;
  const procurementWeeks = Math.ceil(deployWeeks * 0.4);
  const deploymentWeeks = Math.ceil(deployWeeks * 0.6);
  const goLiveWeeks = assessmentWeeks + procurementWeeks + deploymentWeeks;

  return {
    assessmentWeeks,
    procurementWeeks,
    deploymentWeeks,
    goLiveWeeks,
    phases: [
      { label: 'Assessment & Spec (Pilot)', weeks: `Weeks 1–${assessmentWeeks}` },
      { label: 'Vendor Order & Procurement', weeks: `Weeks ${assessmentWeeks + 1}–${assessmentWeeks + procurementWeeks}` },
      { label: 'On-Site Deployment & Config', weeks: `Weeks ${assessmentWeeks + procurementWeeks + 1}–${goLiveWeeks}` },
      { label: 'Go-Live & Handoff', weeks: `Week ${goLiveWeeks}` },
    ],
  };
}

// ── Recommended fleet size ────────────────────────────────────────────────────

function recommendUnits(input: AssessmentInput): number {
  // Rule of thumb: one robot per 2-3 workers on the process for AMR tasks
  const suggested = Math.max(1, Math.ceil(input.workersOnProcess / 2.5));
  // Cap recommendation at what they asked for
  return Math.min(suggested, input.desiredUnits);
}

// ── Main entry point ──────────────────────────────────────────────────────────

export function runAssessment(input: AssessmentInput): AssessmentResult {
  const matches = VENDOR_CATALOG
    .map(v => scoreVendor(input, v))
    .filter((m): m is VendorMatch => m !== null)
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 3); // top 3

  const recommendedUnits = recommendUnits(input);
  const topFleetCost = matches[0]?.estimatedUnitCost
    ? matches[0].estimatedUnitCost * recommendedUnits
    : 0;

  const roi = calcROI(input, topFleetCost);
  const timeline = calcTimeline(input, matches[0]?.vendor ?? null);

  const pilotFee = input.desiredUnits <= 1 ? 2500 : 5000;

  return { input, vendors: matches, roi, timeline, pilotFee, recommendedUnits };
}
