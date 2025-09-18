import { FC } from "react";
import { Content } from "@prismicio/client";
/* import { PrismicNextLink } from "@prismicio/next"; */
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";



type RichTextProps = SliceComponentProps<Content.RichTextSlice>;

const RichText: FC<RichTextProps> = ({ slice }) => {
  return (
    <section>
      <PrismicRichText field={slice.primary?.content}  />
    </section>
  );
};

export default RichText;