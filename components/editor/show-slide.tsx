import React, { Dispatch, SetStateAction } from "react";
import { Post } from "@prisma/client";
import { SlideStyle } from "@/types";
import ContentCustomizer from "./editor-content/content-customizer";
import { Trash } from "lucide-react";
import { EditorContents } from "./editor-content";

type PostWithSite = Post & { site: { subdomain: string | null } | null };

interface Props {
  index: number;
  data: any;
  post: any;
  setData: Dispatch<SetStateAction<PostWithSite>>;
  updateSlides: any;
  slides: Array<string>;
  slideData: string;
  canUseAI: boolean;
  slidesStyles: SlideStyle[] | [];
  updateStyleSlides: any;
}
export default function ShowSlide(props: Props) {
  return (
    <div className="carousel-item carousel-item min-h-[500px] w-[90%]  flex-shrink-0 overflow-y-auto">
      <ContentCustomizer
        style={props.slidesStyles.find(
          (item: SlideStyle) => item.id == props.index + 1,
        )}
        className="relative h-full max-w-screen-xl overflow-y-auto  rounded-lg bg-slate-100 p-8 dark:bg-gray-900/80 lg:mt-0"
      >
        <>
          <Trash
            width={18}
            className="absolute right-4 top-4 z-20 cursor-pointer text-red-300 hover:text-red-500"
            onClick={() => {
              const confirmation = window.confirm(
                "Are you sure you want to delete?",
              );
              if (confirmation) {
                props.updateSlides("delete", Number(props.index), "");
              }
            }}
          />
          <EditorContents
            data={props.data}
            slideData={props.slideData}
            post={props.post}
            slides={props.slides}
            setData={props.setData}
            updateSlides={props.updateSlides}
            index={props.index}
            canUseAI={props.canUseAI}
            slidesStyles={props.slidesStyles}
            updateStyleSlides={props.updateStyleSlides}
          />
        </>
      </ContentCustomizer>
    </div>
  );
}
