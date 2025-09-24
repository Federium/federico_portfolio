"use client";

import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";

/**
 * Props for `ProjectPage`.
 */
export type ProjectPageProps = SliceComponentProps<Content.ProjectPageSlice>;

/**
 * Component for "ProjectPage" Slices.
 */
const ProjectPage: FC<ProjectPageProps> = ({ slice }) => {
  // Controllo di sicurezza per slice.primary
  if (!slice || !slice.primary) {
    console.warn('ProjectPage: slice or slice.primary is missing');
    return null;
  }

  // Raggruppa tutte le immagini in un array
  const projectImages = [
    slice.primary.ProjectImg,
    slice.primary.ProjectImg2,
    slice.primary.ProjectImg3,
    slice.primary.ProjectImg4,
    slice.primary.ProjectImg5,
  ].filter(img => img && img.url); // Filtra solo le immagini che esistono

  // Controlla se ci sono media (immagini o video)
  const hasMedia = projectImages.length > 0 || (slice.primary.video && slice.primary.video.embed_url);

  // Funzione per convertire URL YouTube in formato embed
  const getYouTubeEmbedUrl = (url: string) => {
    try {
      if (!url || typeof url !== 'string') return '';
      
      // Se è già un URL embed, restituiscilo così com'è
      if (url.includes('youtube.com/embed/')) {
        return url;
      }
      
      // Estrai l'ID del video da diversi formati di URL YouTube
      let videoId = '';
      
      // URL del tipo: https://www.youtube.com/watch?v=VIDEO_ID
      const watchMatch = url.match(/[?&]v=([^&]+)/);
      if (watchMatch && watchMatch[1]) {
        videoId = watchMatch[1];
      }
      
      // URL del tipo: https://youtu.be/VIDEO_ID
      if (!videoId) {
        const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
        if (shortMatch && shortMatch[1]) {
          videoId = shortMatch[1];
        }
      }
      
      // Se abbiamo trovato un ID video, crea l'URL embed
      if (videoId) {
        // Pulisci l'ID video da caratteri non validi
        const cleanVideoId = videoId.replace(/[^a-zA-Z0-9_-]/g, '');
        if (cleanVideoId.length > 0) {
          return `https://www.youtube.com/embed/${cleanVideoId}`;
        }
      }
      
      // Se non riusciamo a parsare l'URL YouTube, ritorna vuoto per evitare errori
      return '';
    } catch (error) {
      console.warn('Error parsing YouTube URL:', url, error);
      return '';
    }
  };

  const scrollToImage = () => {
    const imageElement = document.getElementById('project-image');
    if (imageElement) {
      imageElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Stile comune per le immagini
  const imageContainerStyle = "mt-8 mb-8";
  const imageStyle = "w-full h-auto rounded-lg shadow-lg object-cover max-w-full";
  const imageSizes = "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {/* Project Text */}
      <PrismicRichText
        field={slice.primary.ProjectText}
        components={{
          paragraph: ({ children }) => (
            <p className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-blue-600 mb-20 leading-relaxed break-words overflow-wrap-anywhere">
              {children}
            </p>
          )
        }}
      />
      
      {/* Scroll Down Arrow Button */}
      {hasMedia && (
        <div className="flex mb-12">
          <button
            onClick={scrollToImage}
            className="group flex flex-col space-y-2 text-blue-600 hover:text-red-600 transition-colors duration-300 cursor-pointer"
            aria-label="Scroll to images"
          >
            <span className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">↓</span>
          </button>
        </div>
      )}
      
      {/* Spacer to push images below viewport */}
      <div className="h-screen"></div>
      
      {/* Project Images Gallery */}
      <div id="project-image" className="space-y-8">
        {/* Render tutte le immagini con stile uniforme */}
        {projectImages.map((image, index) => (
          <div key={index} className={imageContainerStyle}>
            <PrismicNextImage
              field={image}
              className={imageStyle}
              sizes={imageSizes}
            />
          </div>
        ))}

        {/* Project Video */}
        {slice.primary.video && slice.primary.video.embed_url && (
          (() => {
            const embedUrl = getYouTubeEmbedUrl(slice.primary.video.embed_url);
            return embedUrl ? (
              <div className={imageContainerStyle}>
                <div className="relative w-full rounded-lg overflow-hidden shadow-lg" style={{ aspectRatio: '16/9' }}>
                  <iframe
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    title="Project Video"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </div>
            ) : null;
          })()
        )}

        {/* Fallback for video HTML */}
        {slice.primary.video && slice.primary.video.html && !slice.primary.video.embed_url && (
          <div className={imageContainerStyle}>
            <div 
              className="relative w-full rounded-lg overflow-hidden shadow-lg video-container"
              style={{ aspectRatio: '16/9' }}
              dangerouslySetInnerHTML={{ __html: slice.primary.video.html }}
            />
          </div>
        )}
      </div>

      {/* Return Button - Full Viewport Height at the bottom */}
      {slice.primary.ReturnButton && (
        <div className="h-screen flex items-center">
          <PrismicRichText
            field={slice.primary.ReturnButton}
            components={{
              paragraph: ({ children }) => (
                <p className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-blue-600 leading-normal">
                  {children}
                </p>
              ),
              hyperlink: ({ node, children }) => (
                <PrismicNextLink 
                  field={node.data}
                  className="underline text-blue-600 hover:text-red-600"
                >
                  {children}
                </PrismicNextLink>
              )
            }}
          />
        </div>
      )}
    </section>
  );
};

export default ProjectPage;
