import { type Metadata } from "next";

import { asText } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Home() {
  const client = createClient();
  const home = await client.getByUID("page", "home");

  // Separate footer from other slices
  const footerSlices = home.data.slices.filter((slice: any) => slice.slice_type === 'footer');
  const otherSlices = home.data.slices.filter((slice: any) => slice.slice_type !== 'footer');

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <SliceZone slices={otherSlices} components={components} />
      </div>
      <SliceZone slices={footerSlices} components={components} />
    </div>
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
