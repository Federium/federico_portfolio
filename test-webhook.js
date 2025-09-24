/**
 * Script per testare il webhook Prismic localmente
 * Uso: node test-webhook.js
 */

const { handlePrismicWebhook } = require('./netlify-webhook.js');

// Mock event per testare il webhook
const mockEvent = {
  httpMethod: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-prismic-signature': 'test-signature'
  },
  body: JSON.stringify({
    type: 'test-trigger',
    domain: 'federico-portfolio.prismic.io',
    apiUrl: 'https://federico-portfolio.prismic.io/api/v2',
    secret: null,
    documents: [
      {
        id: 'test-doc-id',
        uid: 'test-page',
        type: 'page',
        href: 'https://federico-portfolio.prismic.io/api/v2/documents/search?ref=test&q=test',
        tags: [],
        first_publication_date: new Date().toISOString(),
        last_publication_date: new Date().toISOString(),
        slugs: ['test-page'],
        linked_documents: [],
        lang: 'it-it'
      }
    ]
  })
};

const mockContext = {};

console.log('🧪 Testing Prismic webhook handler...\n');

// Test del webhook
handlePrismicWebhook(mockEvent, mockContext)
  .then(response => {
    console.log('\n✅ Test completed successfully!');
    console.log('Response:', JSON.parse(response.body));
  })
  .catch(error => {
    console.error('\n❌ Test failed:', error);
  });

// Funzione per testare solo il trigger di build (senza webhook payload)
async function testBuildTrigger() {
  console.log('\n🚀 Testing direct build trigger...');
  
  try {
    const { triggerNetlifyBuild } = require('./netlify-webhook.js');
    await triggerNetlifyBuild();
    console.log('✅ Build trigger test successful!');
  } catch (error) {
    console.error('❌ Build trigger test failed:', error.message);
  }
}

// Uncomment per testare solo il trigger di build
// testBuildTrigger();