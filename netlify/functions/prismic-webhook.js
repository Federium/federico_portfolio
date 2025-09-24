/**
 * Netlify Function per gestire i webhook di Prismic
 * Versione semplificata senza dipendenze esterne
 */

exports.handler = async (event, context) => {
  // Verifica che sia un POST request
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('🔔 Prismic webhook received');
    
    // Parse del body
    const webhookData = JSON.parse(event.body || '{}');
    
    console.log('📝 Event type:', webhookData.type);
    console.log('🔗 Repository:', webhookData.domain);

    // Eventi che dovrebbero triggerare un rebuild
    const rebuildEvents = [
      'api-update',
      'api-delete', 
      'api-unpublish',
      'test-trigger'
    ];

    if (rebuildEvents.includes(webhookData.type)) {
      console.log('🚀 Event requires rebuild');
      
      // Se hai configurato NETLIFY_BUILD_HOOK_URL, triggera il build
      const buildHookUrl = process.env.NETLIFY_BUILD_HOOK_URL;
      
      if (buildHookUrl) {
        const response = await fetch(buildHookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        });
        
        if (response.ok) {
          console.log('✅ Build triggered successfully');
        } else {
          console.error('❌ Build trigger failed:', response.status);
        }
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: 'Webhook processed, build triggered',
          event: webhookData.type,
          timestamp: new Date().toISOString()
        })
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: 'Event received but no build triggered',
          event: webhookData.type
        })
      };
    }

  } catch (error) {
    console.error('❌ Error handling webhook:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};