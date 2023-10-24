"use client";

import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { DotButton, NextButton, PrevButton } from "./carousel-buttons";
import useEmblaCarousel from "embla-carousel-react";
import BlurImage from "@/components/blur-image";
import MDX from "../mdx";
import BlogCard from "../blog-card";
import SocialLinks from "../social-links";

const Carousel = ({ data, siteData }: any) => {
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
    console.log("hellooooooooo");
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

  return (
    <>
      <div className="relative">
        <div className="flex list-none justify-between space-x-2">
          {scrollSnaps.map((_, index: number) => (
            <DotButton
              key={index}
              totalDots={scrollSnaps.length}
              selected={index === selectedIndex}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
        <div className="mx-auto my-auto flex items-center relative ">
          <div className="w-full overflow-hidden" ref={viewportRef}>
            <div className="flex h-fit items-start ">
              <div className="relative h-fit min-w-full text-slate-50  dark:text-gray-400 ">
                <div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full my-auto flex h-screen w-full items-center justify-center overflow-y-auto py-10 text-slate-600 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:text-gray-400 dark:scrollbar-thumb-gray-800 [&>*]:text-xl [&>*]:rounded-xl ">
                  <MDX source={data.mdxSource} />
                </div>
              </div>

              {data.slides &&
                JSON.parse(data.slides).map((value: string, index: number) => (
                  <div
                    className={`relative flex  h-fit min-w-full items-start justify-center`}
                    key={`slide-${index}`}
                  >
                    <div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full my-auto flex h-screen w-full items-center justify-center overflow-y-auto py-10 text-slate-600 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:text-gray-400 dark:scrollbar-thumb-gray-800 [&>*]:text-xl ">
                      <MDX source={data.slidesMdxSource[index]} />
                    </div>
                  </div>
                ))}

              {data.adjacentPosts.length > 0 && (
                <div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full relative mx-auto mt-10 h-screen w-9/12 min-w-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                  <h4 className="pb-8 text-center font-semibold uppercase text-sm tracking-wide text-slate-400 dark:bg-gray-800 dark:text-gray-400">
                    Continue Reading MORE...
                  </h4>
                  <div className="relative mx-auto w-9/12 border px-8 py-4 text-slate-500 dark:border-gray-700 dark:text-gray-400">
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
                          <p className="dark:bg-bg-gray-800 mb-1 text-[22px] font-bold text-slate-500 dark:text-gray-400">
                            Follow Me
                          </p>
                          <div className="h-50 w-50 mb-5 overflow-hidden rounded-full align-middle">
                            {siteData?.user?.image ? (
                              <BlurImage
                                alt={siteData.user?.name ?? "User Avatar"}
                                width={50}
                                height={50}
                                className="h-full w-full object-cover"
                                src={siteData?.user?.image}
                              />
                            ) : (
                              <div className="absolute flex h-full w-full select-none items-center justify-center bg-stone-100 text-4xl text-stone-500">
                                ?
                              </div>
                            )}
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
          <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
        <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
        </div>
      </div>
    </>
  );
};
export default Carousel;
