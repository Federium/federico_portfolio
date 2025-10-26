import { FC } from "react";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { HeaderSlice } from "../../prismicio-types";
import { EmojiText } from "./EmojiText";
import { RotatingHeader } from "./RotatingHeader";
import { TypewriterName } from "./TypewriterName";

// Funzione helper per estrarre testo da ReactNode
const extractTextFromChildren = (children: React.ReactNode): string => {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) {
    return children.map(child => {
      if (typeof child === 'string') return child;
      if (child && typeof child === 'object' && 'props' in child) {
        return extractTextFromChildren((child as any).props.children);
      }
      return '';
    }).join('');
  }
  if (children && typeof children === 'object' && 'props' in children) {
    return extractTextFromChildren((children as any).props.children);
  }
  return '';
};

const Header: FC = async () => {
  const client = createClient();
  
  try {
    const home = await client.getByUID("page", "home");
    const headerSlice = home.data.slices.find(
      (slice) => slice.slice_type === 'header'
    ) as HeaderSlice | undefined;
    
    if (!headerSlice) {
      return null;
    }

    return (
      <header>
        <RotatingHeader>
          <PrismicRichText
            field={headerSlice.primary.RichText}
            components={{
              heading1: ({ children }) => {
                const text = extractTextFromChildren(children);
                const hasFedericoMorsia = /Federico Morsia/.test(text);

                return (
                  <EmojiText
                    className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl text-primary !leading-normal font-mono"
                  >
                    {hasFedericoMorsia ? <TypewriterName>{children}</TypewriterName> : children}
                  </EmojiText>
                );
              },
              hyperlink: ({ node, children }) => (
                <PrismicNextLink 
                  field={node.data}
                  className="underline underline-offset-2 text-primary hover:text-accent"
                >
                  {children}
                </PrismicNextLink>
              )
            }}
          />
        </RotatingHeader>
      </header>
    );
  } catch (error) {
    console.error('Error loading header:', error);
    return null;
  }
};

export default Header