// Quick script to check HTTP headers
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/',
  method: 'HEAD'
};

const req = http.request(options, (res) => {
  console.log('\n✅ HTTP Headers from localhost:3001:\n');

  const coopHeader = res.headers['cross-origin-opener-policy'];
  const corpHeader = res.headers['cross-origin-resource-policy'];
  const cspHeader = res.headers['content-security-policy'];

  if (coopHeader) {
    console.log(`✓ Cross-Origin-Opener-Policy: ${coopHeader}`);
  } else {
    console.log('✗ Cross-Origin-Opener-Policy: NOT SET');
  }

  if (corpHeader) {
    console.log(`✓ Cross-Origin-Resource-Policy: ${corpHeader}`);
  } else {
    console.log('✗ Cross-Origin-Resource-Policy: NOT SET');
  }

  if (cspHeader) {
    console.log(`✓ Content-Security-Policy: ${cspHeader.substring(0, 100)}...`);
  } else {
    console.log('✗ Content-Security-Policy: NOT SET');
  }

  console.log('\n');
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
