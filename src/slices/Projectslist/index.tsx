"use client";

import { FC, useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";

/**
 * Props for `Projectslist`.
 */
export type ProjectslistProps = SliceComponentProps<Content.ProjectslistSlice>;

/**
 * Component for "Projectslist" Slices.
 */
const Projectslist: FC<ProjectslistProps> = ({ slice }) => {
  // Stato per mostrare/nascondere l'immagine di anteprima
  const [showPreview, setShowPreview] = useState(false);

  // Handler per il mouse enter sui link
  const handleLinkHover = () => {
    if (slice.primary.imgpreview && slice.primary.imgpreview.url) {
      setShowPreview(true);
    }
  };

  // Handler per il mouse leave sui link
  const handleLinkLeave = () => {
    setShowPreview(false);
  };
  return (
    <>
      {/* Immagine di anteprima dietro alla lista */}
      {showPreview && slice.primary.imgpreview && slice.primary.imgpreview.url && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="relative max-w-md max-h-96 mx-4">
            <PrismicNextImage
              field={slice.primary.imgpreview}
              className="w-full h-auto object-contain max-h-96"
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
            hyperlink: ({ node, children }) => (
              <PrismicNextLink 
                field={node.data}
                className="underline underline-offset-2 text-blue-600 hover:text-red-600 relative z-10"
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                {children}
              </PrismicNextLink>
            ),
            list: ({ children }) => (
              <ul className="list-none list-inside space-y-16 text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-blue-600 break-words overflow-wrap-anywhere relative z-10">
                {children}
              </ul>
            ),
            oList: ({ children }) => (
              <ol className="list-none list-inside mb-4 space-y-16 text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-blue-600 break-words overflow-wrap-anywhere relative z-10">
                {children}
              </ol>
            ),
            listItem: ({ children }) => (
              <li className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-blue-600 py-8 break-words overflow-wrap-anywhere whitespace-normal relative z-10">
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
