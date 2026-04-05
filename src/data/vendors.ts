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

export interface Vendor {
  id: string;
  name: string;
  category: 'humanoid' | 'delivery' | 'industrial' | 'drone';
  buyPath: BuyPath;
  leadTime?: string;
  contacts: VendorContact[];
  products: VendorProduct[];
  procurementNotes: string;
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



