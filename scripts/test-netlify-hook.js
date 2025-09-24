#!/usr/bin/env node

/**
 * Script per testare il Build Hook di Netlify
 * 
 * Uso:
 * npm run test:netlify-hook [BUILD_HOOK_URL]
 * 
 * oppure:
 * node scripts/test-netlify-hook.js https://api.netlify.com/build_hooks/your_id
 */

const https = require('https');

// Parsing argomenti
const [,, buildHookUrl] = process.argv;

if (!buildHookUrl) {
  console.log('❌ Errore: Build Hook URL mancante');
  console.log('');
  console.log('Uso:');
  console.log('  node scripts/test-netlify-hook.js https://api.netlify.com/build_hooks/your_id');
  console.log('');
  console.log('Come ottenere il Build Hook URL:');
  console.log('1. Vai su Netlify Dashboard → Site Settings');
  console.log('2. Build & Deploy → Build hooks');
  console.log('3. Add build hook → Copia l\'URL');
  process.exit(1);
}

console.log('🚀 Test del Build Hook di Netlify\n');
console.log('📍 URL:', buildHookUrl);
console.log('\n⏳ Triggering build...\n');

// Parsing dell'URL
const url = new URL(buildHookUrl);

// Configurazione della richiesta POST
const options = {
  hostname: url.hostname,
  port: 443,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Prismic-Netlify-Test/1.0'
  }
};

// Esecuzione della richiesta
const req = https.request(options, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);
  console.log();

  let responseBody = '';
  
  res.on('data', (chunk) => {
    responseBody += chunk;
  });

  res.on('end', () => {
    console.log('📄 Response Body:');
    
    if (responseBody) {
      try {
        const parsedResponse = JSON.parse(responseBody);
        console.log(JSON.stringify(parsedResponse, null, 2));
      } catch {
        console.log(responseBody);
      }
    } else {
      console.log('(vuoto)');
    }
    
    // Analisi del risultato
    if (res.statusCode === 200) {
      console.log('\n✅ Build Hook TRIGGERATO con successo!');
      console.log('🔄 Il deploy dovrebbe iniziare tra pochi secondi');
      console.log('📱 Controlla su Netlify Dashboard → Deploys');
    } else if (res.statusCode === 404) {
      console.log('\n❌ Build Hook NON TROVATO');
      console.log('💡 Verifica che l\'URL del Build Hook sia corretto');
      console.log('   Formato: https://api.netlify.com/build_hooks/[ID]');
    } else {
      console.log(`\n❌ Errore: Status code ${res.statusCode}`);
    }
    
    console.log('\n🏁 Test completato');
  });
});

req.on('error', (error) => {
  console.error('💥 Errore nella richiesta:', error.message);
  console.log('\n❌ Test FALLITO');
  
  if (error.code === 'ENOTFOUND') {
    console.log('💡 Suggerimento: Verifica che l\'URL sia corretto');
    console.log('   Deve iniziare con: https://api.netlify.com/build_hooks/');
  }
});

// Payload vuoto per Netlify (opzionale)
const payload = JSON.stringify({
  trigger: 'Prismic content update test'
});

req.write(payload);
req.end();

// Timer di timeout
setTimeout(() => {
  console.log('\n⏰ Timeout: La richiesta sta impiegando troppo tempo');
  process.exit(1);
}, 10000); // 10 secondi