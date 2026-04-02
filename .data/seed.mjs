import fs from 'fs';
import http from 'http';

function postQuote(file) {
  return new Promise((resolve, reject) => {
    const data = fs.readFileSync(file, 'utf-8');
    const req = http.request('http://localhost:3000/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => {
        console.log(`[${file}] ${res.statusCode}: ${body}`);
        resolve(body);
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

await postQuote('.data/seed-quote-1.json');
await postQuote('.data/seed-quote-2.json');
console.log('Done seeding quotes.');

