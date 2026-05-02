#!/usr/bin/env node
/**
 * Vendor URL validator.
 *
 * Scans src/data/vendors.ts for every https?:// link (contacts[].href +
 * products[].orderUrl) and runs a HEAD-then-GET check on each, following
 * redirects up to 5 hops. Reports broken / 4xx / 5xx / DNS / TLS errors so we
 * can patch the catalog before customers click into a 404.
 *
 * Usage:
 *   node scripts/check-vendor-urls.mjs
 *   node scripts/check-vendor-urls.mjs --json > url-report.json
 *
 * Exit code: 0 if all OK, 1 if any failed.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VENDORS_PATH = resolve(__dirname, '..', 'src', 'data', 'vendors.ts');
const CONCURRENCY = 10;
const TIMEOUT_MS = 12_000;
const UA = 'Mozilla/5.0 (compatible; DeeptechVendorAudit/1.0)';

const wantJson = process.argv.includes('--json');

// Pull every URL out of the vendors file along with the surrounding context
// (vendor id + label) for a useful report.
function extractUrls(src) {
  const out = [];
  const vendorIdRe = /^\s{2}\{\s*\n\s*id:\s*'([^']+)'/gm;
  const blocks = [];
  let m;
  while ((m = vendorIdRe.exec(src)) !== null) {
    blocks.push({ id: m[1], start: m.index });
  }
  blocks.push({ id: '__end__', start: src.length });
  for (let i = 0; i < blocks.length - 1; i++) {
    const id = blocks[i].id;
    const slab = src.slice(blocks[i].start, blocks[i + 1].start);
    const linkRe = /(label|orderUrl|href):\s*'(https?:\/\/[^']+)'/g;
    let lm;
    while ((lm = linkRe.exec(slab)) !== null) {
      // We only want href + orderUrl, but `label:` may include a quoted URL too — skip those.
      if (lm[1] === 'label') continue;
      out.push({ vendorId: id, field: lm[1], url: lm[2] });
    }
  }
  // Dedupe by URL, but keep the first vendor that referenced it.
  const seen = new Map();
  for (const r of out) if (!seen.has(r.url)) seen.set(r.url, r);
  return [...seen.values()];
}

async function check(url) {
  const ctl = AbortSignal.timeout(TIMEOUT_MS);
  const headers = { 'User-Agent': UA, Accept: 'text/html,*/*;q=0.8' };
  // Try HEAD first; many sites refuse it, so fall back to a ranged GET.
  for (const method of ['HEAD', 'GET']) {
    try {
      const res = await fetch(url, {
        method,
        redirect: 'follow',
        signal: ctl,
        headers: method === 'GET' ? { ...headers, Range: 'bytes=0-1023' } : headers,
      });
      if (res.status === 405 || res.status === 501) continue; // method not allowed → retry as GET
      return { ok: res.ok, status: res.status, finalUrl: res.url };
    } catch (e) {
      if (method === 'GET') return { ok: false, status: 0, error: e.code || e.name || String(e.message || e) };
    }
  }
  return { ok: false, status: 0, error: 'unreachable' };
}

async function pool(items, fn, n) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (true) {
      const idx = i++;
      if (idx >= items.length) return;
      out[idx] = { ...items[idx], result: await fn(items[idx]) };
      if (!wantJson) {
        const r = out[idx].result;
        const tag = r.ok ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';
        const status = r.status || r.error || '?';
        process.stdout.write(`${tag} [${out[idx].vendorId}] ${out[idx].url} → ${status}\n`);
      }
    }
  }));
  return out;
}

const src = readFileSync(VENDORS_PATH, 'utf8');
const links = extractUrls(src);
if (!wantJson) console.error(`Checking ${links.length} vendor URLs (${CONCURRENCY} parallel, ${TIMEOUT_MS}ms timeout)…\n`);

const results = await pool(links, ({ url }) => check(url), CONCURRENCY);
const broken = results.filter(r => !r.result.ok);
const redirected = results.filter(r => r.result.ok && r.result.finalUrl && r.result.finalUrl.replace(/\/$/, '') !== r.url.replace(/\/$/, ''));

if (wantJson) {
  process.stdout.write(JSON.stringify({ total: results.length, broken, redirected, all: results }, null, 2));
} else {
  console.error(`\n────────────  Summary  ────────────`);
  console.error(`Total checked : ${results.length}`);
  console.error(`OK            : ${results.length - broken.length}`);
  console.error(`Broken / err  : ${broken.length}`);
  console.error(`Redirected    : ${redirected.length} (final URL differs from listed)`);
  if (broken.length) {
    console.error(`\nBroken URLs:`);
    for (const b of broken) {
      const tag = b.result.error ? b.result.error : `HTTP ${b.result.status}`;
      console.error(`  [${b.vendorId}] ${b.field}=${b.url} → ${tag}`);
    }
  }
  if (redirected.length) {
    console.error(`\nRedirected URLs (consider updating to the final destination):`);
    for (const r of redirected) {
      console.error(`  [${r.vendorId}] ${r.url}`);
      console.error(`     → ${r.result.finalUrl}`);
    }
  }
}

process.exit(broken.length ? 1 : 0);
