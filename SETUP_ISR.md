# 📋 Setup ISR con Prismic e Netlify

Questa guida ti aiuterà a configurare ISR (Incremental Static Regeneration) con webhook Prismic e deploy su Netlify.

## 🔧 1. Configurazione Variabili d'Ambiente

### File `.env.local` (Sviluppo)
```bash
# Copia il file .env.local.example e rinominalo in .env.local
cp .env.local.example .env.local
```

Modifica il file con i tuoi valori:
```bash
PRISMIC_ACCESS_TOKEN=your_prismic_access_token_here
NEXT_PUBLIC_PRISMIC_ENVIRONMENT=your_repository_name
PRISMIC_REVALIDATE_SECRET=your_strong_webhook_secret_key_here
```

### Netlify Environment Variables (Produzione)
Nel dashboard di Netlify, vai in **Site Settings > Environment Variables** e aggiungi:

| Nome | Valore | Descrizione |
|------|--------|-------------|
| `PRISMIC_ACCESS_TOKEN` | Il tuo token API Prismic | Token per accedere all'API Prismic |
| `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` | Il nome del tuo repository | Nome del repository Prismic |
| `PRISMIC_REVALIDATE_SECRET` | Una chiave segreta robusta | Usata per validare i webhook (es: `myStrongSecret123!`) |

## 🚀 2. Deploy su Netlify

### Metodo 1: Git Integration (Consigliato)
1. Connetti il repository GitHub a Netlify
2. Netlify rileverà automaticamente il file `netlify.toml`
3. Le environment variables sono già configurare nel dashboard

### Metodo 2: Netlify CLI
```bash
# Installa Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

## 🎣 3. Configurazione Webhook Prismic

### Passo 1: Ottieni l'URL del tuo sito Netlify
Dopo il deploy, avrai un URL tipo: `https://amazing-site-123456.netlify.app`

### Passo 2: Crea il webhook in Prismic
1. Vai nel tuo **Prismic Dashboard**
2. Vai in **Settings > Webhooks**
3. Clicca **Create a webhook**

### Passo 3: Configura il webhook
```
Nome: "Netlify ISR Revalidation"
URL: https://your-netlify-site.netlify.app/api/revalidate
Triggers: ✅ A document is published
           ✅ A document is unpublished  
           ✅ A document is deleted
Custom Headers: (lascia vuoto)
```

### Passo 4: Configura il Payload (Body del webhook)
Nel campo **Custom Payload**, inserisci:

```json
{
  "secret": "your_strong_webhook_secret_key_here",
  "type": "{{ type }}",
  "masterRef": {
    "ref": "{{ masterRef }}"
  },
  "releases": [
    {{#releases}}
    {
      "id": "{{ id }}",
      "ref": "{{ ref }}"
    }{{#unless @last}},{{/unless}}
    {{/releases}}
  ],
  "documents": [
    {{#documents}}
    {
      "id": "{{ id }}",
      "uid": "{{ uid }}",
      "type": "{{ type }}"
    }{{#unless @last}},{{/unless}}
    {{/documents}}
  ]
}
```

> ⚠️ **IMPORTANTE**: Sostituisci `"your_strong_webhook_secret_key_here"` con lo stesso valore che hai messo in `PRISMIC_REVALIDATE_SECRET`

### Passo 5: Salva e testa
1. Clicca **Save**
2. Clicca **Test** per verificare che funzioni
3. Dovresti vedere un ✅ verde se tutto va bene

## 🔍 4. Test della Configurazione

### Test del Webhook
1. Vai in Prismic e modifica una pagina
2. Clicca **Publish**
3. Controlla i logs di Netlify in **Site Overview > Functions**
4. Dovresti vedere logs tipo:
   ```
   ✅ Webhook autenticato correttamente
   🏠 Programmata revalidation per homepage
   ✅ Revalidation completata per: /
   ```

### Test locale del webhook
```bash
# Testa l'endpoint localmente
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your_webhook_secret_key_here",
    "documents": [
      {
        "id": "test",
        "uid": "home",
        "type": "page"
      }
    ]
  }'
```

## 🛠️ 5. Architettura del Sistema

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Editor CMS    │    │   Prismic API    │    │   Netlify Site  │
│   (Prismic)     │────▶   (Webhook)     │────▶   (Next.js)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         │ 1. Pubblica contenuto  │ 2. Trigger webhook     │ 3. Revalida cache
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                            4. Utente vede 
                            contenuto aggiornato
```

## 📊 6. Monitoraggio e Debug

### Logs di Netlify
- Vai in **Site Overview > Functions**
- Clicca su `revalidate` per vedere i logs
- Cerca per 🎉, ✅, ❌ per identificare successi ed errori

### Logs di sviluppo locale
```bash
# Avvia in modalità sviluppo per vedere tutti i logs
npm run dev
```

### Verifica cache Next.js
```bash
# Controlla quale pagine sono cached
ls -la .next/cache/fetch-cache/
```

## 🚨 7. Troubleshooting

### Problema: "Secret key non valida"
- ✅ Verifica che `PRISMIC_REVALIDATE_SECRET` sia configurata su Netlify
- ✅ Verifica che il valore nel webhook payload corrisponda esattamente
- ✅ Non ci devono essere spazi extra o caratteri speciali

### Problema: "Endpoint non trovato"
- ✅ Verifica che l'URL del webhook sia: `https://your-site.netlify.app/api/revalidate`
- ✅ Controlla che il deploy sia andato a buon fine
- ✅ Controlla che il file `src/app/api/revalidate/route.ts` esista

### Problema: "Revalidation non funziona"
- ✅ Controlla i logs di Netlify per errori
- ✅ Verifica che le pagine abbiano `export const revalidate = 60`
- ✅ Prova a cancellare la cache di Next.js: `rm -rf .next`

### Problema: "Build fallisce"
- ✅ Verifica che tutte le dependencies siano installate
- ✅ Controlla che non ci siano errori TypeScript
- ✅ Verifica che `PRISMIC_ACCESS_TOKEN` sia configurato per il build

## 🎯 8. Ottimizzazioni Avanzate

### Cache personalizzato per tipo di documento
Nel file `src/app/api/revalidate/route.ts`, puoi aggiungere logica specifica:

```typescript
if (docType === 'product') {
  pathsToRevalidate.push(`/products/${uid}`);
  pathsToRevalidate.push('/products'); // Lista prodotti
}
if (docType === 'blog_post') {
  pathsToRevalidate.push(`/blog/${uid}`);
  pathsToRevalidate.push('/blog');
}
```

### Revalidation condizionale
```typescript
// Solo per documenti pubblicati
if (type === 'api-update' && documents.length > 0) {
  // Logica di revalidation
}
```

### Webhooks multipli
Puoi creare webhook diversi per ambienti diversi:
- **Staging**: `https://staging--your-site.netlify.app/api/revalidate`
- **Produzione**: `https://your-site.netlify.app/api/revalidate`

## ✅ 9. Checklist Finale

- [ ] Environment variables configurate su Netlify
- [ ] Webhook creato e configurato in Prismic
- [ ] Deploy completato con successo
- [ ] Test del webhook effettuato
- [ ] Logs verificati
- [ ] Cache di pagine testata
- [ ] Performance verificate

Una volta completati tutti questi passaggi, il tuo sito avrà:
- ⚡ **Performance ottimali** con pagine statiche
- 🔄 **Aggiornamenti immediati** quando publichi contenuto
- 🛡️ **Sicurezza** con validazione webhook
- 📊 **Monitoring** completo dei processi