import React, { Dispatch, SetStateAction, useState } from "react";
import { Post } from "@prisma/client";
import { SlideStyle, gateSlide } from "@/types";
import ContentCustomizer from "./editor-content/content-customizer";
import { Trash } from "lucide-react";
import { EditorContents } from "./editor-content";
import { cn } from "@/lib/utils";

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
  gateSlides: gateSlide[] | [];
  setGateSlides: any;
}
export default function ShowSlide(props: Props) {
  const gateSlide = props.gateSlides.find((item) => item.id == props.index + 1);
  const [type, setType] = useState(gateSlide ? gateSlide.type : "email");
  const [link, setLink] = useState(gateSlide ? gateSlide.link : "");

  function handleSlideChange(type: string, e?: any) {
    if (type === "email" || type === "follow") {
      setType(type);
    } else {
      setLink(e.target.value);
    }

    props.setGateSlides(
      props.gateSlides.map((slide: gateSlide) => {
        if (slide.id == props.index + 1) {
          return {
            ...slide,
            type,
            link: e ? e.target.value : link,
          };
        }
      }),
    );
  }

  return (
    <div className="carousel-item carousel-item min-h-[500px] w-[90%]  flex-shrink-0 overflow-y-auto">
      {gateSlide && (
        <div className="w-48 rounded bg-gray-200 p-1 text-black">
          <h5 className="text-md text-black">Method</h5>
          <div className="mt-2 flex items-center gap-2 bg-transparent">
            <button
              type="button"
              onClick={() => handleSlideChange("email")}
              className={cn(
                "mb-2 me-2 rounded-lg border border-blue-700 px-2 py-1 text-center text-sm font-medium text-blue-700 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-0 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800",
                type === "email" && "bg-blue-800 text-white",
              )}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => handleSlideChange("follow")}
              className={cn(
                "mb-2 me-2 rounded-lg border border-blue-700 px-2 py-1 text-center text-sm font-medium text-blue-700 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-0 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800",
                type === "follow" && "bg-blue-800 text-white",
              )}
            >
              Follow
            </button>
          </div>
          {type === "follow" && (
            <input
              defaultValue={link}
              onChange={(e) => handleSlideChange("link", e)}
              type="text"
              placeholder="Link"
              className="dark:placeholder-text-600 font-inter text-md mb-2 w-full rounded-md border-none bg-slate-100 px-2 py-1 placeholder:text-gray-400 focus:outline-none focus:ring-0 dark:bg-black dark:bg-gray-900/80 dark:text-white"
            />
          )}
        </div>
      )}

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
