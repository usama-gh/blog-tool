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

  // Define the touch event handlers
let startX = 0;
let startY = 0;

const handleTouchStart = (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
};

const handleTouchMove = (e) => {
  const deltaX = e.touches[0].clientX - startX;
  const deltaY = e.touches[0].clientY - startY;

  // Adjust these values as needed based on the sensitivity of the swipe
  const swipeThreshold = 50;

  if (Math.abs(deltaX) > swipeThreshold) {
    if (deltaX > 0) {
      scrollPrev();
    } else {
      scrollNext();
    }
  }

  // You can also check deltaY for vertical swipes if needed
};

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

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

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
        <div className="mx-auto my-auto flex items-center">
          <div className="w-full overflow-hidden" ref={viewportRef}>
            <div className="flex h-fit items-start ">
              <div className="h-fit min-w-full text-slate-50  dark:text-gray-400 ">
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
                <div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full relative mx-auto mt-10 h-screen pb-[120px] w-9/12 min-w-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                  <h4 className="pb-8 text-center font-semibold uppercase text-sm tracking-wide text-slate-400 dark:bg-gray-800 dark:text-gray-400">
                    More from {siteData?.name}
                  </h4>
                  <div className="relative mx-auto w-9/12 border border-slate-200 px-8 py-8 text-slate-400 rounded-2xl dark:border-gray-600 dark:text-gray-400">
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
                          <div className="w-full h-[1px] bg-slate-200 dark:bg-gray-600 mb-5"></div>
                          <p className="pb-4 flex space-x-2 items-center text-center font-semibold uppercase text-sm tracking-wide text-slate-400 dark:bg-gray-800 dark:text-gray-400">
                     

  Follow me



                          </p>

                   
                          <div className="h-50 w-50 overflow-hidden rounded-full">
              {siteData?.user?.image ? (
                <BlurImage
                  alt={siteData?.logo ?? "User Avatar"}
                  width={50}
                  height={50}
                  className="h-full w-full scale-100 rounded-full object-cover blur-0 duration-700 ease-in-out"
                  src={siteData?.logo ?? "https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png"}
                />
              ) : (
                <div className="absolute flex h-full w-full select-none items-center justify-center bg-stone-100 text-4xl text-stone-500">
                  ?
                </div>
              )}
            </div> 
            <div className="text-lg text-slate-500 dark:text-gray-400 font-semibold mt-2">
            {siteData?.name}
            </div>
            <div className="text-sm text-slate-400 dark:text-gray-400 ">
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
          <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
        <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
        </div>
      </div>
    </>
  );
};
export default Carousel;
