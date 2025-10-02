import { FC } from "react";
import { PrismicRichText } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { FooterSlice } from "../../prismicio-types";

const Footer: FC = async () => {
  const client = createClient();
  
  try {
    const home = await client.getByUID("page", "home");
    const footerSlice = home.data.slices.find((slice) => slice.slice_type === 'footer') as FooterSlice | undefined;
    
    if (!footerSlice) {
      return null;
    }

    return (
      <footer className="mt-auto py-4 border-t border-gray-200">
        <PrismicRichText 
          field={footerSlice.primary?.FooterText}
          components={{
            paragraph: ({ children }) => (
              <p className="text-sm text-primary">
                {children}
              </p>
            ),
          }}  
        />
      </footer>
    );
  } catch (error) {
    console.error('Error loading footer:', error);
    return null;
  }
};

export default Footer;