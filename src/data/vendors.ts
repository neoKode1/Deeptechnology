/**
 * Deeptech Vendor Intelligence Database
 * Source-verified contacts, pricing, and procurement paths for all catalog vendors.
 * Last updated: April 2026
 */

export type BuyPath = 'direct_online' | 'email_required' | 'raas_only' | 'dealer_only' | 'b2b_partner' | 'not_available';

export interface VendorContact {
  label: string;
  value: string;
  href?: string;
}

export interface VendorProduct {
  name: string;
  price: string;      // display string e.g. "$13,500" or "RaaS — Contact"
  deposit?: string;   // e.g. "$200 refundable"
  status: 'in_stock' | 'pre_order' | 'raas' | 'not_available' | 'quote_required';
  orderUrl?: string;
  notes?: string;
  image?: string;     // path relative to /public e.g. "/media/unitree-g1.webp"
}

export type VendorCategory =
  | 'humanoid' | 'delivery' | 'industrial' | 'drone'
  | 'cobot' | 'surgical' | 'service' | 'agricultural'
  | 'security' | 'cleaning' | 'exoskeleton' | 'components'
  | 'quadruped' | 'underwater' | 'inspection' | 'defense';

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  buyPath: BuyPath;
  leadTime?: string;
  contacts: VendorContact[];
  products: VendorProduct[];
  procurementNotes?: string;
}

