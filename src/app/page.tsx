import { type Metadata } from "next";

import { asText } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import Header from "@/components/header";

interface Slice {
  slice_type: string;
  primary: Record<string, unknown>;
  items?: Record<string, unknown>[];
}

export default async function Home() {
  const client = createClient();
  const home = await client.getByUID("page", "home");

  // Filter out both header and footer slices since header is now shown manually
  const contentSlices = home.data.slices.filter((slice: Slice) => 
    slice.slice_type !== 'footer' && slice.slice_type !== 'header'
  );

  return (
    <>
      <Header />
      <SliceZone slices={contentSlices} components={components} />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const home = await client.getByUID("page", "home");

  return {
    title: asText(home.data.title),
    description: home.data.meta_description,
    openGraph: {
      title: home.data.meta_title ?? undefined,
      images: [{ url: home.data.meta_image.url ?? "" }],
    },
  };
}