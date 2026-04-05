const res = await fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'How can I order a robot?', sessionId: 'local-test-001' }),
});

console.log('HTTP STATUS:', res.status);
const data = await res.json();
console.log('RESPONSE:', JSON.stringify(data, null, 2));
