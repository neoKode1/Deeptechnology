#!/usr/bin/env node
/**
 * Apply db/schema.sql to the production Cloudflare D1 database via REST API.
 * Idempotent (every CREATE uses IF NOT EXISTS).
 *
 * Usage:
 *   CF_ACCOUNT_ID=... CF_D1_DATABASE_ID=... CF_D1_API_TOKEN=... \
 *     node scripts/d1-migrate.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ACCOUNT  = process.env.CF_ACCOUNT_ID;
const DB       = process.env.CF_D1_DATABASE_ID;
const TOKEN    = process.env.CF_D1_API_TOKEN;

if (!ACCOUNT || !DB || !TOKEN) {
  console.error('Missing CF_ACCOUNT_ID, CF_D1_DATABASE_ID, or CF_D1_API_TOKEN');
  process.exit(1);
}

const ENDPOINT = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/d1/database/${DB}/query`;

const sqlPath = path.resolve(process.cwd(), 'db/schema.sql');
const raw = fs.readFileSync(sqlPath, 'utf8');

// Strip line comments first, then split on statement-ending semicolons
const schema = raw
  .split('\n')
  .map((l) => l.replace(/--.*$/, ''))
  .join('\n');

const statements = schema
  .split(/;\s*$/m)
  .map((s) => s.trim())
  .filter(Boolean);

console.log(`Applying ${statements.length} statements to D1 (${DB})…\n`);

let ok = 0;
for (const sql of statements) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql }),
  });
  const data = await res.json();
  const label = sql.split('\n')[0].slice(0, 70);
  if (data.success) {
    console.log(`  ✓ ${label}`);
    ok++;
  } else {
    console.error(`  ✗ ${label}`);
    console.error('   ', JSON.stringify(data.errors));
    process.exit(1);
  }
}

console.log(`\nDone: ${ok}/${statements.length} statements applied.`);
