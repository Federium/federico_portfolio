# 🎣 Configurazione Webhook Prismic → Netlify

Per avere aggiornamenti di contenuto ottimali, devi configurare **DUE webhook** su Prismic:

## 🔄 Webhook #1: ISR Revalidation (Aggiornamenti Immediati)

### Configurazione su Prismic:
- **Nome**: "ISR Revalidation"
- **URL**: `https://your-netlify-site.netlify.app/api/revalidate`
- **Trigger**: 
  - ✅ A document is published
  - ✅ A document is unpublished  
  - ✅ A document is deleted

### Custom Payload:
```json
{
  "secret": "federicomorsia_webhook_secret",
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

**Cosa fa**: Aggiorna il contenuto delle pagine esistenti senza rifare il build completo (veloce ~1-2 secondi).

---

## 🚀 Webhook #2: Netlify Redeploy (Build Completo)

### Step 1: Ottieni il Build Hook di Netlify

1. Vai nel **Dashboard Netlify** → **Site Settings**
2. **Build & Deploy** → **Build hooks**
3. **"Add build hook"**:
   - **Nome**: "Prismic Content Update"
   - **Branch**: `main`
4. **Copia l'URL** generato (tipo: `https://api.netlify.com/build_hooks/abc123def456`)

### Step 2: Configurazione su Prismic:
- **Nome**: "Netlify Redeploy"  
- **URL**: `https://api.netlify.com/build_hooks/YOUR_BUILD_HOOK_ID`
- **Trigger**:
  - ✅ A document is published
  - ✅ A document is unpublished
  - ✅ A document is deleted

### Custom Payload:
```json
{}
```
(Lascia vuoto - Netlify non ha bisogno di payload specifico)

**Cosa fa**: Triggera un build completo del sito (più lento ~2-5 minuti ma garantisce tutto aggiornato).

---

## 🎯 Strategia Consigliata

### Opzione A: Solo ISR (Veloce)
Se vuoi aggiornamenti super veloci:
- Usa **solo il Webhook #1 (ISR)**
- Pro: Aggiornamenti in 1-2 secondi
- Contro: Nuove pagine non verranno create automaticamente

### Opzione B: ISR + Redeploy (Completo)
Se vuoi la sicurezza massima:
- Usa **entrambi i webhook**
- ISR aggiorna subito, Redeploy assicura tutto sia perfetto
- Pro: Sempre aggiornato + backup sicuro
- Contro: Due build (uno veloce, uno lento)

### Opzione C: Solo Redeploy (Tradizionale)
Se preferisci l'approccio classico:
- Usa **solo il Webhook #2 (Redeploy)**
- Pro: Semplice, sempre funziona
- Contro: Più lento (2-5 minuti per ogni modifica)

---

## 🔍 Come Testare

### Test ISR (Webhook #1):
```bash
# In locale con server attivo
npm run test:webhook

# Su Netlify - controlla Function logs
```

### Test Redeploy (Webhook #2):
1. Modifica contenuto su Prismic
2. Vai in Netlify → **Deploys**
3. Dovresti vedere un nuovo deploy automatico con trigger "Deploy hook"

---

## 🚨 Troubleshooting

### ISR non funziona:
- ✅ Verifica che `PRISMIC_REVALIDATE_SECRET` sia configurata su Netlify
- ✅ Controlla Function logs di Netlify
- ✅ Testa il webhook localmente

### Redeploy non parte:
- ✅ Verifica che il Build Hook URL sia corretto
- ✅ Controlla in Netlify → Deploys per errori
- ✅ Verifica i trigger webhook su Prismic

### Entrambi non funzionano:
- ✅ Controlla che i webhook siano "Attivi" su Prismic
- ✅ Verifica la connessione internet del webhook
- ✅ Prova il test webhook manuale su Prismic

---

## 📊 Monitoring

### Netlify:
- **Functions**: Logs dell'endpoint `/api/revalidate`  
- **Deploys**: Cronologia dei build automatici
- **Analytics**: Performance post-aggiornamento

### Prismic:
- **Webhooks**: Status e cronologia chiamate
- **Settings → Webhooks**: Test manuale disponibile