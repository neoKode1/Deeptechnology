const SESSION = 'local-full-test-' + Date.now();

async function chat(message) {
  const res = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId: SESSION }),
  });
  const data = await res.json();
  console.log(`\n[${res.status}] USER: ${message}`);
  console.log(`NIMBUS: ${data.reply || JSON.stringify(data)}`);
  return res.status;
}

console.log('=== Nimbus Consulting Chat — Local Test ===');
console.log('Session:', SESSION);

await chat('How can I order a robot? What robots do you carry?');
await chat('We have a warehouse with 20 workers doing picking and packing. What would reduce our labor costs?');
await chat('What does the pilot cost and what happens after?');
await chat('Can you also help with software? We have a legacy inventory system we want to automate.');
