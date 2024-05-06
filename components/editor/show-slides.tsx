import React, { Dispatch, SetStateAction } from "react";
import { Post } from "@prisma/client";
import { SlideStyle, gateSlide } from "@/types";
import ShowSlide from "./show-slide";


type PostWithSite = Post & { site: { subdomain: string | null } | null };

interface Props {
  data: any;
  post: any;
  setData: Dispatch<SetStateAction<PostWithSite>>;
  updateSlides: any;
  slides: Array<string>;
  setSlides: any;
  canUseAI: boolean;
  slidesStyles: SlideStyle[] | [];
  setSlidesStyles: any;
  updateStyleSlides: any;
  gateSlides: gateSlide[] | [];
  setGateSlides: any;
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
          setSlides={props.setSlides}
          setData={props.setData}
          updateSlides={props.updateSlides}
          index={index}
          canUseAI={props.canUseAI}
          slidesStyles={props.slidesStyles}
          setSlidesStyles={props.setSlidesStyles}
          updateStyleSlides={props.updateStyleSlides}
          gateSlides={props.gateSlides}
          setGateSlides={props.setGateSlides}
        />
      ))}
    </>
  );
}
