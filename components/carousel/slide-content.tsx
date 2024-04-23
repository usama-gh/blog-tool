// "use client";

// import React from "react";
import Image from "next/image";
import MDX from "../mdx";
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
          className={`absolute left-0 top-0 h-full w-full ${
            isDefultStyle("bg", style?.bgColor as string)
              ? ""
              : "bg-" + style?.bgColor
          }}`} // Adjust overlay opacity
        ></div>

        <div
          className={cn(
            "scrollbar-thumb-rounded-full scrollbar-track-rounded-full relative z-20 my-auto flex h-screen w-full flex-1 items-center justify-center overflow-y-auto py-10 pt-40 text-slate-600 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:text-gray-400 dark:scrollbar-thumb-gray-800 [&>*]:text-xl",
            isGateSlide && "",
          )}
        >
          {isGateSlide ? (
            <>
              {!gateSlideUnblock ? (
                <>
                  <MDX source={content} />
                  <UnblockSlides
                    postId={postId}
                    siteId={siteId}
                    gateSlide={gateSlide}
                    setGateSlideUnblock={setGateSlideUnblock}
                  />
                </>
              ) : (
                <div className="mx-auto max-w-xl px-6">
                  <h4 className="pb-4 text-center text-3xl font-bold tracking-tight text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                    Thank you for{" "}
                    {gateSlide.type == "email" ? "subscribe" : "follow"}
                  </h4>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    onClick={scrollNext}
                  >
                    Go to Next Slide
                  </button>
                </div>
              )}
              {/* <MDX source={content} />
              {!gateSlideUnblock && (
                <UnblockSlides
                  postId={postId}
                  gateSlide={gateSlide}
                  setGateSlideUnblock={setGateSlideUnblock}
                />
              )} */}
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
