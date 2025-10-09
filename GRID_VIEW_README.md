# Grid View - Visualizzazione Progetti

## Descrizione

È stata aggiunta una nuova visualizzazione **Grid** per i progetti, che si affianca alla classica visualizzazione **List**.

## Funzionalità

### Toggle List/Grid
- In alto a sinistra della pagina ci sono due pulsanti: **List** e **Grid**
- Permettono di passare tra le due visualizzazioni

### Visualizzazione List
- Visualizzazione classica con lista di progetti
- Mantiene l'effetto hover con preview delle immagini

### Visualizzazione Grid
- Dispone tutte le immagini di anteprima dei progetti in modo casuale sulla pagina
- Ogni immagine ha:
  - Posizione casuale
  - Rotazione casuale (-10° a +10°)
  - Scala casuale (0.8 a 1.2)
- Al passaggio del mouse:
  - L'immagine si ingrandisce (scale 110%)
  - Viene mostrato un tooltip con il titolo del progetto
- Pulsante **↻** (Randomizza): riposiziona casualmente tutte le immagini

## Implementazione Tecnica

### File modificati/creati:

1. **`src/components/ProjectsListWrapper.tsx`** (NUOVO)
   - Componente wrapper che gestisce il toggle tra list e grid
   - Gestisce lo stato della visualizzazione
   - Genera posizioni casuali per la grid view

2. **`src/app/page.tsx`**
   - Modificato per separare i project slices dagli altri
   - Usa ProjectsListWrapper per renderizzare i progetti

3. **`src/slices/Projectslist/index.tsx`**
   - Mantiene la logica originale per la list view

4. **`tailwind.config.js`**
   - Aggiunti i colori custom: primary, secondary, accent, background

5. **`src/app/global.css`**
   - Aggiunte animazioni per la grid view

## Utilizzo

La funzionalità è automatica e non richiede configurazione aggiuntiva. I progetti vengono caricati da Prismic come al solito.

### Struttura Prismic

Ogni progetto in Prismic deve avere:
- `ProjectsList`: Rich text con il titolo/descrizione del progetto
- `imgpreview`: Immagine di anteprima del progetto

## Personalizzazione

### Modificare l'area di posizionamento casuale
Nel file `ProjectsListWrapper.tsx`, modifica i valori nella funzione `generateRandomPositions`:

```typescript
top: Math.random() * 70 + 10, // 10% to 80%
left: Math.random() * 70 + 10, // 10% to 80%
```

### Modificare la rotazione massima
```typescript
rotation: Math.random() * 20 - 10, // -10 to 10 degrees
```

### Modificare la scala
```typescript
scale: Math.random() * 0.4 + 0.8, // 0.8 to 1.2
```

### Modificare le dimensioni delle immagini
Nel file `ProjectsListWrapper.tsx`, cerca:
```tsx
className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 group"
```

## Compatibilità

- ✅ Desktop
- ✅ Tablet
- ✅ Mobile (immagini più piccole)
- ✅ Tutti i browser moderni

## Note

- Le posizioni vengono rigenerate ogni volta che si passa alla grid view
- Il pulsante di randomizzazione è disponibile solo in grid view
- Le immagini mantengono l'aspect ratio originale con object-cover
