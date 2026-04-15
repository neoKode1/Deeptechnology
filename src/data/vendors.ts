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
      { name: 'G1 EDU Standard', price: '$13,500', status: 'in_stock', orderUrl: 'https://shop.unitree.com' },
      { name: 'H2 Advanced', price: '$29,900', status: 'in_stock', orderUrl: 'https://shop.unitree.com' },
      { name: 'R1 (Pre-sale)', price: 'From $4,900', status: 'pre_order', orderUrl: 'https://shop.unitree.com' },
      { name: 'H1 Full-Size', price: '$90,000', status: 'quote_required', notes: 'Email sales_global@unitree.com' },
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
      { name: 'NEO (Early Access)', price: '$20,000', deposit: '$200 refundable', status: 'pre_order', orderUrl: 'https://www.1x.tech/order', notes: 'Priority 2026 delivery, 3-yr warranty' },
      { name: 'NEO (Subscription)', price: '$499/mo', status: 'pre_order', orderUrl: 'https://www.1x.tech/order', notes: 'Ships later than Early Access' },
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
      { name: 'Digit (RaaS)', price: 'RaaS — Contact', status: 'raas', notes: 'Est. ~$250K CapEx; RaaS target <$10/hr equivalent' },
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
      { name: 'Optimus Gen 3', price: 'Not available', status: 'not_available', notes: 'Consumer target: end of 2027. B2B industrial: late 2026 at $100K+.' },
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
      { name: 'Figure 03', price: 'Enterprise — Contact', status: 'quote_required', notes: 'Figure 02 retiring. F03 is current.' },
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
      { name: 'Serve R2 (Fleet)', price: 'B2B partnership only', status: 'raas', notes: '2,000-robot fleet; partners: Uber Eats, 7-Eleven, DoorDash' },
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
      { name: 'Kiwibot Leap', price: '$899/mo per robot', deposit: '$100 refundable', status: 'pre_order', orderUrl: 'https://www.kiwibot.com/product/kiwibot-leap', notes: 'US only, limited units' },
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
      { name: 'E1 Outdoor Delivery Robot', price: 'Partner pricing', status: 'raas', notes: 'Fleet partner model' },
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
      { name: 'Starship R2 (Service)', price: '$1–$2/delivery', status: 'raas', notes: 'Robots not sold standalone — bundled in service' },
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
      { name: 'Spot (Base)', price: '$74,500', status: 'quote_required' },
      { name: 'Spot Enterprise w/ Docking', price: '$111,700', status: 'quote_required' },
      { name: 'Spot Arm', price: '$65,000', status: 'quote_required' },
      { name: 'Spot Enterprise Bundle', price: '$150K–$195K', status: 'quote_required', notes: 'Full thermal + docking bundle' },
      { name: 'Stretch (Warehouse)', price: 'Contact Sales', status: 'quote_required' },
      { name: 'Atlas (Industrial)', price: 'Early adopters only', status: 'quote_required', notes: 'Select partners only' },
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
      { name: 'Palion Lift RS1', price: 'Enterprise quote', status: 'quote_required', notes: '26-week lead time confirmed on product page' },
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
      { name: 'MiR600 Pallet AMR', price: 'Quote via distributor', status: 'quote_required' },
      { name: 'MiR250', price: 'Quote via distributor', status: 'quote_required' },
      { name: 'MiR1200 Pallet Jack', price: 'Quote via distributor', status: 'quote_required' },
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
      { name: 'Mavic 3E', price: '$4,599', status: 'in_stock', orderUrl: 'https://www.dronefly.com/products/dji-mavic-3-enterprise' },
      { name: 'Matrice 400', price: '$10,450', status: 'in_stock', orderUrl: 'https://talosdrones.com/products/dji-enterprise-matrice-400' },
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
      { name: 'X10', price: 'Quote required', status: 'quote_required', notes: 'NDAA compliant, US-made. "~X2 range" (~$11K est.)' },
      { name: 'X10D (Defense)', price: 'Quote required', status: 'quote_required', notes: 'DOD/federal only via ADS' },
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
      { name: 'Apollo', price: 'RaaS / Enterprise — Contact', status: 'quote_required', notes: 'Target <$50K long-term; current pilot pricing undisclosed. Partners: GE Aerospace, Mercedes-Benz, GXO.' },
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
      { name: 'Phoenix Gen 7', price: 'Enterprise — Contact', status: 'quote_required', notes: 'Est. $65K–$250K; Carbon Intelligence OS; 50x faster autonomous learning vs Gen 6.' },
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
      { name: 'Walker S2', price: '$180,000 (purchase) or $5,000/mo RaaS', status: 'in_stock', notes: 'Mass production as of Nov 2025; >800M CNY confirmed orders. BYD, Geely, Foxconn deployments.' },
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
      { name: 'GR-1', price: '~$149,999', status: 'in_stock', notes: '42 DOF; research + rehabilitation deployments globally. Mass production target 2026.' },
      { name: 'GR-2', price: 'Enterprise — Contact', status: 'pre_order', notes: 'Advanced research platform; enhanced dexterity and perception.' },
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
      { name: '4NE-1 Gen 3.5', price: '€98,000 (1–19 units) / €60,000 (fleet)', status: 'pre_order', notes: 'Delivery end 2026. Designed by Studio F.A. Porsche. Bosch strategic partnership (CES 2026).' },
      { name: '4NE-1 Mini', price: 'Contact — Spring 2026', status: 'pre_order', notes: 'Smaller collaborative variant announced Spring 2026.' },
    ],
    procurementNotes: 'German company (Metzingen). €200M Series B raised. Partners: Bosch (CES 2026), Volvo Cars, OpenAI. Volume fleet pricing drops to €60K. Web form → enterprise pilot.',
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
      { name: 'Forerunner K2', price: '~$30,000 (target, based on K1)', status: 'pre_order', notes: '5th-gen model; Ant Group mass production partnership.' },
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
      { name: 'A2 Standard', price: '$100,000', status: 'in_stock', notes: 'Whole-body dexterous manipulation; AI-native platform.' },
      { name: 'A2-Max', price: '$130,000–$160,000', status: 'in_stock', notes: 'Extended capability variant.' },
      { name: 'A2 Youth Edition', price: '$23,000', status: 'in_stock', notes: 'Entry-level research/education platform.' },
      { name: 'X2 (RaaS)', price: '€899/day', status: 'raas', notes: 'Rental model launched MWC 2026. Demonstrated full-split mobility.' },
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
      { name: 'TIAGo Pro', price: 'Quote required (rental ~€850/mo)', status: 'quote_required', notes: 'Mobile manipulator; ROS2; hospital + research.' },
      { name: 'ARI', price: 'Quote required', status: 'quote_required', notes: 'Social service robot; hotel, airport, retail.' },
      { name: 'TALOS', price: '~€1,000,000+', status: 'quote_required', notes: 'Research humanoid; 30 DOF; 200+ university labs worldwide.' },
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
      { name: 'LocusBot Origin', price: 'RaaS — Contact', status: 'raas', notes: 'Collaborative picking AMR; human-robot teaming model.' },
      { name: 'LocusBot Vector', price: 'RaaS — Contact', status: 'raas', notes: 'Next-gen; higher-throughput autonomous navigation.' },
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
      { name: 'Ranger AMR (Rack-to-Person)', price: 'Enterprise Quote', status: 'quote_required', notes: 'AI-first GTP AMR on GreyMatter platform; real-time SKU velocity adaptation.' },
      { name: 'Butler M', price: 'Enterprise Quote', status: 'quote_required', notes: 'Cart/lift transport; proven in high-mix environments.' },
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
      { name: 'P800R (Goods-to-Person)', price: 'Enterprise Quote', status: 'quote_required', notes: '3x human efficiency; 800 kg shelf payload; high-density storage.' },
      { name: 'S20 Sorting AMR', price: 'Enterprise Quote', status: 'quote_required', notes: 'Parcel/apparel high-throughput sorting.' },
      { name: 'RS Shelf-to-Person', price: 'Enterprise Quote', status: 'quote_required', notes: 'Flexible scaling; mixed-SKU picking.' },
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
      { name: 'OTTO 100', price: 'Quote via dealer', status: 'quote_required', notes: '330 lb payload; agile light transport.' },
      { name: 'OTTO 750', price: 'Quote via dealer', status: 'quote_required', notes: '2,340 lb payload; manufacturing floor workhorse.' },
      { name: 'OTTO 1500', price: 'Quote via dealer', status: 'quote_required', notes: '4,200 lb payload; heavy industrial transport.' },
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
      { name: 'LD-60/90', price: 'Quote via distributor', status: 'quote_required', notes: '60/90 kg payload; compact for tight-space navigation.' },
      { name: 'LD-250', price: 'Quote via distributor', status: 'quote_required', notes: '250 kg payload; mid-range warehouse/manufacturing.' },
      { name: 'LD-1500', price: 'Quote via distributor', status: 'quote_required', notes: '1,500 kg payload; heavy industrial.' },
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
      { name: 'HAIPICK A42N', price: 'Enterprise Quote', status: 'quote_required', notes: "World's first carton-picking ACR; 4.5m vertical reach; multi-level tote retrieval." },
      { name: 'HAIPICK A3', price: 'Enterprise Quote', status: 'quote_required', notes: 'Up to 5.5m picking height; floor-level + elevated SKUs.' },
      { name: 'HAIPICK A42D', price: 'Enterprise Quote', status: 'quote_required', notes: 'Double-deep variant for higher storage density.' },
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
      { name: 'Husky UGV', price: 'Quote required', status: 'quote_required', notes: 'ROS2; IP54; outdoor/indoor capable. Research and commercial.' },
      { name: 'Jackal UGV', price: 'Quote required', status: 'quote_required', notes: 'Small weatherproof UGV; field + lab use.' },
      { name: 'Ridgeback', price: 'Quote required', status: 'quote_required', notes: 'Omnidirectional indoor mobile manipulation base.' },
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
      { name: 'Chuck AMR', price: 'Enterprise subscription — Contact', status: 'raas', notes: 'Collaborative picking AMR; voice + light guidance UI. 120+ sites worldwide.' },
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
      { name: 'inVia Dynamic (PickerBot)', price: 'RaaS — per-pick pricing', status: 'raas', notes: 'Goods-to-person ASRS AMR; monthly subscription scales with throughput.' },
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
      { name: 'Platform+ (Instant Delivery DaaS)', price: 'Service contract — Contact', status: 'raas', notes: 'Sub-3-min last-mile delivery. Partners: Walmart, Panera, Chipotle, Wendy\'s, Little Caesars.' },
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
      { name: 'Wing Delivery (DaaS)', price: 'B2B service — Contact', status: 'raas', notes: 'FAA Part 135 Air Carrier. Night delivery via infrared. US, AU, FI operations.' },
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
      { name: 'EVO Max 4T V2', price: 'Contact for current pricing', status: 'in_stock', orderUrl: 'https://shop.autelrobotics.com', notes: 'Quad-sensor fusion; 48MP + 8K; 42-min flight; 20km range.' },
      { name: 'EVO II Pro V3', price: '~$4,499', status: 'in_stock', notes: 'NDAA-compliant; 6K Hasselblad camera.' },
      { name: 'Dragonfish Pro', price: 'Quote required', status: 'quote_required', notes: 'Fixed-wing VTOL; 2-hr flight; long-range survey.' },
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
      { name: 'ANAFI USA', price: '~$7,000', status: 'in_stock', orderUrl: 'https://enterprise.parrot.com/en/drones/anafi-usa/', notes: 'NDAA/TAA compliant; Blue sUAS approved (DIU); NATO-approved; US-assembled; IP53.' },
      { name: 'ANAFI Ai', price: '~$4,500', status: 'in_stock', orderUrl: 'https://enterprise.parrot.com/en/drones/anafi-ai/', notes: 'First 4G LTE drone (Verizon); sub-250g; AI obstacle avoidance; open API.' },
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
      { name: 'Sparrow AiDrone', price: 'SaaS — Quote required', status: 'quote_required', notes: 'Autonomous inspection; DJI Dock 2 compatible.' },
      { name: 'Arc Drone-in-a-Box', price: 'Enterprise Quote', status: 'quote_required', notes: 'Fully autonomous + recharging dock; BVLOS approved.' },
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
      { name: 'Scout System', price: 'Enterprise Quote', status: 'quote_required', notes: 'First FAA BVLOS approval for fully automated drones without on-site operators (2021; all conditions removed 2024).' },
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
      { name: 'Alta X Gen2', price: 'Quote required', status: 'in_stock', notes: 'NDAA variant available; 35 lb payload; heavy-lift industrial. Gen2 launched Feb 2026.' },
      { name: 'Astro', price: '~$22,500', status: 'in_stock', orderUrl: 'https://freeflysystems.com/astro/', notes: 'Industrial mapping + inspection; LiDAR-ready.' },
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
      { name: 'M2 Delivery Drone (DaaS)', price: 'B2B service — Contact', status: 'raas', notes: 'Medical, food, and e-commerce cargo; BVLOS authorized; UTM partner: ANRA Technologies.' },
    ],
    procurementNotes: 'B2B delivery network — drones not sold standalone. Partners: UPS Flight Forward (Part 135), Ameriflight, Dave\'s Hot Chicken. BVLOS authorized. Saudi Arabia deployment approved Jan 2025. Contact via matternet.com.',
  },

  // ─── COBOTS / ROBOT ARMS ────────────────────────────────────────────────────
  {
    id: 'universal-robots',
    name: 'Universal Robots',
    category: 'cobot',
    buyPath: 'dealer_only',
    contacts: [{ label: 'Website', value: 'universal-robots.com', href: 'https://www.universal-robots.com' }],
    products: [
      { name: 'UR3e', price: '$35,000 est.', status: 'quote_required' },
      { name: 'UR5e', price: '$45,000 est.', status: 'quote_required' },
      { name: 'UR10e', price: '$55,000 est.', status: 'quote_required' },
      { name: 'UR16e / UR20 / UR30', price: 'Quote', status: 'quote_required' },
    ],
    procurementNotes: 'Global leader in cobots. Purchase through certified UR+ distributors. Wide ecosystem of end-effectors and integrators.',
  },
  {
    id: 'fanuc',
    name: 'FANUC',
    category: 'cobot',
    buyPath: 'dealer_only',
    contacts: [{ label: 'Website', value: 'fanucamerica.com', href: 'https://www.fanucamerica.com' }],
    products: [
      { name: 'CRX-5iA', price: 'Quote', status: 'quote_required' },
      { name: 'CRX-10iA/L', price: 'Quote', status: 'quote_required' },
      { name: 'CRX-25iA / CRX-30iA', price: 'Quote', status: 'quote_required' },
    ],
    procurementNotes: 'Available through FANUC America authorized distributors. Ideal for welding, assembly, and machine tending.',
  },
  {
    id: 'kuka',
    name: 'KUKA',
    category: 'cobot',
    buyPath: 'dealer_only',
    contacts: [{ label: 'Website', value: 'kuka.com', href: 'https://www.kuka.com' }],
    products: [
      { name: 'LBR iiwa 7', price: 'Quote', status: 'quote_required' },
      { name: 'LBR iiwa 14', price: 'Quote', status: 'quote_required' },
      { name: 'LBR iisy 3/11', price: 'Quote', status: 'quote_required' },
    ],
    procurementNotes: 'KUKA cobots sold through system integrators. Flagship LBR iiwa used in automotive and electronics.',
  },
  {
    id: 'franka',
    name: 'Franka Robotics',
    category: 'cobot',
    buyPath: 'direct_online',
    contacts: [{ label: 'Website', value: 'franka.de', href: 'https://franka.de' }],
    products: [
      { name: 'Franka 3', price: '~$17,000', status: 'in_stock' },
      { name: 'Research 3', price: '~$25,000', status: 'in_stock' },
    ],
    procurementNotes: 'Direct purchase online. Popular in research and education. 7-DoF arm with torque sensing on all joints.',
  },
  {
    id: 'igus',
    name: 'igus',
    category: 'cobot',
    buyPath: 'direct_online',
    contacts: [{ label: 'Website', value: 'igus.com/rebel', href: 'https://www.igus.com/rebel' }],
    products: [
      { name: 'ReBeL 6 DoF (open-source)', price: '$5,850', status: 'in_stock', orderUrl: 'https://www.igus.com' },
      { name: 'ReBeL 6 DoF (plug-and-play)', price: '$7,499', status: 'in_stock', orderUrl: 'https://www.igus.com' },
      { name: 'ReBeL 4 DoF', price: 'Quote', status: 'quote_required' },
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
      { name: 'myCobot 280 (Pi)', price: '$700', status: 'in_stock', orderUrl: 'https://www.elephantrobotics.com' },
      { name: 'myCobot 320 (M5)', price: '$2,500', status: 'in_stock', orderUrl: 'https://www.elephantrobotics.com' },
      { name: 'myArm M750', price: '$4,500', status: 'in_stock', orderUrl: 'https://www.elephantrobotics.com' },
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
      { name: 'M0609 / M1013 / M1509', price: 'Quote', status: 'quote_required' },
      { name: 'H2515 / A0509s', price: 'Quote', status: 'quote_required' },
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
      { name: 'VGC10 Vacuum Gripper', price: '$3,782', status: 'in_stock', orderUrl: 'https://onrobot.com' },
      { name: '2FG7 Parallel Gripper', price: '$4,724', status: 'in_stock', orderUrl: 'https://onrobot.com' },
      { name: 'RG2 Gripper', price: '$5,580', status: 'in_stock', orderUrl: 'https://onrobot.com' },
      { name: 'RG2-FT Force/Torque', price: '$11,598', status: 'in_stock', orderUrl: 'https://onrobot.com' },
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
      { name: '2F-85 Adaptive Gripper', price: 'Quote', status: 'quote_required' },
      { name: '2F-140 Adaptive Gripper', price: 'Quote', status: 'quote_required' },
      { name: 'Hand-E Gripper', price: 'Quote', status: 'quote_required' },
      { name: 'FT 300-S Force Sensor', price: 'Quote', status: 'quote_required' },
    ],
    procurementNotes: 'Industry standard cobot grippers. Compatible with Universal Robots, KUKA, FANUC, and more.',
  },

  // ─── SURGICAL / MEDICAL ─────────────────────────────────────────────────────
  {
    id: 'intuitive-surgical',
    name: 'Intuitive Surgical',
    category: 'surgical',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'intuitive.com', href: 'https://www.intuitive.com' }],
    products: [
      { name: 'da Vinci 5', price: '$1,800,000–$2,500,000', status: 'quote_required' },
      { name: 'da Vinci Xi', price: 'Quote', status: 'quote_required' },
      { name: 'da Vinci SP (single port)', price: 'Quote', status: 'quote_required' },
    ],
    procurementNotes: 'Market leader in surgical robotics. Contact hospital sales team directly. Requires clinical evaluation.',
  },
  {
    id: 'medtronic-hugo',
    name: 'Medtronic (Hugo RAS)',
    category: 'surgical',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'medtronic.com', href: 'https://www.medtronic.com' }],
    products: [
      { name: 'Hugo RAS System (soft tissue)', price: '~$1,200,000–$1,500,000', status: 'quote_required', notes: 'FDA cleared Dec 2025. First US case Feb 2026 at Cleveland Clinic.' },
      { name: 'Mazor X Stealth Edition (spine)', price: 'Quote', status: 'quote_required' },
    ],
    procurementNotes: 'Contact Medtronic surgical robotics team. Hugo FDA cleared for US market Dec 2025.',
  },
  {
    id: 'stryker-mako',
    name: 'Stryker (Mako)',
    category: 'surgical',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'stryker.com', href: 'https://www.stryker.com' }],
    products: [
      { name: 'Mako SmartRobotics (Total Hip)', price: 'Quote', status: 'quote_required' },
      { name: 'Mako SmartRobotics (TKA)', price: 'Quote', status: 'quote_required' },
      { name: 'Mako SmartRobotics (Shoulder/Spine)', price: 'Quote', status: 'quote_required', notes: '4th gen Mako is single system across all applications.' },
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
      { name: 'Versius Plus', price: 'Quote', status: 'quote_required', notes: 'FDA 510k cleared Dec 2025 (cholecystectomy).' },
      { name: 'Versius', price: 'Quote', status: 'quote_required', notes: '40,000+ global procedures.' },
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
      { name: 'TUG Autonomous Hospital Robot', price: '~$105,000 purchase / ~$1,500/mo lease', status: 'quote_required' },
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
      { name: 'Servi', price: 'RaaS — 12/24/36 mo lease', status: 'raas' },
      { name: 'Servi Plus (88 lb capacity)', price: 'RaaS', status: 'raas' },
      { name: 'Servi Mini', price: 'RaaS', status: 'raas' },
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
      { name: 'BellaBot', price: '$15,900', status: 'in_stock', orderUrl: 'https://pudurobotics.com' },
      { name: 'BellaBot Pro', price: '$16,900', status: 'in_stock', orderUrl: 'https://pudurobotics.com' },
      { name: 'KettyBot Pro', price: '$12,000', status: 'in_stock', orderUrl: 'https://pudurobotics.com' },
      { name: 'T300 Lift', price: '$21,000', status: 'in_stock', orderUrl: 'https://pudurobotics.com' },
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
      { name: 'LightStrike (pulsed xenon UV)', price: '$125,000', status: 'quote_required', notes: '5-min room disinfection cycle.' },
      { name: 'LightStrike+', price: 'Quote', status: 'quote_required' },
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
      { name: 'GuideBot', price: '$39,990 or $1,666/mo RaaS', status: 'in_stock', orderUrl: 'https://solutions.lg.com/us/robots' },
      { name: 'ServeBot 3.0', price: 'Quote', status: 'quote_required' },
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
      { name: 'Neo 2', price: '~$50,000+', status: 'quote_required' },
      { name: 'Neo 2W (warehouse variant)', price: 'Quote', status: 'quote_required' },
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
      { name: 'T7AMR', price: 'Quote', status: 'quote_required' },
      { name: 'T380AMR', price: 'Quote', status: 'quote_required' },
      { name: 'X16 Sweep (BrainOS SelfPath AI)', price: 'Quote', status: 'quote_required', notes: 'Launched MODEX 2026.' },
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
      { name: 'Cobi 18 Autonomous Scrubber', price: '$16,000/36-mo subscription (~$15/day)', status: 'raas', orderUrl: 'https://icecobotics.com' },
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
      { name: 'K5 (outdoor patrol)', price: '$7/hr RaaS', status: 'raas' },
      { name: 'K3 (indoor patrol)', price: '$7/hr RaaS', status: 'raas' },
      { name: 'K1 (stationary scanner)', price: 'Quote', status: 'raas' },
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
      { name: 'Cobalt Security Robot + 24/7 Remote Monitoring', price: 'RaaS monthly', status: 'raas' },
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
      { name: 'Go2 Air', price: '$1,600', status: 'in_stock', orderUrl: 'https://shop.unitree.com' },
      { name: 'Go2 Pro', price: '$2,800', status: 'in_stock', orderUrl: 'https://shop.unitree.com' },
      { name: 'B2', price: '$100,000', status: 'quote_required' },
      { name: 'B2-W (wheel-leg hybrid)', price: '$100,000', status: 'quote_required' },
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
      { name: 'Vision 60 Q-UGV', price: '$165,000', status: 'quote_required', notes: '8–12 week lead time. Defense/security primary.' },
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
      { name: 'ANYmal C', price: 'Quote', status: 'quote_required' },
      { name: 'ANYmal D', price: 'Quote', status: 'quote_required' },
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
      { name: 'Lynx', price: '$17,999', status: 'in_stock', orderUrl: 'https://deeprobotics.us' },
      { name: 'Lynx M20 Pro', price: '$53,700', status: 'in_stock', orderUrl: 'https://deeprobotics.us' },
      { name: 'X30 Pro', price: '$94,999–$113,400', status: 'in_stock', orderUrl: 'https://deeprobotics.us' },
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
      { name: 'MK-V (electric autonomous tractor)', price: '~$50,000–$60,000', status: 'quote_required' },
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
      { name: 'LaserWeeder (autonomous laser weeding)', price: '~$1,200,000 purchase or RaaS', status: 'raas' },
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
      { name: 'Agras T50', price: '$30,999', status: 'in_stock', orderUrl: 'https://store.dji.com/category/agriculture' },
      { name: 'Agras T25', price: '$17,999', status: 'in_stock', orderUrl: 'https://store.dji.com/category/agriculture' },
    ],
    procurementNotes: 'Agricultural drone spraying and spreading. Available through DJI authorized agricultural dealers.',
  },
  {
    id: 'burro',
    name: 'Burro',
    category: 'agricultural',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'burro.ai', href: 'https://burro.ai' }],
    products: [
      { name: 'Burro Autonomous Field Vehicle', price: '~$15,000–$20,000', status: 'quote_required' },
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
      { name: 'Elios 3 (collision-tolerant indoor drone)', price: '~$30,000–$40,000', status: 'quote_required' },
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
      { name: 'Wall-Climbing Inspection Robot (vessels/tanks/boilers)', price: 'Service contract', status: 'raas' },
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
      { name: 'Optimus (drone-in-a-box, BVLOS)', price: 'Enterprise Quote', status: 'quote_required' },
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
      { name: 'BlueROV2 (assembled)', price: '$4,080', status: 'in_stock', orderUrl: 'https://bluerobotics.com' },
    ],
    procurementNotes: 'Most popular open-source ROV. Direct purchase online. Strong community and accessory ecosystem.',
  },
  {
    id: 'deep-trekker',
    name: 'Deep Trekker',
    category: 'underwater',
    buyPath: 'direct_online',
    contacts: [{ label: 'Website', value: 'deeptrekker.com', href: 'https://deeptrekker.com' }],
    products: [
      { name: 'REVOLUTION ROV', price: '$15,000–$60,000', status: 'in_stock', orderUrl: 'https://deeptrekker.com' },
      { name: 'DTG3', price: 'Quote', status: 'quote_required' },
      { name: 'PIVOT', price: 'Quote', status: 'quote_required' },
    ],
    procurementNotes: 'Canadian company. Professional ROVs for inspection, aquaculture, and search & rescue.',
  },
  {
    id: 'videoray',
    name: 'VideoRay',
    category: 'underwater',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'videoray.com', href: 'https://videoray.com' }],
    products: [
      { name: 'Scout ROV', price: '~$15,000', status: 'quote_required' },
      { name: 'Pro 4', price: '~$40,000', status: 'quote_required' },
      { name: 'Defender', price: '~$75,000', status: 'quote_required' },
    ],
    procurementNotes: 'US Navy supplier. Professional and defense ROVs.',
  },

  // ─── EXOSKELETON ─────────────────────────────────────────────────────────────
  {
    id: 'ekso-bionics',
    name: 'Ekso Bionics',
    category: 'exoskeleton',
    buyPath: 'email_required',
    contacts: [{ label: 'Website', value: 'eksobionics.com', href: 'https://eksobionics.com' }],
    products: [
      { name: 'EksoGT (rehabilitation exoskeleton)', price: 'Quote', status: 'quote_required' },
      { name: 'EksoVest EVA (industrial)', price: 'Quote', status: 'quote_required' },
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
      { name: 'Guardian XO (full-body, 200 lb lift assist)', price: 'RaaS ~$100,000–$150,000/yr', status: 'raas' },
      { name: 'Guardian XT (upper body)', price: 'RaaS', status: 'raas' },
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
      { name: 'Cray X (back support)', price: 'Quote', status: 'quote_required' },
      { name: 'Apogee+ (connected exo)', price: 'Quote', status: 'quote_required' },
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
      { name: 'OS1-32 LiDAR', price: '~$9,680', status: 'in_stock', orderUrl: 'https://ouster.com' },
      { name: 'OS1-64 LiDAR', price: '~$51,990', status: 'in_stock', orderUrl: 'https://ouster.com' },
      { name: 'OS2-64 / OS2-128 LiDAR', price: '~$26,620–$27,830', status: 'in_stock', orderUrl: 'https://ouster.com' },
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
      { name: 'ZED 2i (stereo depth camera)', price: '$739', status: 'in_stock', orderUrl: 'https://stereolabs.com' },
      { name: 'ZED Mini', price: '$539', status: 'in_stock', orderUrl: 'https://stereolabs.com' },
      { name: 'ZED X Mini (GMSL2)', price: '$549', status: 'in_stock', orderUrl: 'https://stereolabs.com' },
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
      { name: 'XL430-W250-T Servo', price: '~$45', status: 'in_stock', orderUrl: 'https://www.robotis.us' },
      { name: 'XM430 / XD540 Series', price: '$80–$250', status: 'in_stock', orderUrl: 'https://www.robotis.us' },
      { name: 'XH540 / XW540 High-Torque', price: '$300–$500', status: 'in_stock', orderUrl: 'https://www.robotis.us' },
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
      { name: 'Switchblade 300 (loitering munition)', price: 'Quote (ITAR)', status: 'quote_required', notes: 'Government/military only.' },
      { name: 'Switchblade 600', price: 'Quote (ITAR)', status: 'quote_required' },
      { name: 'Raven B UAS / Wasp AE', price: 'Quote (ITAR)', status: 'quote_required' },
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
      { name: 'Centaur UGV', price: 'Quote', status: 'quote_required', notes: 'Government/military customers.' },
      { name: 'PackBot 510 Kobra', price: 'Quote', status: 'quote_required' },
      { name: 'PackBot 710', price: 'Quote', status: 'quote_required' },
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
      { name: 'THeMIS UGV', price: 'Quote', status: 'quote_required' },
      { name: 'Type-X RCV', price: 'Quote', status: 'quote_required' },
    ],
    procurementNotes: 'Estonian company. NATO partner. Unmanned ground vehicles for defense and logistics.',
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



