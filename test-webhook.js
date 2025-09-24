#!/usr/bin/env node

/**
 * Script per testare il webhook Prismic → Netlify
 * 
 * Uso:
 * node test-webhook.js [URL_BASE]
 * 
 * Esempi:
 * node test-webhook.js http://localhost:3000
 * node test-webhook.js https://your-site.netlify.app
 */

const https = require('https');
const http = require('http');
const url = require('url');

const baseUrl = process.argv[2] || 'http://localhost:3000';
const webhookUrl = `${baseUrl}/api/webhook/netlify`;

console.log(`🧪 Testing webhook endpoint: ${webhookUrl}`);

// Test data simulating a Prismic webhook payload
const testPayload = {
  type: 'api-update',
  domain: 'your-repo.prismic.io',
  apiUrl: 'https://your-repo.prismic.io/api/v2',
  releases: {
    addition: [],
    update: [],
    deletion: []
  },
  documents: [
    {
      id: 'test-document-id',
      uid: 'test-page',
      type: 'page',
      lang: 'en-us',
      tags: [],
      first_publication_date: new Date().toISOString(),
      last_publication_date: new Date().toISOString()
    }
  ]
};

const postData = JSON.stringify(testPayload);
const parsedUrl = url.parse(webhookUrl);

const options = {
  hostname: parsedUrl.hostname,
  port: parsedUrl.port,
  path: parsedUrl.path,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'User-Agent': 'Prismic-Webhook-Test/1.0'
  }
};

// Add webhook secret if available
const secret = process.env.PRISMIC_WEBHOOK_SECRET;
if (secret) {
  options.headers['prismic-webhook-secret'] = secret;
  console.log('🔐 Using webhook secret for authentication');
}

const protocol = parsedUrl.protocol === 'https:' ? https : http;

console.log('\n📤 Sending test webhook...');
console.log('Payload:', JSON.stringify(testPayload, null, 2));

const req = protocol.request(options, (res) => {
  let data = '';

  console.log(`\n📨 Response Status: ${res.statusCode}`);
  console.log('Response Headers:', res.headers);

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('\n📥 Response Body:');
      console.log(JSON.stringify(response, null, 2));

      if (res.statusCode === 200) {
        console.log('\n✅ Webhook test completed successfully!');
        if (response.netlifyTriggered) {
          console.log('🚀 Netlify build was triggered');
        } else {
          console.log('ℹ️ Netlify build was not triggered (check NETLIFY_BUILD_HOOK_URL)');
        }
      } else {
        console.log('\n❌ Webhook test failed');
        console.log(`Status: ${res.statusCode}`);
        console.log('Response:', response);
        process.exit(1);
      }
    } catch (error) {
      console.error('\n❌ Failed to parse response JSON:');
      console.error('Raw response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ Request failed:', error.message);
  
  if (error.code === 'ECONNREFUSED') {
    console.log('\nTips:');
    console.log('• Make sure your development server is running (npm run dev)');
    console.log('• Check that the URL is correct');
  }
  
  process.exit(1);
});

req.write(postData);
req.end();

// Also test GET endpoint
setTimeout(() => {
  console.log('\n🔍 Testing GET endpoint...');
  
  const getOptions = {
    ...options,
    method: 'GET',
    headers: {
      'User-Agent': 'Prismic-Webhook-Test/1.0'
    }
  };

  const getReq = protocol.request(getOptions, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log(`GET Response (${res.statusCode}):`, response);
        
        if (res.statusCode === 200) {
          console.log('✅ GET endpoint is working');
        }
      } catch (error) {
        console.log('GET Response (raw):', data);
      }
    });
  });

  getReq.on('error', (error) => {
    console.error('GET request failed:', error.message);
  });

  getReq.end();
}, 1000);