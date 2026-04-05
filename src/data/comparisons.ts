/**
 * Vendor comparison definitions for gated lead-magnet pages.
 * Each comparison maps to /compare/[slug].
 */

export interface ComparisonCriterion {
  label: string;
  a: string;
  b: string;
  winner?: 'a' | 'b' | 'tie';
}

export interface Comparison {
  slug: string;
  title: string;
  description: string;
  vendorAId: string;
  vendorBId: string;
  vendorALabel: string;
  vendorBLabel: string;
  criteria: ComparisonCriterion[];
  verdict: {
    summary: string;
    chooseA: string;
    chooseB: string;
  };
}

export const COMPARISONS: Comparison[] = [
  {
    slug: 'unitree-vs-boston-dynamics',
    title: 'Unitree G1 vs Boston Dynamics Spot — 2026 Buyer Comparison',
    description:
      'Side-by-side spec breakdown, pricing, procurement paths, and a deployment verdict for Unitree G1 ($13,500) vs Boston Dynamics Spot ($74,500).',
    vendorAId: 'unitree',
    vendorBId: 'boston-dynamics',
    vendorALabel: 'Unitree G1',
    vendorBLabel: 'Boston Dynamics Spot',
    criteria: [
      { label: 'Starting Price', a: '$13,500', b: '$74,500', winner: 'a' },
      { label: 'Form Factor', a: 'Humanoid (bipedal)', b: 'Quadruped', winner: 'tie' },
      { label: 'Payload Capacity', a: '3 kg', b: '14 kg', winner: 'b' },
      { label: 'Walk Speed', a: '2.0 m/s', b: '1.6 m/s', winner: 'a' },
      { label: 'Battery Life', a: '~2 hr', b: '~90 min', winner: 'a' },
      { label: 'Procurement', a: 'Buy online (direct)', b: 'Quote required', winner: 'a' },
      { label: 'Lead Time', a: '5 business days', b: '2–3 weeks after vetting', winner: 'a' },
      { label: 'Software SDK', a: 'Python / ROS2 open', b: 'Spot SDK (Python)', winner: 'tie' },
      { label: 'Autonomy Level', a: 'Manual + basic nav', b: 'Enterprise SLAM + Scout', winner: 'b' },
      { label: 'Enterprise Support', a: 'Email / community', b: 'Dedicated enterprise', winner: 'b' },
      { label: 'IP Rating', a: 'IP54', b: 'IP54', winner: 'tie' },
      { label: 'Notable Customers', a: 'Universities, R&D labs', b: 'BP, Ford, US Army', winner: 'b' },
    ],
    verdict: {
      summary:
        'Unitree wins on raw price-to-capability ratio — you get a bipedal humanoid for less than a Spot base unit. Boston Dynamics wins on enterprise readiness: mature SDK, proven field deployments, and dedicated support. The question is budget vs reliability risk.',
      chooseA: 'Choose Unitree G1 if you need a capable research or demo platform under $20K with fast delivery.',
      chooseB: 'Choose Boston Dynamics Spot if you need a field-proven platform with enterprise support for industrial inspection or security.',
    },
  },
  {
    slug: 'agility-vs-figure',
    title: 'Agility Digit vs Figure 03 — 2026 Humanoid Enterprise Comparison',
    description:
      'Head-to-head analysis of the two leading enterprise humanoid robots: Agility Robotics Digit (RaaS) vs Figure 03 (enterprise purchase). Procurement paths, deployment models, and ROI verdict.',
    vendorAId: 'agility',
    vendorBId: 'figure',
    vendorALabel: 'Agility Digit',
    vendorBLabel: 'Figure 03',
    criteria: [
      { label: 'Pricing Model', a: 'RaaS subscription', b: 'Enterprise CapEx', winner: 'tie' },
      { label: 'Est. CapEx', a: '~$250K equivalent', b: '$70K–$150K+', winner: 'b' },
      { label: 'Height', a: '175 cm', b: '~170 cm', winner: 'tie' },
      { label: 'Payload Capacity', a: '16 kg', b: '~20 kg (est.)', winner: 'b' },
      { label: 'Procurement Path', a: 'Web form → call → pilot → RaaS', b: 'Web form → sales review → pilot', winner: 'tie' },
      { label: 'Deployment Setting', a: 'Warehouse / fulfillment', b: 'Auto manufacturing', winner: 'tie' },
      { label: 'Notable Customers', a: 'GXO, Toyota TMMC', b: 'BMW (30K cars, 11 months)', winner: 'b' },
      { label: 'US Availability', a: 'Yes (Salem, OR HQ)', b: 'Yes (Sunnyvale, CA)', winner: 'tie' },
      { label: 'Uptime Guarantee', a: 'Included in RaaS SLA', b: 'Contract-dependent', winner: 'a' },
      { label: 'Capital Risk', a: 'Low (OpEx model)', b: 'High (CapEx + integration)', winner: 'a' },
      { label: 'Customisation', a: 'Limited (RaaS model)', b: 'Higher (direct ownership)', winner: 'b' },
    ],
    verdict: {
      summary:
        "Both are serious enterprise platforms with no public pricing and multi-step procurement. Agility's RaaS model de-risks capital exposure — ideal if you want opex predictability. Figure 03 suits buyers who want full ownership and have the integration budget to match BMW's deployment scale.",
      chooseA: 'Choose Agility Digit if you want a proven warehouse humanoid without upfront CapEx risk.',
      chooseB: 'Choose Figure 03 if you are deploying at manufacturing scale and need direct ownership and customisation.',
    },
  },
  {
    slug: 'kiwibot-vs-serve',
    title: 'Kiwibot Leap vs Serve Gen 3 — 2026 Sidewalk Delivery Robot Comparison',
    description:
      'Which sidewalk delivery robot is right for your operation? Kiwibot Leap ($899/mo, reservable) vs Serve Gen 3 (B2B fleet partner). Full spec, availability, and deployment verdict.',
    vendorAId: 'kiwibot',
    vendorBId: 'serve',
    vendorALabel: 'Kiwibot Leap',
    vendorBLabel: 'Serve Gen 3',
    criteria: [
      { label: 'Pricing', a: '$899/mo per robot', b: 'B2B partnership (not public)', winner: 'a' },
      { label: 'Availability', a: 'Reservable online ($100 deposit)', b: 'Fleet partner agreement only', winner: 'a' },
      { label: 'Speed', a: '~4 mph', b: '~6 mph', winner: 'b' },
      { label: 'Payload Capacity', a: '26.5 lbs (12 kg)', b: '50 lbs (22.7 kg)', winner: 'b' },
      { label: 'Delivery Range', a: '~3 miles', b: '~5 miles', winner: 'b' },
      { label: 'Fleet Size', a: 'Small / growing', b: '2,000+ robots deployed', winner: 'b' },
      { label: 'Platform Partners', a: 'Direct operator model', b: 'Uber Eats, 7-Eleven, DoorDash', winner: 'b' },
      { label: 'Market Coverage', a: 'Campus + city (US)', b: 'Major US metros', winner: 'b' },
      { label: 'Operator Control', a: 'Operator owns relationship', b: 'Serve controls deployment', winner: 'a' },
      { label: 'Best Fit', a: 'Campus / university operators', b: 'Large metro fleet operators', winner: 'tie' },
    ],
    verdict: {
      summary:
        "Serve wins on raw scale and speed, but you can't just buy in — it requires a B2B partnership. Kiwibot Leap is the only directly-reservable sidewalk delivery robot on the US market today, making it the only real option for independent operators.",
      chooseA: 'Choose Kiwibot Leap if you are a campus, university, or independent city operator who needs a deployable unit without a fleet partnership.',
      chooseB: 'Choose Serve Gen 3 if you are a large platform or logistics operator who can negotiate a fleet partnership.',
    },
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}
