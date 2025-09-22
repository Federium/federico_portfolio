import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";

/**
 * Props for `ProjectPage`.
 */
export type ProjectPageProps = SliceComponentProps<Content.ProjectPageSlice>;

/**
 * Component for "ProjectPage" Slices.
 */
const ProjectPage: FC<ProjectPageProps> = ({ slice }) => {
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
      
      {/* Spacer to push image below viewport */}
      <div className="h-screen"></div>
      
      {/* Project Image */}
      {slice.primary.ProjectImg && slice.primary.ProjectImg.url && (
        <div className="mt-8 mb-8">
          <PrismicNextImage
            field={slice.primary.ProjectImg}
            className="w-full h-auto rounded-lg shadow-lg object-cover max-w-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>
      )}
    </section>
  );
};

export default ProjectPage;
