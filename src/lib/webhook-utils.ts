/**
 * Utilità per gestire i webhook di Prismic e la revalidation
 */

import { NextRequest } from 'next/server';

// Tipi TypeScript per i dati del webhook
export interface PrismicWebhookDocument {
  id: string;
  uid: string;
  type: string;
}

export interface PrismicWebhookRelease {
  id: string;
  ref: string;
}

export interface PrismicWebhookData {
  secret: string;
  type: string;
  masterRef?: {
    ref: string;
  };
  releases?: PrismicWebhookRelease[];
  documents?: PrismicWebhookDocument[];
}

export interface RevalidationResult {
  path: string;
  status: 'success' | 'error';
  error?: string;
}

/**
 * Valida la secret key del webhook
 */
export function validateWebhookSecret(receivedSecret: string): boolean {
  const expectedSecret = process.env.PRISMIC_REVALIDATE_SECRET;
  
  if (!expectedSecret) {
    throw new Error('PRISMIC_REVALIDATE_SECRET non configurata');
  }
  
  return receivedSecret === expectedSecret;
}

/**
 * Estrae i dati dal corpo del webhook
 */
export async function parseWebhookData(request: NextRequest): Promise<PrismicWebhookData> {
  try {
    const data = await request.json();
    return data;
  } catch {
    throw new Error('Formato del webhook non valido');
  }
}

/**
 * Determina quali pagine devono essere revalidate in base ai documenti
 */
export function determinePathsToRevalidate(documents: PrismicWebhookDocument[]): string[] {
  const paths: string[] = [];
  
  for (const document of documents) {
    const { uid, type } = document;
    
    switch (type) {
      case 'page':
        if (uid === 'home') {
          paths.push('/');
        } else if (uid) {
          paths.push(`/${uid}`);
        }
        break;
      
      // Aggiungi altri tipi di documento qui
      case 'blog_post':
        if (uid) {
          paths.push(`/blog/${uid}`);
          // Revalida anche la lista blog
          if (!paths.includes('/blog')) {
            paths.push('/blog');
          }
        }
        break;
        
      case 'product':
        if (uid) {
          paths.push(`/products/${uid}`);
          // Revalida anche la lista prodotti
          if (!paths.includes('/products')) {
            paths.push('/products');
          }
        }
        break;
        
      default:
        console.log(`⚠️ Tipo di documento non gestito: ${type}`);
    }
  }
  
  return paths;
}

/**
 * Mappa i tipi di webhook Prismic per il logging
 */
export function getWebhookTypeDescription(type: string): string {
  const types: Record<string, string> = {
    'api-update': '📝 Aggiornamento contenuto',
    'test-trigger': '🧪 Test webhook',
    'scheduled-trigger': '⏰ Trigger programmato'
  };
  
  return types[type] || `❓ Tipo sconosciuto: ${type}`;
}

/**
 * Formatta i logs del webhook per debugging
 */
export function formatWebhookLogs(data: PrismicWebhookData): string {
  const logs = [
    `Tipo: ${getWebhookTypeDescription(data.type)}`,
    `Master Ref: ${data.masterRef?.ref || 'N/A'}`,
    `Releases: ${data.releases?.length || 0}`,
    `Documenti: ${data.documents?.length || 0}`,
  ];
  
  if (data.documents && data.documents.length > 0) {
    logs.push('Documenti modificati:');
    data.documents.forEach(doc => {
      logs.push(`  - ${doc.type}:${doc.uid || doc.id}`);
    });
  }
  
  return logs.join('\n');
}

/**
 * Crea una risposta standardizzata per il webhook
 */
export function createWebhookResponse(
  success: boolean,
  message: string,
  data?: {
    revalidatedPaths?: RevalidationResult[];
    totalPaths?: number;
    webhookType?: string;
  }
) {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString(),
    revalidated: success,
    now: Date.now(),
    ...data
  };
  
  return response;
}