import { Metadata } from "next";
import { notFound } from "next/navigation";

import { asText, filter } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

type Params = { uid: string };

interface Slice {
  slice_type: string;
  primary: Record<string, unknown>;
  items?: Record<string, unknown>[];
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  const client = createClient();
  
  try {
    const page = await client.getByUID("page", uid);
    
    // Filter out header and footer slices since they're now handled by layout components
    const contentSlices = page.data.slices.filter((slice: Slice) => 
      slice.slice_type !== 'footer' && slice.slice_type !== 'header'
    );

    // Debug: log della pagina e delle slice
    console.log(`Page UID: ${uid}`);
    console.log(`Total slices: ${page.data.slices.length}`);
    console.log(`Content slices after filtering: ${contentSlices.length}`);
    console.log('Available slice types:', page.data.slices.map((slice: Slice) => slice.slice_type));

    // Se non ci sono slice di contenuto, mostra almeno il titolo
    if (contentSlices.length === 0) {
      return (
        <div className="prose max-w-none">
          <h1 className="text-4xl font-bold mb-8 text-blue-600">{asText(page.data.title)}</h1>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p className="font-bold">Debug Info:</p>
            <p>Questa pagina ha solo slice header/footer che sono gestite dal layout.</p>
            <p>Slice disponibili: {page.data.slices.map((slice: Slice) => slice.slice_type).join(', ')}</p>
            <p>Per aggiungere contenuto, vai su Prismic e aggiungi altre slice a questa pagina.</p>
          </div>
        </div>
      );
    }

    // <SliceZone> renders the page's slices (excluding header/footer).
    return <SliceZone slices={contentSlices} components={components} />;
    
  } catch (error) {
    console.error(`Error loading page ${uid}:`, error);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("page", uid).catch(() => notFound());

  return {
    title: asText(page.data.title),
    description: page.data.meta_description,
    openGraph: {
      title: page.data.meta_title ?? undefined,
      images: [{ url: page.data.meta_image.url ?? "" }],
    },
  };
}

export async function generateStaticParams() {
  const client = createClient();

  // Get all pages from Prismic, except the homepage.
  const pages = await client.getAllByType("page", {
    filters: [filter.not("my.page.uid", "home")],
  });

  return pages.map((page) => ({ uid: page.uid }));
}
