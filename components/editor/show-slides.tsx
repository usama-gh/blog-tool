import React, { Dispatch, SetStateAction } from "react";
import { Post } from "@prisma/client";
import { SlideStyle } from "@/types";
import ShowSlide from "./show-slide";

type PostWithSite = Post & { site: { subdomain: string | null } | null };

interface Props {
  data: any;
  post: any;
  setData: Dispatch<SetStateAction<PostWithSite>>;
  updateSlides: any;
  slides: Array<string>;
  canUseAI: boolean;
  slidesStyles: SlideStyle[] | [];
  updateStyleSlides: any;
}
export default function ShowSlides(props: Props) {
  return (
    <>
      {props.slides.map((slideData: string, index: number) => (
        <ShowSlide
          key={`divslide-${index}`}
          data={props.data}
          slideData={slideData}
          post={props.post}
          slides={props.slides}
          setData={props.setData}
          updateSlides={props.updateSlides}
          index={index}
          canUseAI={props.canUseAI}
          slidesStyles={props.slidesStyles}
          updateStyleSlides={props.updateStyleSlides}
        />
      ))}
    </>
  );
}
