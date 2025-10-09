import { Metadata } from "next";
import { notFound } from "next/navigation";

import { asText, Content } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { getPage, getAllPageUIDs } from "@/prismicio";
import { components } from "@/slices";
import ISRDebug from "@/components/ISRDebug";
import ProjectsListWrapper from "@/components/ProjectsListWrapper";

type Params = { uid: string };

/**
 * Pagina dinamica per le pagine Prismic con supporto ISR
 * 
 * Questa pagina:
 * - Usa getPage() e getAllPageUIDs() per recuperare i dati da Prismic
 * - È configurata per ISR (Incremental Static Regeneration)
 * - Genera automaticamente le pagine statiche al build time
 * - Viene automaticamente revalidata tramite webhook per contenuto specifico
 */
export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  
  // Fetch dei dati della pagina usando la helper function
  const page = await getPage(uid);

  // Se la pagina non esiste, mostra 404
  if (!page) {
    console.error(`❌ Pagina con UID "${uid}" non trovata in Prismic`);
    notFound();
  }

  // Check if there are any projectslist slices
  const projectSlices = page.data.slices.filter((slice) => slice.slice_type === 'projectslist');
  const otherSlices = page.data.slices.filter((slice) => slice.slice_type !== 'projectslist');

  // Render delle slice della pagina
  return (
    <>
      {/* Render other slices first */}
      {otherSlices.length > 0 && <SliceZone slices={otherSlices} components={components} />}
      
      {/* Render projects with wrapper if there are any */}
      {projectSlices.length > 0 && <ProjectsListWrapper projects={projectSlices as Content.ProjectslistSlice[]} />}
      
      <ISRDebug 
        pageType="dynamic" 
        uid={uid}
        lastUpdated={page.last_publication_date}
      />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid } = await params;
  
  // Fetch dei dati per i metadati usando la helper function
  const page = await getPage(uid);

  // Fallback metadata se non riusciamo a recuperare i dati
  if (!page) {
    return {
      title: `Pagina ${uid}`,
      description: `Pagina ${uid} del portfolio di Federico Morsia`,
    };
  }

  return {
    title: asText(page.data.title),
    description: page.data.meta_description,
    openGraph: {
      title: page.data.meta_title ?? undefined,
      images: [{ url: page.data.meta_image.url ?? "" }],
    },
  };
}

/**
 * Genera i parametri statici per tutte le pagine al build time
 * 
 * Questa funzione:
 * - Recupera tutti gli UID delle pagine da Prismic (esclusa homepage)
 * - Permette a Next.js di pre-generare tutte le pagine statiche
 * - Ottimizza le performance riducendo i tempi di caricamento
 */
export async function generateStaticParams() {
  try {
    // Usa la helper function per ottenere tutti gli UID
    const pageUIDs = await getAllPageUIDs();
    
    console.log(`📄 Generazione di ${pageUIDs.length} pagine statiche:`, 
      pageUIDs.map(p => p.uid).join(', ')
    );

    return pageUIDs;
  } catch (error) {
    console.error('❌ Errore nella generazione dei parametri statici:', error);
    // Ritorna un array vuoto come fallback
    return [];
  }
}

// ========================================
// CONFIGURAZIONE ISR
// ========================================

/**
 * Configurazione per l'ISR (Incremental Static Regeneration)
 * 
 * revalidate: 60 - Le pagine vengono rigenerate al massimo ogni 60 secondi
 * se ci sono nuove richieste dopo quel periodo.
 * 
 * Questa configurazione combinata con il webhook di Prismic garantisce:
 * - Aggiornamenti immediati quando il contenuto cambia (via webhook)
 * - Fallback ogni 60 secondi per sicurezza
 * - Performance ottimali per gli utenti
 * - Generazione dinamica di nuove pagine quando necessario
 */
export const revalidate = 60;
