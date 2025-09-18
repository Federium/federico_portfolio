import { FC } from "react";
import { Content } from "@prismicio/client";
/* import { PrismicNextLink } from "@prismicio/next"; */
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";



type RichTextProps = SliceComponentProps<Content.HeaderSlice>;

const RichText: FC<RichTextProps> = ({ slice }) => {
  return (
    <section>
      <PrismicRichText field={slice.primary?.RichText}  />
    </section>
  );
};

export default RichText;