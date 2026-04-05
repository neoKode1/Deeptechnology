import { spawn } from 'child_process';
import { randomUUID } from 'crypto';
import path from 'path';
import { VENDORS, BUY_PATH_LABELS, type Vendor } from '@/data/vendors';

/** Nimbus (Clawdbot) gateway path — sibling directory to deeptech */
const NIMBUS_DIR = path.resolve(process.cwd(), '..', 'nimbus');

interface IntakeFields {
  environmentType?: string;
  systemCategory?: string;
  payloadDescription?: string;
  terrainSurface?: string;
  deploymentScale?: string;
  integrationNeeds?: string[];
  projectType?: string;
  techStack?: string;
  contentType?: string;
  deliverables?: string;
  styleReferences?: string;
  budgetRange?: string;
  timeline?: string;
}

interface SourcingRequest {
  name: string;
  email: string;
  /** Enterprise qualification fields */
  company?: string;
  jobTitle?: string;
  industry?: string;
  employeeCount?: string;
  inquiry: string;
  message: string;
  intake?: IntakeFields;
}

/**
 * Build a compact vendor reference block for the Nimbus prompt.
 * Limits to vendors in the relevant category to keep the prompt tight.
 */
function buildVendorContext(category?: Vendor['category']): string {
  const vendors = category ? VENDORS.filter(v => v.category === category) : VENDORS;
  const lines: string[] = ['--- Verified Vendor Intelligence (use this — do NOT re-search) ---'];

  for (const v of vendors) {
    lines.push(`\n[${v.name}] buy_path=${v.buyPath} (${BUY_PATH_LABELS[v.buyPath]})`);
    if (v.leadTime) lines.push(`  lead_time: ${v.leadTime}`);

    // Primary contact
    const primary = v.contacts[0];
    if (primary) lines.push(`  contact: ${primary.label} — ${primary.value}`);

    // Products with pricing
    for (const p of v.products) {
      const orderNote = p.orderUrl ? ` → ${p.orderUrl}` : '';
      const depositNote = p.deposit ? ` [deposit: ${p.deposit}]` : '';
      lines.push(`  product: ${p.name} | ${p.price}${depositNote} | status=${p.status}${orderNote}`);
    }

    lines.push(`  notes: ${v.procurementNotes.slice(0, 200)}`);
  }

  return lines.join('\n');
}

/**
 * Build a structured prompt for Nimbus based on the contact form submission.
 * Nimbus receives this as a natural-language instruction with embedded parameters.
 */
function buildSourcingPrompt(req: SourcingRequest, sessionId: string): string {
  const lines: string[] = [
    `NEW SOURCING REQUEST — Session: ${sessionId}`,
    `Customer: ${req.name} <${req.email}>`,
    req.company    ? `Company: ${req.company}`                : '',
    req.jobTitle   ? `Job Title: ${req.jobTitle}`             : '',
    req.industry   ? `Industry: ${req.industry}`              : '',
    req.employeeCount ? `Employee Count: ${req.employeeCount}` : '',
    `Inquiry type: ${req.inquiry}`,
    '',
    `Customer message: ${req.message}`,
  ].filter(l => l !== '');

  if (req.intake) {
    const i = req.intake;
    lines.push('', '--- Sourcing Parameters ---');

    if (req.inquiry === 'Autonomous solutions') {
      if (i.environmentType) lines.push(`Environment: ${i.environmentType}`);
      if (i.systemCategory) lines.push(`System category: ${i.systemCategory}`);
      if (i.payloadDescription) lines.push(`Payload: ${i.payloadDescription}`);
      if (i.terrainSurface) lines.push(`Terrain: ${i.terrainSurface}`);
      if (i.deploymentScale) lines.push(`Scale: ${i.deploymentScale}`);
      if (i.integrationNeeds?.length) lines.push(`Integrations: ${i.integrationNeeds.join(', ')}`);
    } else if (req.inquiry === 'Software solutions') {
      if (i.projectType) lines.push(`Project type: ${i.projectType}`);
      if (i.techStack) lines.push(`Tech stack: ${i.techStack}`);
    } else if (req.inquiry === 'Media solutions') {
      if (i.contentType) lines.push(`Content type: ${i.contentType}`);
      if (i.deliverables) lines.push(`Deliverables: ${i.deliverables}`);
      if (i.styleReferences) lines.push(`Style references: ${i.styleReferences}`);
    }

    if (i.budgetRange) lines.push(`Budget: ${i.budgetRange}`);
    if (i.timeline) lines.push(`Timeline: ${i.timeline}`);
  }

  // Inject vendor intelligence — focus on autonomous/humanoid for robot inquiries
  const vendorCategory: Vendor['category'] | undefined =
    req.inquiry === 'Autonomous solutions' ? undefined : undefined; // full list for now
  lines.push('', buildVendorContext(vendorCategory));

  const callbackUrl = process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/nimbus/callback`
    : 'https://deeptechnologies.dev/api/nimbus/callback';
  const callbackSecret = process.env.NIMBUS_CALLBACK_SECRET ?? '';

  lines.push(
    '',
    '--- Requisition Instructions ---',
    `1. Match the customer's request to the best vendor(s) from the Verified Vendor Intelligence above.`,
    `   - buy_path=direct_online  → Place order at the orderUrl directly. No email needed.`,
    `   - buy_path=email_required → Draft an outbound email to the vendor's sales contact.`,
    `   - buy_path=dealer_only    → Identify the nearest authorized dealer and initiate contact.`,
    `   - buy_path=raas_only      → Prepare a RaaS fleet proposal (monthly billing).`,
    `   - buy_path=b2b_partner    → Prepare a partnership/API agreement outreach.`,
    `   - buy_path=not_available  → Note that direct procurement is not possible; suggest alternatives.`,
    `2. Do NOT re-search vendor contacts or pricing — use ONLY the data above.`,
    `3. Apply a 15% markup to all vendorCost values for the client quote (markup field = 0.15).`,
    `4. POST the final sourcing result as JSON to: ${callbackUrl}`,
    `   Header: Authorization: Bearer ${callbackSecret}`,
    `   Body (JSON):`,
    `   {`,
    `     "requestId": "${sessionId}",`,
    `     "customerName": "${req.name}",`,
    `     "customerEmail": "${req.email}",`,
    `     "inquiryType": "${req.inquiry}",`,
    `     "summary": "<one-sentence description of recommended solution>",`,
    `     "lineItems": [`,
    `       {`,
    `         "description": "<product name and model>",`,
    `         "vendor": "<vendor name>",`,
    `         "vendorUrl": "<order or contact URL>",`,
    `         "vendorCost": <number in USD, no markup>,`,
    `         "markup": 0.15,`,
    `         "billingCycle": "one_time" | "monthly"`,
    `       }`,
    `     ],`,
    `     "notes": "<requisition steps: e.g. order placed at shop.unitree.com OR email drafted to sales@bostondynamics.com>"`,
    `   }`,
    `5. The callback creates a draft quote for admin review — do NOT email the quote to the customer.`,
    `6. If a deposit-only product is recommended, note the deposit amount and estimated ship date in notes.`,
  );

  return lines.join('\n');
}

