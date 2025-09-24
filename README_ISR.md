# 🚀 Next.js + Prismic + ISR con Webhook

Progetto Next.js con Prismic CMS, ISR (Incremental Static Regeneration) e webhook automatici per Netlify.

## 📁 Struttura del Progetto

```
src/
├── app/
│   ├── api/revalidate/route.ts     # 🎣 Endpoint webhook per ISR
│   ├── page.tsx                    # 🏠 Homepage con ISR
│   └── [uid]/page.tsx              # 📄 Pagine dinamiche con ISR
├── components/
│   └── ISRDebug.tsx               # 🔧 Componente debug per sviluppo
├── lib/
│   └── webhook-utils.ts           # 🛠️ Utilità per gestire webhook
└── prismicio.ts                   # 📡 Client Prismic e helper functions

scripts/
└── test-webhook.js                # 🧪 Script per testare webhook

netlify.toml                       # ⚙️ Configurazione Netlify
SETUP_ISR.md                      # 📋 Guida completa al setup
```

## ⚡ Features

### ✅ ISR (Incremental Static Regeneration)
- **Homepage** e **pagine dinamiche** con rivalidazione automatica ogni 60 secondi
- **Webhook di Prismic** per aggiornamenti immediati del contenuto
- **Cache intelligente** con Next.js App Router

### ✅ Sicurezza Webhook
- **Validazione secret key** per autenticare i webhook
- **Error handling** completo con logging dettagliato
- **Rate limiting** e validazione payload

### ✅ Performance Ottimizzata
- **Static Generation** al build time per tutte le pagine
- **Cache tags** per invalidazione granulare
- **Fetch ottimizzato** con helper functions centralizzate

### ✅ Developer Experience
- **TypeScript** completo con tipizzazione Prismic
- **Componente debug** per monitorare ISR in development
- **Script di test** per validare webhook localmente
- **Logging dettagliato** per debugging

## 🛠️ Helper Functions Prismic

### `getHomepage(config?)`
Recupera la homepage dal repository Prismic.

### `getPage(uid, config?)`
Recupera una pagina specifica tramite UID.

### `getAllPages(config?)`
Recupera tutte le pagine del repository.

### `getAllPageUIDs(config?)`
Recupera solo gli UID delle pagine (ottimizzato per `generateStaticParams`).

## 🎣 Webhook Prismic

L'endpoint `/api/revalidate` gestisce i webhook di Prismic:

1. **Autentica** la richiesta con secret key
2. **Analizza** i documenti modificati
3. **Revalida** selettivamente le pagine interessate
4. **Risponde** con dettagli sull'operazione

### Payload Webhook Esempio
```json
{
  "secret": "your_secret_key",
  "type": "api-update",
  "documents": [
    {
      "id": "doc_id",
      "uid": "home",
      "type": "page"
    }
  ]
}
```

## 🚀 Quick Start

### 1. Installa dipendenze
```bash
npm install
```

### 2. Configura environment variables
```bash
cp .env.local.example .env.local
```

Modifica `.env.local` con i tuoi valori:
```bash
PRISMIC_ACCESS_TOKEN=your_token_here
NEXT_PUBLIC_PRISMIC_ENVIRONMENT=your_repo_name
PRISMIC_REVALIDATE_SECRET=your_secret_key
```

### 3. Avvia in sviluppo
```bash
npm run dev
```

### 4. Testa il webhook localmente
```bash
npm run test:webhook
```

## 🌐 Deploy su Netlify

### 1. Configura Environment Variables
Nel dashboard Netlify, aggiungi le stesse variabili di `.env.local`:
- `PRISMIC_ACCESS_TOKEN`
- `NEXT_PUBLIC_PRISMIC_ENVIRONMENT`  
- `PRISMIC_REVALIDATE_SECRET`

### 2. Deploy
```bash
# Automatico con Git integration
git push origin main

# Oppure manualmente
netlify deploy --prod
```

### 3. Configura Webhook in Prismic
1. Vai in **Settings > Webhooks** nel tuo Prismic dashboard
2. Crea nuovo webhook con URL: `https://your-site.netlify.app/api/revalidate`
3. Usa il payload dal file `SETUP_ISR.md`

## 🧪 Testing

### Test Webhook Locale
```bash
# Con URL e secret di default
npm run test:webhook

# Con parametri custom
node scripts/test-webhook.js http://localhost:3000/api/revalidate your_secret
```

### Test ISR
1. Modifica contenuto in Prismic
2. Pubblica le modifiche
3. Controlla i logs di Netlify per conferma webhook
4. Verifica che la pagina sia aggiornata

## 🔧 Debug e Monitoring

### Componente Debug (Development)
Il componente `ISRDebug` mostra informazioni in tempo reale:
- Tipo di pagina (homepage/dinamica)
- Ultima pubblicazione
- Stato ISR
- Configurazione webhook

### Logs
- **Netlify Functions**: Dashboard > Functions > revalidate
- **Development**: Console del browser e terminale
- **Build**: Netlify deploy logs

## 📊 Monitoraggio Performance

### Metriche da Monitorare
- **TTFB** (Time to First Byte) delle pagine statiche
- **Cache Hit Rate** su CDN Netlify
- **Webhook Response Time** (<1s raccomandato)
- **Build Time** per nuove pagine

### Tools Consigliati
- [Lighthouse](https://lighthouse-dot-webdotdevsite.appspot.com/)
- [WebPageTest](https://www.webpagetest.org/)
- [Netlify Analytics](https://docs.netlify.com/monitor-sites/analytics/)

## 🛡️ Best Practices

### Sicurezza
- ✅ Usa secret key robuste per i webhook
- ✅ Valida sempre i payload in ingresso
- ✅ Limita le chiamate API con rate limiting
- ✅ Non loggare informazioni sensibili

### Performance  
- ✅ Usa `revalidate` appropriato per ogni pagina
- ✅ Revalida selettivamente solo le pagine necessarie
- ✅ Monitora la dimensione del bundle JavaScript
- ✅ Ottimizza immagini con Next.js Image

### SEO
- ✅ Configura metadati dinamici per ogni pagina
- ✅ Usa URL SEO-friendly
- ✅ Implementa Open Graph e Twitter Cards
- ✅ Genera sitemap.xml automaticamente

## 🔗 Link Utili

- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Prismic Webhook Documentation](https://prismic.io/docs/webhooks)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Setup ISR Completo](./SETUP_ISR.md)

## 📝 Licenza

Questo progetto è basato sul template Prismic Next.js Minimal con licenza Apache-2.0.