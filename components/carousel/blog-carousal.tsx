"use client";

import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { DotButton, NextButton, PrevButton } from "./carousel-buttons";
import useEmblaCarousel from "embla-carousel-react";
import BlurImage from "@/components/blur-image";
import Image from "next/image";
import MDX from "../mdx";
import BlogCard from "../blog-card";
import SocialLinks from "../social-links";
import useSwipe from "@/lib/hooks/useSwipe";
import { toast } from "sonner";
/* @ts-ignore*/
import { MarkdownRenderer } from "markdown-react-renderer";
import { LeadDownload } from "../lead-download";
import { Subscribe } from "../subscribe";
import { SlideStyle } from "@/types";
import SlideContent from "./slide-content";
import { isDefultStyle } from "@/lib/utils";

const Carousel = ({ data, siteData, lead }: any) => {
  const stylings: SlideStyle[] | [] = !!data.styling
    ? JSON.parse(data.styling)
    : [];

  const contentStyling: SlideStyle | undefined = stylings.find(
    (item: SlideStyle) => item.id == 0,
  );

  const [viewportRef, embla] = useEmblaCarousel({
    skipSnaps: false,
    watchDrag: false,
    dragFree: true,
    align: "center",
    containScroll: false,
  });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState<boolean>(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [scrollSnaps, setScrollSnaps] = useState<Array<ReactNode>>([]);

  const scrollPrev = useCallback(
    () => embla && embla.scrollPrev(true),
    [embla],
  );
  const scrollNext = useCallback(
    () => embla && embla.scrollNext(true),
    [embla],
  );
  const scrollTo = useCallback(
    (index: number) => embla && embla.scrollTo(index, true),
    [embla],
  );

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());

    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, [embla, setSelectedIndex]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on("select", onSelect);

    document.body.style.overflow = "hidden";
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    // Re-enable the window scroll when the component unmounts
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [embla, setScrollSnaps, onSelect]);

  // listen to Left and Right arrow and override the default behavior
  useEffect(() => {
    onkeydown = (e) => {
      if (e.key === "ArrowRight") {
        scrollNext();
      } else if (e.key === "ArrowLeft") {
        scrollPrev();
      }
    };
  });

  const swipeHandlers = useSwipe({
    onSwipedLeft: () => scrollNext(),
    onSwipedRight: () => scrollPrev(),
  });

  return (
    <>
      <div className="relative" {...swipeHandlers}>
        <div className="flex list-none justify-between space-x-2 relative z-30">
          {scrollSnaps.map((_, index: number) => (
            <DotButton
              key={index}
              totalDots={scrollSnaps.length}
              selected={index === selectedIndex}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
        <div className="mx-auto my-auto flex items-center">
          <div className="w-full overflow-hidden relative" ref={viewportRef}>
      

            <div className="flex h-fit items-start ">
              <div className="relative h-fit min-w-full  text-slate-50 dark:text-gray-400 "
              >


{contentStyling?.bgImage && (
  <Image
    alt="Mountains"
    src={contentStyling?.bgImage}
   
    quality={100}
    fill
    sizes="100vw"
    style={{
      objectFit: 'cover',
    }}
  />
)}


              <div

style={{
  ...(isDefultStyle("bg", contentStyling?.bgColor as string)
    ? {}
    : {
        backgroundColor: contentStyling?.bgColor, // Use the provided RGBA value
        opacity: contentStyling?.bgImage ? 0.8 : 1, // Adjust overlay opacity
      }),
}}

    
        className={`absolute top-0 left-0 w-full h-full ${
          isDefultStyle("bg", contentStyling?.bgColor as string) ? "" : "bg-" + contentStyling?.bgColor
        }}`} // Adjust overlay opacity
      ></div>

              



               

                <div className=" relative z-20 scrollbar-thumb-rounded-full scrollbar-track-rounded-full relative my-auto pt-20 flex h-screen w-full items-center justify-center overflow-y-auto py-10 text-slate-600 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:text-gray-400 dark:scrollbar-thumb-gray-800 [&>*]:rounded-xl [&>*]:text-lg ">
                  <MDX source={data.mdxSource} />
                </div>
              </div>

              {data.slides &&
                JSON.parse(data.slides).map((value: string, index: number) => (
                  <div
                    className={`relative flex h-fit min-w-full items-start justify-center`}
                    key={`slide-${index}`}
                  >
                    <SlideContent
                      key={index + 1}
                      content={data.slidesMdxSource[index]}
                      style={stylings.find(
                        (item: SlideStyle) => item.id == index + 1,
                      )}
                    />
                    {/* <div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full my-auto flex h-screen w-full flex-1 items-center justify-center overflow-y-auto py-10 text-slate-600 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:text-gray-400 dark:scrollbar-thumb-gray-800 [&>*]:text-xl">
                      <MDX source={data.slidesMdxSource[index]} />
                    </div> */}
                  </div>
                ))}

              {/* showing lead */}
              {lead && (
                <div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full relative mx-auto my-auto mt-0 flex h-screen w-9/12  min-w-full items-center  justify-center overflow-y-auto pb-[120px] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                  <div className="mx-auto max-w-xl px-6">
                    <h4 className="pb-4 text-center text-3xl font-bold tracking-tight text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                      {lead.title}
                    </h4>
                    <div className="font-regular overflow-hidden  text-center text-lg text-slate-800 dark:text-gray-50">
                      {/* @ts-ignore*/}
                      <MarkdownRenderer markdown={lead.description} />
                    </div>
                    {/* <p className="pb-8 text-center text-lg font-normal tracking-wide text-gray-600  dark:text-gray-300">
                      {lead.description}
                    </p> */}
                    <LeadDownload postId={data.id} lead={lead} />
                  </div>
                </div>
              )}

              {/* showing adjacent posts */}
              {data.adjacentPosts.length > 0 && (
                <div className="pt-40 scrollbar-thumb-rounded-full scrollbar-track-rounded-full relative mx-auto  h-screen w-9/12 min-w-full overflow-y-auto pb-[120px] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                  <h4 className="pb-8 text-center text-sm font-semibold uppercase tracking-wide text-slate-400 dark:bg-gray-800 dark:text-gray-400">
                    More from {siteData?.name}
                  </h4>
                  {/* susbcribe to blog */}
                  <Subscribe siteId={data.siteId} />

                  <div className="relative mx-auto w-9/12 rounded-2xl border border-slate-200 px-8 py-8 text-slate-400 dark:border-gray-600 dark:text-gray-400">
                    {data.adjacentPosts && (
                      <>
                        <div className="relative grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                          {data.adjacentPosts
                            .slice(0, 4)
                            .map((value: any, index: number) => (
                              <div key={index}>
                                <BlogCard key={index} data={value} />
                              </div>
                            ))}
                        </div>
                        <div className="mt-8 flex flex-col items-center justify-center">
                          <div className="mb-5 h-[1px] w-full bg-slate-200 dark:bg-gray-600"></div>
                          <p className="flex items-center space-x-2 pb-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-400 dark:bg-gray-800 dark:text-gray-400">
                            Follow me
                          </p>

                          <div className="h-[70px] w-[70px] overflow-hidden rounded-full border-4 border-slate-300 dark:border-gray-700">
                            {siteData?.logo ? (
                              <BlurImage
                                alt={siteData?.logo ?? "User Avatar"}
                                width={70}
                                height={70}
                                className="h-full w-full scale-100 rounded-full object-cover blur-0 duration-700 ease-in-out"
                                src={
                                  siteData?.logo ??
                                  "https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png"
                                }
                              />
                            ) : (
                              <div className="absolute flex h-full w-full select-none items-center justify-center bg-stone-100 text-4xl text-stone-500">
                                ?
                              </div>
                            )}
                          </div>
                          <div className="mt-2 bg-gradient-to-br	 from-slate-600 to-slate-300 bg-clip-text text-lg font-bold text-slate-500 text-transparent  drop-shadow-md dark:from-gray-200 dark:to-gray-500">
                            {siteData?.name}
                          </div>
                          <div className="bg-gradient-to-br from-slate-600 to-slate-300	 bg-clip-text text-center text-sm text-transparent drop-shadow-md dark:from-gray-200 dark:to-gray-500 ">
                            {siteData?.bio}
                          </div>

                          <SocialLinks linksData={siteData.links} />
                        </div>
                      </>
                    )}
                    
                  </div>
                </div>
              )}
            </div>
          </div>
          {lead && (
            <div className="z-90 fixed bottom-12 left-1/2  -translate-x-1/2 transform lg:bottom-4">
              <div className="flex w-fit items-center justify-between gap-3 rounded-full bg-slate-200 p-1 dark:bg-gray-200">
                <p className="text-dark whitespace-nowrap	 pl-4 text-sm font-semibold">
                  {lead.title}
                </p>
                <button
                  type="button"
                  className="inline-flex	items-center gap-x-2 whitespace-nowrap rounded-full border border-transparent bg-blue-600 px-4 py-1 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  onClick={() =>
                    scrollTo(
                      data.slides ? JSON.parse(data.slides).length + 1 : 1,
                    )
                  }
                >
                  {lead.buttonCta}
                </button>
              </div>
            </div>
          )}
          <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
          <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
        </div>
      </div>
    </>
  );
};
export default Carousel;
