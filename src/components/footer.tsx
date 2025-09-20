import { FC } from "react";
import { PrismicRichText } from "@prismicio/react";
import { createClient } from "@/prismicio";

const Footer: FC = async () => {
  const client = createClient();
  
  try {
    const home = await client.getByUID("page", "home");
    const footerSlice: any = home.data.slices.find((slice: any) => slice.slice_type === 'footer');
    
    if (!footerSlice) {
      return null;
    }

    return (
      <footer className="mt-auto py-4 border-t border-gray-200">
        <PrismicRichText 
          field={footerSlice.primary?.FooterText}
          components={{
            paragraph: ({ children }) => (
              <p className="text-sm text-blue-600">
                {children}
              </p>
            ),
          }}  
        />
      </footer>
    );
  } catch (error) {
    return null;
  }
};

export default Footer;