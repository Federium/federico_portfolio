"use client";

import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";



type HeaderProps = SliceComponentProps<Content.HeaderSlice>;

const Header: FC<HeaderProps> = ({ slice }) => {
  return (
    <section>
      <PrismicRichText
                field={slice.primary.RichText}
                components={{
                  heading1: ({ children }) => (
                    <h1
                      className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-primary !leading-normal font-mono"
                      style={{ mixBlendMode: 'difference' }}
                    >
                      {children}
                    </h1>
                  ),
                  hyperlink: ({ node, children }) => (
                    <PrismicNextLink 
                      field={node.data}
                      className="underline underline-offset-2 text-primary hover:text-accent"
                      style={{ mixBlendMode: 'difference' }}
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