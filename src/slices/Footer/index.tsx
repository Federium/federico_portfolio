import { FC } from "react";
import { Content } from "@prismicio/client";
/* import { PrismicNextLink } from "@prismicio/next"; */
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";


type FooterProps = SliceComponentProps<Content.FooterSlice>;

const Footer: FC<FooterProps> = ({ slice }) => {
  return (
    <footer className="" style={{ mixBlendMode: 'difference' }}>
      <PrismicRichText field={slice.primary?.FooterText}
      components={{
          paragraph: ({ children }) => (
            <p className="text-xs sm:text-sm md:text-base text-primary">{children}</p>
          ),
        }}  
        />
    </footer>
  );
};

export default Footer;