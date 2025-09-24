#!/usr/bin/env node

/**
 * Script per testare l'endpoint webhook di revalidation
 * 
 * Uso:
 * npm run test:webhook
 * 
 * oppure:
 * node scripts/test-webhook.js [URL] [SECRET]
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Funzione per leggere la secret key dal file .env.local
function getSecretFromEnvFile() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/^PRISMIC_REVALIDATE_SECRET\s*=\s*(.+)$/m);
      if (match && match[1]) {
        return match[1].trim().replace(/^["']|["']$/g, ''); // Rimuove eventuali quotes
      }
    }
  } catch (error) {
    console.log('⚠️  Non riesco a leggere .env.local:', error.message);
  }
  return null;
}

// Configurazione
const DEFAULT_URL = 'http://localhost:3000/api/revalidate';
const SECRET_FROM_FILE = getSecretFromEnvFile();
const DEFAULT_SECRET = SECRET_FROM_FILE || process.env.PRISMIC_REVALIDATE_SECRET || 'test-secret';

// Parsing argomenti
const [,, customUrl, customSecret] = process.argv;
const webhookUrl = customUrl || DEFAULT_URL;
const secret = customSecret || DEFAULT_SECRET;

// Payload di test che simula un webhook Prismic reale
const testPayload = {
  secret: secret,
  type: 'api-update',
  masterRef: {
    ref: 'YXExaRIAACEA4TQx~master-ref'
  },
  releases: [
    {
      id: 'YXExaRIAACEA4TQx',
      ref: 'YXExaRIAACEA4TQx~release-ref'
    }
  ],
  documents: [
    {
      id: 'YXExaRIAACEA4TQy',
      uid: 'home',
      type: 'page'
    },
    {
      id: 'YXExaRIAACEA4TQz',
      uid: 'about',
      type: 'page'
    }
  ]
};

console.log('🧪 Test del webhook di revalidation\n');
console.log('📍 URL:', webhookUrl);
console.log('🔑 Secret:', secret.replace(/./g, '*'));
if (SECRET_FROM_FILE) {
  console.log('✅ Secret letta da .env.local');
} else if (process.env.PRISMIC_REVALIDATE_SECRET) {
  console.log('✅ Secret letta da environment variable');
} else {
  console.log('⚠️  Usando secret di default (potrebbe non funzionare)');
}
console.log('📦 Payload:', JSON.stringify(testPayload, null, 2));
console.log('\n⏳ Invio richiesta...\n');

// Determina se usare HTTP o HTTPS
const isHttps = webhookUrl.startsWith('https://');
const httpModule = isHttps ? https : http;

// Parsing dell'URL
const url = new URL(webhookUrl);

// Configurazione della richiesta
const options = {
  hostname: url.hostname,
  port: url.port || (isHttps ? 443 : 80),
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Prismic-Webhook-Test/1.0'
  }
};

// Esecuzione della richiesta
const req = httpModule.request(options, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);
  console.log();

  let responseBody = '';
  
  res.on('data', (chunk) => {
    responseBody += chunk;
  });

  res.on('end', () => {
    console.log('📄 Response Body:');
    
    try {
      const parsedResponse = JSON.parse(responseBody);
      console.log(JSON.stringify(parsedResponse, null, 2));
      
      // Analisi del risultato
      if (res.statusCode === 200) {
        console.log('\n✅ Test SUPERATO!');
        if (parsedResponse.revalidatedPaths) {
          console.log(`🔄 Paths revalidati: ${parsedResponse.totalPaths}`);
          parsedResponse.revalidatedPaths.forEach(path => {
            const status = path.status === 'success' ? '✅' : '❌';
            console.log(`   ${status} ${path.path}`);
          });
        }
      } else if (res.statusCode === 401) {
        console.log('\n❌ Test FALLITO: Secret key non valida');
        console.log('💡 Verifica che PRISMIC_REVALIDATE_SECRET sia configurata correttamente');
      } else {
        console.log(`\n❌ Test FALLITO: Status code ${res.statusCode}`);
      }
      
    } catch (error) {
      console.log(responseBody);
      console.log('\n⚠️ Risposta non JSON valida');
    }
    
    console.log('\n🏁 Test completato');
  });
});

req.on('error', (error) => {
  console.error('💥 Errore nella richiesta:', error.message);
  console.log('\n❌ Test FALLITO');
  
  if (error.code === 'ECONNREFUSED') {
    console.log('💡 Suggerimento: Assicurati che il server Next.js sia in esecuzione');
    console.log('   Esegui: npm run dev');
  } else if (error.code === 'ENOTFOUND') {
    console.log('💡 Suggerimento: Verifica che l\'URL sia corretto');
  }
});

// Invio del payload
req.write(JSON.stringify(testPayload));
req.end();

// Timer di timeout
setTimeout(() => {
  console.log('\n⏰ Timeout: La richiesta sta impiegando troppo tempo');
  process.exit(1);
}, 10000); // 10 secondi