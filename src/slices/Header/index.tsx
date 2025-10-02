"use client";

import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";



type HeaderProps = SliceComponentProps<Content.HeaderSlice>;

const Header: FC<HeaderProps> = ({ slice }) => {
  return (
    <section style={{ mixBlendMode: 'difference' }}>
      <PrismicRichText
        field={slice.primary.RichText}
        components={{
          heading1: ({ children }) => (
            <h1 
              className="font-bold text-blue-600"
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                lineHeight: '1.2'
              }}
            >
              {children}
            </h1>
          ),
          hyperlink: ({ node, children }) => (
            <PrismicNextLink 
              field={node.data}
              style={{
                textDecoration: 'underline',
                color: 'inherit',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'red';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'inherit';
              }}
            >
              {children}
            </PrismicNextLink>
          )
        }}
      />
    </section>
  );
};

export default Header;