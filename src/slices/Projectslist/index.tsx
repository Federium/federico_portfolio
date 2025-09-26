import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import AnimatedText from "@/components/AnimatedText";

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
    >
      <PrismicRichText
        field={slice.primary.ProjectsList}
        components={{
          heading1: ({ children }) => (
            <AnimatedText className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-blue-600 leading-loose">
              {children}
            </AnimatedText>
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
              className="underline underline-offset-2 text-blue-600 hover:text-red-600"
            >
              {children}
            </PrismicNextLink>
          ),
          list: ({ children }) => (
            <ul className="list-none list-inside space-y-4 text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-blue-600 break-words overflow-wrap-anywhere">
              {children}
            </ul>
          ),
          oList: ({ children }) => (
            <ol className="list-none list-inside mb-4 space-y-4 text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-blue-600 break-words overflow-wrap-anywhere">
              {children}
            </ol>
          ),
          listItem: ({ children }) => (
            <AnimatedText className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-blue-600 py-4 break-words overflow-wrap-anywhere whitespace-normal">
              {children}
            </AnimatedText>
          ),
        }}
      />
    </section>
  );
};

export default Projectslist;
