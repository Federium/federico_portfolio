/**
 * Netlify Webhook Handler per Prismic
 * Questo file gestisce i webhook di Prismic per triggerare deploy automatici su Netlify
 */

const https = require('https');

// Configurazione Netlify Build Hook
const NETLIFY_BUILD_HOOK_URL = process.env.NETLIFY_BUILD_HOOK_URL;
const PRISMIC_WEBHOOK_SECRET = process.env.PRISMIC_WEBHOOK_SECRET;

/**
 * Funzione per triggerare il build su Netlify
 */
function triggerNetlifyBuild() {
  return new Promise((resolve, reject) => {
    const url = new URL(NETLIFY_BUILD_HOOK_URL);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('✅ Netlify build triggered successfully');
          resolve({ success: true, data });
        } else {
          console.error('❌ Failed to trigger Netlify build:', res.statusCode, data);
          reject(new Error(`Build trigger failed: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Error triggering Netlify build:', error);
      reject(error);
    });

    // Invia payload vuoto per triggerare il build
    req.write(JSON.stringify({}));
    req.end();
  });
}

/**
 * Verifica la firma del webhook Prismic (opzionale ma raccomandato per sicurezza)
 */
function verifyPrismicWebhook(signature, payload) {
  if (!PRISMIC_WEBHOOK_SECRET) {
    console.warn('⚠️  PRISMIC_WEBHOOK_SECRET not configured, skipping verification');
    return true;
  }
  
  const crypto = require('crypto');
  const computedSignature = crypto
    .createHmac('sha256', PRISMIC_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
    
  return signature === computedSignature;
}

/**
 * Handler principale per i webhook Prismic
 */
async function handlePrismicWebhook(event, context) {
  try {
    console.log('🔔 Prismic webhook received');
    
    // Verifica che sia un POST request
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // Parse del body
    const payload = event.body;
    let webhookData;
    
    try {
      webhookData = JSON.parse(payload);
    } catch (parseError) {
      console.error('❌ Invalid JSON payload:', parseError);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON payload' })
      };
    }

    // Verifica signature (se configurata)
    const signature = event.headers['x-prismic-signature'];
    if (!verifyPrismicWebhook(signature, payload)) {
      console.error('❌ Invalid webhook signature');
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Invalid signature' })
      };
    }

    // Log degli eventi Prismic
    console.log('📝 Prismic event type:', webhookData.type);
    console.log('🔗 Prismic repository:', webhookData.domain);
    
    if (webhookData.documents && webhookData.documents.length > 0) {
      console.log('📄 Documents affected:', webhookData.documents.length);
      webhookData.documents.forEach(doc => {
        console.log(`  - ${doc.type}: ${doc.id} (${doc.lang})`);
      });
    }

    // Eventi che dovrebbero triggerare un rebuild
    const rebuildEvents = [
      'api-update',           // Documento pubblicato/aggiornato
      'api-delete',           // Documento eliminato
      'api-unpublish',        // Documento non pubblicato
      'test-trigger'          // Test manuale
    ];

    if (rebuildEvents.includes(webhookData.type)) {
      console.log('🚀 Triggering Netlify rebuild...');
      
      // Triggera il build su Netlify
      await triggerNetlifyBuild();
      
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: 'Build triggered successfully',
          event: webhookData.type,
          timestamp: new Date().toISOString()
        })
      };
    } else {
      console.log('ℹ️  Event does not require rebuild:', webhookData.type);
      
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: 'Event received but no build triggered',
          event: webhookData.type
        })
      };
    }

  } catch (error) {
    console.error('❌ Error handling Prismic webhook:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
}

// Export per Netlify Functions
exports.handler = handlePrismicWebhook;

// Export per uso locale/testing
module.exports = {
  handlePrismicWebhook,
  triggerNetlifyBuild,
  verifyPrismicWebhook
};