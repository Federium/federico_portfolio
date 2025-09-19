import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps, JSXMapSerializer } from "@prismicio/react";

const components: JSXMapSerializer = {
  hyperlink: ({ node, children }) => {
    return (
      <PrismicNextLink 
        field={node.data}
        style={{ 
          color: 'blue',
          textDecoration: 'underline',
          transition: 'color 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'red';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'blue';
        }}
      >
        {children}
      </PrismicNextLink>
    );
  },
};



type RichTextProps = SliceComponentProps<Content.HeaderSlice>;

const RichText: FC<RichTextProps> = ({ slice }) => {
  return (
    <section>
      <PrismicRichText field={slice.primary?.RichText} components={components} />
    </section>
  );
};

export default RichText;