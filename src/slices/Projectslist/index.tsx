"use client";

import { FC, useState, useRef } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { createClient } from "@/prismicio";
import Image from "next/image";

/**
 * Props for `Projectslist`.
 */
export type ProjectslistProps = SliceComponentProps<Content.ProjectslistSlice>;

/**
 * Component for "Projectslist" Slices.
 */
const Projectslist: FC<ProjectslistProps> = ({ slice }) => {
  // Stato per l'immagine di anteprima
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    alt: string;
    dimensions: { width: number; height: number };
  } | null>(null);
  const currentHoveredUidRef = useRef<string | null>(null);

  // Funzione per recuperare la prima immagine di un progetto
  const getProjectPreviewImage = async (uid: string) => {
    try {
      const client = createClient();
      const page = await client.getByUID("page", uid);
      
      if (page && page.data.slices) {
        // Cerca la prima slice di tipo "project_page"
        const projectSlice = page.data.slices.find(slice => slice.slice_type === "project_page");
        
        if (projectSlice && projectSlice.slice_type === "project_page") {
          // Type assertion per accedere alle proprietà specifiche di ProjectPageSlice
          const projectData = projectSlice as Content.ProjectPageSlice;
          
          // Cerca la prima immagine disponibile
          const images = [
            projectData.primary.ProjectImg,
            projectData.primary.ProjectImg2,
            projectData.primary.ProjectImg3,
            projectData.primary.ProjectImg4,
            projectData.primary.ProjectImg5,
          ].filter(img => img && img.url);
          
          if (images.length > 0) {
            const firstImage = images[0];
            if (firstImage.url) {
              return {
                url: firstImage.url,
                alt: firstImage.alt || `${uid} project image`,
                dimensions: firstImage.dimensions || { width: 800, height: 600 }
              };
            }
          }
        }
      }
      return null;
    } catch (error) {
      console.error(`Errore nel recupero dell'immagine per ${uid}:`, error);
      return null;
    }
  };

  // Handler per il mouse enter sui link
  const handleLinkHover = async (uid: string) => {
    currentHoveredUidRef.current = uid;
    const image = await getProjectPreviewImage(uid);
    // Controlla se siamo ancora in hover su questo stesso uid
    if (image && currentHoveredUidRef.current === uid) {
      setPreviewImage(image);
    }
  };

  // Handler per il mouse leave sui link
  const handleLinkLeave = () => {
    currentHoveredUidRef.current = null;
    setPreviewImage(null);
  };

  // Funzione per estrarre l'UID da un link Prismic
  const extractUidFromLink = (linkField: { link_type?: string; uid?: string }): string | null => {
    if (linkField && linkField.link_type === "Document" && linkField.uid) {
      return linkField.uid;
    }
    return null;
  };
  return (
    <>
      {/* Immagine di anteprima dietro alla lista */}
      {previewImage && (
        <div 
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-0"
        >
          <div className="relative max-w-md max-h-96 mx-4">
            <Image
              src={previewImage.url}
              alt={previewImage.alt}
              width={previewImage.dimensions.width}
              height={previewImage.dimensions.height}
              className="w-full h-auto object-contain bg-white max-h-96"
              style={{ maxWidth: '600px' }}
            />
          </div>
        </div>
      )}

      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="relative z-10"
      >
        <PrismicRichText
          field={slice.primary.ProjectsList}
          components={{
            heading1: ({ children }) => (
              <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-blue-600 leading-loose relative z-10">
                {children}
              </h1>
            ),
            paragraph: ({ children }) => (
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-800 mb-4 leading-relaxed relative z-10">
                {children}
              </p>
            ),
            preformatted: ({ children }) => (
              <pre className="bg-gray-100 p-4 rounded-lg text-sm sm:text-base font-mono overflow-x-auto mb-4 relative z-10">
                {children}
              </pre>
            ),
            strong: ({ children }) => (
              <strong className="font-bold text-blue-600 relative z-10">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="italic text-gray-700 relative z-10">
                {children}
              </em>
            ),
            hyperlink: ({ node, children }) => {
              const uid = extractUidFromLink(node.data);
              return (
                <PrismicNextLink 
                  field={node.data}
                  className="underline underline-offset-2 text-blue-600 hover:text-red-600 relative z-10"
                  onMouseEnter={() => uid && handleLinkHover(uid)}
                  onMouseLeave={handleLinkLeave}
                >
                  {children}
                </PrismicNextLink>
              );
            },
            list: ({ children }) => (
              <ul className="list-none list-inside space-y-4 text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-blue-600 break-words overflow-wrap-anywhere relative z-10">
                {children}
              </ul>
            ),
            oList: ({ children }) => (
              <ol className="list-none list-inside mb-4 space-y-4 text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-blue-600 break-words overflow-wrap-anywhere relative z-10">
                {children}
              </ol>
            ),
            listItem: ({ children }) => (
              <li className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-blue-600 py-4 break-words overflow-wrap-anywhere whitespace-normal relative z-10">
                {children}
              </li>
            ),
          }}
        />
      </section>
    </>
  );
};

export default Projectslist;
