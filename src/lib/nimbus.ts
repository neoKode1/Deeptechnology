import { exec } from 'child_process';
import { randomUUID } from 'crypto';
import path from 'path';

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
  inquiry: string;
  message: string;
  intake?: IntakeFields;
}

/**
 * Build a structured prompt for Nimbus based on the contact form submission.
 * Nimbus receives this as a natural-language instruction with embedded parameters.
 */
function buildSourcingPrompt(req: SourcingRequest): string {
  const lines: string[] = [
    `NEW SOURCING REQUEST from ${req.name} <${req.email}>`,
    `Inquiry type: ${req.inquiry}`,
    '',
    `User message: ${req.message}`,
  ];

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

  lines.push(
    '',
    '--- Instructions ---',
    `1. Source solutions matching these parameters using web search and GitHub.`,
    `2. Compile a sourcing report with options, pricing, and vendor details.`,
    `3. Apply a 15% markup to all costs for the client quote.`,
    `4. Email the quote to ${req.email} and CC 1deeptechnology@gmail.com.`,
    `5. Include an "Accept Quote" link in the email (placeholder for now).`,
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
  const prompt = buildSourcingPrompt(req);

  console.log(`[nimbus] Forwarding sourcing request ${requestId} to Nimbus…`);
  console.log(`[nimbus] Session: ${sessionId}`);

  if (NIMBUS_STUB) {
    console.log(`[nimbus] STUB MODE — Nimbus CLI not called. Prompt logged below:`);
    console.log(`[nimbus] ---\n${prompt}\n[nimbus] ---`);
    return requestId;
  }

  /* Shell-escape the prompt by replacing single quotes */
  const escaped = prompt.replace(/'/g, "'\\''");

  const cmd = `pnpm clawdbot agent --message '${escaped}' --local --session-id ${sessionId}`;

  /* Fire-and-forget: exec in the nimbus directory, log output, don't await */
  exec(cmd, { cwd: NIMBUS_DIR, timeout: 300_000 }, (error, stdout, stderr) => {
    if (error) {
      console.error(`[nimbus] Sourcing ${requestId} failed:`, error.message);
      if (stderr) console.error(`[nimbus] stderr:`, stderr);
      return;
    }
    console.log(`[nimbus] Sourcing ${requestId} completed.`);
    if (stdout) console.log(`[nimbus] stdout:`, stdout.slice(0, 500));
  });

  return requestId;
}

