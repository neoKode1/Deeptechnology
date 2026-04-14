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
    slug: 'tesla-optimus-vs-figure',
    title: 'Tesla Optimus Gen 3 vs Figure 03 — 2026 Humanoid Robot Comparison',
    description:
      'The two most-watched humanoid robots in enterprise AI — Tesla Optimus Gen 3 vs Figure 03. Availability, pricing, deployment timelines, and a frank verdict on which is actually buyable today.',
    vendorAId: 'tesla',
    vendorBId: 'figure',
    vendorALabel: 'Tesla Optimus Gen 3',
    vendorBLabel: 'Figure 03',
    criteria: [
      { label: 'Starting Price',       a: '$100K+ (B2B est. late 2026)',    b: '$70K–$150K+ (enterprise)',  winner: 'tie' },
      { label: 'Consumer Target',      a: '<$20K long-term at scale',        b: 'Enterprise only',           winner: 'a' },
      { label: 'Availability',         a: 'Not available — no pre-orders',   b: 'Pilot deployments active',  winner: 'b' },
      { label: 'Height / Weight',      a: '~5\'8" / 57 kg',                  b: '~5\'7" / ~60 kg',           winner: 'tie' },
      { label: 'Payload Capacity',     a: '~20 kg (est.)',                   b: '~20 kg (est.)',             winner: 'tie' },
      { label: 'Procurement Path',     a: 'No path — watch announcements',   b: 'Web form → sales → pilot',  winner: 'b' },
      { label: 'AI / Software',        a: 'Tesla FSD + Dojo neural net',     b: 'Figure AI proprietary OS',  winner: 'tie' },
      { label: 'Notable Deployments',  a: 'Tesla factories (internal only)', b: 'BMW Spartanburg (30K cars)', winner: 'b' },
      { label: 'Production Timeline',  a: 'Industrial B2B: late 2026',       b: 'Active now (select partners)', winner: 'b' },
      { label: 'Vertical Integration', a: 'Full (chips, AI, actuators)',      b: 'Focused (humanoid only)',    winner: 'a' },
    ],
    verdict: {
      summary:
        'Figure 03 is the only one you can actually deploy today — Tesla Optimus has no pre-order path and remains internal as of Q2 2026. Optimus has the long-term scale advantage (Tesla supply chain, Dojo AI, consumer price target), but Figure wins on immediate enterprise availability.',
      chooseA: 'Choose Tesla Optimus when it becomes available if you want the most vertically integrated platform with a path to mass-market pricing.',
      chooseB: 'Choose Figure 03 if you need a deployable enterprise humanoid now and have the integration budget for a pilot program.',
    },
  },
  {
    slug: 'dji-vs-skydio',
    title: 'DJI Enterprise vs Skydio X10 — 2026 Enterprise Drone Comparison',
    description:
      'DJI Matrice 400 vs Skydio X10 — the world\'s most capable commercial drone against America\'s NDAA-compliant autonomous flyer. Pricing, compliance, autonomy, and enterprise verdict.',
    vendorAId: 'dji-enterprise',
    vendorBId: 'skydio',
    vendorALabel: 'DJI Matrice 400',
    vendorBLabel: 'Skydio X10',
    criteria: [
      { label: 'Starting Price',       a: '$10,450 (in stock)',              b: '~$11K est. (quote required)', winner: 'a' },
      { label: 'Procurement',          a: 'Buy online — authorized dealers', b: 'Quote / distributor only',    winner: 'a' },
      { label: 'NDAA Compliance',      a: 'No — restricted for federal use', b: 'Yes — US-made, NDAA exempt',  winner: 'b' },
      { label: 'Autonomous Flight',    a: 'Good — waypoint + obstacle',      b: 'Best-in-class autonomy',      winner: 'b' },
      { label: 'Payload Capacity',     a: '2.5 kg payload',                  b: '~1 kg payload (est.)',        winner: 'a' },
      { label: 'Flight Time',          a: '~46 min',                         b: '~35 min',                     winner: 'a' },
      { label: 'Wind Resistance',      a: 'Level 8 (up to 54 km/h)',         b: 'Level 7 (up to 45 km/h)',     winner: 'a' },
      { label: 'Camera / Sensors',     a: 'Zenmuse H30T thermal + RGB',      b: 'Teledyne FLIR + 4K RGB',      winner: 'tie' },
      { label: 'Gov / Public Safety',  a: 'Not eligible for federal RFPs',   b: 'Primary US public safety drone', winner: 'b' },
      { label: 'Global Availability',  a: 'Worldwide via dealers',           b: 'US-focused',                  winner: 'a' },
      { label: 'Enterprise Software',  a: 'DJI FlightHub 2',                 b: 'Skydio Cloud (AI-first)',      winner: 'tie' },
    ],
    verdict: {
      summary:
        'DJI wins on price, payload, and global availability — it\'s still the most capable commercial drone dollar-for-dollar. Skydio wins for any US government, public safety, or federal deployment where NDAA compliance is non-negotiable. Your procurement context decides this one.',
      chooseA: 'Choose DJI Matrice 400 for commercial inspection, agriculture, or enterprise use cases where NDAA compliance is not required.',
      chooseB: 'Choose Skydio X10 for US federal, military, public safety, or any environment that mandates NDAA-compliant hardware.',
    },
  },
  {
    slug: 'universal-robots-vs-fanuc',
    title: 'Universal Robots vs FANUC CRX — 2026 Cobot Comparison',
    description:
      'The world\'s #1 cobot brand vs Japan\'s industrial automation giant. Universal Robots e-Series vs FANUC CRX — deployment ease, ecosystem, pricing, and verdict for manufacturers.',
    vendorAId: 'universal-robots',
    vendorBId: 'fanuc',
    vendorALabel: 'Universal Robots e-Series',
    vendorBLabel: 'FANUC CRX',
    criteria: [
      { label: 'Entry Price',          a: '~$35,000 (UR3e)',                 b: 'Quote only (CRX-5iA)',        winner: 'a' },
      { label: 'Procurement',          a: 'UR+ distributor network',         b: 'FANUC America distributors',  winner: 'tie' },
      { label: 'Ease of Programming',  a: 'Polyscope — drag & drop teach',   b: 'CRX Teach — tablet-based',    winner: 'a' },
      { label: 'Payload Range',        a: '3 kg – 30 kg (UR3e–UR30)',        b: '5 kg – 30 kg (CRX-5iA–30iA)', winner: 'tie' },
      { label: 'Reach',                a: '500 mm – 1,750 mm',               b: '994 mm – 1,889 mm',           winner: 'b' },
      { label: 'Ecosystem / Apps',     a: '250+ UR+ certified apps',         b: 'FANUC FIELD system IoT',      winner: 'a' },
      { label: 'Integrators',          a: 'Thousands globally',              b: 'FANUC certified network',     winner: 'a' },
      { label: 'Industrial Precision', a: 'High (±0.03 mm)',                 b: 'Very high (±0.02 mm)',        winner: 'b' },
      { label: 'Uptime / Reliability', a: 'Excellent — 35M+ deployments',    b: 'Exceptional — FANUC standard', winner: 'tie' },
      { label: 'Best Fit',             a: 'SME / fast deployment / research', b: 'Automotive / heavy industrial', winner: 'tie' },
    ],
    verdict: {
      summary:
        'Universal Robots wins on ecosystem size, ease of programming, and SME accessibility — it\'s the cobot you can deploy fastest with the widest pool of integrators. FANUC CRX wins on raw precision and industrial-grade reliability for high-volume manufacturing where uptime is non-negotiable.',
      chooseA: 'Choose Universal Robots if you need fast deployment, a rich app ecosystem, and accessible programming for a small-to-mid-size operation.',
      chooseB: 'Choose FANUC CRX if you need automotive-grade precision, maximum reliability, and are deploying in heavy industrial or high-volume manufacturing.',
    },
  },
  {
    slug: 'intuitive-surgical-vs-stryker-mako',
    title: 'Intuitive da Vinci 5 vs Stryker Mako — 2026 Surgical Robot Comparison',
    description:
      'The world\'s most installed surgical robot vs the leading orthopedic platform. da Vinci 5 vs Stryker Mako 4th Gen — specialties, pricing, and which system belongs in your OR.',
    vendorAId: 'intuitive-surgical',
    vendorBId: 'stryker-mako',
    vendorALabel: 'Intuitive da Vinci 5',
    vendorBLabel: 'Stryker Mako (4th Gen)',
    criteria: [
      { label: 'System Price',         a: '$1.8M–$2.5M',                    b: 'Quote (est. $1.2M–$2M)',      winner: 'b' },
      { label: 'Specialty',            a: 'Soft tissue — urology, gyn, GI', b: 'Orthopedic — hip/knee/spine', winner: 'tie' },
      { label: 'FDA Clearances',       a: '17+ indications',                 b: '4 indications (unified 4th gen)', winner: 'a' },
      { label: 'Installed Base',       a: '10,000+ systems worldwide',       b: '3,500+ systems',              winner: 'a' },
      { label: 'Procedures Performed', a: '10M+ total procedures',           b: '1M+ orthopedic procedures',   winner: 'a' },
      { label: 'Haptic Feedback',      a: 'Force feedback (dV5 new)',        b: 'Tactile guidance + haptics',   winner: 'tie' },
      { label: 'Imaging Integration',  a: 'ICG fluorescence + 3D vision',   b: 'CT-based 3D pre-op planning',  winner: 'tie' },
      { label: 'Autonomy Level',       a: 'Surgeon-controlled (teleop)',     b: 'Semi-autonomous cut guidance', winner: 'b' },
      { label: 'Procurement Path',     a: 'Intuitive hospital sales team',   b: 'Stryker orthopedic sales',    winner: 'tie' },
      { label: 'Market Position',      a: '#1 soft tissue robotic surgery',  b: '#1 orthopedic robotic surgery', winner: 'tie' },
    ],
    verdict: {
      summary:
        'These robots serve entirely different ORs — da Vinci 5 is the standard of care for soft tissue surgery, Mako is the leader for orthopedic joint replacement. Most hospitals will ultimately need both. Choose based on your surgical program\'s highest volume procedure type.',
      chooseA: 'Choose da Vinci 5 if your hospital performs high volumes of urologic, gynecologic, or general surgery cases.',
      chooseB: 'Choose Stryker Mako if you are building or expanding an orthopedic joint replacement or spine program.',
    },
  },
  {
    slug: 'boston-dynamics-spot-vs-anymal',
    title: 'Boston Dynamics Spot vs ANYbotics ANYmal D — 2026 Quadruped Robot Comparison',
    description:
      'The world\'s most recognized quadruped vs Switzerland\'s industrial-grade inspection robot. Spot vs ANYmal D — pricing, IP rating, payload, and which belongs in your facility.',
    vendorAId: 'boston-dynamics',
    vendorBId: 'anybotics',
    vendorALabel: 'Boston Dynamics Spot',
    vendorBLabel: 'ANYbotics ANYmal D',
    criteria: [
      { label: 'Starting Price',       a: '$74,500 (base unit)',             b: 'Quote only',                  winner: 'a' },
      { label: 'Full Kit Price',       a: '$150K–$195K (enterprise bundle)', b: 'Quote (est. $100K–$200K)',    winner: 'tie' },
      { label: 'IP Rating',            a: 'IP54 — splash resistant',         b: 'IP67 — dust/water immersion', winner: 'b' },
      { label: 'Payload Capacity',     a: '14 kg',                           b: '5 kg',                        winner: 'a' },
      { label: 'Speed',                a: '1.6 m/s',                         b: '1.0 m/s',                     winner: 'a' },
      { label: 'Battery Life',         a: '~90 min',                         b: '~2 hr',                       winner: 'b' },
      { label: 'Inspection Use Case',  a: 'General industrial + research',   b: 'Oil & gas, utilities, mining', winner: 'tie' },
      { label: 'Autonomy',             a: 'Scout + Orbit enterprise SLAM',   b: 'ANYmal autonomous patrol',    winner: 'tie' },
      { label: 'Arm Attachment',       a: 'Yes — Spot Arm ($65K add-on)',    b: 'No arm option',               winner: 'a' },
      { label: 'Global Support',       a: 'US + worldwide enterprise team',  b: 'European HQ, growing US',     winner: 'a' },
      { label: 'Brand Recognition',    a: 'Highest in industry',             b: 'Strong in ATEX/IECEx sectors', winner: 'a' },
    ],
    verdict: {
      summary:
        'Spot wins on payload, arm capability, availability, and brand ecosystem. ANYmal D wins on IP rating and battery — critical for outdoor or wet industrial environments like oil & gas and wastewater. If your facility is harsh enough to require IP67, ANYmal is the right call; otherwise Spot\'s richer ecosystem wins.',
      chooseA: 'Choose Boston Dynamics Spot for general industrial inspection, research, or any use case where arm manipulation or broad ecosystem access is needed.',
      chooseB: 'Choose ANYbotics ANYmal D for ATEX-rated, IP67-required environments — offshore platforms, chemical plants, and utilities where exposure to liquids or dust is unavoidable.',
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
