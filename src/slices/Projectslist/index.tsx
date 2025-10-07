"use client";

import { FC, useState, useEffect } from "react";
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative group">
      {/* Immagine di anteprima dietro alla lista - sempre nel DOM, controllata solo da CSS */}
      {slice.primary.imgpreview && slice.primary.imgpreview.url && (
        <div 
          className="preview-image fixed pointer-events-none z-0 opacity-0"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="relative max-w-md max-h-96">
            <PrismicNextImage
              field={slice.primary.imgpreview}
              className="w-full h-auto object-contain max-h-96"
              style={{ maxWidth: '400px' }}
            />
          </div>
        </div>
      )}

      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="relative z-10"
        style={{ mixBlendMode: 'difference' }}
      >
        <PrismicRichText
          field={slice.primary.ProjectsList}
          components={{
            hyperlink: ({ node, children }) => (
              <PrismicNextLink 
                field={node.data}
                className="project-link underline underline-offset-2 text-primary hover:text-accent relative z-10"
              >
                {children}
              </PrismicNextLink>
            ),
            list: ({ children }) => (
              <ul className="list-none list-inside space-y-16 text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-primary break-words overflow-wrap-anywhere relative z-10">
                {children}
              </ul>
            ),
            oList: ({ children }) => (
              <ol className="list-none list-inside mb-4 space-y-16 text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-primary break-words overflow-wrap-anywhere relative z-10">
                {children}
              </ol>
            ),
            listItem: ({ children }) => (
              <li className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-primary py-8 break-words overflow-wrap-anywhere whitespace-normal relative z-10">
                {children}
              </li>
            ),
          }}
        />
      </section>
    </div>
  );
};

export default Projectslist;
