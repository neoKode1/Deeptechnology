import { readFileSync } from 'fs';

// Read env vars from .env.local
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => l.split('=').map((p, i) => i === 0 ? p.trim() : l.slice(l.indexOf('=') + 1).trim()))
    .filter(([k]) => k)
);

const url = env.UPSTASH_REDIS_REST_URL;
const token = env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) { console.error('Missing Redis env vars'); process.exit(1); }

console.log('Checking Redis for quotes...\n');

// Get all quote IDs newest first
const idRes = await fetch(`${url}/zrange/quotes:index/0/-1/REV`, {
  headers: { Authorization: `Bearer ${token}` }
});
const { result: ids } = await idRes.json();

if (!ids || ids.length === 0) {
  console.log('NO QUOTES IN REDIS — callback did not fire or Nimbus is still running.');
  process.exit(0);
}

console.log(`Found ${ids.length} quote(s) in Redis. Showing latest:\n`);

const quoteRes = await fetch(`${url}/get/quote:${ids[0]}`, {
  headers: { Authorization: `Bearer ${token}` }
});
const { result: raw } = await quoteRes.json();
const q = JSON.parse(raw);

console.log('  ID:      ', q.id);
console.log('  Status:  ', q.status);
console.log('  Customer:', q.customerName, `<${q.customerEmail}>`);
console.log('  Inquiry: ', q.inquiryType);
console.log('  Summary: ', q.summary);
console.log('  Total:   ', `$${q.total}`);
console.log('  Created: ', q.createdAt);
console.log('  Expires: ', q.expiresAt);
console.log('  Items:   ', q.lineItems?.length ?? 0, 'line item(s)');

if (q.lineItems?.length) {
  q.lineItems.forEach((li, i) => {
    console.log(`\n  Item ${i + 1}:`);
    console.log('    Description:', li.description);
    console.log('    Vendor:     ', li.vendor);
    console.log('    Vendor cost:', `$${li.vendorCost}`);
    console.log('    Markup:     ', `${(li.markup * 100).toFixed(0)}%`);
    console.log('    Client price:', `$${li.clientPrice}`);
    console.log('    Billing:    ', li.billingCycle);
  });
}

console.log('\n--- All quote IDs ---');
ids.forEach((id, i) => console.log(`  ${i + 1}. ${id}`));
