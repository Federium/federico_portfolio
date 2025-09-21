import { FC } from "react";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { HeaderSlice } from "../../prismicio-types";

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
        <PrismicRichText
          field={headerSlice.primary.RichText}
          components={{
            heading1: ({ children }) => (
              <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-blue-600 leading-normal">
                {children}
              </h1>
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
      </header>
    );
  } catch (error) {
    console.error('Error loading header:', error);
    return null;
  }
};

export default Header