/**
 * Check if Nimbus stub mode is enabled.
 * Set NIMBUS_STUB=1 in .env.local to skip the real CLI call and log the prompt instead.
 */
const NIMBUS_STUB = process.env.NIMBUS_STUB === '1';

/**
 * Forward a sourcing request to Nimbus via the clawdbot CLI.
 * Fire-and-forget — logs result but does not block the caller.
 *
 * When NIMBUS_STUB=1, logs the full prompt without calling the CLI
 * (useful when the Anthropic API key is unavailable).
 */
export function forwardToNimbus(req: SourcingRequest): string {
  const requestId = randomUUID().slice(0, 8);
  const sessionId = `sourcing-${requestId}`;
  const prompt = buildSourcingPrompt(req, sessionId);

  console.log(`[nimbus] Forwarding sourcing request ${requestId} to Nimbus…`);
  console.log(`[nimbus] Session: ${sessionId}`);

  if (NIMBUS_STUB) {
    console.log(`[nimbus] STUB MODE — Nimbus CLI not called. Prompt logged below:`);
    console.log(`[nimbus] ---\n${prompt}\n[nimbus] ---`);
    return requestId;
  }

  console.log(`[nimbus] Callback URL: ${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://deeptechnologies.dev'}/api/nimbus/callback`);

  /* Use spawn with args array — bypasses shell escaping and ARG_MAX limits entirely */
  const args = ['clawdbot', 'agent', '--message', prompt, '--local', '--session-id', sessionId];
  const child = spawn('pnpm', args, { cwd: NIMBUS_DIR, timeout: 300_000 });

  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (chunk: Buffer) => { stdout += chunk.toString(); });
  child.stderr.on('data', (chunk: Buffer) => { stderr += chunk.toString(); });

  /* Fire-and-forget — log full output on exit */
  child.on('close', (code) => {
    if (code !== 0) {
      console.error(`[nimbus] Sourcing ${requestId} failed (exit ${code})`);
      if (stderr) console.error(`[nimbus] stderr:`, stderr.slice(0, 2000));
    } else {
      console.log(`[nimbus] Sourcing ${requestId} completed (exit 0).`);
    }
    if (stdout) {
      // Skip the pnpm echo of the full command (everything before the first blank line
      // after "> node scripts/run-node.mjs") to surface the actual AI response
      const markerIdx = stdout.indexOf('\n\n', stdout.indexOf('> node scripts/run-node.mjs'));
      const aiOutput = markerIdx > -1 ? stdout.slice(markerIdx).trimStart() : stdout;
      console.log(`[nimbus] Clawdbot output:\n${aiOutput.slice(0, 20000)}`);
    }
  });

  child.on('error', (err) => {
    console.error(`[nimbus] Failed to spawn Clawdbot:`, err.message);
  });

  return requestId;
}

