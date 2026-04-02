#!/usr/bin/env node
/**
 * Seed all existing .data/quotes/*.json into Upstash Redis.
 * Run: node scripts/seed-redis.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUOTES_DIR = path.resolve(__dirname, '..', '.data', 'quotes');

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!UPSTASH_URL || !UPSTASH_TOKEN) {
  console.error('Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN');
  process.exit(1);
}

async function redis(cmd) {
  const res = await fetch(`${UPSTASH_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cmd),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

const files = fs.readdirSync(QUOTES_DIR).filter(f => f.endsWith('.json'));
console.log(`Found ${files.length} quotes to seed.\n`);

let ok = 0;
let fail = 0;

for (const file of files) {
  const raw = fs.readFileSync(path.join(QUOTES_DIR, file), 'utf-8');
  const quote = JSON.parse(raw);
  const id = quote.id;

  if (!id) {
    console.log(`⚠ Skipping ${file} — no id field`);
    fail++;
    continue;
  }

  try {
    // SET quote:{id} <json>
    await redis(['SET', `quote:${id}`, raw]);
    // ZADD quotes:index <timestamp> <id>
    const ts = new Date(quote.createdAt).getTime() || Date.now();
    await redis(['ZADD', 'quotes:index', ts, id]);
    console.log(`✅ ${id} (${quote.summary?.slice(0, 50)}...)`);
    ok++;
  } catch (err) {
    console.error(`❌ ${id}: ${err.message}`);
    fail++;
  }
}

console.log(`\nDone: ${ok} seeded, ${fail} failed.`);

