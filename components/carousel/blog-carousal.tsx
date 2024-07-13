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
import parse from "html-react-parser";

const Carousel = ({ data, siteData, lead }: any) => {
  const stylings: SlideStyle[] | [] = !!data.styling
    ? JSON.parse(data.styling)
    : [];

  const contentStyling: SlideStyle | undefined = stylings.find(
    (item: SlideStyle) => item.id == 0,
  );

  const gateSlides = data.gateSlides ? JSON.parse(data.gateSlides) : [];
  const gateSlide = gateSlides[0];

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
  const [gateSlideUnblock, setGateSlideUnblock] = useState<boolean>(false);

  useEffect(() => {
    const siteIdFromStorage = localStorage.getItem("siteId");
    if (siteIdFromStorage && data.siteId === siteIdFromStorage) {
      setGateSlideUnblock(true);
    }
  }, []);

  const scrollPrev = useCallback(
    () => embla && embla.scrollPrev(true),
    [embla],
  );
  const scrollNext = useCallback(() => {
    const currentSlide = embla ? embla.selectedScrollSnap() + 1 : 0;
    if (!gateSlideUnblock && gateSlide && currentSlide > gateSlide.id) {
      toast.error(`Rest of slides needs to be unlocked`);
      return;
    }

    embla && embla.scrollNext(true);
  }, [embla, gateSlide, gateSlideUnblock]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!gateSlideUnblock && gateSlide && index > gateSlide.id) {
        toast.error(`Rest of slides needs to be unlocked`);
        return;
      }

      embla && embla.scrollTo(index, true);
    },
    [embla, gateSlide, gateSlideUnblock],
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
        <div className="absolute z-50 w-full top-0 flex bg-transparent list-none justify-around gap-x-4">
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
          <div className="relative w-full overflow-hidden" ref={viewportRef}>
            <div className="flex h-fit items-start ">
              <div className="relative h-fit min-w-full  text-slate-50 dark:text-gray-400 ">
                {contentStyling?.bgImage && (
                  <Image
                    alt="Mountains"
                    src={contentStyling?.bgImage}
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
                    ...(isDefultStyle("bg", contentStyling?.bgColor as string)
                      ? {}
                      : {
                          backgroundColor: contentStyling?.bgColor, // Use the provided RGBA value
                          opacity: contentStyling?.bgImage ? 0.8 : 1, // Adjust overlay opacity
                        }),
                  }}
                  className={`absolute left-0 top-0 h-full w-full ${
                    isDefultStyle("bg", contentStyling?.bgColor as string)
                      ? ""
                      : "bg-" + contentStyling?.bgColor
                  }`}
                ></div>

                <div className=" scrollbar-thumb-rounded-full scrollbar-track-rounded-full relative z-20 my-auto flex h-screen w-full items-center justify-center overflow-y-auto py-10 pt-20 text-slate-600 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:text-gray-400 dark:scrollbar-thumb-gray-800 [&>*]:rounded-xl [&>*]:text-lg ">
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
                      index={index + 1}
                      postId={data.id}
                      content={data.slidesMdxSource[index]}
                      style={stylings.find(
                        (item: SlideStyle) => item.id == index + 1,
                      )}
                      gateSlide={gateSlide}
                      gateSlideUnblock={gateSlideUnblock}
                      setGateSlideUnblock={setGateSlideUnblock}
                      scrollNext={scrollNext}
                      siteId={data.siteId}
                      leadSlide={data.leadSlide}
                      lead={lead}
                    />

                    {/* <div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full my-auto flex h-screen w-full flex-1 items-center justify-center overflow-y-auto py-10 text-slate-600 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:text-gray-400 dark:scrollbar-thumb-gray-800 [&>*]:text-xl">
                      <MDX source={data.slidesMdxSource[index]} />
                    </div> */}
                  </div>
                ))}

              {/* showing lead */}
              {/* {lead && (
                <div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full relative mx-auto my-auto mt-0 flex h-screen w-9/12  min-w-full items-center  justify-center overflow-y-auto pb-[120px] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                  <div className="mx-auto max-w-xl px-6">
                    <h4 className="pb-4 text-center text-5xl font-bold tracking-tight text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                      {lead.title}
                    </h4>
                    <div className="font-regular overflow-hidden  text-center text-lg text-slate-800 dark:text-gray-50">
                      <div
                        dangerouslySetInnerHTML={{ __html: lead.description }}
                      />
                    </div>
                    <LeadDownload postId={data.id} lead={lead} />
                  </div>
                </div>
              )} */}

              {/* showing adjacent posts */}
              {data.adjacentPosts.length > 0 && (
                <div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full relative mx-auto h-screen w-9/12 min-w-full  overflow-y-auto bg-slate-200 pb-[120px] pt-40 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:bg-gray-900 dark:scrollbar-thumb-gray-800">
                  <p className="mx-auto mb-10 mb-8 max-w-2xl pb-8 text-center text-4xl font-bold tracking-tight  text-slate-800 dark:bg-gray-900 dark:text-gray-100">
                    Thank you for reading! For more insights & stories, check
                    out my other posts.
                  </p>

                  <section className="body-font text-gray-600">
                    <div className="container mx-auto flex max-w-6xl flex-wrap items-start  gap-x-4 lg:flex-nowrap">
                      <div className="mb-10  pb-10 md:mb-0 md:w-4/12">
                        <div className=" flex flex-col gap-y-4">
                          <div className="flex flex-col items-start justify-start rounded-3xl bg-white dark:bg-gray-700 p-5">
                            <div className="h-[70px] w-[70px] overflow-hidden rounded-full">
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
                            <div className="mt-2 font-semibold tracking-wide text-slate-700">
                              {siteData?.name}
                            </div>
                            <div className="text-left text-sm text-gray-800 dark:text-white ">
                              {parse(siteData?.bio)}
                            </div>

                            <div className="my-2 flex w-full justify-start">
                              <SocialLinks linksData={siteData.links} />
                            </div>
                          </div>

                          <div className="rounded-3xl bg-teal-100 py-6 text-left dark:bg-teal-700">
                            <Subscribe
                              siteId={data.siteId}
                              view="homepage"
                              searchKey={siteData.id}
                              type="siteId"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col md:w-8/12 ">
                        <div className="relative rounded-2xl  text-slate-400  dark:text-gray-400">
                          {data.adjacentPosts && (
                            <>
                              <div className="relative grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                                {data.adjacentPosts
                                  .slice(0, 4)
                                  .map((value: any, index: number) => (
                                    <div key={index}>
                                      <BlogCard key={index} data={value} />
                                    </div>
                                  ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>
          {lead && data.leadSlide && (
            <div className="z-90 fixed bottom-12 left-1/2  -translate-x-1/2 transform lg:bottom-4">
              <div className="flex w-fit items-center justify-between gap-3 rounded-full bg-slate-200 p-1 dark:bg-gray-700">
                <p className="text-dark whitespace-nowrap	 pl-4 text-sm font-semibold">
                  {lead.title}
                </p>
                <button
                  type="button"
                  className="inline-flex	items-center gap-x-2 whitespace-nowrap rounded-full border border-transparent bg-blue-600 px-4 py-1 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  onClick={() =>
                    // scrollTo(
                    //   data.slides ? JSON.parse(data.slides).length + 1 : 1,
                    // )
                    scrollTo(data.leadSlide.id ?? 1)
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
