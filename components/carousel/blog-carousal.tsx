"use client";

import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { DotButton, NextButton, PrevButton } from "./carousel-buttons";
import useEmblaCarousel from "embla-carousel-react";
import MDX from "../mdx";
import BlogCard from "../blog-card";

const Carousel = ({ data }: any) => {
  const [viewportRef, embla] = useEmblaCarousel({
    skipSnaps: false,
    watchDrag: false,
    dragFree: true,
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
  }, [embla, setSelectedIndex]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on("select", onSelect);
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
      <div>
        <div className="flex list-none justify-between pt-2.5">
          {scrollSnaps.map((_, index: number) => (
            <DotButton
              key={index}
              totalDots={scrollSnaps.length}
              selected={index === selectedIndex}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
        <div className="mx-auto min-h-[calc(100vh-106px)] w-7/12">
          <div
            className="h-full w-full overflow-hidden py-20"
            ref={viewportRef}
          >
            <div className="flex">
              <div className="relative min-w-full">
                <div className="relative overflow-hidden [&>*]:text-slate-500">
                  <h3 className="mb-8 text-[44px] font-extrabold">
                    {data.title}
                  </h3>
                  <MDX source={data.mdxSource} />
                </div>
              </div>
              {JSON.parse(data.slides).map((value: string, index: number) => (
                <div className="relative min-w-full" key={`slide-${index}`}>
                  <div className="relative overflow-hidden [&>*]:text-[33px] [&>*]:text-slate-500">
                    <p>{value}</p>
                  </div>
                </div>
              ))}
              {data.adjacentPosts.length > 0 && (
                <div className="relative min-w-full">
                  <div className="relative top-2 z-50 flex w-full justify-center">
                    <span className="bg-white px-2 text-sm text-stone-500 dark:bg-black dark:text-stone-400">
                      Continue Reading
                    </span>
                  </div>
                  <div className="relative rounded-[30px] border-2 px-8 py-16 [&>*]:text-slate-500">
                    {data.adjacentPosts && (
                      <>
                        <div className="relative flex justify-between gap-6">
                          {data.adjacentPosts.map(
                            (value: any, index: number) => (
                              <BlogCard key={index} data={value} />
                            ),
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
        <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
      </div>
    </>
  );
};
export default Carousel;
