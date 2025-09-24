import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { 
  validateWebhookSecret,
  parseWebhookData,
  determinePathsToRevalidate,
  formatWebhookLogs,
  createWebhookResponse,
  RevalidationResult
} from "@/lib/webhook-utils";

/**
 * Endpoint API per gestire i webhook di Prismic e triggerare ISR
 * 
 * Questo endpoint:
 * 1. Verifica la secret key inviata da Prismic
 * 2. Estrae le informazioni del documento modificato
 * 3. Triggera la revalidation delle pagine interessate
 * 4. Restituisce una risposta appropriata
 */
export async function POST(request: NextRequest) {
  try {
    console.log('📨 Webhook ricevuto da Prismic');

    // ========================================
    // 1. PARSING E VALIDAZIONE DEI DATI
    // ========================================
    const webhookData = await parseWebhookData(request);
    const { secret, documents } = webhookData;

    console.log('📋 Dati webhook:\n' + formatWebhookLogs(webhookData));

    // ========================================
    // 2. VALIDAZIONE DELLA SECRET KEY
    // ========================================
    try {
      if (!validateWebhookSecret(secret)) {
        console.error('❌ Secret key non valida');
        return NextResponse.json(
          createWebhookResponse(false, 'Secret key non valida'),
          { status: 401 }
        );
      }
    } catch (error) {
      console.error('❌ Errore di configurazione:', error);
      return NextResponse.json(
        createWebhookResponse(false, 'Configurazione server non valida'),
        { status: 500 }
      );
    }

    console.log('✅ Webhook autenticato correttamente');

    // ========================================
    // 3. DETERMINAZIONE DELLE PAGINE DA REVALIDARE
    // ========================================
    let pathsToRevalidate: string[] = [];

    if (documents && Array.isArray(documents) && documents.length > 0) {
      pathsToRevalidate = determinePathsToRevalidate(documents);
    }

    // Se non ci sono documenti specifici, revalida la homepage
    if (pathsToRevalidate.length === 0) {
      pathsToRevalidate.push('/');
      console.log('⚠️ Nessun documento specifico trovato, revalidating homepage');
    }

    console.log(`🎯 Paths da revalidare: ${pathsToRevalidate.join(', ')}`);

    // ========================================
    // 4. ESECUZIONE DELLA REVALIDATION
    // ========================================
    const revalidationResults: RevalidationResult[] = [];

    for (const path of pathsToRevalidate) {
      try {
        revalidatePath(path);
        revalidationResults.push({ path, status: 'success' });
        console.log(`✅ Revalidation completata per: ${path}`);
      } catch (revalidateError) {
        const errorMessage = revalidateError instanceof Error 
          ? revalidateError.message 
          : 'Errore sconosciuto';
        
        console.error(`❌ Errore nella revalidation di ${path}:`, errorMessage);
        revalidationResults.push({ 
          path, 
          status: 'error', 
          error: errorMessage
        });
      }
    }

    // ========================================
    // 5. REVALIDATION DEI CACHE TAGS
    // ========================================
    try {
      revalidateTag('prismic');
      console.log('✅ Cache tag "prismic" revalidato');
    } catch (tagError) {
      console.error('❌ Errore nella revalidation del cache tag:', tagError);
    }

    // ========================================
    // 6. RISPOSTA FINALE
    // ========================================
    const response = createWebhookResponse(true, 'Revalidation completata', {
      revalidatedPaths: revalidationResults,
      totalPaths: pathsToRevalidate.length,
      webhookType: webhookData.type
    });

    console.log('🎉 Webhook processato con successo');

    return NextResponse.json(response);

  } catch (error) {
    console.error('💥 Errore generale nel processing del webhook:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Errore sconosciuto durante la revalidation';
    
    return NextResponse.json(
      createWebhookResponse(false, errorMessage),
      { status: 500 }
    );
  }
}
