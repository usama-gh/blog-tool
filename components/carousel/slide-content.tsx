// "use client";

// import React from "react";
import Image from "next/image";
import MDX from "../mdx";
import { Sparkles, Lock } from "lucide-react";
import { SlideStyle, gateSlide } from "@/types";
import { cn, isDefultStyle } from "@/lib/utils";
import { UnblockSlides } from "../gate-slide-unblock";

const SlideContent = ({
  postId,
  index,
  content,
  style,
  gateSlide,
  gateSlideUnblock,
  setGateSlideUnblock,
  scrollNext,
  siteId,
}: {
  index: number;
  postId: string;
  content: any;
  style: SlideStyle | undefined;
  gateSlide: gateSlide | undefined;
  gateSlideUnblock: boolean;
  setGateSlideUnblock: any;
  scrollNext: any;
  siteId: string;
}) => {
  const isGateSlide = gateSlide?.id === index;

  return (
    <>
      <div className="w-full">
        {style?.bgImage && (
          <Image
            alt="Mountains"
            src={style?.bgImage}
            quality={100}
            fill
            sizes="100vw"
            style={{
              objectFit: "cover",
            }}
          />
        )}

        <div
          style={{
            ...(isDefultStyle("bg", style?.bgColor as string)
              ? {}
              : {
                  backgroundColor: style?.bgColor, // Use the provided RGBA value
                  opacity: style?.bgImage ? 0.8 : 1, // Adjust overlay opacity
                }),
          }}
          className={`absolute left-0 top-0 h-full w-full ${style && style.bgColor && !isDefultStyle("bg", style.bgColor) ? "bg-" + style.bgColor : ""}`}

        ></div>

        <div
          className={cn(
            "scrollbar-thumb-rounded-full scrollbar-track-rounded-full relative z-20 my-auto flex flex-col h-screen w-full flex-1 items-center justify-center overflow-y-auto py-10 pt-40 text-slate-600 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:text-gray-400 dark:scrollbar-thumb-gray-800 [&>*]:text-xl",
            isGateSlide && "",
          )}
        >
          {isGateSlide ? (
            <>
              {!gateSlideUnblock ? (
                <>
                
                  <MDX source={content} gated={true} />
                  <UnblockSlides
                    postId={postId}
                    siteId={siteId}
                    gateSlide={gateSlide}
                    setGateSlideUnblock={setGateSlideUnblock}
                  />
                 
                </>
              ) : (
              
                <div className="mx-auto max-w-xl px-6 mb-12 text-center border-2 border-lime-200 py-6 rounded-2xl">
                    {/* <div className="absolute top-0 left-0 h-full w-full  bg-white">
                  
                  </div> */}
                  <div className="relative z-20">
                  <Sparkles strokeWidth={"1.2px"} size={80} className="text-lime-400 mx-auto" />
                  <h4 className="pb-4 text-center text-5xl font-bold tracking-tight bg-gradient-to-r from-lime-500 to-lime-500 inline-block text-transparent bg-clip-text">
                  
                    You've unlocked your exclusive content
        
                  </h4>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-x-2 rounded-lg shadow-lg shadow-lime-600/20 transition-all	 hover:shadow-lime-500/50  bg-gradient-to-tr from-lime-600  to-lime-400 px-6 tracking-wide py-2 text-sm font-semibold uppercase text-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    onClick={scrollNext}
                  >
                  Continue
                  </button>

                  </div>
                 
                </div>
              )}
            
            </>
          ) : (
            <MDX source={content} />
          )}
        </div>
      </div>
    </>
  );
};
export default SlideContent;
