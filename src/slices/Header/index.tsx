import { FC } from "react";
import { Content } from "@prismicio/client";
/* import { PrismicNextLink } from "@prismicio/next"; */
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

import "../global.css";

type HeaderProps = SliceComponentProps<Content.HeaderSlice>;

const Header: FC<HeaderProps> = ({ slice }) => {
  return (
    <section>
      <PrismicRichText
        field={slice.primary.RichText}
        components={{
          heading1: ({ children }) => (
            <h1 className="text-4xl font-bold tracking-wide text-blue-600">{children}</h1>
          )
        }}
      />
    </section>
  );
};

export default Header;