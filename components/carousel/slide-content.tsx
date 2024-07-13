// "use client";

// import React from "react";
import Image from "next/image";
import MDX from "../mdx";
import { Sparkles, Lock } from "lucide-react";
import { SlideStyle, gateSlide, leadSlide } from "@/types";
import { cn, isDefultStyle } from "@/lib/utils";
import { UnblockSlides } from "../gate-slide-unblock";
import { Lead } from "@prisma/client";
import { LeadDownload } from "../lead-download";

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
  leadSlide,
  lead,
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
  leadSlide: leadSlide | null;
  lead: Lead | null;
}) => {
  const isGateSlide = gateSlide?.id === index;
  const isLeadSlide = leadSlide?.id === index;

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
            style && style.bgColor && !isDefultStyle("bg", style.bgColor)
              ? "bg-" + style.bgColor
              : ""
          }`}
        ></div>

        <div
          className={cn(
            "h-screen overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full relative z-20  flex w-full items-start justify-start my-auto  py-10 pt-20 text-slate-600 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:text-gray-400 dark:scrollbar-thumb-gray-800 [&>*]:rounded-xl [&>*]:text-lg ",
            (isGateSlide || isLeadSlide) && "flex-col",
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
                <div className="mx-auto mb-12 max-w-xl rounded-2xl border-2 border-blue-400 px-6 py-6 text-center shadow-md shadow-blue-200/40">
                  {/* <div className="absolute top-0 left-0 h-full w-full  bg-white">
                  
                  </div> */}
                  <div className="relative z-20">
                    <Sparkles
                      strokeWidth={"1.2px"}
                      size={80}
                      className="mx-auto text-blue-400"
                    />
                    <h4 className="inline-block bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text pb-4 text-center text-5xl font-bold tracking-tight text-transparent">
                      You've unlocked your exclusive content
                    </h4>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-x-2 rounded-lg bg-gradient-to-tr from-blue-400 to-blue-600	 px-6  py-2 text-sm  font-semibold uppercase tracking-wide text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-blue-500/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                      onClick={scrollNext}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : isLeadSlide && lead ? (
            <>
              <MDX source={content} gated={true} />
              <LeadDownload postId={postId} lead={lead} />
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
