const BASE = 'http://localhost:3001';

// ── Step 1: Submit pilot form ─────────────────────────────────────────────────
console.log('\n=== STEP 1: Submit pilot request form ===');
const pilotRes = await fetch(`${BASE}/api/pilot-request`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    companyName:  'Test Warehouse Co',
    contactName:  'Jane Smith',
    email:        'jane@testwarehouse.com',
    phone:        '+1 415 000 0000',
    environment:  'Warehouse / Distribution',
    robotType:    'Warehouse AMR',
    fleetSize:    '1',
    timeline:     '1–3 months',
    useCase:      'Picking and packing — 20 workers, want to cut travel time by 60%',
  }),
});
const pilotData = await pilotRes.json();
console.log('Status:', pilotRes.status);
console.log('Response:', JSON.stringify(pilotData, null, 2));

if (!pilotData.quoteId) {
  console.error('❌ No quoteId returned — pipeline broken at form submission');
  process.exit(1);
}

const quoteId = pilotData.quoteId;
console.log(`\n✅ Quote created: ${quoteId}`);

// ── Step 2: Check the quote exists in the system ──────────────────────────────
console.log('\n=== STEP 2: Verify quote in system (admin fetch) ===');
const ADMIN_SECRET = '133ad368a78ad23d8240c0d6effecced14f6a68d80cabe3132ee7de3d3ad4da1';
const ADMIN_HEADERS = { 'Authorization': `Bearer ${ADMIN_SECRET}`, 'Content-Type': 'application/json' };
const quoteRes = await fetch(`${BASE}/api/quotes/${quoteId}`, {
  headers: { 'Authorization': `Bearer ${ADMIN_SECRET}` },
});
const quoteData = await quoteRes.json();
const q = quoteData.quote ?? quoteData;
console.log('Status:', quoteRes.status);
console.log('Quote status:', q.status);
console.log('Total:', q.total);
console.log('Customer:', q.customerName);
console.log('Summary:', q.summary);

if (quoteRes.status !== 200) {
  console.error('❌ Could not fetch quote from admin API');
  process.exit(1);
}
console.log('\n✅ Quote is in the system and fetchable by admin');

// ── Step 3: Send the quote (admin action) ─────────────────────────────────────
console.log('\n=== STEP 3: Admin sends quote to customer (PATCH status → sent) ===');
const sendRes = await fetch(`${BASE}/api/quotes/${quoteId}`, {
  method: 'PATCH',
  headers: ADMIN_HEADERS,
  body: JSON.stringify({ status: 'sent' }),
});
const sendData = await sendRes.json();
console.log('Status:', sendRes.status);
console.log('Response:', JSON.stringify(sendData, null, 2));

if (sendRes.status === 200) {
  console.log('\n✅ Quote sent — customer would receive payment link email');
} else {
  console.log('\n⚠️  Send failed (email may not work in local env — check output above)');
}

// ── Step 4: Create Stripe checkout session ────────────────────────────────────
console.log('\n=== STEP 4: Create Stripe checkout session ===');
const checkoutRes = await fetch(`${BASE}/api/checkout`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ quoteId }),
});
const checkoutData = await checkoutRes.json();
console.log('Status:', checkoutRes.status);
if (checkoutData.url) {
  console.log('\n✅ Stripe checkout URL generated:');
  console.log(checkoutData.url);
  console.log('\nPay with test card: 4242 4242 4242 4242 | Any future date | Any CVC');
} else {
  console.log('Response:', JSON.stringify(checkoutData, null, 2));
  console.error('❌ No checkout URL returned');
}
