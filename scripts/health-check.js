const http = require('http');
const https = require('https');

console.log('🏥 Dental Practice Manager Health Check\n');

const checks = [
  {
    name: 'Backend Server',
    url: 'http://localhost:5000/api/health',
    expectedStatus: 200
  },
  {
    name: 'Frontend Server',
    url: 'http://localhost:5173',
    expectedStatus: 200
  },
  {
    name: 'MongoDB Connection',
    url: 'http://localhost:5000/api/health/db',
    expectedStatus: 200
  }
];

async function checkService(check) {
  return new Promise((resolve) => {
    const url = new URL(check.url);
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.request(url, { timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const success = res.statusCode === check.expectedStatus;
        resolve({
          name: check.name,
          success,
          statusCode: res.statusCode,
          data: data
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        name: check.name,
        success: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        name: check.name,
        success: false,
        error: 'Timeout'
      });
    });

    req.end();
  });
}

async function runHealthCheck() {
  const results = [];
  
  for (const check of checks) {
    console.log(`🔍 Checking ${check.name}...`);
    const result = await checkService(check);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ ${check.name}: OK (${result.statusCode})`);
    } else {
      console.log(`❌ ${check.name}: FAILED - ${result.error || `Status ${result.statusCode}`}`);
    }
  }

  console.log('\n📊 Health Check Summary:');
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
  });

  console.log(`\n${passed}/${total} services are healthy`);
  
  if (passed === total) {
    console.log('🎉 All systems operational!');
    process.exit(0);
  } else {
    console.log('⚠️  Some services are not responding. Please check the logs.');
    process.exit(1);
  }
}

runHealthCheck().catch(err => {
  console.error('❌ Health check failed:', err);
  process.exit(1);
}); 