import {
  createClient as baseCreateClient,
  ClientConfig,
  Route,
} from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";
import sm from "../slicemachine.config.json";

/**
 * The project's Prismic repository name.
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

/**
 * The project's Prismic route resolvers. This list determines a Prismic document's URL.
 */
const routes: Route[] = [
  { type: "page", uid: "home", path: "/" },
  { type: "page", path: "/:uid" },
];

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 */
export function createClient(config: ClientConfig = {}) {
  const client = baseCreateClient(sm.apiEndpoint || repositoryName, {
    routes,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"] }, cache: "force-cache" }
        : { next: { revalidate: 5 } },
    ...config,
  });

  enableAutoPreviews({ client });

  return client;
}

// ============================================
// HELPER FUNCTIONS PER IL FETCH DEI CONTENUTI
// ============================================

/**
 * Recupera la homepage dal repository Prismic
 * @param config - Configurazione client opzionale
 */
export async function getHomepage(config?: ClientConfig) {
  const client = createClient(config);
  
  try {
    // Cerchiamo il documento "page" con UID "home"
    const homepage = await client.getByUID("page", "home");
    return homepage;
  } catch (error) {
    console.error("Errore nel fetch della homepage:", error);
    return null;
  }
}

/**
 * Recupera una pagina specifica tramite UID
 * @param uid - L'identificatore unico della pagina
 * @param config - Configurazione client opzionale
 */
export async function getPage(uid: string, config?: ClientConfig) {
  const client = createClient(config);
  
  try {
    const page = await client.getByUID("page", uid);
    return page;
  } catch (error) {
    console.error(`Errore nel fetch della pagina ${uid}:`, error);
    return null;
  }
}

/**
 * Recupera tutte le pagine del repository
 * Utilizzato principalmente per generateStaticParams/getStaticPaths
 * @param config - Configurazione client opzionale
 */
export async function getAllPages(config?: ClientConfig) {
  const client = createClient(config);
  
  try {
    const pages = await client.getAllByType("page", {
      orderings: [
        { field: "my.page.title", direction: "asc" }
      ]
    });
    return pages;
  } catch (error) {
    console.error("Errore nel fetch di tutte le pagine:", error);
    return [];
  }
}

/**
 * Recupera solo gli UID di tutte le pagine (più efficiente per getStaticPaths)
 * @param config - Configurazione client opzionale
 */
export async function getAllPageUIDs(config?: ClientConfig) {
  const client = createClient(config);
  
  try {
    const pages = await client.getAllByType("page", {
      fetch: [] // Non recuperiamo il contenuto, solo i metadati
    });
    
    return pages
      .filter(page => page.uid && page.uid !== "home") // Escludiamo la homepage
      .map(page => ({
        uid: page.uid
      }));
  } catch (error) {
    console.error("Errore nel fetch degli UID delle pagine:", error);
    return [];
  }
}
