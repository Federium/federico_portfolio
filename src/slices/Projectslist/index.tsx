"use client";

import { FC, useState, useRef, useEffect } from "react";
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
  // Stato per controllare la visibilità e l'opacità dell'immagine
  const [isVisible, setIsVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  
  // Ref per tracciare se il mouse è sopra un link
  const isHoveringRef = useRef(false);
  
  // Ref per gestire i timeout
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup dei timeout quando il componente viene smontato
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Effetto per verificare periodicamente se il mouse è ancora sopra un link
  useEffect(() => {
    const checkInterval = setInterval(() => {
      // Se l'immagine è visibile ma il mouse non è più sopra un link, nascondi l'immagine
      if (isVisible && !isHoveringRef.current) {
        handleLinkLeave();
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, [isVisible]);

  // Handler per il mouse enter sui link
  const handleLinkHover = () => {
    if (!slice.primary.imgpreview || !slice.primary.imgpreview.url) return;
    
    // Segna che il mouse è sopra un link
    isHoveringRef.current = true;
    
    // Cancella eventuali timeout di nascondimento in corso
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    // Mostra immediatamente l'immagine se non è già visibile
    if (!isVisible) {
      setIsVisible(true);
      // Piccolo delay per permettere al DOM di aggiornare prima di fare fade in
      showTimeoutRef.current = setTimeout(() => {
        setOpacity(1);
      }, 10);
    } else {
      // Se è già visibile, aumenta solo l'opacità
      setOpacity(1);
    }
  };

  // Handler per il mouse leave sui link
  const handleLinkLeave = () => {
    // Segna che il mouse non è più sopra un link
    isHoveringRef.current = false;
    
    // Cancella eventuali timeout di visualizzazione in corso
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    
    // Inizia il fade out
    setOpacity(0);
    
    // Rimuovi l'immagine dal DOM dopo la transizione
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 300); // Deve corrispondere alla durata della transizione CSS
  };

  return (
    <>
      {/* Immagine di anteprima dietro alla lista */}
      {isVisible && slice.primary.imgpreview && slice.primary.imgpreview.url && (
        <div 
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-0"
          style={{
            opacity: opacity,
          }}
        >
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
        style={{ mixBlendMode: 'difference' }}
      >
        <PrismicRichText
          field={slice.primary.ProjectsList}
          components={{
            hyperlink: ({ node, children }) => (
              <PrismicNextLink 
                field={node.data}
                className="underline underline-offset-2 text-primary hover:text-accent relative z-10"
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
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
    </>
  );
};

export default Projectslist;
