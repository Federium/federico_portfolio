# Configurazione Webhook Prismic → Netlify

Questa guida spiega come configurare un webhook automatico per deployare il sito su Netlify ogni volta che viene aggiornato il contenuto in Prismic.

## Setup

### 1. Configurazione Netlify Build Hook

1. Vai nel dashboard di Netlify per il tuo sito
2. Naviga in **Site Settings → Build & Deploy → Build Hooks**
3. Clicca su **Add build hook**
4. Dai un nome al webhook (es. "Prismic Content Update")
5. Seleziona il branch da deployare (solitamente `main`)
6. Copia l'URL del build hook generato

### 2. Configurazione Variabili d'Ambiente

Crea un file `.env.local` nella root del progetto e aggiungi:

```bash
# Prismic Configuration
NEXT_PUBLIC_PRISMIC_ENVIRONMENT=your-repo-name

# Prismic Webhook Security (opzionale ma raccomandato)
PRISMIC_WEBHOOK_SECRET=your-secret-key

# Netlify Build Hook URL
NETLIFY_BUILD_HOOK_URL=https://api.netlify.com/build_hooks/your-build-hook-id
```

### 3. Configurazione Webhook in Prismic

1. Vai nel tuo repository Prismic
2. Naviga in **Settings → Webhooks**
3. Clicca su **Create a webhook**
4. Compila i campi:
   - **Name**: Netlify Deploy
   - **URL**: `https://your-domain.com/api/webhook/netlify`
   - **Secret** (opzionale): inserisci il valore di `PRISMIC_WEBHOOK_SECRET`
   - **Triggers**: seleziona gli eventi che devono triggerare il webhook:
     - ✅ A document is published
     - ✅ A document is unpublished
     - ✅ A document is deleted
     - ✅ A release is published
5. Clicca su **Add this webhook**

### 4. Configurazione su Netlify (Variabili d'Ambiente)

Se usi variabili d'ambiente che devono essere disponibili anche su Netlify:

1. Vai in **Site Settings → Environment Variables**
2. Aggiungi le stesse variabili del tuo `.env.local`:
   - `NEXT_PUBLIC_PRISMIC_ENVIRONMENT`
   - `PRISMIC_WEBHOOK_SECRET` (se usato)
   - `NETLIFY_BUILD_HOOK_URL` (non necessario su Netlify, ma può essere utile)

## Come Funziona

1. **Aggiornamento Contenuto**: Quando pubblichi/aggiorni contenuto in Prismic
2. **Webhook Trigger**: Prismic invia una richiesta POST al tuo endpoint `/api/webhook/netlify`
3. **Cache Revalidation**: L'endpoint invalida la cache di Next.js per aggiornare il contenuto
4. **Build Trigger**: Viene chiamato il build hook di Netlify per avviare un nuovo deploy
5. **Deploy Automatico**: Netlify rebuilda e deploya il sito con il contenuto aggiornato

## Test del Webhook

Per testare se il webhook funziona:

1. **Test locale**: Avvia il server di sviluppo (`npm run dev`) e fai una richiesta GET a `http://localhost:3000/api/webhook/netlify`
2. **Test produzione**: Fai una richiesta GET a `https://your-domain.com/api/webhook/netlify`
3. **Test completo**: Pubblica/aggiorna un documento in Prismic e verifica che il deploy si avvii su Netlify

## Logs e Debugging

- I logs del webhook sono visibili nella console quando il server è in esecuzione
- Su Netlify, puoi vedere i deploy triggered nei **Deploy logs**
- In caso di errori, controlla le **Function logs** su Netlify

## Sicurezza

- Il `PRISMIC_WEBHOOK_SECRET` è opzionale ma altamente raccomandato per verificare che le richieste vengano effettivamente da Prismic
- L'endpoint è protetto contro richieste non autorizzate
- Tutti gli errori vengono loggati per facilitare il debugging

## Troubleshooting

### Il webhook non si attiva
- Verifica che l'URL del webhook in Prismic sia corretto
- Controlla che le variabili d'ambiente siano configurate correttamente
- Verifica i logs per eventuali errori

### Il build non si avvia su Netlify
- Controlla che `NETLIFY_BUILD_HOOK_URL` sia corretto
- Verifica che il build hook esista ancora nel dashboard di Netlify
- Controlla i logs di Netlify per eventuali problemi

### Errori di autenticazione
- Verifica che `PRISMIC_WEBHOOK_SECRET` sia identico in Prismic e nelle variabili d'ambiente
- Se non usi il secret, rimuovi il campo dal webhook di Prismic