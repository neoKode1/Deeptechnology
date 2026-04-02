import http from 'http';

const data = JSON.stringify({
  requestId: 'test-demo-001',
  customerName: 'Chad Neo',
  customerEmail: '1deeptechnology@gmail.com',
  inquiryType: 'Software solutions',
  summary: 'Custom AI-powered content management platform with automated video transcription and smart tagging',
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
  notes: 'Demo quote for testing the quote system'
});

const req = http.request('http://localhost:3000/api/quotes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
}, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    const parsed = JSON.parse(body);
    console.log('Status:', res.statusCode);
    console.log('Quote ID:', parsed.quote?.id);
    console.log('Total:', parsed.quote?.total);
    console.log('View at: http://localhost:3000/quote/' + parsed.quote?.id);
    console.log(JSON.stringify(parsed, null, 2));
  });
});
req.write(data);
req.end();

