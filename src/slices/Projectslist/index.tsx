import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";

/**
 * Props for `Projectslist`.
 */
export type ProjectslistProps = SliceComponentProps<Content.ProjectslistSlice>;

/**
 * Component for "Projectslist" Slices.
 */
const Projectslist: FC<ProjectslistProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-8"
    >
      <PrismicRichText
        field={slice.primary.ProjectsList}
        components={{
          heading1: ({ children }) => (
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-blue-600 mb-6 leading-tight">
              {children}
            </h1>
          ),
          heading2: ({ children }) => (
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-blue-600 mb-4 leading-tight">
              {children}
            </h2>
          ),
          heading3: ({ children }) => (
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-blue-600 mb-4 leading-tight">
              {children}
            </h3>
          ),
          heading4: ({ children }) => (
            <h4 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-blue-600 mb-3 leading-tight">
              {children}
            </h4>
          ),
          heading5: ({ children }) => (
            <h5 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-blue-600 mb-3 leading-tight">
              {children}
            </h5>
          ),
          heading6: ({ children }) => (
            <h6 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-blue-600 mb-2 leading-tight">
              {children}
            </h6>
          ),
          paragraph: ({ children }) => (
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-800 mb-4 leading-relaxed">
              {children}
            </p>
          ),
          preformatted: ({ children }) => (
            <pre className="bg-gray-100 p-4 rounded-lg text-sm sm:text-base font-mono overflow-x-auto mb-4">
              {children}
            </pre>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-blue-600">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-700">
              {children}
            </em>
          ),
          hyperlink: ({ node, children }) => (
            <PrismicNextLink 
              field={node.data}
              className="underline text-blue-600 hover:text-red-600 transition-colors duration-300"
            >
              {children}
            </PrismicNextLink>
          ),
        }}
      />
    </section>
  );
};

export default Projectslist;
