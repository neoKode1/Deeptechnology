#!/usr/bin/env node
// Nimbus Smoke Test — Step 1: Contact Form → Nimbus → Callback → Redis
// Run: node smoke-test.mjs

const BASE = 'http://localhost:3000';

const payload = {
  firstName: 'Alex',
  lastName: 'Rivera',
  email: 'alex.rivera@testcorp.com',
  phone: '415-555-0192',
  company: 'TestCorp Logistics',
  jobTitle: 'VP of Operations',
  country: 'United States',
  industry: 'Logistics and Delivery',
  employeeCount: '51-200',
  inquiry: 'Autonomous solutions',
  message: 'We run a last-mile delivery operation in San Francisco and are evaluating sidewalk delivery robots for a pilot. Looking for 2-3 units to start, ideally on a monthly lease arrangement.',
  intake: {
    environmentType: 'Outdoor urban sidewalk',
    systemCategory: 'Sidewalk delivery robot',
    payloadDescription: 'Food and small parcel delivery under 20 lbs',
    terrainSurface: 'Paved sidewalk, curb cuts',
    deploymentScale: '2-5 units',
    integrationNeeds: ['GPS tracking', 'API integration with dispatch system'],
    budgetRange: '$10,000-$25,000',
    timeline: '1-3 months',
  },
};

console.log('\n=== STEP 1: Submitting contact form ===');
console.log(`POST ${BASE}/api/contact`);

try {
  const res = await fetch(`${BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log(`Status: ${res.status}`);
  console.log('Response:', JSON.stringify(data, null, 2));

  if (res.ok && data.success) {
    console.log('\n✅ STEP 1 PASSED — Contact form accepted. Nimbus is running in background.');
    console.log('   Watch the dev server logs for:');
    console.log('   [nimbus] Forwarding sourcing request...');
    console.log('   [nimbus] Sourcing completed.');
    console.log('   [nimbus/callback] Draft quote created: quote-XXXXXXXX');
    console.log('\n   Then run: node smoke-test.mjs --list-quotes');
  } else {
    console.log('\n❌ STEP 1 FAILED — Response indicates error.');
  }
} catch (err) {
  console.error('\n❌ STEP 1 ERROR:', err.message);
}

// If --list-quotes flag, poll admin quotes API
if (process.argv.includes('--list-quotes')) {
  console.log('\n=== STEP 3: Checking admin quotes (Redis) ===');
  try {
    // Hit the quotes API directly
    const res = await fetch(`${BASE}/api/quotes`);
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    if (data.quotes?.length) {
      const latest = data.quotes[0];
      console.log(`\n✅ Latest quote found:`);
      console.log(`   ID:       ${latest.id}`);
      console.log(`   Status:   ${latest.status}`);
      console.log(`   Customer: ${latest.customerName} <${latest.customerEmail}>`);
      console.log(`   Summary:  ${latest.summary}`);
      console.log(`   Total:    $${latest.total}`);
      console.log(`   Items:    ${latest.lineItems?.length ?? 0} line item(s)`);
    } else {
      console.log('No quotes found yet — Nimbus may still be processing. Try again in 30s.');
    }
  } catch (err) {
    console.error('❌ Quote list error:', err.message);
  }
}
