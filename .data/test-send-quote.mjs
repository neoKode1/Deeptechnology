import http from 'http';

function post(url, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const req = http.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (res) => {
      let out = '';
      res.on('data', c => out += c);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(out) }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function patch(url, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const req = http.request(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (res) => {
      let out = '';
      res.on('data', c => out += c);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(out) }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function run() {
  // Step 1: Create a quote
  console.log('--- Step 1: Creating quote ---');
  const createRes = await post('http://localhost:3000/api/quotes', {
    requestId: 'email-test-001',
    customerName: 'Chad Neo',
    customerEmail: '1deeptechnology@gmail.com',
    inquiryType: 'Software solutions',
    summary: 'Custom AI-powered content management platform with automated video transcription, smart tagging, and analytics dashboard',
    lineItems: [
      {
        description: 'Full-stack web application (Next.js + Supabase) — 6 week build',
        vendor: 'Deep Tech Engineering',
        vendorCost: 18000,
        markup: 0.15,
        notes: 'Includes admin dashboard and API layer'
      },
      {
        description: 'AI transcription integration (Whisper API)',
        vendor: 'OpenAI',
        vendorUrl: 'https://openai.com',
        vendorCost: 1200,
        markup: 0.10
      },
      {
        description: 'Cloud infrastructure setup + 12-month hosting',
        vendor: 'Infrastructure',
        vendorCost: 2400,
        markup: 0.15
      }
    ],
    notes: 'Email delivery test'
  });

  const quoteId = createRes.data.quote.id;
  console.log('Created:', quoteId, '| Total:', createRes.data.quote.total);

  // Step 2: Mark as "sent" — this triggers the email
  console.log('\n--- Step 2: Marking as sent (triggers email) ---');
  const sendRes = await patch(`http://localhost:3000/api/quotes/${quoteId}`, {
    status: 'sent'
  });

  console.log('Status:', sendRes.data.quote.status);
  console.log('Email sent:', sendRes.data.emailSent);
  console.log('\nQuote URL: https://deeptech.varyai.link/quote/' + quoteId);
  console.log('Done!');
}

run().catch(console.error);