export const VENDORS: Vendor[] = [
  // ─── HUMANOID ───────────────────────────────────────────────────────────────
  {
    id: 'unitree',
    name: 'Unitree Robotics',
    category: 'humanoid',
    buyPath: 'direct_online',
    leadTime: '5 business days (confirm)',
    contacts: [
      { label: 'Sales (Global)', value: 'sales_global@unitree.com', href: 'mailto:sales_global@unitree.com' },
      { label: 'Shop Email', value: 'sales_global@unitree.cc', href: 'mailto:sales_global@unitree.cc' },
      { label: 'Phone (HQ)', value: '+86 17621781139', href: 'tel:+8617621781139' },
      { label: 'Support', value: 'support@unitree.com', href: 'mailto:support@unitree.com' },
      { label: 'US Dealer — ToborLife', value: 'Mountain View, CA', href: 'https://toborlife.com' },
      { label: 'Order Form', value: 'unitree.com/booking', href: 'https://www.unitree.com/booking' },
    ],
    products: [
      { name: 'G1 Basic', price: '$17,990', status: 'in_stock', orderUrl: 'https://shop.unitree.com', notes: '23 DOF; entry-level humanoid; no SDK.', image: '/media/G1%20Basic.png' },
      { name: 'G1 EDU Standard', price: '$13,500', status: 'in_stock', orderUrl: 'https://shop.unitree.com', notes: '100 TOPS computing; SDK included.', image: '/media/G1%20EDU%20Standard.webp' },
      { name: 'G1 EDU Plus', price: '~$43,500', status: 'in_stock', orderUrl: 'https://shop.unitree.com', notes: 'Enhanced dexterity; 43-joint version.', image: '/media/unitree-g1-edu-plus-robotic-humanoid-u2-3162585.webp' },
      { name: 'H1', price: '$90,000', status: 'quote_required', notes: 'First-gen full-size humanoid; contact sales_global@unitree.com.', image: '/media/H1.png' },
      { name: 'H2', price: '$29,900', status: 'in_stock', orderUrl: 'https://shop.unitree.com', image: '/media/H2.webp' },
      { name: 'R1 (Pre-sale)', price: 'From $5,900', status: 'pre_order', orderUrl: 'https://shop.unitree.com', notes: 'Wheeled humanoid; mass production 2026.', image: '/media/unitree-r1-humanoid-robot-grey-04_1200x1200.webp' },
    ],
    procurementNotes: 'G1/H2/R1 can be purchased directly at shop.unitree.com. H1 requires emailing sales. Industry orders use the booking form. US dealers (ToborLife, K-Robotics) offer 3% institutional discount.',
  },
  {
    id: '1x',
    name: '1X Technologies',
    category: 'humanoid',
    buyPath: 'direct_online',
    leadTime: 'US deliveries begin 2026',
    contacts: [
      { label: 'Order Page', value: '1x.tech/order', href: 'https://www.1x.tech/order' },
      { label: 'Press', value: 'press@1x.tech', href: 'mailto:press@1x.tech' },
    ],
    products: [
      { name: 'NEO (Early Access)', price: '$20,000', deposit: '$200 refundable', status: 'pre_order', orderUrl: 'https://www.1x.tech/order', notes: 'Priority 2026 delivery, 3-yr warranty', image: '/media/1X%20Technologies.avif' },
      { name: 'NEO (Subscription)', price: '$499/mo', status: 'pre_order', orderUrl: 'https://www.1x.tech/order', notes: 'Ships later than Early Access', image: '/media/1X%20Technologies.avif' },
    ],
    procurementNotes: '$200 fully refundable deposit locks Early Access. Ships US first (2026), other markets 2027. Colors: Tan, Gray, Dark Brown.',
  },
  {
    id: 'agility',
    name: 'Agility Robotics',
    category: 'humanoid',
    buyPath: 'raas_only',
    contacts: [
      { label: 'Sales Page', value: 'agilityrobotics.com/sales', href: 'https://agilityrobotics.com/sales' },
    ],
    products: [
      { name: 'Digit (Gen 5)', price: '~$250,000 or RaaS', status: 'raas', notes: '175 cm / 63.5 kg; 1.5 m/s; 30 DOF; Amazon warehouse partner; RaaS target <$10/hr equivalent.', image: '/media/Agility%20Robotics%20Digit.jpg' },
    ],
    procurementNotes: 'RaaS model only. No direct CapEx purchase. Submit web form → Sales call → Pilot → RaaS contract. Customers: GXO, Toyota TMMC (7 units), Mercado Libre. HQ: Salem, OR.',
  },
  {
    id: 'tesla',
    name: 'Tesla',
    category: 'humanoid',
    buyPath: 'not_available',
    contacts: [
      { label: 'Contact', value: 'tesla.com/contact', href: 'https://www.tesla.com/contact' },
    ],
    products: [
      { name: 'Optimus Gen 3', price: 'Not available', status: 'not_available', notes: 'Consumer target: end of 2027. B2B industrial: late 2026 at $100K+.', image: '/media/tesla-optimus-auAwknG6.png' },
    ],
    procurementNotes: '⚠️ No pre-orders, no waitlist as of April 2026. All third-party reservation sites are scams. Gen 3 revealed Q1 2026. Long-term price target <$20K at scale.',
  },
  {
    id: 'figure',
    name: 'Figure AI',
    category: 'humanoid',
    buyPath: 'email_required',
    contacts: [
      { label: 'Contact', value: 'figure.ai', href: 'https://www.figure.ai' },
    ],
    products: [
      { name: 'Figure 03', price: 'Enterprise — Contact', status: 'quote_required', notes: 'Figure 02 retiring. F03 is current.', image: '/media/Figure%2002.jpg' },
    ],
    procurementNotes: 'Enterprise pilot/deployment contracts only. No public price. Estimated $70K–$150K+ per unit. Notable: 11-month BMW Spartanburg deployment (30K cars). Web form → Sales review → Pilot.',
  },

  // ─── DELIVERY ───────────────────────────────────────────────────────────────
  {
    id: 'serve',
    name: 'Serve Robotics',
    category: 'delivery',
    buyPath: 'b2b_partner',
    contacts: [
      { label: 'Press / Media', value: 'press@serverobotics.com', href: 'mailto:press@serverobotics.com' },
      { label: 'IR', value: 'investor.relations@serverobotics.com', href: 'mailto:investor.relations@serverobotics.com' },
      { label: 'Contact', value: 'serverobotics.com/contact', href: 'https://www.serverobotics.com/contact' },
    ],
    products: [
      { name: 'Serve R2 (Fleet)', price: 'B2B partnership only', status: 'raas', notes: '2,000-robot fleet; partners: Uber Eats, 7-Eleven, DoorDash', image: '/media/Serve-Gen-2-left-and-Gen-3-robots.jpg' },
    ],
    procurementNotes: 'Not available for individual purchase. Fleet operator partnerships only. Largest US sidewalk delivery fleet.',
  },
  {
    id: 'kiwibot',
    name: 'Kiwibot',
    category: 'delivery',
    buyPath: 'direct_online',
    contacts: [
      { label: 'Business / Partnerships', value: 'mariaf.valdez@kiwibot.com', href: 'mailto:mariaf.valdez@kiwibot.com' },
      { label: 'Customer Service', value: 'help@kiwibot.com', href: 'mailto:help@kiwibot.com' },
      { label: 'Customer Service Phone', value: '+1 (831) 292-5135', href: 'tel:+18312925135' },
      { label: 'Press', value: 'comms@kiwibot.com', href: 'mailto:comms@kiwibot.com' },
      { label: 'Custom Dev', value: 'd@kiwibot.com', href: 'mailto:d@kiwibot.com' },
    ],
    products: [
      { name: 'Kiwibot Leap', price: '$899/mo per robot', deposit: '$100 refundable', status: 'pre_order', orderUrl: 'https://www.kiwibot.com/product/kiwibot-leap', notes: 'US only, limited units', image: '/media/kiwi-2.webp' },
    ],
    procurementNotes: '$100 refundable deposit to reserve. $899/mo per robot after activation. US only. Campus and city delivery use case.',
  },
  {
    id: 'segway',
    name: 'Segway Robotics',
    category: 'delivery',
    buyPath: 'b2b_partner',
    contacts: [
      { label: 'Commercial Email', value: 'commercial_business@ninebot.com', href: 'mailto:commercial_business@ninebot.com' },
      { label: 'Partner Inquiry', value: 'robotics.segway.com/request-a-trial', href: 'https://robotics.segway.com/request-a-trial/' },
    ],
    products: [
      { name: 'E1 Outdoor Delivery Robot', price: 'Partner pricing', status: 'raas', notes: 'Fleet partner model', image: '/media/Segway%20Robotics.jpeg' },
    ],
    procurementNotes: 'Partner/dealer model. Submit form → Sales contact → Fleet deployment. Not sold direct to end operators.',
  },
  {
    id: 'starship',
    name: 'Starship Technologies',
    category: 'delivery',
    buyPath: 'b2b_partner',
    contacts: [
      { label: 'Business Inquiries', value: 'business@starship.co', href: 'mailto:business@starship.co' },
      { label: 'Contact', value: 'starship.xyz/contact-starship', href: 'https://www.starship.xyz/contact-starship/' },
    ],
    products: [
      { name: 'Starship R2 (Urban Delivery)', price: '$1–$2/delivery', status: 'raas', notes: 'Sidewalk delivery robot; 6-wheeled; autonomous; neighborhood & city deployments.', image: '/media/starship_delivery_bot.webp' },
      { name: 'Starship R2 (Campus Fleet)', price: 'B2B Contract', status: 'raas', notes: 'University & corporate campus deployments; API integration; 270+ locations globally.', image: '/media/starship_tcm17-33127.png' },
    ],
    procurementNotes: 'B2B service agreement. Delivery-as-a-Service: $1 UK, $2 US per delivery. API integration available. 270+ locations globally. HQ: San Francisco.',
  },
  {
    id: 'rivr',
    name: 'RIVR',
    category: 'delivery',
    buyPath: 'b2b_partner',
    leadTime: '16–24 weeks (fleet deployment)',
    contacts: [
      { label: 'Website', value: 'rivr.ai', href: 'https://www.rivr.ai' },
      { label: 'Partnership Inquiry', value: 'rivr.ai/#contact', href: 'https://www.rivr.ai/#contact' },
    ],
    products: [
      {
        name: 'RIVR One — Wheeled-Legged Delivery Robot',
        price: '~$200,000 full-stack · RaaS available',
        status: 'raas',
        notes: 'Carries 30 kg payload · 30+ km range · 14 km/h top speed · 2–3 hr recharge. Partners: Just Eat, Swiss Post, Migros Online, Evri UK.',
        image: '/media/rivr-unitree-robot-concept-scazziga-front-view-2025.jpg',
      },
    ],
    procurementNotes: 'Formerly Swiss-Mile. RIVR builds wheeled-legged quadruped robots for last-mile and doorstep delivery. Fleet deployment model — not sold unit-direct. $22M seed round backed by Jeff Bezos (Bezos Expeditions). HQ: Zurich, Switzerland.',
  },

  // ─── INDUSTRIAL / WAREHOUSE ─────────────────────────────────────────────────
  {
    id: 'boston-dynamics',
    name: 'Boston Dynamics',
    category: 'industrial',
    buyPath: 'email_required',
    leadTime: '~5 business days for quote',
    contacts: [
      { label: 'Spot Sales', value: 'bostondynamics.com/contact', href: 'https://bostondynamics.com/contact/' },
      { label: 'Stretch Sales', value: 'bostondynamics.com/stretch-sales', href: 'https://bostondynamics.com/stretch-sales' },
      { label: 'Atlas Early Access', value: 'bostondynamics.com/atlas-contact', href: 'https://bostondynamics.com/atlas-contact' },
      { label: 'Customer Support', value: 'support.bostondynamics.com', href: 'https://support.bostondynamics.com' },
      { label: 'Spec Sheet Email', value: 'sales@bostondynamics.com', href: 'mailto:sales@bostondynamics.com' },
    ],
    products: [
      // ── Spot — 4-legged inspection quadruped ───────────────────────────────
      { name: 'Spot (Base)', price: '$74,500', status: 'quote_required', notes: 'Quadruped inspection robot; 14 kg payload; IP54; 90-min runtime.', image: '/media/Boston%20Dynamics%20Spot.jpg' },
      { name: 'Spot Enterprise w/ Docking', price: '$111,700', status: 'quote_required', notes: 'Autonomous charging dock; 24/7 unattended inspection missions.', image: '/media/boston-dynamics-spot.jpg' },
      { name: 'Spot Arm', price: '$65,000', status: 'quote_required', notes: 'Add-on manipulation arm; 4 kg payload; valve turning, door opening.', image: '/media/boston-dynamics-spot.jpg' },
      { name: 'Spot Enterprise Bundle', price: '$150K–$195K', status: 'quote_required', notes: 'Full thermal + docking bundle; mission autonomy package.', image: '/media/boston-dynamics-spot.jpg' },
      // ── Stretch — wheeled warehouse unloading robot (different type) ────────
      { name: 'Stretch (Warehouse)', price: 'Contact Sales', status: 'quote_required', notes: 'Wheeled mobile arm robot. Autonomous truck unloading; 800 cases/hr; not a quadruped.', image: '/media/Boston%20Dynamics%20Stretch.jpg' },
      // ── Atlas — humanoid ────────────────────────────────────────────────────
      { name: 'Atlas (Industrial)', price: 'Early adopters only', status: 'quote_required', notes: 'Electric bipedal humanoid; early-access partner program only.', image: '/media/atlas2-Pre-Launch-Thumbnail.webp' },
    ],
    procurementNotes: 'Verified businesses and government only — no personal/hobby sales. Web form → Vetting → Quote (5 days) → Pilot → Purchase. Strict use-case screening.',
  },
  {
    id: 'seegrid',
    name: 'Seegrid',
    category: 'industrial',
    buyPath: 'email_required',
    leadTime: '26 weeks',
    contacts: [
      { label: 'Sales', value: 'sales@seegrid.com', href: 'mailto:sales@seegrid.com' },
      { label: 'Media', value: 'media@seegrid.com', href: 'mailto:media@seegrid.com' },
      { label: 'Media Phone', value: '412-379-4500', href: 'tel:4123794500' },
    ],
    products: [
      { name: 'Palion Lift RS1', price: 'Enterprise quote', status: 'quote_required', notes: '26-week lead time confirmed on product page', image: '/media/Seegrid-Palion-AMR-Fleet-2024_Palion-Tow-Palion-Lift-RS1-Palion-Lift-CR1.webp' },
    ],
    procurementNotes: '26-week lead time. Enterprise sales — contact form or email sales@seegrid.com. Specializes in autonomous fork trucks and tow tractors for palletized material handling.',
  },
  {
    id: 'mir',
    name: 'MiR Robotics',
    category: 'industrial',
    buyPath: 'dealer_only',
    contacts: [
      { label: 'Clayton Controls (CA/AZ)', value: 'info@claycon.com — 800-235-4411', href: 'mailto:info@claycon.com' },
      { label: 'Industrial Control (MI)', value: 'Sales@IndustrialControl.com — 616-748-8200', href: 'mailto:Sales@IndustrialControl.com' },
      { label: 'Gibson Engineering', value: 'gibsonengineering.com/products/mir', href: 'https://www.gibsonengineering.com/products/mir' },
      { label: 'Automation Inc.', value: 'automationinc.com/mir-products/mir600', href: 'https://www.automationinc.com/mir-products/mir600' },
    ],
    products: [
      { name: 'MiR100', price: 'Quote via distributor', status: 'quote_required', notes: '100 kg payload; compact; cost-efficient smaller loads.', image: '/media/MiR-AMR-lineup-1500x1000-1-1024x683.webp' },
      { name: 'MiR250', price: 'Quote via distributor', status: 'quote_required', notes: '250 kg payload; agile and fast; 2 m/s.', image: '/media/MiR-AMR-lineup-1500x1000-1-1024x683.webp' },
      { name: 'MiR600', price: 'Quote via distributor', status: 'quote_required', notes: '600 kg pallet AMR; 2 m/s.', image: '/media/MiR-AMR-lineup-1500x1000-1-1024x683.webp' },
      { name: 'MiR1200 Pallet Jack', price: 'Quote via distributor', status: 'quote_required', notes: 'Autonomous pallet jack; 1,200 kg.', image: '/media/MiR-AMR-lineup-1500x1000-1-1024x683.webp' },
      { name: 'MiR1350', price: '~$124,700', status: 'quote_required', notes: '1,350 kg payload; most powerful MiR AMR; 1.2 m/s; 9 h 50 min runtime.', image: '/media/MiR-AMR-lineup-1500x1000-1-1024x683.webp' },
    ],
    procurementNotes: 'US sales via regional distributors only. No direct purchase from MiR website in the US. Contact closest distributor for demo and quote.',
  },

  // ─── DRONES ─────────────────────────────────────────────────────────────────
  {
    id: 'dji-enterprise',
    name: 'DJI Enterprise',
    category: 'drone',
    buyPath: 'dealer_only',
    contacts: [
      { label: 'Dronefly', value: '+1-805-480-4033', href: 'https://www.dronefly.com' },
      { label: 'DSLRPros', value: '+1-877-299-1075', href: 'https://www.dslrpros.com' },
      { label: 'Dominion Drones', value: '+757-300-9183 — info@dominiondrones.com', href: 'mailto:info@dominiondrones.com' },
      { label: 'Talos Drones', value: 'talosdrones.com', href: 'https://talosdrones.com' },
    ],
    products: [
      { name: 'Mavic 3E (Enterprise)', price: '$4,599', status: 'in_stock', orderUrl: 'https://www.dronefly.com/products/dji-mavic-3-enterprise', notes: 'Mechanical shutter; 56× zoom; RTK module; IP54.', image: '/media/DJI%20Enterprise.jpg' },
      { name: 'Mavic 3T (Thermal)', price: '$4,799', status: 'in_stock', notes: 'Wide + zoom + thermal; first-responder / inspection.', image: '/media/DJI%20Enterprise.jpg' },
      { name: 'Matrice 30T', price: '~$9,000', status: 'in_stock', notes: 'Dual-sensor + thermal; IP55; dock-compatible; 41-min flight.', image: '/media/DJI%20Enterprise.jpg' },
      { name: 'Matrice 350 RTK', price: '~$7,000', status: 'in_stock', orderUrl: 'https://enterprise.dji.com/matrice-350-rtk', notes: '55-min flight; IP55; O3 Enterprise; 400 battery cycles; 6-directional sensing.', image: '/media/DJI%20Enterprise.jpg' },
      { name: 'Matrice 400', price: '$10,450', status: 'in_stock', orderUrl: 'https://talosdrones.com/products/dji-enterprise-matrice-400', notes: 'O4 Enterprise; 59-min flight; 40 km range; 6 kg payload; Zenmuse H30/L3 compatible.', image: '/media/DJI%20Enterprise.jpg' },
      { name: 'Matrice 4 Series', price: 'From ~$12,250', status: 'in_stock', notes: 'Latest compact enterprise series; 4K + thermal + lidar options; dock-ready.', image: '/media/DJI%20Enterprise.jpg' },
      { name: 'DJI Dock 2', price: '~$7,500', status: 'in_stock', notes: 'Weatherproof drone-in-a-box; M30/M350/M400 compatible; fully autonomous BVLOS.', image: '/media/DJI%20Enterprise.jpg' },
      { name: 'Zenmuse L3 (LiDAR)', price: '~$15,700', status: 'in_stock', notes: '1535 nm LiDAR; 100MP RGB; up to 100 km²/flight; M300/M350/M400 compatible.', image: '/media/DJI%20Enterprise.jpg' },
    ],
    procurementNotes: 'In stock at multiple authorized US dealers. Can be purchased directly online (add to cart) or via "Request Quote" for enterprise volume orders.',
  },
  {
    id: 'skydio',
    name: 'Skydio',
    category: 'drone',
    buyPath: 'email_required',
    contacts: [
      { label: 'Sales Form', value: 'skydio.com', href: 'https://skydio.com' },
      { label: 'RMUS Distributor', value: '1-800-793-3548', href: 'tel:18007933548' },
      { label: 'ADS (Gov/DOD)', value: '866-845-3012', href: 'tel:8668453012' },
    ],
    products: [
      { name: 'X10', price: 'Quote (~$11K est.)', status: 'quote_required', notes: 'NDAA compliant; US-made; 45 mph; 40-min flight; IP55; NVIDIA Jetson Orin AI; 4-bay modular payload.', image: '/media/Skydio.avif' },
      { name: 'X10D (Defense)', price: 'Quote — DOD/Federal only', status: 'quote_required', notes: 'EW-resilient; dual-use; Blue UAS cleared; sUAS for battlefields.', image: '/media/Skydio.avif' },
      { name: 'X2+ Enterprise', price: 'Quote (~$11K est.)', status: 'quote_required', notes: 'Compact foldable; IP55; Blue UAS approved; thermal + color options.', image: '/media/Skydio.avif' },
      { name: 'X2D (Defense)', price: 'Quote — DOD/Federal only', status: 'quote_required', notes: 'Defense sUAS; thermal camera; NDAA compliant.', image: '/media/Skydio.avif' },
      { name: 'Skydio Dock for X10', price: 'Quote required', status: 'quote_required', notes: 'Weatherproof drone-in-a-box; fully automated BVLOS inspection.', image: '/media/Skydio.avif' },
    ],
    procurementNotes: 'No public pricing. Contact sales form or RMUS distributor. NDAA-compliant, US-assembled. Used by public safety, infrastructure, and enterprise sectors.',
  },

  // ─── HUMANOID (additions) ────────────────────────────────────────────────────
  {
    id: 'apptronik',
    name: 'Apptronik',
    category: 'humanoid',
    buyPath: 'email_required',
    contacts: [
      { label: 'Contact / Partnerships', value: 'apptronik.com/contact', href: 'https://apptronik.com/contact' },
      { label: 'Press', value: 'media@apptronik.com', href: 'mailto:media@apptronik.com' },
    ],
    products: [
      { name: 'Apollo', price: 'RaaS / Enterprise — Contact', status: 'quote_required', notes: 'Target <$50K long-term; current pilot pricing undisclosed. Partners: GE Aerospace, Mercedes-Benz, GXO.', image: '/media/Apptronik.jpg' },
    ],
    procurementNotes: 'NASA-backed humanoid in enterprise pilot programs. Partners: GE Aerospace, Mercedes-Benz, GXO Logistics, Jabil. Austin, TX HQ. Pilot → RaaS or CapEx contract via web form. Mass production target: mid-2026.',
  },
  {
    id: 'sanctuary',
    name: 'Sanctuary AI',
    category: 'humanoid',
    buyPath: 'email_required',
    contacts: [
      { label: 'Contact', value: 'sanctuaryai.com', href: 'https://sanctuaryai.com' },
    ],
    products: [
      { name: 'Phoenix Gen 7', price: 'Enterprise — Contact', status: 'quote_required', notes: 'Est. $65K–$250K; Carbon Intelligence OS; 50x faster autonomous learning vs Gen 6.', image: '/media/Sanctuary%20AI.webp' },
    ],
    procurementNotes: 'Enterprise only. Partners: Magna International (automotive assembly trials). Vancouver, BC. Carbon Intelligence OS enables task generalization without per-task reprogramming. Gen 7 released April 2024.',
  },
  {
    id: 'ubtech',
    name: 'UBTECH Robotics',
    category: 'humanoid',
    buyPath: 'email_required',
    contacts: [
      { label: 'Global Enterprise', value: 'enterprise@ubtrobot.com', href: 'mailto:enterprise@ubtrobot.com' },
      { label: 'Website', value: 'ubtrobot.com', href: 'https://www.ubtrobot.com' },
    ],
    products: [
      { name: 'Walker S2', price: '$180,000 (purchase) or $5,000/mo RaaS', status: 'in_stock', notes: 'Mass production as of Nov 2025; >800M CNY confirmed orders. BYD, Geely, Foxconn deployments.', image: '/media/UBTECH%20Robotics.webp' },
    ],
    procurementNotes: 'HK-listed (HKEX). Walker S2 in mass production. Direct purchase ($180K) or RaaS ($5K/mo). Customers: BYD, Geely, FAW-Volkswagen, Audi FAW, BAIC NEV, Foxconn, SF Express. Contact enterprise@ubtrobot.com.',
  },
  {
    id: 'fourier',
    name: 'Fourier Intelligence',
    category: 'humanoid',
    buyPath: 'email_required',
    contacts: [
      { label: 'Contact', value: 'fourier-ai.com', href: 'https://www.fourier-ai.com' },
      { label: 'Business', value: 'business@fourier-ai.com', href: 'mailto:business@fourier-ai.com' },
    ],
    products: [
      { name: 'GR-1', price: '~$149,999', status: 'in_stock', notes: '165 cm / 55 kg; 40 DOF; 1.38 m/s; research + rehabilitation globally. Mass production 2026.', image: '/media/fourier-gr1.webp' },
      { name: 'GR-2', price: '~$100,000–$150,000', status: 'in_stock', notes: '175 cm / 63 kg; 53 DOF; enhanced dexterity and perception.', image: '/media/Fourier%20Intelligence%20gr-2.jpg' },
      { name: 'GR-3', price: 'Contact Fourier', status: 'pre_order', notes: 'Latest generation; full-stack AI; companion + industrial dual-use.', image: '/media/fourier-gr3.webp' },
    ],
    procurementNotes: 'Shanghai-based. GR-1 at ~$150K in active global research deployments. GR-2 enterprise pre-orders open. Contact via fourier-ai.com for commercial inquiries.',
  },
  {
    id: 'neura',
    name: 'Neura Robotics',
    category: 'humanoid',
    buyPath: 'email_required',
    contacts: [
      { label: 'Contact', value: 'neura-robotics.com/contact', href: 'https://www.neura-robotics.com/contact' },
      { label: 'Press', value: 'press@neura-robotics.com', href: 'mailto:press@neura-robotics.com' },
    ],
    products: [
      // ── Humanoid ───────────────────────────────────────────────────────────
      { name: '4NE-1 Gen 3.5', price: '€98,000 (1–19 units) / €60,000 (fleet)', status: 'pre_order', notes: 'Bipedal humanoid. Delivery end 2026. Designed by Studio F.A. Porsche. Bosch partnership.', image: '/media/4NE-1%20Gen%203.5' },
      { name: '4NE-1 Mini', price: 'Contact — Spring 2026', status: 'pre_order', notes: 'Compact bipedal humanoid variant; collaborative use cases; Spring 2026.', image: '/media/4NE1_Mini.webp' },
      // ── Mobile Service Robot (wheeled — different type from humanoid) ───────
      { name: 'MiPA', price: 'Contact for pricing', status: 'pre_order', notes: 'Mobile Interactive Platform Assistant. Wheeled service robot; navigation + interaction; home & commercial environments.', image: '/media/MiPA_NEURA_Robotics_Navigation_Image-233x300.webp' },
      // ── Quadruped (4-legged — different type from humanoid and wheeled) ─────
      { name: 'NEURA Quadruped', price: 'Contact for pricing', status: 'pre_order', notes: '4-legged robot. Rough-terrain mobility; industrial inspection and patrol use cases.', image: '/media/NEURA_Quadruped_2-1024x1024.webp' },
    ],
    procurementNotes: 'German company (Metzingen). €200M Series B raised. Partners: Bosch (CES 2026), Volvo Cars, OpenAI. Multi-form-factor lineup: humanoid, wheeled service, quadruped. Volume fleet pricing drops to €60K.',
  },
  {
    id: 'kepler',
    name: 'Kepler Robotics',
    category: 'humanoid',
    buyPath: 'email_required',
    contacts: [
      { label: 'Website', value: 'gotokepler.com', href: 'https://www.gotokepler.com' },
      { label: 'Business', value: 'business@kepler.bot', href: 'mailto:business@kepler.bot' },
    ],
    products: [
      { name: 'Forerunner K2', price: '~$30,000 (target, based on K1)', status: 'pre_order', notes: '5th-gen model; Ant Group mass production partnership.', image: '/media/Kepler%20Robotics.jpg' },
    ],
    procurementNotes: 'Chinese company. K2 is current-gen (K1 superseded). Ant Group partnership for mass production. Target ~$30K for industrial use. Contact business@kepler.bot for pilot inquiries.',
  },
  {
    id: 'agibot',
    name: 'AgiBot',
    category: 'humanoid',
    buyPath: 'email_required',
    contacts: [
      { label: 'Store', value: 'store.agibot.com', href: 'https://store.agibot.com' },
      { label: 'Contact', value: 'agibot.com', href: 'https://www.agibot.com' },
    ],
    products: [
      { name: 'A2 Standard', price: '$100,000', status: 'in_stock', notes: 'Whole-body dexterous manipulation; AI-native platform.', image: '/media/agibot-a2-standard.png' },
      { name: 'A2-Max', price: '$130,000–$160,000', status: 'in_stock', notes: 'Extended capability variant.', image: '/media/A2-Max' },
      { name: 'A2 Youth Edition', price: '$23,000', status: 'in_stock', notes: 'Entry-level research/education platform.', image: '/media/A2%20Youth%20Edition.avif' },
      { name: 'X2 (RaaS)', price: '€899/day', status: 'raas', notes: 'Rental model launched MWC 2026. Demonstrated full-split mobility.', image: '/media/AgiBot1.png' },
    ],
    procurementNotes: 'Formerly Zhiyuan Robotics. Purchase via store.agibot.com. X2 RaaS at €899/day. Widest price range of any current humanoid lineup ($23K–$190K+). Contact for enterprise fleet pricing.',
  },
  {
    id: 'pal-robotics',
    name: 'PAL Robotics',
    category: 'humanoid',
    buyPath: 'email_required',
    contacts: [
      { label: 'Contact', value: 'pal-robotics.com/contact', href: 'https://pal-robotics.com/contact/' },
      { label: 'Email', value: 'info@pal-robotics.com', href: 'mailto:info@pal-robotics.com' },
    ],
    products: [
      { name: 'TIAGo Pro', price: 'Quote (rental ~€850/mo)', status: 'quote_required', notes: 'Mobile manipulator; ROS2; hospital + research.', image: '/media/TIAGo%20Pro.webp' },
      { name: 'TIAGo Base', price: 'Quote required', status: 'quote_required', notes: 'Navigation-only mobile base; ideal for logistics research.', image: '/media/tiago_base_image.jpg' },
      { name: 'REE-C', price: 'Quote required', status: 'quote_required', notes: 'Outdoor-capable mobile platform; multi-purpose navigation; different form factor from TIAGo.', image: '/media/PAL%20Robotics-REE-C-Robot-3.webp' },
      { name: 'ARI', price: 'Quote required', status: 'quote_required', notes: 'Social robot; 165 cm; hotel, airport, retail; 8–12 h battery.', image: '/media/ARI.webp' },
      { name: 'TALOS', price: '~€1,000,000+', status: 'quote_required', notes: 'Advanced research humanoid; 30 DOF; 200+ university labs worldwide.', image: '/media/TALOS-Robot-538x600.webp' },
      { name: 'KANGAROO Lite', price: 'Quote required', status: 'pre_order', notes: '152 cm / 50 kg; 5 kg arm payload; bipedal dynamic locomotion; Isaac Lab / MuJoCo sim support.', image: '/media/KANGAROO%20Lite.webp' },
      { name: 'KANGAROO Standard', price: 'Quote required', status: 'pre_order', notes: '158 cm / 55 kg; advanced manipulation; designed for embodied AI research.', image: '/media/KANGAROO%20Standard.png' },
      { name: 'KANGAROO Plus', price: 'Quote required', status: 'pre_order', notes: '158 cm / 60 kg; premium transport + anthropomorphic hand option.', image: '/media/KANGAROO%20Plus.webp' },
    ],
    procurementNotes: 'Spanish company (Barcelona), est. 2004. Mature commercial platforms for research and service. Customers: Decathlon (StockBot), healthcare institutions, ESA, Honda. Contact info@pal-robotics.com.',
  },

  // ─── INDUSTRIAL / AMR (additions) ───────────────────────────────────────────
  {
    id: 'locus',
    name: 'Locus Robotics',
    category: 'industrial',
    buyPath: 'raas_only',
    contacts: [
      { label: 'Sales', value: 'locusrobotics.com/contact', href: 'https://locusrobotics.com/contact' },
      { label: 'Email', value: 'sales@locusrobotics.com', href: 'mailto:sales@locusrobotics.com' },
    ],
    products: [
      { name: 'Locus Origin', price: 'RaaS — Contact', status: 'raas', notes: 'Collaborative picking AMR; human-robot teaming; 2x+ throughput.', image: '/media/-Locus%20RoboticsLocus_Robotics_picking.jpg' },
      { name: 'Locus Vector', price: 'RaaS — Contact', status: 'raas', notes: 'Omnidirectional; high payload; fulfillment, transport, putaway.', image: '/media/Locus-3.png' },
      { name: 'Locus Max', price: 'RaaS — Contact', status: 'raas', notes: '3,000 lb capacity; autonomous heavy payload transport.', image: '/media/-Locus%20RoboticsLocus_Robotics_picking.jpg' },
      { name: 'Locus Array', price: 'RaaS — Contact', status: 'raas', notes: 'Fully autonomous Physical AI warehouse robot; no human assist required.', image: '/media/Locus-3.png' },
    ],
    procurementNotes: 'RaaS only; no capital purchase. Wilmington, MA. 1B+ unit picks across fleet. 2–3 month deployment timeline. Customers: DHL, GEODIS, Holman. Contact sales@locusrobotics.com.',
  },
  {
    id: 'greyorange',
    name: 'GreyOrange',
    category: 'industrial',
    buyPath: 'b2b_partner',
    contacts: [
      { label: 'Contact', value: 'greyorange.com/contact-us', href: 'https://www.greyorange.com/contact-us' },
    ],
    products: [
      { name: 'Ranger GTP AMR (Goods-to-Person)', price: 'Enterprise Quote', status: 'quote_required', notes: 'AI-first GTP AMR on GreyMatter platform; real-time SKU velocity adaptation.', image: '/media/GreyOrange_announces_1.jpg' },
      { name: 'Ranger ACR (Aisle-Climbing)', price: 'Enterprise Quote', status: 'quote_required', notes: 'Vertical storage retrieval; multi-level shelving access.', image: '/media/greyorange-warehouse-robots.jpg' },
      { name: 'Butler M (Mobile Cart)', price: 'Enterprise Quote', status: 'quote_required', notes: 'Cart/lift transport; proven in high-mix environments.', image: '/media/GreyOrange_announces_1.jpg' },
      { name: 'Butler S (Shelf-to-Person)', price: 'Enterprise Quote', status: 'quote_required', notes: 'Smaller form factor; high-density picking environments.', image: '/media/greyorange-warehouse-robots.jpg' },
      { name: 'FLEEK (AI Sorter)', price: 'Enterprise Quote', status: 'quote_required', notes: 'AI-powered parcel sorting AMR; high-throughput e-commerce fulfillment.', image: '/media/Robotic-Sorting-as-a-Service-B3A7940.webp' },
    ],
    procurementNotes: 'GreyMatter AI platform launched early 2026. Certified Ranger Network (CRN) partner model. HQ: Atlanta, GA. Customers: Zalando, Myntra, DHL. Web form → Solutions engineer → Pilot.',
  },
  {
    id: 'geekplus',
    name: 'Geek+',
    category: 'industrial',
    buyPath: 'email_required',
    contacts: [
      { label: 'Global Contact', value: 'geekplus.com/contact-us', href: 'https://www.geekplus.com/contact-us' },
      { label: 'Email (US)', value: 'contact@geekplus.com', href: 'mailto:contact@geekplus.com' },
    ],
    products: [
      { name: 'P500R (Goods-to-Person)', price: 'Enterprise Quote', status: 'quote_required', notes: '600 kg shelf payload; 2 m/s; high-density storage.', image: '/media/Geek%2B.webp' },
      { name: 'P800R (Goods-to-Person)', price: 'Enterprise Quote', status: 'quote_required', notes: '800 kg shelf payload; 3x human efficiency.', image: '/media/IMG-Geekplus-robotics-solution-3-670x510-1.png' },
      { name: 'P1200R (Goods-to-Person)', price: 'Enterprise Quote', status: 'quote_required', notes: 'Max payload 1,200 kg; heavy pallet/shelf transport.', image: '/media/Geek%2B.webp' },
      { name: 'RS8 (High-Bay Shuttle)', price: 'Enterprise Quote', status: 'quote_required', notes: '240 kg per shuttle; multi-level tote retrieval up to 8 totes/cycle.', image: '/media/IMG-Geekplus-robotics-solution-3-670x510-1.png' },
      { name: 'S20 Sorting AMR', price: 'Enterprise Quote', status: 'quote_required', notes: 'Parcel/apparel high-throughput sorting.', image: '/media/Geek%2B.webp' },
      { name: 'M1 Mini AMR', price: 'Enterprise Quote', status: 'quote_required', notes: 'Compact picking assistant; mixed-SKU; human-robot collaboration.', image: '/media/IMG-Geekplus-robotics-solution-3-670x510-1.png' },
    ],
    procurementNotes: 'Chinese company. One of the largest AMR fleets globally. US HQ: Los Angeles. Customer: Siemens Switchgear. 2–3 month implementation. Contact for pilot → enterprise deployment.',
  },
  {
    id: 'otto-motors',
    name: 'OTTO Motors',
    category: 'industrial',
    buyPath: 'dealer_only',
    contacts: [
      { label: 'Sales', value: 'ottomotors.com/contact', href: 'https://ottomotors.com/contact' },
      { label: 'Dealer: Toyota MHS', value: 'toyotaforklift.com', href: 'https://www.toyotaforklift.com' },
      { label: 'Dealer: Papé Material Handling', value: 'papemh.com', href: 'https://www.papemh.com' },
    ],
    products: [
      { name: 'OTTO 100', price: 'Quote via dealer', status: 'quote_required', notes: '150 kg payload; agile light transport; person-to-person workflows.', image: '/media/OTTO%20Motors.png' },
      { name: 'OTTO 600', price: 'Quote via dealer', status: 'quote_required', notes: '600 kg payload; mid-range manufacturing floor transport.', image: '/media/OTTO%20Motors.png' },
      { name: 'OTTO 1200', price: 'Quote via dealer', status: 'quote_required', notes: '1,200 kg payload; heavy industrial transport.', image: '/media/OTTO%20Motors.png' },
      { name: 'OTTO 1500', price: 'Quote via dealer', status: 'quote_required', notes: '1,900 kg payload; heaviest loads; industrial floor.', image: '/media/OTTO%20Motors.png' },
      { name: 'OTTO Lifter', price: 'Quote via dealer', status: 'quote_required', notes: '1,200 kg payload; autonomous pallet lift and transport.', image: '/media/OTTO%20Motors.png' },
    ],
    procurementNotes: 'Full Rockwell Automation subsidiary (acquired 2023). Ontario, Canada HQ. Industrial-grade AMRs for manufacturing and automotive. Dealers: Toyota MHS, Papé Material Handling, Eastern Lift Truck.',
  },
  {
    id: 'omron',
    name: 'Omron Mobile Robotics',
    category: 'industrial',
    buyPath: 'dealer_only',
    contacts: [
      { label: 'US Distributors', value: 'industrial.omron.us/en/contact', href: 'https://industrial.omron.us/en/contact' },
      { label: 'Find Distributor', value: 'omron.com/global/en/partner', href: 'https://www.omron.com/global/en/partner/' },
    ],
    products: [
      { name: 'LD-60', price: 'Quote via distributor', status: 'quote_required', notes: '60 kg payload; compact; tight-space navigation.', image: '/media/Omron%20Mobile%20Robotics-fleet-bg.jpg' },
      { name: 'LD-90', price: 'Quote via distributor', status: 'quote_required', notes: '90 kg payload; agile light-transport AMR.', image: '/media/Omron%20Mobile%20Robotics-fleet-bg.jpg' },
      { name: 'LD-250', price: 'Quote via distributor', status: 'quote_required', notes: '250 kg payload; mid-range warehouse + manufacturing.', image: '/media/LD-250-Omron-360-0000_Transparent1.webp' },
      { name: 'LD-1500', price: 'Quote via distributor', status: 'quote_required', notes: '1,500 kg payload; heavy industrial transport.', image: '/media/Omron%20Mobile%20Robotics-fleet-bg.jpg' },
      { name: 'HD-1500', price: 'Quote via distributor', status: 'quote_required', notes: '1,500 kg with heavy-duty lifting platform; pallet transport.', image: '/media/Omron%20Mobile%20Robotics-fleet-bg.jpg' },
    ],
    procurementNotes: 'US sales via Omron Automation & Safety distributor network only. Integrates with Omron NX/NJ industrial control systems. Wide regional dealer coverage.',
  },
  {
    id: 'hai-robotics',
    name: 'HAI Robotics',
    category: 'industrial',
    buyPath: 'email_required',
    contacts: [
      { label: 'Contact', value: 'hairobotics.com/contact', href: 'https://www.hairobotics.com/contact' },
      { label: 'US Sales', value: 'usa@hairobotics.com', href: 'mailto:usa@hairobotics.com' },
    ],
    products: [
      { name: 'HAIPICK A42N', price: 'Enterprise Quote', status: 'quote_required', notes: "World's first carton-picking ACR; 4.5m vertical reach; multi-level tote retrieval.", image: '/media/Hai-Robotics-ASRS-bots-670x510-1.png' },
      { name: 'HAIPICK A3', price: 'Enterprise Quote', status: 'quote_required', notes: 'Up to 5.5m picking height; floor-level + elevated SKUs.', image: '/media/Hai-Robotics-ASRS-bots-670x510-1.png' },
      { name: 'HAIPICK A42D', price: 'Enterprise Quote', status: 'quote_required', notes: 'Double-deep variant for higher storage density.', image: '/media/Hai-Robotics-ASRS-bots-670x510-1.png' },
    ],
    procurementNotes: "ACR (Autonomous Case-handling Robot) pioneer. 1,700+ systems in 40+ countries. Shenzhen HQ, Dallas US office. Customers: Zara, Decathlon, JD.com. Web form → pilot engagement.",
  },
  {
    id: 'clearpath',
    name: 'Clearpath Robotics',
    category: 'industrial',
    buyPath: 'email_required',
    contacts: [
      { label: 'Sales', value: 'sales@clearpathrobotics.com', href: 'mailto:sales@clearpathrobotics.com' },
      { label: 'Website', value: 'clearpathrobotics.com', href: 'https://clearpathrobotics.com' },
    ],
    products: [
      { name: 'Husky A200 UGV', price: 'Quote required', status: 'quote_required', notes: 'ROS2; IP54; 100 kg / 2 m/s; outdoor/indoor; research and commercial.', image: '/media/Husky-Observer-Clearpath.jpg' },
      { name: 'Jackal UGV', price: 'Quote required', status: 'quote_required', notes: 'Small weatherproof UGV; 20 kg payload; field + lab use.', image: '/media/clearpath-ros.jpg' },
      { name: 'Ridgeback', price: 'Quote required', status: 'quote_required', notes: 'Omnidirectional indoor mobile manipulation base.', image: '/media/clearpath-ros.jpg' },
      { name: 'Warthog UGV', price: 'Quote required', status: 'quote_required', notes: 'Large all-terrain UGV; 272 kg payload; amphibious capable; 18 km/h.', image: '/media/clearpath-ros.jpg' },
      { name: 'Dingo (Differential)', price: 'Quote required', status: 'quote_required', notes: 'Lightweight indoor robot; 20 kg payload; 1.3 m/s; research + education.', image: '/media/clearpath-ros.jpg' },
      { name: 'Dingo (Omnidirectional)', price: 'Quote required', status: 'quote_required', notes: 'Omni-drive variant; expandable compute and power.', image: '/media/clearpath-ros.jpg' },
      { name: 'Boxer', price: 'Quote required', status: 'quote_required', notes: 'Large indoor platform; industrial prototyping and development.', image: '/media/clearpath-ros.jpg' },
      { name: 'TurtleBot 4', price: 'Quote required', status: 'quote_required', notes: 'Low-cost open-source research robot; ROS2; education focused.', image: '/media/clearpath-ros.jpg' },
    ],
    procurementNotes: 'Rockwell Automation subsidiary (acquired 2023 for ~$550–600M). ROS2 ready; OutdoorNAV software. 12+ platforms from mini to full-size. Research, inspection, and commercial deployments.',
  },
  {
    id: '6rs',
    name: '6 River Systems',
    category: 'industrial',
    buyPath: 'raas_only',
    contacts: [
      { label: 'Contact', value: '6river.com/contact', href: 'https://6river.com/contact' },
      { label: 'Email', value: 'sales@6river.com', href: 'mailto:sales@6river.com' },
    ],
    products: [
      { name: 'Chuck AMR', price: 'Enterprise subscription — Contact', status: 'raas', notes: 'Collaborative picking AMR; voice + light guidance UI. 120+ sites worldwide.', image: '/media/6-river-systems-shopify.png' },
    ],
    procurementNotes: 'Acquired by Ocado Group (July 2023). 120+ warehouse sites. Subscription model. Workers follow Chuck to assigned pick locations — collaborative human-robot fulfillment. Customers: CEVA, XB Fulfillment.',
  },
  {
    id: 'invia',
    name: 'inVia Robotics',
    category: 'industrial',
    buyPath: 'raas_only',
    contacts: [
      { label: 'Contact', value: 'inviarobotics.com/contact', href: 'https://inviarobotics.com/contact/' },
      { label: 'Email', value: 'info@inviarobotics.com', href: 'mailto:info@inviarobotics.com' },
    ],
    products: [
      { name: 'inVia Dynamic (PickerBot)', price: 'RaaS — per-pick pricing', status: 'raas', notes: 'Goods-to-person ASRS AMR; monthly subscription scales with throughput.', image: '/media/inVia-robot-product-shot-image-1.png' },
    ],
    procurementNotes: 'Per-pick RaaS — all hardware, software, and maintenance included. Scales for peak seasons. Westlake Village, CA. Contact for ROI assessment → pilot.',
  },

  // ─── DRONES (additions) ──────────────────────────────────────────────────────
  {
    id: 'zipline',
    name: 'Zipline',
    category: 'drone',
    buyPath: 'b2b_partner',
    contacts: [
      { label: 'Partner / Business', value: 'zipline.com/contact', href: 'https://www.zipline.com/contact' },
      { label: 'Press', value: 'press@flyzipline.com', href: 'mailto:press@flyzipline.com' },
    ],
    products: [
      { name: 'Platform+ (Instant Delivery DaaS)', price: 'Service contract — Contact', status: 'raas', notes: 'Sub-3-min last-mile delivery. Partners: Walmart, Panera, Chipotle, Wendy\'s, Little Caesars.', image: '/media/zipline.jpg' },
    ],
    procurementNotes: 'Delivery as a service — hardware not sold. $7.6B valuation (Jan 2026), $800M Series H. 750,000+ global deliveries. Expanding to 4+ US states 2026. Rwanda national contract. Partner inquiries via zipline.com.',
  },
  {
    id: 'wing',
    name: 'Wing (Alphabet)',
    category: 'drone',
    buyPath: 'b2b_partner',
    contacts: [
      { label: 'Partner Inquiry', value: 'wing.com/partners', href: 'https://wing.com/partners' },
      { label: 'Press', value: 'press@wing.com', href: 'mailto:press@wing.com' },
    ],
    products: [
      { name: 'Wing Delivery (DaaS)', price: 'B2B service — Contact', status: 'raas', notes: 'FAA Part 135 Air Carrier. Night delivery via infrared. US, AU, FI operations.', image: '/media/Wing%20%28Alphabet%29.webp' },
    ],
    procurementNotes: 'Alphabet/Google subsidiary. Drones not sold — service only. 750,000+ deliveries globally. Active: NC, VA, TX, GA, Australia. Walmart (150+ stores 2026 → 270 by 2027) and DoorDash integration. SF Bay Area launch Q2 2026.',
  },
  {
    id: 'autel',
    name: 'Autel Robotics',
    category: 'drone',
    buyPath: 'direct_online',
    contacts: [
      { label: 'US HQ (Bothell, WA)', value: 'autelrobotics.com', href: 'https://www.autelrobotics.com' },
      { label: 'Sales', value: 'sales@autelrobotics.com', href: 'mailto:sales@autelrobotics.com' },
      { label: 'Enterprise', value: 'enterprise@autelrobotics.com', href: 'mailto:enterprise@autelrobotics.com' },
      { label: 'Store', value: 'shop.autelrobotics.com', href: 'https://shop.autelrobotics.com' },
    ],
    products: [
      { name: 'EVO Nano+ (Consumer)', price: '~$649', status: 'in_stock', orderUrl: 'https://shop.autelrobotics.com', notes: 'Sub-250 g; RYYB sensor; 4K; 28-min flight.', image: '/media/Autel%20Robotics.jpg' },
      { name: 'EVO Lite+ (Consumer)', price: '~$1,049', status: 'in_stock', orderUrl: 'https://shop.autelrobotics.com', notes: '6K camera; 40-min flight; 12.4km range; obstacle avoidance.', image: '/media/Autel%20Robotics.jpg' },
      { name: 'EVO II Pro V3', price: '~$4,499', status: 'in_stock', notes: 'NDAA-compliant; 6K Hasselblad camera; enterprise ready.', image: '/media/Autel%20Robotics.jpg' },
      { name: 'EVO II Enterprise V3', price: 'Quote required', status: 'quote_required', notes: 'Modular payload system; RGB + thermal options; NDAA compliant.', image: '/media/Autel%20Robotics.jpg' },
      { name: 'EVO Max 4T V2', price: 'Contact for pricing', status: 'in_stock', orderUrl: 'https://shop.autelrobotics.com', notes: 'Quad-sensor fusion; 48MP + 8K thermal + zoom; 42-min; 20 km range.', image: '/media/Autel%20Robotics.jpg' },
      { name: 'EVO Max 4N', price: 'Quote required', status: 'quote_required', notes: 'Night-optimized; 4× zoom + thermal; NDAA compliant.', image: '/media/Autel%20Robotics.jpg' },
      { name: 'Dragonfish Standard', price: 'Quote required', status: 'quote_required', notes: 'Fixed-wing VTOL; 120-min flight; 40 km range; survey + mapping.', image: '/media/Autel%20Robotics.jpg' },
      { name: 'Dragonfish Pro', price: 'Quote required', status: 'quote_required', notes: 'Enhanced VTOL; 2-hr flight; LiDAR-capable; long-range inspection.', image: '/media/Autel%20Robotics.jpg' },
    ],
    procurementNotes: 'NDAA-compliant DJI alternative. US HQ (Bothell, WA). Direct purchase at shop.autelrobotics.com. Enterprise volume pricing via enterprise@autelrobotics.com.',
  },
  {
    id: 'parrot',
    name: 'Parrot',
    category: 'drone',
    buyPath: 'direct_online',
    contacts: [
      { label: 'Enterprise Portal', value: 'enterprise.parrot.com', href: 'https://enterprise.parrot.com' },
      { label: 'Contact', value: 'enterprise@parrot.com', href: 'mailto:enterprise@parrot.com' },
      { label: 'US Dealer — DSLRPros', value: '+1-877-299-1075', href: 'https://www.dslrpros.com/parrot' },
    ],
    products: [
      { name: 'ANAFI USA', price: '~$7,000', status: 'in_stock', orderUrl: 'https://enterprise.parrot.com/en/drones/anafi-usa/', notes: 'NDAA/TAA compliant; Blue sUAS approved; NATO-approved; US-assembled; IP53; 32× zoom thermal.', image: '/media/Parrot%20ANAFI%20USA%20.png' },
      { name: 'ANAFI USA Gov', price: 'Quote required', status: 'quote_required', notes: 'Government-hardened variant; FIPS 140-2 encryption; restricted data handling.', image: '/media/Parrot%20ANAFI%20USA%20.png' },
      { name: 'ANAFI Ai', price: '~$4,500', status: 'in_stock', orderUrl: 'https://enterprise.parrot.com/en/drones/anafi-ai/', notes: 'First 4G LTE drone; sub-250 g; 48MP camera; 4K HDR; AI obstacle avoidance; open API.', image: '/media/Parrot%20ANAFI%20USA%20.png' },
      { name: 'ANAFI Ai + FreeFlight 7', price: 'Quote required', status: 'quote_required', notes: 'Enterprise mission software bundle; photogrammetry + 3D mapping.', image: '/media/Parrot%20ANAFI%20USA%20.png' },
    ],
    procurementNotes: 'French company. ANAFI USA: NDAA/TAA compliant, Blue sUAS approved (Defense Innovation Unit), NATO-approved, US-assembled. Used by US Army, law enforcement, emergency response. Direct purchase at enterprise.parrot.com or via DSLRPros/B&H.',
  },
  {
    id: 'percepto',
    name: 'Percepto',
    category: 'drone',
    buyPath: 'email_required',
    contacts: [
      { label: 'Contact', value: 'percepto.co/contact', href: 'https://percepto.co/contact' },
      { label: 'Sales', value: 'sales@percepto.co', href: 'mailto:sales@percepto.co' },
    ],
    products: [
      { name: 'Sparrow AiDrone', price: 'SaaS — Quote required', status: 'quote_required', notes: 'Autonomous inspection; DJI Dock 2 compatible.', image: '/media/Percepto-1.jpg' },
      { name: 'Arc Drone-in-a-Box', price: 'Enterprise Quote', status: 'quote_required', notes: 'Fully autonomous + recharging dock; BVLOS approved.', image: '/media/Percepto-1.jpg' },
    ],
    procurementNotes: 'Israeli company with US operations. Enterprise SaaS for autonomous industrial inspection. BVLOS approvals held. Customers: BP, AT&T, Nestlé. Sales form → pilot program.',
  },
  {
    id: 'american-robotics',
    name: 'American Robotics',
    category: 'drone',
    buyPath: 'email_required',
    contacts: [
      { label: 'Contact', value: 'american-robotics.com/contact', href: 'https://www.american-robotics.com/contact' },
      { label: 'Email', value: 'info@american-robotics.com', href: 'mailto:info@american-robotics.com' },
    ],
    products: [
      { name: 'Scout System', price: 'Enterprise Quote', status: 'quote_required', notes: 'First FAA BVLOS approval for fully automated drones without on-site operators (2021; all conditions removed 2024).', image: '/media/American%20robot%20scout-system.webp' },
    ],
    procurementNotes: 'Ondas Holdings subsidiary. First company with unconditional FAA BVLOS approval for automated drone operations. Use cases: agriculture, energy, rail inspection. Contact for deployment scoping.',
  },
  {
    id: 'freefly',
    name: 'Freefly Systems',
    category: 'drone',
    buyPath: 'direct_online',
    contacts: [
      { label: 'Store', value: 'freeflysystems.com/products', href: 'https://freeflysystems.com/products' },
      { label: 'Enterprise (Drone Nerds)', value: 'dronenerds.com', href: 'https://www.dronenerds.com' },
      { label: 'Support', value: 'support@freeflysystems.com', href: 'mailto:support@freeflysystems.com' },
    ],
    products: [
      { name: 'Alta X Gen2', price: 'Quote required', status: 'in_stock', notes: 'NDAA variant available; 35 lb payload; heavy-lift industrial. Gen2 launched Feb 2026.', image: '/media/Freefly%20Systems-alta-x-signoff2.jpg' },
      { name: 'Astro', price: '~$22,500', status: 'in_stock', orderUrl: 'https://freeflysystems.com/astro/', notes: 'Industrial mapping + inspection; LiDAR-ready.', image: '/media/Freefly%20Systems-alta-x-signoff2.jpg' },
    ],
    procurementNotes: 'Canadian company (Edmonton, AB). Direct purchase at freeflysystems.com or enterprise via Drone Nerds (XTI Aerospace portfolio). Alta X Gen2 NDAA variant available Feb 2026. Part 107 required for commercial outdoor use.',
  },
  {
    id: 'matternet',
    name: 'Matternet',
    category: 'drone',
    buyPath: 'b2b_partner',
    contacts: [
      { label: 'Contact', value: 'matternet.com', href: 'https://matternet.com' },
    ],
    products: [
      { name: 'M2 Delivery Drone (DaaS)', price: 'B2B service — Contact', status: 'raas', notes: 'Medical, food, and e-commerce cargo; BVLOS authorized; UTM partner: ANRA Technologies.', image: '/media/Matternet_System_018.webp' },
    ],
    procurementNotes: 'B2B delivery network — drones not sold standalone. Partners: UPS Flight Forward (Part 135), Ameriflight, Dave\'s Hot Chicken. BVLOS authorized. Saudi Arabia deployment approved Jan 2025. Contact via matternet.com.',
  },

  // ─── COBOTS / ROBOT ARMS ────────────────────────────────────────────────────
  {
    id: 'universal-robots',
    name: 'Universal Robots',
    category: 'cobot',
    buyPath: 'dealer_only',
    contacts: [
      { label: 'Website', value: 'universal-robots.com', href: 'https://www.universal-robots.com/products/' },
      { label: 'Sales Email', value: 'sales@universal-robots.com', href: 'mailto:sales@universal-robots.com' },
      { label: 'Phone', value: '+1 844-462-6268', href: 'tel:+18444626268' },
    ],
    products: [
      // — e-Series: Proven reliability, IP54, up to 16 kg payload —
      {
        name: 'UR3e',
        price: 'Quote required',
        status: 'quote_required',
        orderUrl: 'https://www.universal-robots.com/products/ur3e/',
        notes: 'e-Series. 3 kg / 6.6 lbs payload; 500 mm / 19.7 in reach; Ø128 mm footprint; 11.2 kg robot weight. Smallest cobot in the lineup. Ideal for bench-top assembly, lab automation, and electronics. IP54; self-calibration; omni-mount; field-replaceable joints.',
        image: '/media/UR3e.webp',
      },
      {
        name: 'UR7e',
        price: 'Quote required',
        status: 'quote_required',
        orderUrl: 'https://www.universal-robots.com/products/ur7e/',
        notes: 'e-Series. 7.5 kg / 16 lbs payload; 850 mm / 33.5 in reach; Ø151 mm footprint; 20.6 kg robot weight. Replaces UR5e. Machine tending, packaging, pick-and-place, dispensing. IP54.',
        image: '/media/UR7e.webp',
      },
      {
        name: 'UR12e',
        price: 'Quote required',
        status: 'quote_required',
        orderUrl: 'https://www.universal-robots.com/products/ur12e/',
        notes: 'e-Series. 12.5 kg / 27.5 lbs payload; 1300 mm / 51.2 in reach; Ø190 mm footprint; 33.5 kg robot weight. Replaces UR10e. Wide reach for welding, material handling, quality inspection. IP54.',
        image: '/media/UR12e.webp',
      },
      {
        name: 'UR16e',
        price: 'Quote required',
        status: 'quote_required',
        orderUrl: 'https://www.universal-robots.com/products/ur16e/',
        notes: 'e-Series. 16 kg / 35.3 lbs payload; 900 mm / 35.4 in reach; Ø190 mm footprint; 33.1 kg robot weight. Highest payload in e-Series. Compact high-force tasks: screw driving, press-fitting, palletizing. IP54.',
        image: '/media/UR16e.webp',
      },
      // — UR Series: Max performance, IP65, up to 35 kg payload —
      {
        name: 'UR8 Long',
        price: 'Quote required',
        status: 'quote_required',
        orderUrl: 'https://www.universal-robots.com/products/ur8-long/',
        notes: 'UR Series. 10 kg / 22 lbs payload; 1750 mm / 68.9 in reach; Ø204 mm footprint; 44.7 kg robot weight. Extra-long reach for wide-envelope tasks — across-conveyor pick, welding, inspection. IP65; ISO10218/TUV/UL1740; up to 65% higher joint accelerations vs prior gen.',
        image: '/media/UR8 Long.webp',
      },
      {
        name: 'UR15',
        price: 'Quote required',
        status: 'quote_required',
        orderUrl: 'https://www.universal-robots.com/products/ur15/',
        notes: 'UR Series. 17.5 kg / 38.58 lbs payload; 1300 mm / 51.2 in reach; Ø204 mm footprint; 40.7 kg robot weight. High-payload mid-reach: machine tending, assembly, material handling. IP65; cleanroom certified.',
        image: '/media/UR15.webp',
      },
      {
        name: 'UR18',
        price: 'Quote required',
        status: 'quote_required',
        orderUrl: 'https://www.universal-robots.com/products/ur18/',
        notes: 'UR Series. 18 kg / 39.7 lbs payload; 950 mm / 37.4 in reach; Ø204 mm footprint; 39.2 kg robot weight. High-force compact cobot: press-fitting, screw driving, machining, deburring. IP65.',
        image: '/media/UR18.webp',
      },
      {
        name: 'UR20',
        price: 'Quote required',
        status: 'quote_required',
        orderUrl: 'https://www.universal-robots.com/products/ur20/',
        notes: 'UR Series. 25 kg / 55.1 lbs payload; 1750 mm / 68.9 in reach; Ø245 mm footprint; 64 kg robot weight. Long-reach heavy cobot for end-of-line palletizing, welding, material handling. IP65. Up to 37% faster cycle times.',
        image: '/media/UR20.webp',
      },
      {
        name: 'UR30',
        price: 'Quote required',
        status: 'quote_required',
        orderUrl: 'https://www.universal-robots.com/products/ur30/',
        notes: 'UR Series. 35 kg / 77.1 lbs payload; 1300 mm / 51.2 in reach; Ø245 mm footprint; 63.5 kg robot weight. Highest-payload cobot in the UR lineup. Palletizing, heavy assembly, automotive. IP65.',
        image: '/media/UR30.webp',
      },
    ],
    procurementNotes: 'Global cobot market leader (Teradyne subsidiary). Two active series: e-Series (proven, IP54, up to 16 kg) and UR Series (next-gen, IP65, up to 35 kg). Purchase through certified UR+ distributors. PolyScope X software; 60,000+ deployments worldwide; UR Academy training available. Cobot rental/leasing also available.',
  },
  {
    id: 'fanuc',
    name: 'FANUC America',
    category: 'industrial',
    buyPath: 'dealer_only',
    leadTime: 'Varies by model; contact authorized system integrator',
    contacts: [
      { label: 'Phone', value: '888-FANUC-US (888-326-8287)', href: 'tel:18883268287' },
      { label: 'Website', value: 'fanucamerica.com', href: 'https://www.fanucamerica.com' },
      { label: 'Request Quote', value: 'fanucamerica.com/contact', href: 'https://www.fanucamerica.com/contact' },
      { label: 'Find Integrator', value: 'fanucamerica.com/integrators', href: 'https://www.fanucamerica.com/integrators/authorized-robotic' },
      { label: 'ROBODRILL/ROBOCUT Dealer: Methods Machine Tools', value: 'methodsmachine.com', href: 'https://www.methodsmachine.com' },
      { label: 'ROBOSHOT Dealer: Milacron', value: 'milacron.com', href: 'https://www.milacron.com' },
    ],
    products: [
      // ── CRX Collaborative Robots ─────────────────────────────────────────────
      {
        name: 'CRX-3iA',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/crx-cobot',
        notes: 'CRX cobot. 4 kg payload; 592 mm reach; smallest CRX; light assembly, electronics, and lab automation.',
        image: '/media/FANUC.jpeg',
      },
      {
        name: 'CRX-5iA / CRX-5iA Food Grade',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/crx-cobot',
        notes: 'CRX cobot. 5 kg payload; 994 mm reach; drag-to-teach programming; iPendant tablet; food-grade variant available.',
        image: '/media/FANUC.jpeg',
      },
      {
        name: 'CRX-10iA / CRX-10iA Food Grade',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/crx-cobot',
        notes: 'CRX cobot. 10 kg payload; 1,249 mm reach; assembly, machine tending, inspection; food-grade variant available.',
        image: '/media/FANUC.jpeg',
      },
      {
        name: 'CRX-10iA/L / CRX-10iA/L Food Grade / CRX-10iA/L Paint',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/crx-cobot',
        notes: 'CRX cobot. 10 kg payload; 1,418 mm extended-reach arm; food-grade and paint-application variants available.',
        image: '/media/FANUC.jpeg',
      },
      {
        name: 'CRX-20iA/L / CRX-20iA/L Food Grade',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/crx-cobot',
        notes: 'CRX cobot. 20 kg payload; 1,418 mm reach; heavier part handling; food-grade variant available.',
        image: '/media/FANUC.jpeg',
      },
      {
        name: 'CRX-30iA / CRX-30iA Food Grade',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/crx-cobot',
        notes: 'CRX cobot. 30 kg payload; largest CRX model; heavy collaborative tasks; food-grade variant available.',
        image: '/media/FANUC.jpeg',
      },
      // ── CR Series Collaborative Robots ───────────────────────────────────────
      {
        name: 'CR-4iA',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/collaborative-robots',
        notes: 'CR series green cobot. 4 kg payload; anti-trap protection; side-by-side human collaboration without safety fencing.',
        image: '/media/FANUC.jpeg',
      },
      {
        name: 'CR-7iA / CR-7iA/L',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/collaborative-robots',
        notes: 'CR series. 7 kg payload; standard (717 mm) and long-reach (911 mm) variants; machine tending and assembly.',
        image: '/media/FANUC.jpeg',
      },
      {
        name: 'CR-15iA',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/collaborative-robots',
        notes: 'CR series. 15 kg payload; 1,441 mm reach; larger-scale collaborative tasks.',
        image: '/media/FANUC.jpeg',
      },
      {
        name: 'CR-35iB',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/collaborative-robots',
        notes: 'CR series. 35 kg payload; 1,813 mm reach; heaviest CR cobot; works alongside humans without safety cage.',
        image: '/media/FANUC.jpeg',
      },
      // ── ARC Mate Series (Arc Welding) ────────────────────────────────────────
      {
        name: 'ARC Mate 50iD / 50iD/7L',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/arc-mate-series',
        notes: 'Arc welding robot. 6-axis compact; 7 kg payload; 717–911 mm reach; MIG/TIG/laser welding.',
        image: '/media/FANUC.jpeg',
      },
      {
        name: 'ARC Mate 100iD / 100iD/8L / 100iD/10L',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/arc-mate-series',
        notes: 'Arc welding robot. 12 kg payload; 1,373–1,632 mm reach; all-around arc welding; slim wrist.',
        image: '/media/FANUC.jpeg',
      },
      {
        name: 'ARC Mate 120iD / 120iD/12L',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/arc-mate-series',
        notes: 'Arc welding robot. 20 kg payload; 1,811–2,009 mm reach; high-reach welding for large workpieces.',
        image: '/media/FANUC.jpeg',
      },
      // ── LR Mate Series (Small / Tabletop) ────────────────────────────────────
      {
        name: 'LR Mate 200iD Series',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/lr-mate-series',
        notes: 'Small tabletop 6-axis robot. Models: 200iD (7 kg / 717 mm), 200iD/4S (short arm), 200iD/7H (high IP), 200iD/7L (long arm 911 mm), 200iD/7C (cleanroom), 200iD/7WP (washdown IP67), 200iD/7WE (welding), 200iD/14L (14 kg). Machine tending, assembly, inspection.',
        image: '/media/FANUC.jpeg',
      },
      {
        name: 'LR-10iA Series',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/lr-10ia-series',
        notes: 'Compact high-speed 6-axis robot; 10 kg payload; semiconductor, electronics, and pharmaceutical applications.',
        image: '/media/FANUC.jpeg',
      },
      // ── M-1iA / M-2iA / M-3iA (Delta / Parallel Link) ───────────────────────
      {
        name: 'M-1iA Series (Delta)',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/m-1ia-series',
        notes: 'Parallel-link delta robot. 0.5–1 kg payload; ultra-high-speed pick & place; food packaging, electronics. Models: 0.5AL, 0.5S, 0.5SL, 1H.',
        image: '/media/FANUC.jpeg',
      },
      {
        name: 'M-2iA Series (Delta)',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/m-2ia-series',
        notes: 'Parallel-link delta robot. 3–6 kg payload; high-speed sorting and packaging. Models: 3AL, 3S, 3SL, 6HL.',
        image: '/media/FANUC.jpeg',
      },
      {
        name: 'M-3iA Series (Delta)',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/m-3ia-series',
        notes: 'Parallel-link delta robot. 6–12 kg payload; vision-guided pick & place; food and pharmaceutical packaging. Models: 6A, 6S, 12H.',
        image: '/media/FANUC.jpeg',
      },
      // ── M-10 Series ──────────────────────────────────────────────────────────
      {
        name: 'M-10iD Series',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/m-10-series',
        notes: '6-axis industrial robot. 8–16 kg payload; 1,096–1,632 mm reach; machine tending, assembly, dispensing, inspection. Models: 8L, 10L, 12, 12 Food Grade, 16S.',
        image: '/media/FANUC.jpeg',
      },
      // ── M-20 Series ──────────────────────────────────────────────────────────
      {
        name: 'M-20iB / M-20iD Series',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/m-20-series',
        notes: '6-axis industrial robot. 12–35 kg payload; 1,373–1,811 mm reach; spot welding, handling, assembly. Models: iB/25, iB/25C, iB/35S, iD/12L, iD/25, iD/25 Food Grade, iD/35.',
        image: '/media/FANUC.jpeg',
      },
      // ── M-410 Series (Palletizing) ────────────────────────────────────────────
      {
        name: 'M-410 Series (Palletizing)',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/m-410-series',
        notes: '4-axis palletizing robot. 110–700 kg payload; high-speed layer palletizing/depalletizing and case packing. Models: iC/110, iB/140H, iC/185, iC/315, iC/500, iB/700.',
        image: '/media/FANUC.jpeg',
      },
      // ── M-710 Series ─────────────────────────────────────────────────────────
      {
        name: 'M-710iC / M-710iD Series',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/m-710-series',
        notes: '6-axis industrial robot. 12–70 kg payload; 2,050–3,110 mm reach; spot welding, material handling, die casting. Models: 12L, 20L, 20M, 45M, 50, 50H, 50S, 70, iD/50M, iD/70.',
        image: '/media/FANUC.jpeg',
      },
      // ── M-800 / M-810 Series ──────────────────────────────────────────────────
      {
        name: 'M-800 / M-810 Series',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/m-800-series',
        notes: '6-axis heavy-payload robot. 60–270 kg payload; automotive body assembly, heavy material handling. Models: M-800iA/60, M-800/60-20B, M-810/190-20B, M-810/270-27B.',
        image: '/media/FANUC.jpeg',
      },
      // ── M-900 Series ─────────────────────────────────────────────────────────
      {
        name: 'M-900iB Series',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/m-900-series',
        notes: '6-axis heavy-duty robot. 280–700 kg payload; up to 4,637 mm reach; automotive stamping, press tending, die casting, foundry. Models: 280, 280L, 330L, 360, 400L, 700, 700E, 360E, 330F-32B.',
        image: '/media/FANUC.jpeg',
      },
      // ── M-950 / M-1000 Series ─────────────────────────────────────────────────
      {
        name: 'M-950iA/500 & M-1000iA',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/m-950-series',
        notes: '6-axis ultra-heavy robot. 500–1,000 kg payload; automotive and aerospace heavy-part handling; among the world\'s strongest production robots.',
        image: '/media/FANUC.jpeg',
      },
      // ── M-2000 Series ─────────────────────────────────────────────────────────
      {
        name: 'M-2000iA Series',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/m-2000-series',
        notes: 'World\'s strongest robot. 900–2,300 kg payload; up to 4,683 mm reach; automotive chassis, aerospace fuselage, locomotive handling. Models: 900L, 1200, 1700L, 2300.',
        image: '/media/FANUC.jpeg',
      },
      // ── Paint / P-Series ──────────────────────────────────────────────────────
      {
        name: 'Paint / P-Series',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/paint-series',
        notes: 'Explosion-proof painting and coating robots. Wide work envelopes optimized for automotive paint booths and general coating. Models: Paint Mate 200iA/5L, P-20iB, P-25iB, P-35iA, P-40iA, P-50iB, P-250iB, P-350iA/45, P-700iB, P-1000iA.',
        image: '/media/FANUC.jpeg',
      },
      // ── R-1000 Series ─────────────────────────────────────────────────────────
      {
        name: 'R-1000iA Series',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/r-1000-series',
        notes: '6-axis compact high-payload robot. 80–130 kg payload; spot welding, material handling, machine tending. Models: 80H, 80F, 100F, 120F-7B, 130F.',
        image: '/media/FANUC.jpeg',
      },
      // ── R-2000 Series ─────────────────────────────────────────────────────────
      {
        name: 'R-2000iC / R-2000iD Series',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/r-2000-series',
        notes: 'FANUC\'s most popular industrial robot. 100–270 kg payload; 2,655–3,100 mm reach; automotive spot welding, body assembly, press tending. Models: iC/100P, 125L, 165F, 165R, 190S, 210F, 210L, 210R, 210WE, 270F, 270R; iD/100FH, 165FH, 210FH.',
        image: '/media/FANUC.jpeg',
      },
      // ── SCARA SR-Series ───────────────────────────────────────────────────────
      {
        name: 'SCARA SR-Series',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/scara-series',
        notes: 'SCARA robots for high-speed precision assembly, pick & place, testing, dispensing. 3–20 kg payload; food-grade and environmental options available. Models: SR-3iA, SR-6iA, SR-9iA/R, SR-12iA, SR-20iA (each with standard, H, C Food Grade, environmental variants).',
        image: '/media/FANUC.jpeg',
      },
      // ── DR Series ─────────────────────────────────────────────────────────────
      {
        name: 'DR-3iB Series',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robots/dr-series',
        notes: 'Dust and drip-proof 6-axis robot for food, pharmaceutical, and washdown environments. Models: DR-3iB/8L and DR-3iB/6 Stainless.',
        image: '/media/FANUC.jpeg',
      },
      // ── ROBODRILL Plus (Vertical Machining Center) ────────────────────────────
      {
        name: 'ROBODRILL Plus α-DiB Plus',
        price: 'Quote (via Methods Machine Tools)',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robodrill-plus',
        notes: 'Vertical machining center (VMC). Models: α-D21SiB5 Plus (small/short bed), α-D21MiB5 Plus (all-round medium), α-D14LiB5 Plus (large), α-D28LiB5ADV Plus Y500 (latest; 28-tool capacity; 500 mm Y-stroke). 0.7 sec tool change on ADV; high-speed drilling, boring, tapping; direct FANUC robot integration via Robot and CNC Integration.',
        image: '/media/FANUC.jpeg',
      },
      // ── ROBOCUT (Wire EDM) ────────────────────────────────────────────────────
      {
        name: 'ROBOCUT α-CiB Series',
        price: 'Quote (via Methods Machine Tools)',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/robocut',
        notes: 'Wire EDM machine. α-CiB series; 3 all-around models incl. first with 800 mm table; max workpiece 60 kg; wire threading in 10 seconds; up to 140 hours unmanned operation; 7-axis CNC control; automatic in-path wire re-threading; Core Stitch function for unattended cutting.',
        image: '/media/FANUC.jpeg',
      },
      // ── ROBOSHOT (Electric Injection Molding) ─────────────────────────────────
      {
        name: 'ROBOSHOT',
        price: 'Quote (via Milacron)',
        status: 'quote_required',
        orderUrl: 'https://www.fanucamerica.com/products/roboshot',
        notes: 'All-electric injection molding machine (IMM). 10–15% less energy than comparable electric IMMs; up to 70% less than hydraulic; 4 servo motors; 100% electric-driven axes; AI Mold Protection; seamless FANUC robot integration for loading/unloading. Distributed through Milacron partnership.',
        image: '/media/FANUC.jpeg',
      },
    ],
    procurementNotes: 'FANUC America is the world\'s largest robotics manufacturer with 1M+ robots installed globally. All robots and cobots are sold exclusively through authorized system integrators (ASIs) — no direct purchase. Use the Robot Finder Tool or call 888-FANUC-US to identify the right model and nearest integrator. ROBODRILL and ROBOCUT are distributed through Methods Machine Tools. ROBOSHOT through Milacron. FANUC Zero Down Time (ZDT) IoT platform provides predictive maintenance across all robot and CNC products. ROBOGUIDE offline simulation software available for cell planning.',
  },
  {
    id: 'kuka',
    name: 'KUKA',
    category: 'industrial',
    buyPath: 'dealer_only',
    contacts: [
      { label: 'Website', value: 'kuka.com', href: 'https://www.kuka.com/en-us' },
      { label: 'Phone (US)', value: '+1 866 873 5852', href: 'tel:+18668735852' },
      { label: 'my.KUKA Portal', value: 'my.kuka.com', href: 'https://my.kuka.com/' },
      { label: 'Robot Guide', value: 'kuka.com/robot-guide', href: 'https://www.kuka.com/en-us/robot-guide' },
    ],
    products: [
      {
        name: 'KR AGILUS Series (4–11 kg)',
        price: 'Quote',
        status: 'quote_required',
        notes: 'Payload 4–11 kg; reach 601–1101 mm; 6-axis; IP 65/67; KR C5 micro controller. Variants: Standard, Food-grade (HO), Electrostatic Protected (EP). Mounting: floor, ceiling, wall, angle. Applications: pick & place, assembly, machine loading, arc welding, cleanroom, additive manufacturing.',
        image: '/media/KUKA.avif',
        orderUrl: 'https://www.kuka.com/en-us/products/robotics-systems/industrial-robots/kr-agilus',
      },
      {
        name: 'KR DELTA Series (3 kg)',
        price: 'Quote',
        status: 'quote_required',
        notes: 'Payload 3 kg; delta/parallel kinematics; extremely high-speed pick & place; food & pharmaceutical packaging.',
        image: '/media/KUKA.avif',
        orderUrl: 'https://www.kuka.com/en-us/products/robotics-systems/industrial-robots',
      },
      {
        name: 'KR SCARA Series (6–60 kg)',
        price: 'Quote',
        status: 'quote_required',
        notes: 'Payload 6–60 kg; SCARA kinematics; high-speed precision assembly; electronics and semiconductor handling.',
        image: '/media/KUKA.avif',
        orderUrl: 'https://www.kuka.com/en-us/products/robotics-systems/industrial-robots',
      },
      {
        name: 'KR CYBERTECH nano Series (6–10 kg)',
        price: 'Quote',
        status: 'quote_required',
        notes: 'Payload 6–10 kg; compact 6-axis; designed for tight workcells; machine tending, assembly, handling.',
        image: '/media/KUKA.avif',
        orderUrl: 'https://www.kuka.com/en-us/products/robotics-systems/industrial-robots',
      },
      {
        name: 'KR CYBERTECH Series (8–22 kg)',
        price: 'Quote',
        status: 'quote_required',
        notes: 'Payload 8–22 kg; 6-axis; versatile mid-small robot; arc welding, handling, machine tending, assembly.',
        image: '/media/KUKA.avif',
        orderUrl: 'https://www.kuka.com/en-us/products/robotics-systems/industrial-robots',
      },
      {
        name: 'KR IONTEC Series (20–120 kg)',
        price: 'Quote',
        status: 'quote_required',
        notes: 'Payload 20–120 kg; 6-axis mid-range industrial robot; spot welding, handling, palletizing, machine tending.',
        image: '/media/KUKA.avif',
        orderUrl: 'https://www.kuka.com/en-us/products/robotics-systems/industrial-robots',
      },
      {
        name: 'KR QUANTEC Series (120–300 kg)',
        price: 'Quote',
        status: 'quote_required',
        notes: 'Payload 120–300 kg; reach up to 2701 mm; 6-axis; IP 65/67; KR C5 controller. Largest payload/range in high-payload class. Variants: Standard, Foundry (F), Press-to-press. Applications: spot welding, arc welding, handling, mechanical machining, palletizing, foundry, medical (QUANTEC HC). Also available: QUANTEC PA (palletizing), QUANTEC nano (compact), QUANTEC Arctic (–30 °C cold storage).',
        image: '/media/KUKA.avif',
        orderUrl: 'https://www.kuka.com/en-us/products/robotics-systems/industrial-robots/kr-quantec',
      },
      {
        name: 'KR FORTEC Series (240–800 kg)',
        price: 'Quote',
        status: 'quote_required',
        notes: 'Payload 240–800 kg; 6-axis heavy-duty robot; automotive body-in-white, press tending, heavy handling and welding. IP 65/67; foundry variants available.',
        image: '/media/kuka-robot-fortec-serie-handling-welding.avif',
        orderUrl: 'https://www.kuka.com/en-us/products/robotics-systems/industrial-robots',
      },
      {
        name: 'KR titan Series (750–1300 kg)',
        price: 'Quote',
        status: 'quote_required',
        notes: 'Payload 750–1300 kg; among the world\'s strongest 6-axis robots; aerospace, heavy press tending, large-part assembly.',
        image: '/media/KUKA.avif',
        orderUrl: 'https://www.kuka.com/en-us/products/robotics-systems/industrial-robots',
      },
      {
        name: 'KR 40 PA (40 kg Palletizer)',
        price: 'Quote',
        status: 'quote_required',
        notes: 'Payload 40 kg; palletizing kinematic; high-speed pallet stacking for consumer goods, food, and beverage.',
        image: '/media/KUKA.avif',
        orderUrl: 'https://www.kuka.com/en-us/products/robotics-systems/industrial-robots',
      },
      {
        name: 'KR 470 PA (300–470 kg Palletizer)',
        price: 'Quote',
        status: 'quote_required',
        notes: 'Payload 300–470 kg; heavy palletizing robot; logistics, cold storage, and industrial palletizing.',
        image: '/media/KUKA.avif',
        orderUrl: 'https://www.kuka.com/en-us/products/robotics-systems/industrial-robots',
      },
      {
        name: 'KR 700 PA (700 kg Palletizer)',
        price: 'Quote',
        status: 'quote_required',
        notes: 'Payload 700 kg; ultra-heavy palletizing; one of the highest-payload palletizing robots available.',
        image: '/media/KUKA.avif',
        orderUrl: 'https://www.kuka.com/en-us/products/robotics-systems/industrial-robots',
      },
      {
        name: 'LBR iisy Series (3–15 kg) — Cobot',
        price: 'Quote',
        status: 'quote_required',
        notes: 'Payload 3–15 kg; reach 760–1300 mm; 6-axis collaborative robot; iiQKA.OS2 operating system; easy teach-in; IP 54; machine tending, assembly, quality inspection. Models: LBR iisy 3 R760, LBR iisy 8 R930, LBR iisy 11 R1300, LBR iisy 15 R930.',
        image: '/media/KUKA.avif',
        orderUrl: 'https://www.kuka.com/en-us/products/robotics-systems/industrial-robots',
      },
      {
        name: 'LBR iiwa Series (7–14 kg) — Sensitive Cobot',
        price: 'Quote',
        status: 'quote_required',
        notes: 'Payload 7–14 kg; reach 800–820 mm; 7-axis with torque sensing on all joints; human-robot collaboration; automotive assembly, electronics, research. Models: LBR iiwa 7 R800, LBR iiwa 14 R820.',
        image: '/media/KUKA.avif',
        orderUrl: 'https://www.kuka.com/en-us/products/robotics-systems/industrial-robots',
      },
      {
        name: 'LBR Med Series (7–14 kg) — Medical Cobot',
        price: 'Quote',
        status: 'quote_required',
        notes: 'Payload 7–14 kg; medical-grade certified; ISO 10218, IEC 62061; SunriseOS.Med software; surgery assistance, diagnostics, radiotherapy, rehabilitation. KR QUANTEC HC (300 kg) also available for heavy medical applications.',
        image: '/media/KUKA.avif',
        orderUrl: 'https://www.kuka.com/en-us/industries/robots-used-in-medicine/kuka-solutions-for-medical-robots/lbr-med-medical-robot',
      },
    ],
    procurementNotes: 'KUKA is one of the world\'s leading industrial robot manufacturers (part of Midea Group). All robots are sold exclusively through KUKA system integrators and authorized partners — no direct purchase. Use the Robot Guide at kuka.com/robot-guide or call +1 866 873 5852 to find the right model and nearest integrator. The my.KUKA portal (my.kuka.com) provides access to spare parts (25,000+), software licensing, and technical documentation. Controllers: KR C5 for full-size industrial robots; KR C5 micro for small robots and cobots. iiQKA.OS2 is the new AI-ready operating system for the LBR iisy cobot line. KUKA Express Packs offer preconfigured robot+controller+software bundles with short delivery times.',
  },
  {
    id: 'franka',
    name: 'Franka Robotics',
    category: 'cobot',
    buyPath: 'direct_online',
    contacts: [
      { label: 'Website', value: 'franka.de', href: 'https://franka.de' },
      { label: 'Phone', value: '+49 89 2006069 20', href: 'tel:+4989200606920' },
      { label: 'Email', value: 'info@franka.de', href: 'mailto:info@franka.de' },
    ],
    products: [
      {
        name: 'Franka Research 3 (FR3)',
        price: '~$25,000',
        status: 'in_stock',
        orderUrl: 'https://franka.de',
        notes: '7-DOF; 3 kg payload; 855 mm reach; torque sensors all 7 joints; ±0.1 mm repeatability; Franka Control Interface (FCI) at 1 kHz; ROS2/MATLAB compatible. The reference platform for physical AI and manipulation research.',
        image: '/media/Franka%20Robotics-franka-research-3.png',
      },
      {
        name: 'Franka Hand (FE Gripper)',
        price: '~$1,704',
        status: 'in_stock',
        orderUrl: 'https://franka.de',
        notes: 'Factory-integrated parallel gripper for FR3; programmable force and width; designed for grasping research.',
        image: '/media/Franka%20Robotics-franka-research-3.png',
      },
      {
        name: 'Franka Research 3 Duo (FR3 Duo) — Prototype',
        price: 'Quote',
        status: 'pre_order',
        orderUrl: 'https://franka.de/product-prototypes',
        notes: 'Dual-arm system for embodied AI research. Unifies teleoperation, data collection, and policy execution on one platform. Deliverable with curated manipulation actuators and vision sensors. Reproducible setup for standardized datasets across labs. FCI at 1 kHz. Optimized kinematics for table-top bimanual tasks.',
        image: '/media/Franka%20Robotics-franka-research-3.png',
      },
      {
        name: 'Tactile Mobile Robot (TMR) — Prototype',
        price: 'Quote',
        status: 'pre_order',
        orderUrl: 'https://franka.de/product-prototypes',
        notes: 'Advanced mobile robot optimized for teleoperation, mobile manipulation, and physical AI research. Designed for seamless integration with Franka Research 3. Enables quick deployment for researchers beyond fixed workcells.',
        image: '/media/Franka%20Robotics-franka-research-3.png',
      },
      {
        name: 'Mobile FR3 Duo — Prototype',
        price: 'Quote',
        status: 'pre_order',
        orderUrl: 'https://franka.de/product-prototypes',
        notes: 'FR3 Duo integrated with Tactile Mobile Robot (TMR). Combines dual-arm manipulation, rich perception, and omnidirectional mobility into a single physical AI system. Enables data collection and policy execution in unstructured mobile environments.',
        image: '/media/Franka%20Robotics-franka-research-3.png',
      },
      {
        name: 'Franka GELLO / GELLO Duo — Teleoperation Device',
        price: 'Quote',
        status: 'in_stock',
        orderUrl: 'https://franka.de/product-prototypes',
        notes: 'Teleoperation input devices for FR3 (GELLO) and FR3 Duo (GELLO Duo). Direct joint-level control for robot teaching and physical AI data collection. Fully open-source hardware and software. Single and dual-arm configurations.',
        image: '/media/Franka%20Robotics-franka-research-3.png',
      },
      {
        name: 'Diana 7 by Agile Robots',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://franka.de/diana-7',
        notes: '7-axis force-sensitive robot arm; 7 kg payload; 923 mm reach; ±0.05 mm repeatability; torque sensors in all 7 axes; Franka Control Interface (FCI) at 1 kHz for real-time sensor data and precise position/velocity/torque control; AgileCore software for easy setup and programming; anthropomorphic kinematics; ideal for research and complex task automation.',
        image: '/media/Franka%20Robotics-franka-research-3.png',
      },
      {
        name: 'Franka AI Services (Robot Farm)',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://franka.de/product-prototypes',
        notes: 'Managed large-scale robot farms for corporate labs developing embodied intelligence. Franka operates and manages the infrastructure to collect high-quality physical interaction data at scale — thousands of episodes for training or targeted data for fine-tuning.',
        image: '/media/Franka%20Robotics-franka-research-3.png',
      },
    ],
    procurementNotes: 'Franka Robotics GmbH (Munich, Germany) sells the FR3 and accessories directly online. Prototype systems (FR3 Duo, TMR, Mobile FR3 Duo) are available via early-access request at franka.de/product-prototypes. Diana 7 is sold through Franka as a partner product of Agile Robots — contact for quote. Franka is the leading platform for physical AI and manipulation research, deployed in 400+ universities and labs worldwide. Franka Control Interface (FCI) provides 1 kHz real-time control access across all products.',
  },
  {
    id: 'igus',
    name: 'igus',
    category: 'cobot',
    buyPath: 'direct_online',
    contacts: [{ label: 'Website', value: 'igus.com/rebel', href: 'https://www.igus.com/rebel' }],
    products: [
      { name: 'ReBeL 6 DoF (Open-Source)', price: '$5,850', status: 'in_stock', orderUrl: 'https://www.igus.com', notes: '2 kg payload; 661 mm reach; low-cost polymer construction; ROS2 compatible.', image: '/media/igus.jpg' },
      { name: 'ReBeL 6 DoF (Plug-and-Play)', price: '$7,499', status: 'in_stock', orderUrl: 'https://www.igus.com', notes: 'Ready-to-run bundle with controller and teach pendant.', image: '/media/igus.jpg' },
      { name: 'ReBeL 4 DoF', price: 'Quote', status: 'quote_required', notes: 'Simplified 4-axis variant; palletizing and simple pick-and-place.', image: '/media/igus.jpg' },
      { name: 'robolink RL-D-RBT-5DOF', price: 'Quote', status: 'quote_required', orderUrl: 'https://www.igus.com', notes: '5-DOF desktop arm; modular joint system; ultra-low-cost entry.', image: '/media/igus.jpg' },
    ],
    procurementNotes: 'Most affordable production-ready cobot. Plastic polymer construction. Direct online purchase.',
  },
  {
    id: 'elephant-robotics',
    name: 'Elephant Robotics',
    category: 'cobot',
    buyPath: 'direct_online',
    contacts: [{ label: 'Website', value: 'elephantrobotics.com', href: 'https://www.elephantrobotics.com' }],
    products: [
      { name: 'myCobot 280 Pi', price: '$700', status: 'in_stock', orderUrl: 'https://www.elephantrobotics.com', notes: '6-axis; 250 g payload; 280 mm reach; Raspberry Pi 4; education and research.', image: '/media/Elephant%20Robotics.webp' },
      { name: 'myCobot 280 M5', price: '$800', status: 'in_stock', orderUrl: 'https://www.elephantrobotics.com', notes: '6-axis; M5Stack controller variant.', image: '/media/Elephant%20Robotics.webp' },
      { name: 'myCobot 320 M5', price: '$2,500', status: 'in_stock', orderUrl: 'https://www.elephantrobotics.com', notes: '6-axis; 1 kg payload; 320 mm reach; stronger cobot.', image: '/media/Elephant%20Robotics.webp' },
      { name: 'mechArm 270 Pi', price: '$1,100', status: 'in_stock', orderUrl: 'https://www.elephantrobotics.com', notes: '6-axis; 250 g payload; 270 mm reach; compact desktop arm.', image: '/media/Elephant%20Robotics.webp' },
      { name: 'myArm M750', price: '$4,500', status: 'in_stock', orderUrl: 'https://www.elephantrobotics.com', notes: '7-axis; 750 mm reach; advanced research arm.', image: '/media/Elephant%20Robotics.webp' },
      { name: 'myAGV 2023', price: '~$1,500', status: 'in_stock', orderUrl: 'https://www.elephantrobotics.com', notes: 'Autonomous mobile base; pairs with myCobot for mobile manipulation.', image: '/media/Elephant%20Robotics.webp' },
      { name: 'myBuddy 280', price: '~$5,000', status: 'in_stock', orderUrl: 'https://www.elephantrobotics.com', notes: 'Dual-arm desktop collaborative robot; bimanual manipulation research.', image: '/media/Elephant%20Robotics.webp' },
    ],
    procurementNotes: 'Entry-level cobots for education and light automation. Available direct via website or Amazon.',
  },
  {
    id: 'doosan-robotics',
    name: 'Doosan Robotics',
    category: 'cobot',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'doosanrobotics.com', href: 'https://www.doosanrobotics.com' }],
    products: [
      { name: 'M0609', price: 'Quote', status: 'quote_required', notes: 'M-Series; 6 kg payload; 900 mm reach; precision assembly.', image: '/media/Doosan%20Robotics-A-Series-1.png' },
      { name: 'M0617', price: 'Quote', status: 'quote_required', notes: 'M-Series; 6 kg payload; 1700 mm reach; extended range tasks.', image: '/media/Doosan%20Robotics-A-Series-1.png' },
      { name: 'M1013', price: 'Quote', status: 'quote_required', notes: 'M-Series; 10 kg payload; 1300 mm reach; versatile manufacturing.', image: '/media/Doosan%20Robotics-A-Series-1.png' },
      { name: 'M1509', price: 'Quote', status: 'quote_required', notes: 'M-Series; 15 kg payload; 900 mm reach; high-force tasks.', image: '/media/Doosan%20Robotics-A-Series-1.png' },
      { name: 'H2017', price: 'Quote', status: 'quote_required', notes: 'H-Series; 20 kg payload; 1700 mm reach; 6 torque sensors; palletizing.', image: '/media/Doosan%20Robotics-A-Series-1.png' },
      { name: 'H2515', price: 'Quote', status: 'quote_required', notes: 'H-Series; 25 kg payload; 1500 mm reach; heaviest Doosan cobot.', image: '/media/Doosan%20Robotics-A-Series-1.png' },
      { name: 'A0509', price: 'Quote', status: 'quote_required', notes: 'A-Series; 5 kg payload; 900 mm reach; fast, economical.', image: '/media/Doosan%20Robotics-A-Series-1.png' },
      { name: 'A0509S (Force Sensor)', price: 'Quote', status: 'quote_required', notes: 'A-Series; with integrated force sensor; inspection use cases.', image: '/media/Doosan%20Robotics-A-Series-1.png' },
      { name: 'A0912', price: 'Quote', status: 'quote_required', notes: 'A-Series; 9 kg payload; 1200 mm reach.', image: '/media/Doosan%20Robotics-A-Series-1.png' },
      { name: 'A0912S (Force Sensor)', price: 'Quote', status: 'quote_required', notes: 'A-Series; with integrated force sensor.', image: '/media/Doosan%20Robotics-A-Series-1.png' },
    ],
    procurementNotes: 'South Korean cobot manufacturer. Strong integration with Doosan automation ecosystem.',
  },
  {
    id: 'onrobot',
    name: 'OnRobot',
    category: 'components',
    buyPath: 'direct_online',
    contacts: [{ label: 'Website', value: 'onrobot.com', href: 'https://onrobot.com' }],
    products: [
      { name: 'VGC10 Vacuum Gripper', price: '$3,782', status: 'in_stock', orderUrl: 'https://onrobot.com', notes: 'Configurable vacuum cups; 15 kg payload; 360° rotation.', image: '/media/OnRobot-Products_2021.jpg' },
      { name: '2FG7 Parallel Gripper', price: '$4,724', status: 'in_stock', orderUrl: 'https://onrobot.com', notes: '7 kg payload; parallel electric gripper; IP67.', image: '/media/OnRobot-Products_2021.jpg' },
      { name: 'RG2 Gripper', price: '$5,580', status: 'in_stock', orderUrl: 'https://onrobot.com', notes: '2 kg payload; 0–110 mm stroke; versatile pick-and-place.', image: '/media/OnRobot-Products_2021.jpg' },
      { name: 'RG6 Gripper', price: 'Quote', status: 'quote_required', orderUrl: 'https://onrobot.com', notes: '6 kg payload; 0–160 mm stroke; heavy-duty handling.', image: '/media/OnRobot-Products_2021.jpg' },
      { name: 'RG2-FT Force/Torque Gripper', price: '$11,598', status: 'in_stock', orderUrl: 'https://onrobot.com', notes: 'Integrated force/torque + proximity sensor; precise assembly.', image: '/media/OnRobot-Products_2021.jpg' },
      { name: 'HEX-E/H Force Torque Sensor', price: 'Quote', status: 'quote_required', orderUrl: 'https://onrobot.com', notes: '6-axis force/torque; 6 sensing directions; all major cobot brands.', image: '/media/OnRobot-Products_2021.jpg' },
      { name: 'Gecko (Micro-Structured Gripper)', price: 'Quote', status: 'quote_required', notes: 'Gecko-adhesion technology; handles flat/non-porous surfaces without suction.', image: '/media/OnRobot-Products_2021.jpg' },
      { name: 'Screwdriver', price: 'Quote', status: 'quote_required', notes: 'Cobot-mounted electric screwdriver; auto-load and torque control.', image: '/media/OnRobot-Products_2021.jpg' },
      { name: 'Sander', price: 'Quote', status: 'quote_required', notes: 'Cobot surface finishing tool; force-controlled sanding and polishing.', image: '/media/OnRobot-Products_2021.jpg' },
    ],
    procurementNotes: 'Leading cobot end-effector brand. Compatible with all major cobot arms. Direct online purchase.',
  },
  {
    id: 'robotiq',
    name: 'Robotiq',
    category: 'components',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'robotiq.com', href: 'https://robotiq.com' }],
    products: [
      { name: '2F-85 Adaptive Gripper', price: 'Quote', status: 'quote_required', notes: '5 kg payload; 85 mm stroke; angular parallel gripper; UR, FANUC, KUKA compatible.', image: '/media/Robotiq%202F-85%20Adaptive%20Gripper%20.jpg' },
      { name: '2F-140 Adaptive Gripper', price: 'Quote', status: 'quote_required', notes: '2.5 kg payload; 140 mm stroke; wider opening for larger objects.', image: '/media/Robotiq%202F-85%20Adaptive%20Gripper%20.jpg' },
      { name: 'Hand-E Gripper', price: 'Quote', status: 'quote_required', notes: '50 mm stroke; high-precision; hex + parallel grasping.', image: '/media/Robotiq%202F-85%20Adaptive%20Gripper%20.jpg' },
      { name: 'Hand-E C10 Gripper', price: 'Quote', status: 'quote_required', notes: 'Cleanroom ISO 5 variant of Hand-E; semiconductor and pharma.', image: '/media/Robotiq%202F-85%20Adaptive%20Gripper%20.jpg' },
      { name: 'FT 300-S Force/Torque Sensor', price: 'Quote', status: 'quote_required', notes: '6-axis; 300 N force range; integrates with Robotiq grippers.', image: '/media/Robotiq%202F-85%20Adaptive%20Gripper%20.jpg' },
      { name: 'Finishing Copilot', price: 'Quote', status: 'quote_required', notes: 'AI-powered surface finishing application; auto path correction.', image: '/media/Robotiq%202F-85%20Adaptive%20Gripper%20.jpg' },
      { name: 'Wrist Camera', price: 'Quote', status: 'quote_required', notes: 'Robot-mounted camera; part detection + pick calibration; works with 2F grippers.', image: '/media/Robotiq%202F-85%20Adaptive%20Gripper%20.jpg' },
    ],
    procurementNotes: 'Industry standard cobot grippers. Compatible with Universal Robots, KUKA, FANUC, and more.',
  },

  // ─── SURGICAL / MEDICAL ─────────────────────────────────────────────────────
  {
    id: 'intuitive-surgical',
    name: 'Intuitive Surgical',
    category: 'surgical',
    buyPath: 'email_required',
    contacts: [
      { label: 'Website', value: 'intuitive.com', href: 'https://www.intuitive.com/en-us/products-and-services/da-vinci' },
      { label: 'Contact Sales', value: 'intuitive.com/contact', href: 'https://www.intuitive.com/en-us/contact-us' },
    ],
    products: [
      {
        name: 'da Vinci 5',
        price: '$1,800,000–$2,500,000',
        status: 'quote_required',
        orderUrl: 'https://www.intuitive.com/en-us/products-and-services/da-vinci/5',
        notes: 'Most advanced da Vinci system ever. 150+ design innovations; ~2× faster docking vs Xi; Force Feedback technology; integrates Table Motion, insufflation, Intuitive Hub, SimNow simulation, E-200 ESU. Limited supply through 2025. ~30% higher list price than Xi but ~15% higher all-in vs fully-optioned Xi.',
        image: '/media/Da Vinci 5.jpg',
      },
      {
        name: 'da Vinci Xi',
        price: '$1,500,000–$2,500,000',
        status: 'quote_required',
        orderUrl: 'https://www.intuitive.com/en-us/products-and-services/da-vinci/xi',
        notes: 'Multi-port workhorse; avg ASP ~$1.42M. Broad surgical specialties including urology, gynecology, general surgery, thoracics, colorectal. Overhead instrument mount; laser targeting for port placement; compatible with full EndoWrist instrument catalog.',
        image: '/media/Da Vinci Xi.jpg',
      },
      {
        name: 'da Vinci X',
        price: '$800,000–$1,800,000',
        status: 'quote_required',
        orderUrl: 'https://www.intuitive.com/en-us/products-and-services/da-vinci/x',
        notes: 'More affordable multi-port entry point. Compatible with most da Vinci Xi instruments and accessories. Shares similar patient cart design to Xi; 3-component system (patient cart, surgeon console, vision cart). Ideal for institutions building a robotics program.',
        image: '/media/Da Vinci X.jpg',
      },
      {
        name: 'da Vinci SP',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.intuitive.com/en-us/products-and-services/da-vinci/sp',
        notes: 'Single-port system engineered for precision in compact spaces. All instruments deploy through one 25 mm port; articulating camera + 3 fully-wristed instruments. Cleared for urological, colorectal, general thoracoscopic, and transoral otolaryngology procedures. Extended- and standard-range instrument collections available.',
        image: '/media/Da Vinci SP.jpg',
      },
    ],
    procurementNotes: 'Market leader in surgical robotics with >10M procedures performed. All systems require institutional purchase with clinical evaluation, training plan, and service agreement. Contact Intuitive hospital sales team directly. Pre-owned systems available through authorized dealers (e.g. R2 Surgical).',
  },
  {
    id: 'medtronic-hugo',
    name: 'Medtronic',
    category: 'surgical',
    buyPath: 'email_required',
    contacts: [
      { label: 'Website', value: 'medtronic.com/surgical-robotics', href: 'https://www.medtronic.com/en-us/healthcare-professionals/products/surgical-robotics/robotic-systems.html' },
      { label: 'Contact Sales', value: 'medtronic.com/contact', href: 'https://www.medtronic.com/en-us/about/contact-us.html' },
    ],
    products: [
      {
        name: 'Hugo™ RAS System',
        price: '~$1,200,000–$1,500,000',
        status: 'quote_required',
        orderUrl: 'https://www.medtronic.com/en-us/healthcare-professionals/specialties/surgical-robotics/robotic-assisted-surgery.html',
        notes: 'FDA cleared Dec 2025 for urologic soft-tissue procedures (prostatectomy, nephrectomy, cystectomy). Modular design: 4 independent arm carts that can be repositioned between cases. Open console — surgeon maintains direct line of sight to the OR team. Touch Surgery™ AI-powered video management and analytics platform. CE marked; commercially available in 30+ countries. ~$1,000 cost per surgery. First US case performed Feb 2026 at Cleveland Clinic.',
        image: '/media/Hugo RAS.jpg',
      },
      {
        name: 'Mazor™ X Stealth Edition',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.medtronic.com/en-us/healthcare-professionals/products/surgical-robotics/robotic-systems/mazor-robotic-guidance-system.html',
        notes: '3rd-generation spinal robotic guidance system; 8th-generation navigation. Combines pre-operative surgical planning with intraoperative robotic guidance for precise pedicle screw and implant placement. Integrates with O-arm™ surgical imaging for real-time verification. Indicated for general spinal and cranial procedures. Supports UNiD™ patient-specific rod integration.',
        image: '/media/Mazor™ robotic guidance platform.avif',
      },
    ],
    procurementNotes: 'Medtronic is the largest medical device company globally. Hugo RAS FDA cleared for US market Dec 2025 — expanding procedure clearances expected (gynecology, general surgery). Mazor X Stealth is the established spinal robotics leader. Contact Medtronic surgical robotics team for institutional pricing and evaluation.',
  },
  {
    id: 'stryker-mako',
    name: 'Stryker (Mako)',
    category: 'surgical',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'stryker.com', href: 'https://www.stryker.com' }],
    products: [
      { name: 'Mako SmartRobotics (Total Hip)', price: 'Quote', status: 'quote_required', image: '/media/Mako%204%20Family%204%204K%20with%20shadow4.png' },
      { name: 'Mako SmartRobotics (TKA)', price: 'Quote', status: 'quote_required', image: '/media/Mako%204%20Family%204%204K%20with%20shadow4.png' },
      { name: 'Mako SmartRobotics (Shoulder/Spine)', price: 'Quote', status: 'quote_required', notes: '4th gen Mako is single system across all applications.', image: '/media/Mako%204%20Family%204%204K%20with%20shadow4.png' },
    ],
    procurementNotes: 'Contact Stryker orthopedic robotics sales. 4th gen Mako released 2025 unifies hip, knee, shoulder, and spine.',
  },
  {
    id: 'cmr-surgical',
    name: 'CMR Surgical',
    category: 'surgical',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'cmrsurgical.com', href: 'https://cmrsurgical.com' }],
    products: [
      { name: 'Versius Plus', price: 'Quote', status: 'quote_required', notes: 'FDA 510k cleared Dec 2025 (cholecystectomy).', image: '/media/CMR%20Surgical.webp' },
      { name: 'Versius', price: 'Quote', status: 'quote_required', notes: '40,000+ global procedures.', image: '/media/CMR%20Surgical.webp' },
    ],
    procurementNotes: 'UK-based. Compact, modular surgical robot. US market entry with FDA clearance Dec 2025.',
  },

  // ─── SERVICE / HOSPITALITY / HOSPITAL ───────────────────────────────────────
  {
    id: 'aethon',
    name: 'Aethon',
    category: 'service',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'aethon.com', href: 'https://aethon.com' }],
    products: [
      { name: 'TUG Autonomous Hospital Robot', price: '~$105,000 purchase / ~$1,500/mo lease', status: 'quote_required', image: '/media/Aethon_Website_Robot_T3.png' },
    ],
    procurementNotes: '500+ hospitals deployed. Handles medications, meals, and linens. ST Engineering subsidiary.',
  },
  {
    id: 'bear-robotics',
    name: 'Bear Robotics',
    category: 'service',
    buyPath: 'raas_only',
    contacts: [{ label: 'Website', value: 'bearrobotics.ai', href: 'https://bearrobotics.ai' }],
    products: [
      { name: 'Servi', price: 'RaaS — 12/24/36 mo lease', status: 'raas', image: '/media/Bear%20Robotics.jpg' },
      { name: 'Servi Plus (88 lb capacity)', price: 'RaaS', status: 'raas', image: '/media/Bear%20Robotics.jpg' },
      { name: 'Servi Mini', price: 'RaaS', status: 'raas', image: '/media/Bear%20Robotics.jpg' },
    ],
    procurementNotes: 'Restaurant delivery robot. RaaS only. Contact via website.',
  },
  {
    id: 'pudu-robotics',
    name: 'PUDU Robotics',
    category: 'service',
    buyPath: 'direct_online',
    contacts: [{ label: 'Website', value: 'pudurobotics.com', href: 'https://pudurobotics.com' }],
    products: [
      { name: 'BellaBot', price: '$15,900', status: 'in_stock', orderUrl: 'https://pudurobotics.com', notes: '40 kg capacity; 4-tray; dual SLAM; restaurant delivery.', image: '/media/PUDU%20Robotics-Bellabot-1-2.webp' },
      { name: 'BellaBot Pro', price: '$16,900', status: 'in_stock', orderUrl: 'https://pudurobotics.com', notes: 'VSLAM+; dual advertising displays; 65 cm path clearance.', image: '/media/PUDU%20Robotics-Bellabot-1-2.webp' },
      { name: 'KettyBot', price: 'Quote', status: 'quote_required', orderUrl: 'https://pudurobotics.com', notes: '30 kg capacity; 3-in-1 delivery + reception + promotion robot.', image: '/media/PUDU%20Robotics-Bellabot-1-2.webp' },
      { name: 'KettyBot Pro', price: '$12,000', status: 'in_stock', orderUrl: 'https://pudurobotics.com', notes: 'Enhanced AI voice interaction; advanced 3-in-1 functionality.', image: '/media/PUDU%20Robotics-Bellabot-1-2.webp' },
      { name: 'HolaBot', price: 'Quote', status: 'quote_required', orderUrl: 'https://pudurobotics.com', notes: 'Large-capacity tray delivery; 60 kg total load; dirty-dish collection.', image: '/media/PUDU%20Robotics-Bellabot-1-2.webp' },
      { name: 'FlashBot', price: 'Quote', status: 'quote_required', orderUrl: 'https://pudurobotics.com', notes: 'Closed-compartment delivery; 4 lockable compartments; hotel rooms, offices.', image: '/media/PUDU%20Robotics-Bellabot-1-2.webp' },
      { name: 'PuduBot 2', price: 'Quote', status: 'quote_required', orderUrl: 'https://pudurobotics.com', notes: 'Mid-size restaurant delivery robot; multi-layer tray; 9 h runtime.', image: '/media/PUDU%20Robotics-Bellabot-1-2.webp' },
      { name: 'SwiftBot', price: 'Quote', status: 'quote_required', orderUrl: 'https://pudurobotics.com', notes: 'Compact fast delivery robot; high throughput, tight spaces.', image: '/media/PUDU%20Robotics-Bellabot-1-2.webp' },
      { name: 'T300 Lift', price: '$21,000', status: 'in_stock', orderUrl: 'https://pudurobotics.com', notes: 'Industrial lift transport; 300 kg payload; manufacturing + warehouse.', image: '/media/PUDU%20Robotics-Bellabot-1-2.webp' },
    ],
    procurementNotes: 'Global leader in service robots for restaurants and hotels. Direct purchase online.',
  },
  {
    id: 'xenex',
    name: 'Xenex',
    category: 'service',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'xenex.com', href: 'https://xenex.com' }],
    products: [
      { name: 'LightStrike (pulsed xenon UV)', price: '$125,000', status: 'quote_required', notes: '5-min room disinfection cycle.', image: '/media/Xenex-XenL.jpg' },
      { name: 'LightStrike+', price: 'Quote', status: 'quote_required', image: '/media/Xenex-XenL.jpg' },
    ],
    procurementNotes: '450+ hospitals including Mayo Clinic and MD Anderson. Hospital disinfection specialist.',
  },
  {
    id: 'lg-cloi',
    name: 'LG CLOi',
    category: 'service',
    buyPath: 'direct_online',
    contacts: [{ label: 'Website', value: 'solutions.lg.com/us/robots', href: 'https://solutions.lg.com/us/robots' }],
    products: [
      { name: 'GuideBot', price: '$39,990 or $1,666/mo RaaS', status: 'in_stock', orderUrl: 'https://solutions.lg.com/us/robots', image: '/media/LG%20CLOi.jpg' },
      { name: 'ServeBot 3.0', price: 'Quote', status: 'quote_required', image: '/media/LG%20CLOi.jpg' },
    ],
    procurementNotes: 'LG service robots for hospitality, retail, and medical. US sales via LG Business Solutions.',
  },

  // ─── FLOOR CLEANING ──────────────────────────────────────────────────────────
  {
    id: 'avidbots',
    name: 'Avidbots',
    category: 'cleaning',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'avidbots.com', href: 'https://avidbots.com' }],
    products: [
      { name: 'Neo 2', price: '~$50,000+', status: 'quote_required', image: '/media/Neo_nimbus.png' },
      { name: 'Neo 2W (warehouse variant)', price: 'Quote', status: 'quote_required', image: '/media/Neo_nimbus.png' },
    ],
    procurementNotes: 'Deployed in airports, warehouses, and shopping malls. Contact via website for quote.',
  },
  {
    id: 'tennant',
    name: 'Tennant Company',
    category: 'cleaning',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'tennantco.com', href: 'https://www.tennantco.com' }],
    products: [
      { name: 'T7AMR', price: 'Quote', status: 'quote_required', image: '/media/Tennant%20.jpeg' },
      { name: 'T380AMR', price: 'Quote', status: 'quote_required', image: '/media/Tennant%20.jpeg' },
      { name: 'X16 Sweep (BrainOS SelfPath AI)', price: 'Quote', status: 'quote_required', notes: 'Launched MODEX 2026.', image: '/media/Tennant%20.jpeg' },
    ],
    procurementNotes: 'Autonomous floor scrubbers powered by BrainOS AI. Deployed in distribution centers and manufacturing.',
  },
  {
    id: 'ice-cobotics',
    name: 'ICE Cobotics',
    category: 'cleaning',
    buyPath: 'direct_online',
    contacts: [{ label: 'Website', value: 'icecobotics.com', href: 'https://icecobotics.com' }],
    products: [
      { name: 'Cobi 18 Autonomous Scrubber', price: '$16,000/36-mo subscription (~$15/day)', status: 'raas', orderUrl: 'https://icecobotics.com', image: '/media/ICE%20Cobotics.png' },
    ],
    procurementNotes: 'Subscription-based autonomous floor scrubber. Direct online signup.',
  },

  // ─── SECURITY ────────────────────────────────────────────────────────────────
  {
    id: 'knightscope',
    name: 'Knightscope',
    category: 'security',
    buyPath: 'raas_only',
    contacts: [{ label: 'Website', value: 'knightscope.com', href: 'https://knightscope.com' }],
    products: [
      { name: 'K5 (outdoor patrol)', price: '$7/hr RaaS', status: 'raas', notes: '5 ft tall; 420 lbs; 3 mph; weatherproof; AI threat detection; 24/7 autonomous patrol.', image: '/media/Knightscope.webp' },
      { name: 'K3 (indoor patrol)', price: '$7/hr RaaS', status: 'raas', notes: 'Indoor autonomous patrol; thermal + visual cameras; anomaly detection.', image: '/media/Knightscope.webp' },
      { name: 'K1 (stationary scanner)', price: 'Quote', status: 'raas', notes: 'Entrance/exit stationary unit; weapon detection; Blue Light Tower variant available.', image: '/media/Knightscope.webp' },
      { name: 'K7 (multi-terrain)', price: 'Waitlist — 2026 deployment', status: 'pre_order', notes: 'Off-grid capable; perimeter protection; next-gen deterrence platform.', image: '/media/Knightscope.webp' },
    ],
    procurementNotes: 'Acquired Event Risk (security guard company) Mar 2026. RaaS model only. Nasdaq: KSCP.',
  },
  {
    id: 'cobalt-robotics',
    name: 'Cobalt Robotics',
    category: 'security',
    buyPath: 'raas_only',
    contacts: [{ label: 'Website', value: 'cobaltai.com', href: 'https://cobaltai.com' }],
    products: [
      { name: 'Cobalt Security Robot + 24/7 Remote Monitoring', price: 'RaaS monthly', status: 'raas', image: '/media/Cobalt%20Robotics.jpg' },
    ],
    procurementNotes: 'Combines physical robot with human remote monitoring overlay. SF, NYC, Chicago, Seattle deployments.',
  },

  // ─── QUADRUPED ───────────────────────────────────────────────────────────────
  {
    id: 'unitree-quadruped',
    name: 'Unitree (Quadruped)',
    category: 'quadruped',
    buyPath: 'direct_online',
    contacts: [{ label: 'Shop', value: 'shop.unitree.com', href: 'https://shop.unitree.com' }],
    products: [
      { name: 'Go1 Air', price: 'From $2,700', status: 'in_stock', orderUrl: 'https://shop.unitree.com', notes: 'Entry-level quadruped; education + research.', image: '/media/Unitree%20%28Quadruped%29%20.webp' },
      { name: 'Go2 Air', price: '$1,600', status: 'in_stock', orderUrl: 'https://shop.unitree.com', notes: 'Entry-level; AI-capable; 4D LiDAR option.', image: '/media/1_deeaa3cc-08f5-454f-bfcb-1a477b30adb4_900x.webp' },
      { name: 'Go2 Pro', price: '$2,800', status: 'in_stock', orderUrl: 'https://shop.unitree.com', notes: 'Advanced navigation; wider sensor suite.', image: '/media/2_3769ceea-b323-4ebc-a1f4-e27a9624706b_900x.jpg' },
      { name: 'Go2 X', price: '$5,990', status: 'in_stock', orderUrl: 'https://shop.unitree.com', notes: 'Top consumer quadruped; full LiDAR + computing.', image: '/media/3_d9687814-d553-451b-9429-c224a20f3b3a_900x.webp' },
      { name: 'Go2 EDU', price: '$13,999+', status: 'in_stock', orderUrl: 'https://shop.unitree.com', notes: 'Research/education platform; SDK + ROS2 + optional arm attachment.', image: '/media/5_eb271a12-e794-439d-ade5-d60ec009e81a_900x.webp' },
      { name: 'Aliengo', price: '$50,000', status: 'quote_required', notes: 'Mid-range industrial quadruped; 5 kg payload; 1 m/s.', image: '/media/Unitree%20%28Quadruped%29%20.webp' },
      { name: 'B1', price: '$100,000', status: 'quote_required', notes: 'Previous-gen heavy quadruped; proven in industry.', image: '/media/Unitree%20Robotics-B1.webp' },
      { name: 'B2 (Industrial)', price: '$100,000', status: 'quote_required', notes: 'Heavy-duty quadruped; agriculture, industry, security; large payload.', image: '/media/Unitree%20Robotics-B1.webp' },
      { name: 'B2-W (Wheel-Leg Hybrid)', price: '$100,000', status: 'quote_required', notes: 'B2 with wheeled locomotion; faster on flat terrain.', image: '/media/Unitree%20Robotics-B1.webp' },
      { name: 'Z1 Cobot Arm', price: '$15,999', status: 'in_stock', orderUrl: 'https://shop.unitree.com', notes: 'Compatible arm for Go2/B2; 7-DOF; 2 kg payload.', image: '/media/Unitree%20%28Quadruped%29%20.webp' },
    ],
    procurementNotes: 'Go2 series available direct at shop.unitree.com. B2 industrial quadruped via sales team.',
  },
  {
    id: 'ghost-robotics',
    name: 'Ghost Robotics',
    category: 'quadruped',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'ghostrobotics.io', href: 'https://ghostrobotics.io' }],
    products: [
      { name: 'Vision 60 Q-UGV', price: '$165,000', status: 'quote_required', notes: '2.5 m/s; 10 kg payload; 3+ h runtime; IP67; open architecture; 8–12 week lead time. Defense/security primary.', image: '/media/Ghost-Robotics-featured.jpg' },
      { name: 'Spirit 40', price: 'Quote required', status: 'quote_required', notes: 'Smaller research/development platform; backpackable; open SDK for custom behaviors.', image: '/media/Ghost-Robotics-featured.jpg' },
    ],
    procurementNotes: 'Defense and security-focused quadruped. Primary customers are government and enterprise security.',
  },
  {
    id: 'anybotics',
    name: 'ANYbotics',
    category: 'quadruped',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'anybotics.com', href: 'https://anybotics.com' }],
    products: [
      { name: 'ANYmal C', price: 'Quote', status: 'quote_required', notes: 'IP67; 90-min runtime; 360° LiDAR + 6 depth cameras; 10 kg payload; industrial inspection.', image: '/media/ANYbotics-ANYmal.webp' },
      { name: 'ANYmal D', price: 'Quote', status: 'quote_required', notes: 'Successor to ANYmal C; upgraded actuators; longer runtime; enhanced perception.', image: '/media/ANYbotics-ANYmal.webp' },
      { name: 'ANYmal X (Ex-proof)', price: 'Quote', status: 'quote_required', notes: 'ATEX & IECEx certified Zone 1 IIB; designed for explosive atmospheres; oil & gas, chemical plants.', image: '/media/ANYbotics-ANYmal.webp' },
    ],
    procurementNotes: 'Swiss company. Specializes in industrial inspection — oil & gas, utilities, mining. IP67 rated.',
  },
  {
    id: 'deep-robotics',
    name: 'DEEP Robotics',
    category: 'quadruped',
    buyPath: 'direct_online',
    contacts: [{ label: 'Website', value: 'deeprobotics.us', href: 'https://deeprobotics.us' }],
    products: [
      { name: 'Lite3 Basic', price: '$4,995', status: 'in_stock', orderUrl: 'https://deeprobotics.us', notes: 'Academic & research quadruped; lightweight entry-level.', image: '/media/DEEP%20Robotics.jpg' },
      { name: 'Lite3 Pro', price: '$9,995', status: 'in_stock', orderUrl: 'https://deeprobotics.us', notes: 'Advanced research platform; enhanced sensors.', image: '/media/DEEP%20Robotics.jpg' },
      { name: 'Lite3 LIDAR', price: '$14,500', status: 'in_stock', orderUrl: 'https://deeprobotics.us', notes: 'Lite3 with integrated 3D LiDAR; autonomous navigation.', image: '/media/DEEP%20Robotics.jpg' },
      { name: 'Lynx Sport', price: '$17,999', status: 'in_stock', orderUrl: 'https://deeprobotics.us', notes: 'All-terrain wheeled-legged hybrid quadruped.', image: '/media/DEEP%20Robotics.jpg' },
      { name: 'Lynx M20 Pro', price: '$49,995', status: 'in_stock', orderUrl: 'https://deeprobotics.us', notes: 'Omni-terrain; wheeled-legged; 20 kg payload; EDU platform.', image: '/media/DEEP%20Robotics.jpg' },
      { name: 'X20 (Industrial)', price: 'Quote', status: 'quote_required', notes: '20 kg payload; IP66; 4 m/s; 53 kg; substation patrol + pipeline survey.', image: '/media/DEEP%20Robotics.jpg' },
      { name: 'X30 Pro (Industrial)', price: '$85,000–$113,400', status: 'in_stock', orderUrl: 'https://deeprobotics.us', notes: 'Flagship industrial quadruped; heavy inspection; firefighting; IP66+.', image: '/media/DEEP%20Robotics.jpg' },
      { name: 'DR02 Humanoid', price: '$119,950', status: 'in_stock', orderUrl: 'https://deeprobotics.us', notes: 'All-weather humanoid robot; bipedal; industrial-grade.', image: '/media/DEEP%20Robotics.jpg' },
    ],
    procurementNotes: 'Direct purchase at deeprobotics.us. Strong value vs Boston Dynamics Spot.',
  },

  // ─── AGRICULTURAL ────────────────────────────────────────────────────────────
  {
    id: 'monarch-tractor',
    name: 'Monarch Tractor',
    category: 'agricultural',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'monarchtractor.com', href: 'https://monarchtractor.com' }],
    products: [
      { name: 'MK-V (electric autonomous tractor)', price: '~$50,000–$60,000', status: 'quote_required', image: '/media/Monarch%20Tractor.webp' },
    ],
    procurementNotes: 'Vineyard and specialty crop autonomous tractor. Contact via website.',
  },
  {
    id: 'carbon-robotics',
    name: 'Carbon Robotics',
    category: 'agricultural',
    buyPath: 'raas_only',
    contacts: [{ label: 'Website', value: 'carbonrobotics.com', href: 'https://carbonrobotics.com' }],
    products: [
      { name: 'LaserWeeder (autonomous laser weeding)', price: '~$1,200,000 purchase or RaaS', status: 'raas', image: '/media/Carbon%20Robotics-LaserWeeder-G2-600.webp' },
    ],
    procurementNotes: '6-inch precision weed removal without chemicals. RaaS model available for seasonal deployment.',
  },
  {
    id: 'dji-agras',
    name: 'DJI Agras',
    category: 'agricultural',
    buyPath: 'dealer_only',
    contacts: [{ label: 'Website', value: 'store.dji.com/agras', href: 'https://store.dji.com/category/agriculture' }],
    products: [
      { name: 'Agras T20P', price: '$10,499', status: 'not_available', orderUrl: 'https://www.dji.com/t20p', notes: 'Smart farming; intelligent spray systems; lightweight design; perfect for beginners or veterans. 20 kg spray payload; 25 kg (35 L) spread payload; quad-rotor tilted truss design; folds 77% smaller; Dual Atomized Spraying System; Active Phased Array Radar + Binocular Vision; IPX6K; DJI Terra mapping.', image: '/media/dji-agras-t20p.png' },
      { name: 'Agras T25', price: '$10,999', status: 'not_available', orderUrl: 'https://store.dji.com/category/agriculture', notes: 'Spot spraying & small-field operations; single-operator; longer battery life; quicker charging. 20 L tank; 16-nozzle system.', image: '/media/DJI Agras T25.webp' },
      { name: 'Agras T40', price: '$13,499', status: 'not_available', orderUrl: 'https://www.dji.com/t40', notes: 'Proven leader with millions of acres sprayed; dependable powertrain; choice of custom applicators. 40 kg spray payload; 50 kg (70 L) spread payload; Coaxial Twin Rotor design; Dual Atomized Spraying System; Active Phased Array Radar + Binocular Vision; Core Modules IPX6K; EFI Generator (15% fuel saving); DJI Terra mapping.', image: '/media/DJI Agras T40.webp' },
      { name: 'Agras T50', price: '$30,999', status: 'in_stock', orderUrl: 'https://store.dji.com/category/agriculture', notes: '40 L tank; 16-nozzle; dual atomizing; 50 kg MTOW; large farms.', image: '/media/DJI Agras T50.webp' },
    ],
    procurementNotes: 'Agricultural drone spraying and spreading. T20P, T25, and T40 currently out of stock at Agri Spray Drones (shop.agrispraydrones.com). Contact dealer for restock or alternative fulfillment.',
  },
  {
    id: 'burro',
    name: 'Burro',
    category: 'agricultural',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'burro.ai', href: 'https://burro.ai' }],
    products: [
      { name: 'Burro Autonomous Field Vehicle', price: '~$15,000–$20,000', status: 'quote_required', image: '/media/Burro%20Autonomous%20Field%20Vehicle.png' },
    ],
    procurementNotes: 'Follows farm workers and hauls harvest bins autonomously. Contact via website.',
  },

  // ─── INSPECTION ──────────────────────────────────────────────────────────────
  {
    id: 'flyability',
    name: 'Flyability',
    category: 'inspection',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'flyability.com', href: 'https://flyability.com' }],
    products: [
      { name: 'Elios 3 (Standard Package)', price: '~$30,000', status: 'quote_required', notes: '12.5-min flight; FlyAware SLAM; collision-resilient cage; confined space inspection.', image: '/media/Elios%203%20%28collision-tolerant%20indoor%20drone%29.jpg' },
      { name: 'Elios 3 (LiDAR Package)', price: '~$40,000', status: 'quote_required', notes: 'Includes LiDAR payload; 3D point cloud mapping; 9-min flight with payload.', image: '/media/Elios%203%20%28collision-tolerant%20indoor%20drone%29.jpg' },
      { name: 'Elios 3 Industrial Suite', price: 'Quote required', status: 'quote_required', notes: 'Enterprise bundle; multi-drone fleet; GIS export; advanced data analytics.', image: '/media/Elios%203%20%28collision-tolerant%20indoor%20drone%29.jpg' },
    ],
    procurementNotes: 'Cage-protected drone for tanks, boilers, mines, and confined spaces. Swiss company.',
  },
  {
    id: 'gecko-robotics',
    name: 'Gecko Robotics',
    category: 'inspection',
    buyPath: 'b2b_partner',
    contacts: [{ label: 'Website', value: 'geckorobotics.com', href: 'https://geckorobotics.com' }],
    products: [
      { name: 'Wall-Climbing Inspection Robot (vessels/tanks/boilers)', price: 'Service contract', status: 'raas', image: '/media/gecko_robot_1-header.jpg' },
    ],
    procurementNotes: 'Inspection-as-a-service model. Robots not sold standalone. Customers include US military and energy sector.',
  },
  {
    id: 'airobotics',
    name: 'Airobotics',
    category: 'inspection',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'airobotics.com', href: 'https://airobotics.com' }],
    products: [
      { name: 'Optimus (drone-in-a-box, BVLOS)', price: 'Enterprise Quote', status: 'quote_required', image: '/media/Airobotics%20Optimus%20%28drone-in-a-box%2C%20BVLOS%29.jpeg' },
    ],
    procurementNotes: 'Israeli company. Automated drone-in-a-box for oil/gas, port, and industrial inspection. BVLOS authorized.',
  },

  // ─── UNDERWATER ──────────────────────────────────────────────────────────────
  {
    id: 'blue-robotics',
    name: 'Blue Robotics',
    category: 'underwater',
    buyPath: 'direct_online',
    contacts: [{ label: 'Website', value: 'bluerobotics.com', href: 'https://bluerobotics.com' }],
    products: [
      { name: 'BlueROV2 (assembled)', price: '$4,080', status: 'in_stock', orderUrl: 'https://bluerobotics.com', image: '/media/BlueROV2-remotely-operated-vehicle.png' },
    ],
    procurementNotes: 'Most popular open-source ROV. Direct purchase online. Strong community and accessory ecosystem.',
  },
  {
    id: 'deep-trekker',
    name: 'Deep Trekker',
    category: 'underwater',
    buyPath: 'direct_online',
    leadTime: 'In stock for standard packages; custom configs may add lead time',
    contacts: [
      { label: 'Website', value: 'deeptrekker.com', href: 'https://www.deeptrekker.com' },
      { label: 'Phone', value: '+1 519-342-3177', href: 'tel:+15193423177' },
      { label: 'Request a Quote', value: 'build.deeptrekker.com', href: 'https://www.build.deeptrekker.com' },
    ],
    products: [
      {
        name: 'SPECTRA ROV',
        price: 'Quote required',
        status: 'quote_required',
        notes: 'NEW (March 2026) — Offshore Inspection, Repair and Maintenance (IRM) class ROV. Operates in currents up to 4 knots. 1,000 m (3,280 ft) depth rating. 300,000-lumen lighting. 180° rotating head. Integrated 3D Sonar SLAM, 4K stereo vision, and NDT tooling. Real-time 3D mapping.',
        image: '/media/deep-trekker-spectra-rov.png',
      },
      {
        name: 'REVOLUTION ROV',
        price: '$15,000–$60,000',
        status: 'in_stock',
        orderUrl: 'https://www.build.deeptrekker.com',
        notes: 'Flagship inspection ROV. 260° rotating head. Flexible battery or topside power options. Autonomy modes (station hold, heading hold, depth hold). Greater payload capacity for sonar, grabber, and NDT add-ons. BRIDGE Technology compatible.',
        image: '/media/Deep%20Trekker-REV_front__1_.jpg',
      },
      {
        name: 'PIVOT ROV',
        price: 'Quote required',
        status: 'quote_required',
        notes: 'Balanced size and power. Modular design with 97° tilting tool shelf for sonar and grabber rotation. 220° rotating 4K camera. Interchangeable battery or direct-power options. Ideal for confined space inspections and offshore pipeline surveys.',
        image: '/media/deep-trekker-pivot-rov.png',
      },
      {
        name: 'PHOTON ROV',
        price: 'Quote required',
        status: 'quote_required',
        notes: 'True suitcase ROV — lightweight, durable, and quick-deploy. Rotating 4K camera. Designed for rapid surface inspection, quick-eyes-underwater missions, and budget-conscious survey work. Easy to learn; proficient piloting achievable within hours.',
        image: '/media/deep-trekker-photon-rov.png',
      },
      {
        name: 'DTG3 ROV',
        price: 'Quote required',
        status: 'quote_required',
        notes: 'Commercial-grade portable ROV for harsh environments. Lightweight. Patented pitch system. Rotating 4K camera. Industry-leading inspection and survey capabilities. Used extensively in aquaculture, infrastructure, defense, and SAR.',
        image: '/media/deep-trekker-dtg3-rov.jpg',
      },
    ],
    procurementNotes: 'Canadian company (Kitchener, ON) with US service hub in Tampa, FL. Professional ROVs for offshore inspection, aquaculture, infrastructure, search & rescue, defense, and maritime. All models run on BRIDGE Technology (autonomous navigation, dead reckoning, 4K image optimization, sonar integration). Configure and quote at build.deeptrekker.com or call +1 519-342-3177.',
  },
  {
    id: 'videoray',
    name: 'VideoRay',
    category: 'underwater',
    buyPath: 'email_required',
    leadTime: 'Quote required — 8–16 weeks typical',
    contacts: [
      { label: 'Website', value: 'videoray.com', href: 'https://www.videoray.com' },
      { label: 'Sales', value: 'sales@videoray.com', href: 'mailto:sales@videoray.com' },
      { label: 'Phone', value: '+1 610-458-3000', href: 'tel:+16104583000' },
    ],
    products: [
      {
        name: 'Mission Specialist Wraith',
        price: 'Quote required',
        status: 'quote_required',
        notes: 'Next-generation ROV with extreme agility. Compact, vectored-thruster design optimised for confined spaces and high-current environments. Depth rating 305 m.',
        image: '/media/wraith-isolated-sm-mm-1.webp',
      },
      {
        name: 'Mission Specialist Ally',
        price: 'Quote required',
        status: 'quote_required',
        notes: 'Designed for optimal power and lift. Heavy-lift configuration with modular payload bay; ideal for cable-laying, object recovery, and intervention tasks.',
        image: '/media/ally-edited-2.webp',
      },
      {
        name: 'Mission Specialist Defender',
        price: 'Quote required',
        status: 'quote_required',
        notes: 'Designed for heavier payloads and demanding intervention. Maximum thrust configuration; supports manipulator arms, sonar, and multi-tool payloads. Depth rating 305 m.',
        image: '/media/DEFENDER-edited-4.webp',
      },
      {
        name: 'Mission Specialist Pro 5',
        price: 'Quote required',
        status: 'quote_required',
        notes: 'Small-footprint ROV with optimal performance features. 8-thruster vectored system; modular design; supports 4K camera, sonar, and positioning payloads.',
        image: '/media/VideoRay.webp',
      },
    ],
    procurementNotes: 'US-based ROV manufacturer (Malvern, PA). Supplier to the US Navy, NATO, and commercial offshore sectors. All Mission Specialist Series vehicles share a modular architecture — payloads, thrusters, and sensors can be swapped in the field. Contact sales@videoray.com or +1 610-458-3000 for configuration and quote.',
  },

  // ─── EXOSKELETON ─────────────────────────────────────────────────────────────
  {
    id: 'ekso-bionics',
    name: 'Ekso Bionics',
    category: 'exoskeleton',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'eksobionics.com', href: 'https://eksobionics.com' }],
    products: [
      { name: 'EksoGT (rehabilitation exoskeleton)', price: 'Quote', status: 'quote_required', image: '/media/EksoNR-by-Ekso-Bionics-Exoskeleton-Catalog-600.jpg' },
      { name: 'EksoVest EVA (industrial)', price: 'Quote', status: 'quote_required', image: '/media/EksoNR-by-Ekso-Bionics-Exoskeleton-Catalog-600.jpg' },
    ],
    procurementNotes: 'FDA cleared. Nasdaq: EKSO. Medical rehab and industrial overhead work assistance.',
  },
  {
    id: 'sarcos',
    name: 'Sarcos Robotics',
    category: 'exoskeleton',
    buyPath: 'raas_only',
    contacts: [{ label: 'Website', value: 'sarcos.com', href: 'https://sarcos.com' }],
    products: [
      { name: 'Guardian XO (full-body, 200 lb lift assist)', price: 'RaaS ~$100,000–$150,000/yr', status: 'raas', image: '/media/Guardian%20XO.avif' },
      { name: 'Guardian XT (upper body)', price: 'RaaS', status: 'raas', image: '/media/Guardian%20XO.avif' },
    ],
    procurementNotes: 'Industrial full-body exoskeleton. RaaS model only. Targets heavy industry, defense, logistics.',
  },
  {
    id: 'german-bionic',
    name: 'German Bionic',
    category: 'exoskeleton',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'germanbionic.com', href: 'https://germanbionic.com' }],
    products: [
      { name: 'Cray X (back support)', price: 'Quote', status: 'quote_required', image: '/media/Cray-X-5th-Gen-German-Bionics-Exoskeleton-Catalog-2022.jpg' },
      { name: 'Apogee+ (connected exo)', price: 'Quote', status: 'quote_required', image: '/media/Cray-X-5th-Gen-German-Bionics-Exoskeleton-Catalog-2022.jpg' },
    ],
    procurementNotes: 'EU leader in IoT-connected exoskeletons. Tracks worker ergonomics data in real time.',
  },

  // ─── COMPONENTS / SENSORS ───────────────────────────────────────────────────
  {
    id: 'ouster',
    name: 'Ouster',
    category: 'components',
    buyPath: 'direct_online',
    contacts: [{ label: 'Website', value: 'ouster.com', href: 'https://ouster.com' }],
    products: [
      { name: 'OS1-32 LiDAR', price: '~$9,680', status: 'in_stock', orderUrl: 'https://ouster.com', image: '/media/OS1-32%20LiDAR%20.png' },
      { name: 'OS1-64 LiDAR', price: '~$51,990', status: 'in_stock', orderUrl: 'https://ouster.com', image: '/media/OS1-32%20LiDAR%20.png' },
      { name: 'OS2-64 / OS2-128 LiDAR', price: '~$26,620–$27,830', status: 'in_stock', orderUrl: 'https://ouster.com', image: '/media/OS1-32%20LiDAR%20.png' },
    ],
    procurementNotes: 'Direct online purchase. High-performance LiDAR sensors for robotics, AV, and mapping.',
  },
  {
    id: 'stereolabs',
    name: 'Stereolabs',
    category: 'components',
    buyPath: 'direct_online',
    contacts: [{ label: 'Website', value: 'stereolabs.com', href: 'https://stereolabs.com' }],
    products: [
      { name: 'ZED 2i (stereo depth camera)', price: '$739', status: 'in_stock', orderUrl: 'https://stereolabs.com', image: '/media/ZED%202i%20.webp' },
      { name: 'ZED Mini', price: '$539', status: 'in_stock', orderUrl: 'https://stereolabs.com', image: '/media/ZED%202i%20.webp' },
      { name: 'ZED X Mini (GMSL2)', price: '$549', status: 'in_stock', orderUrl: 'https://stereolabs.com', image: '/media/ZED%202i%20.webp' },
    ],
    procurementNotes: 'Industry-standard depth cameras for robotics. Works with ROS, NVIDIA Jetson, and most compute platforms.',
  },
  {
    id: 'robotis',
    name: 'ROBOTIS / Dynamixel',
    category: 'components',
    buyPath: 'direct_online',
    contacts: [{ label: 'Website', value: 'robotis.us', href: 'https://www.robotis.us' }],
    products: [
      { name: 'XL430-W250-T Servo', price: '~$45', status: 'in_stock', orderUrl: 'https://www.robotis.us', image: '/media/ROBOTIS%20%3A%20Dynamixel.jpg' },
      { name: 'XM430 / XD540 Series', price: '$80–$250', status: 'in_stock', orderUrl: 'https://www.robotis.us', image: '/media/ROBOTIS%20%3A%20Dynamixel.jpg' },
      { name: 'XH540 / XW540 High-Torque', price: '$300–$500', status: 'in_stock', orderUrl: 'https://www.robotis.us', image: '/media/ROBOTIS%20%3A%20Dynamixel.jpg' },
    ],
    procurementNotes: 'Industry-standard smart servo actuators. Direct purchase at robotis.us or Robotis Shop.',
  },

  // ─── DEFENSE ────────────────────────────────────────────────────────────────
  {
    id: 'aerovironment',
    name: 'AeroVironment',
    category: 'defense',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'avinc.com', href: 'https://www.avinc.com' }],
    products: [
      { name: 'Switchblade 300 (loitering munition)', price: 'Quote (ITAR)', status: 'quote_required', notes: 'Government/military only.', image: '/media/AeroVironment.webp' },
      { name: 'Switchblade 600', price: 'Quote (ITAR)', status: 'quote_required', image: '/media/AeroVironment.webp' },
      { name: 'Raven B UAS / Wasp AE', price: 'Quote (ITAR)', status: 'quote_required', image: '/media/AeroVironment.webp' },
    ],
    procurementNotes: 'Government and military only. ITAR restricted. Contact via official procurement channels.',
  },
  {
    id: 'teledyne-flir-defense',
    name: 'Teledyne FLIR Defense',
    category: 'defense',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'teledyneflir.com/defense', href: 'https://www.teledyneflir.com/defense' }],
    products: [
      { name: 'Centaur UGV', price: 'Quote', status: 'quote_required', notes: 'Government/military customers.', image: '/media/Teledyne%20FLIR%20Defense.jpg' },
      { name: 'PackBot 510 Kobra', price: 'Quote', status: 'quote_required', image: '/media/Teledyne%20FLIR%20Defense.jpg' },
      { name: 'PackBot 710', price: 'Quote', status: 'quote_required', image: '/media/Teledyne%20FLIR%20Defense.jpg' },
    ],
    procurementNotes: 'Defense and public safety robots. Military procurement through authorized channels.',
  },
  {
    id: 'milrem-robotics',
    name: 'Milrem Robotics',
    category: 'defense',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'milrem.com', href: 'https://milrem.com' }],
    products: [
      { name: 'THeMIS UGV', price: 'Quote', status: 'quote_required', image: '/media/Milrem%20Robotics.webp' },
      { name: 'Type-X RCV', price: 'Quote', status: 'quote_required', image: '/media/Milrem%20Robotics.webp' },
    ],
    procurementNotes: 'Estonian company. NATO partner. Unmanned ground vehicles for defense and logistics.',
  },
  {
    id: 'elephant-robotics',
    name: 'Elephant Robotics',
    category: 'cobot',
    buyPath: 'direct_online',
    contacts: [
      { label: 'Website', value: 'elephantrobotics.com', href: 'https://www.elephantrobotics.com/en/' },
      { label: 'Shop', value: 'shop.elephantrobotics.com', href: 'https://shop.elephantrobotics.com' },
      { label: 'Email', value: 'info@elephantrobotics.com', href: 'mailto:info@elephantrobotics.com' },
    ],
    products: [
      {
        name: 'myCobot 280 (M5Stack / Pi)',
        price: '~$699–$999',
        status: 'in_stock',
        orderUrl: 'https://shop.elephantrobotics.com',
        notes: '6-DOF desktop cobot; 0.25 kg payload; 280 mm reach; ±0.5 mm repeatability; 0.85 kg weight; ideal for education, research, and light automation demos. Available with M5Stack, Raspberry Pi, Jetson Nano, or Arduino controllers.',
        image: '/media/myCobot%20Collaborative%20Robotic%20Arm.webp',
      },
      {
        name: 'myCobot Pro 630',
        price: '$6,999',
        status: 'in_stock',
        orderUrl: 'https://shop.elephantrobotics.com/products/mycobot-pro-630-robotic-arm-commercial-collaborative-robot',
        notes: '6-DOF professional cobot; 2 kg payload; 630 mm reach; ±0.1 mm repeatability; self-developed harmonic joint modules; DC 48V; designed for commercial and teaching applications. Ships in 7–15 business days.',
        image: '/media/myCobot%20Collaborative%20Robotic%20Arm.webp',
      },
      {
        name: 'ER C3 — C Series (3 kg)',
        price: '~$18,999',
        status: 'in_stock',
        orderUrl: 'https://www.elephantrobotics.com/en/catbot-en/',
        notes: '6-axis industrial-grade cobot; 3 kg payload; 600 mm reach; ±0.05 mm repeatability; 18 kg total weight — highly portable vs. traditional cobots. Applications: commercial, medical, scientific research, education, light manufacturing. CE certified.',
        image: '/media/Elephant%20Robotics.webp',
      },
      {
        name: 'ER C5 — C Series (5 kg)',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.elephantrobotics.com/en/catbot-en/',
        notes: '6-axis industrial-grade cobot; 5 kg payload; compact form factor; ±0.05 mm repeatability. Same C Series platform as C3 with higher payload for heavier machine tending, assembly, and lab automation tasks.',
        image: '/media/Elephant%20Robotics.webp',
      },
      {
        name: 'ER P3 — P Series (3 kg)',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.elephantrobotics.com/en/panda-en/',
        notes: '6-axis universal cobot; 3 kg payload; 550 mm reach; ±0.05 mm repeatability; 17 kg weight; SDK: Python, C++, Java; API and ROS support. Applications: 3C electronics, precision injection molding, pharma, automotive parts, metal processing.',
        image: '/media/Elephant%20Robotics.webp',
      },
      {
        name: 'ER P5 — P Series (5 kg)',
        price: '~$19,999',
        status: 'in_stock',
        orderUrl: 'https://www.elephantrobotics.com/en/panda-en/',
        notes: '6-axis universal cobot; 5 kg payload; 850 mm reach; ±0.05 mm repeatability; tool speed 1 m/s; 24.5 kg weight; IP40; CE certified; SDK: Python, C++, Java; ROS support. Drag-to-teach and visual programming. 2–4 week lead time (US).',
        image: '/media/Elephant%20Robotics.webp',
      },
      {
        name: 'ER P10 — P Series (10 kg)',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.elephantrobotics.com/en/panda-en/',
        notes: '6-axis professional cobot; 10 kg payload; highest-payload P Series model; for heavier assembly, material handling, and machine tending. Contact for pricing and lead time.',
        image: '/media/Elephant%20Robotics.webp',
      },
      {
        name: 'MC Series Joint Modules (MC14 / MC17 / MC20 / MC25 / MC32)',
        price: 'Quote',
        status: 'quote_required',
        orderUrl: 'https://www.elephantrobotics.com/en/modules/',
        notes: '5 modular robotic joint sizes for OEM and custom robot builds. MC14: 70 mm dia, 1.3 kg, 49 N·m, 30 RPM. MC17: 80 mm dia, 1.8 kg, 31.35 N·m. MC20: 90 mm dia, 2.4 kg, 70.2 N·m. MC25: 115 mm dia, 3.8 kg, 167.4 N·m. MC32: 147 mm dia, 7 kg, 243 N·m, 16 RPM. Also available: MS Series (with official enclosure).',
        image: '/media/Elephant%20Robotics.webp',
      },
    ],
    procurementNotes: 'Elephant Robotics (大象机器人, Shenzhen, China) is a global lightweight cobot and robotic arm manufacturer founded in 2016; incubated by HAX; backed by SOSV, Zhenge Fund, and others. Products ship from China warehouse (7–15 business days). US distributors available — Top3DShop carries C3 and P5 with local US support and 1-year warranty. The myCobot line (280, 320, Pro) is the most accessible entry point; the ER P and C Series are industrial-grade professional cobots for production environments. All arms support ROS, Python, C++, and Java SDKs.',
  },
];

/** Look up a vendor by ID */
export function getVendor(id: string): Vendor | undefined {
  return VENDORS.find((v) => v.id === id);
}

/** Get all vendors in a category */
export function getVendorsByCategory(category: Vendor['category']): Vendor[] {
  return VENDORS.filter((v) => v.category === category);
}

export const BUY_PATH_LABELS: Record<BuyPath, string> = {
  direct_online: 'Buy Online',
  email_required: 'Email / Form Required',
  raas_only: 'RaaS Only',
  dealer_only: 'Dealer Only',
  b2b_partner: 'B2B Partner',
  not_available: 'Not Available',
};

export const BUY_PATH_COLORS: Record<BuyPath, string> = {
  direct_online: 'text-emerald-400 border-emerald-800/50 bg-emerald-900/20',
  email_required: 'text-yellow-400 border-yellow-800/50 bg-yellow-900/20',
  raas_only: 'text-cyan-400 border-cyan-800/50 bg-cyan-900/20',
  dealer_only: 'text-blue-400 border-blue-800/50 bg-blue-900/20',
  b2b_partner: 'text-purple-400 border-purple-800/50 bg-purple-900/20',
  not_available: 'text-red-400 border-red-800/50 bg-red-900/20',
};



