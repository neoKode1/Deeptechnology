export type EnvironmentType =
  | 'warehouse'
  | 'campus'
  | 'last_mile'
  | 'manufacturing'
  | 'retail'
  | 'food_beverage'
  | 'cold_storage';

export type ProcessType =
  | 'picking_packing'
  | 'goods_to_person'
  | 'delivery_indoor'
  | 'delivery_outdoor'
  | 'inspection'
  | 'sorting'
  | 'humanoid_general';

export type FloorSurface = 'smooth_concrete' | 'epoxy' | 'rough_concrete' | 'outdoor_pavement' | 'mixed';

/** Raw data collected during a site visit */
export interface AssessmentInput {
  // Environment
  environment: EnvironmentType;
  squareFootage: number;         // sq ft
  shiftsPerDay: number;          // 1 | 2 | 3
  hoursPerShift: number;

  // Process being automated
  process: ProcessType;
  workersOnProcess: number;      // headcount currently doing this task
  avgHourlyWage: number;         // fully-loaded $/hr per worker
  currentThroughput: number;     // units/hr or deliveries/hr today
  targetImprovement: number;     // % improvement desired (e.g. 60)

  // Constraints
  floorSurface: FloorSurface;
  ceilingHeightFt: number;
  hasWifi: boolean;
  hasDock: boolean;              // loading dock / elevator access
  outdoorRequired: boolean;

  // Fleet
  desiredUnits: number;          // 1-20
  timeline: string;              // free text e.g. "1-3 months"

  // Client info (for output)
  companyName: string;
  contactName: string;
  contactEmail: string;
}

/** A single vendor option in the catalog */
export interface VendorSpec {
  id: string;
  name: string;
  category: 'amr' | 'humanoid' | 'delivery' | 'drone' | 'forklift';
  vendor: string;
  unitCostMin: number;     // $ low estimate
  unitCostMax: number;     // $ high estimate
  payloadKg: number;
  speedMph: number;
  deployWeeks: number;     // typical weeks from order to live
  environments: EnvironmentType[];
  processes: ProcessType[];
  surfaces: FloorSurface[];
  requiresDock: boolean;
  outdoorCapable: boolean
  minCeilingFt: number;
  notes: string;
}

/** One vendor match with scores */
export interface VendorMatch {
  vendor: VendorSpec;
  fitScore: number;        // 0-100
  fitReasons: string[];
  concerns: string[];
  estimatedUnitCost: number;
  estimatedFleetCost: number;
}

/** Full output of the assessment engine */
export interface AssessmentResult {
  input: AssessmentInput;
  vendors: VendorMatch[];          // ranked best-fit first
  roi: ROIResult;
  timeline: TimelineResult;
  pilotFee: number;
  recommendedUnits: number;
}

export interface ROIResult {
  currentAnnualLaborCost: number;
  projectedAnnualSavings: number;
  fleetCostEstimate: number;       // mid-range for recommended units
  paybackMonths: number;
  threeYearNetSavings: number;
  annualROIPercent: number;
}

export interface TimelineResult {
  assessmentWeeks: number;   // always ~4 (the pilot)
  procurementWeeks: number;
  deploymentWeeks: number;
  goLiveWeeks: number;       // total from contract to live
  phases: { label: string; weeks: string }[];
}
