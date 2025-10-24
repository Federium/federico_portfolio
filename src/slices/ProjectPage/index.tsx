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
  const hasMedia = projectImages.length > 0 || 
    (slice.primary.video && slice.primary.video.embed_url) ||
    (slice.primary.videotop && 'url' in slice.primary.videotop && slice.primary.videotop.url) ||
    (slice.primary.videobottom && 'url' in slice.primary.videobottom && slice.primary.videobottom.url);

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
      const elementPosition = imageElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 80; // 100px di margine dall'alto

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Stile comune per le immagini - layout a doppia colonna
  const imageContainerStyle = "relative overflow-hidden";
  const imageStyle = "absolute inset-0 w-full h-full object-cover";
  const imageSizes = "(max-width: 768px) 100vw, 50vw";
  const fullWidthImageSizes = "100vw";

  // Tipo per i contenuti media
  type MediaItem = 
    | { type: 'video'; content: { url: string } }
    | { type: 'image'; content: typeof slice.primary.ProjectImg; index?: number }
    | { type: 'youtube'; content: typeof slice.primary.video }
    | { type: 'videohtml'; content: typeof slice.primary.video };

  // Crea array di tutti i contenuti media in ordine
  const allMedia: MediaItem[] = [];
  
  if (slice.primary.videotop && 'url' in slice.primary.videotop && slice.primary.videotop.url) {
    allMedia.push({ type: 'video', content: slice.primary.videotop });
  }
  
  projectImages.forEach((image, index) => {
    allMedia.push({ type: 'image', content: image, index });
  });
  
  if (slice.primary.video && slice.primary.video.html && !slice.primary.video.embed_url) {
    allMedia.push({ type: 'videohtml', content: slice.primary.video });
  }
  
  if (slice.primary.video && slice.primary.video.embed_url) {
    allMedia.push({ type: 'youtube', content: slice.primary.video });
  }
  
  if (slice.primary.videobottom && 'url' in slice.primary.videobottom && slice.primary.videobottom.url) {
    allMedia.push({ type: 'video', content: slice.primary.videobottom });
  }

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {/* Project Text */}
      <div style={{ mixBlendMode: 'difference' }}>
        <PrismicRichText
          field={slice.primary.ProjectText}
          components={{
            paragraph: ({ children }) => (
              <p className="text-base sm:text-base md:text-2xl lg:text-3xl xl:text-4xl text-primary mb-8 leading-relaxed break-words overflow-wrap-anywhere">
                {children}
              </p>
            )
          }}
        />
      </div>
      
      {/* Scroll Down Arrow Button */}
      {hasMedia && (
        <div className="flex mb-12" style={{ mixBlendMode: 'difference' }}>
          <button
            onClick={scrollToImage}
            className="group flex flex-col space-y-2 text-primary hover:text-accent cursor-pointer mt-12"
            aria-label="Scroll to images"
          >
            <span className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">↓</span>
          </button>
        </div>
      )}
      
      {/* Spacer to push images below viewport */}
      <div className="h-[40vh]"></div>
      
      <div id="project-image">
        {/* First media item - full width */}
        {allMedia.length > 0 && (
          <div className="mb-4">
            <div className={imageContainerStyle} style={{ aspectRatio: '16/10' }}>
              {allMedia[0].type === 'video' && (
                <video
                  src={allMedia[0].content.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={imageStyle}
                />
              )}
              {allMedia[0].type === 'image' && (
                <PrismicNextImage
                  field={allMedia[0].content}
                  className={imageStyle}
                  sizes={fullWidthImageSizes}
                />
              )}
              {allMedia[0].type === 'videohtml' && allMedia[0].content.html && (
                <div 
                  className="absolute inset-0 w-full h-full"
                  dangerouslySetInnerHTML={{ __html: allMedia[0].content.html }}
                />
              )}
              {allMedia[0].type === 'youtube' && (
                <iframe
                  src={getYouTubeEmbedUrl(allMedia[0].content.embed_url)}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  title="Project Video"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              )}
            </div>
          </div>
        )}

        {/* Remaining media items - two columns grid */}
        {allMedia.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allMedia.slice(1).map((media, index) => {
              const isLast = index === allMedia.slice(1).length - 1;
              const isOdd = allMedia.slice(1).length % 2 !== 0;
              const shouldBeFullWidth = isLast && isOdd;
              
              return (
                <div 
                  key={index} 
                  className={`${imageContainerStyle} ${shouldBeFullWidth ? 'md:col-span-2' : ''}`} 
                  style={{ aspectRatio: '16/10' }}
                >
                  {media.type === 'video' && (
                    <video
                      src={media.content.url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className={imageStyle}
                    />
                  )}
                  {media.type === 'image' && (
                    <PrismicNextImage
                      field={media.content}
                      className={imageStyle}
                      sizes={shouldBeFullWidth ? fullWidthImageSizes : imageSizes}
                    />
                  )}
                  {media.type === 'videohtml' && media.content.html && (
                    <div 
                      className="absolute inset-0 w-full h-full"
                      dangerouslySetInnerHTML={{ __html: media.content.html }}
                    />
                  )}
                  {media.type === 'youtube' && (
                    <iframe
                      src={getYouTubeEmbedUrl(media.content.embed_url)}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                      title="Project Video"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Return Button - Full Viewport Height at the bottom */}
      {slice.primary.ReturnButton && (
        <div className="h-screen flex items-center" style={{ mixBlendMode: 'difference' }}>
          <PrismicRichText
            field={slice.primary.ReturnButton}
            components={{
              paragraph: ({ children }) => (
                <p className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl text-primary leading-normal">
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
