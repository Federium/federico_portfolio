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
    if (!url) return url;
    
    // Se è già un URL embed, restituiscilo così com'è
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    // Estrai l'ID del video da diversi formati di URL YouTube
    let videoId = '';
    
    // URL del tipo: https://www.youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) {
      videoId = watchMatch[1];
    }
    
    // URL del tipo: https://youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch) {
      videoId = shortMatch[1];
    }
    
    // Se abbiamo trovato un ID video, crea l'URL embed
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Altrimenti restituisci l'URL originale
    return url;
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
  const imageStyle = "w-full h-auto object-cover max-w-full";
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
            <p className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-primary mb-20 leading-relaxed break-words overflow-wrap-anywhere">
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
            className="group flex flex-col space-y-2 text-primary hover:text-accent cursor-pointer"
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
          <div className={imageContainerStyle}>
            <div className="relative w-full  overflow-hidden " style={{ aspectRatio: '16/9' }}>
              <iframe
                src={getYouTubeEmbedUrl(slice.primary.video.embed_url)}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                title="Project Video"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        )}

        {/* Fallback for video HTML */}
        {slice.primary.video && slice.primary.video.html && !slice.primary.video.embed_url && (
          <div className={imageContainerStyle}>
            <div 
              className="relative w-full overflow-hidden video-container"
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
                <p className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-primary leading-normal">
                  {children}
                </p>
              ),
              hyperlink: ({ node, children }) => (
                <PrismicNextLink 
                  field={node.data}
                  className="underline text-primary hover:text-accent"
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
