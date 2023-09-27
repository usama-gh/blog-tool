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
    align: 'center',
    containScroll:false,
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
    console.log('hellooooooooo')
  }, [embla, setSelectedIndex]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on("select", onSelect);
    
    document.body.style.overflow = 'hidden';

    // Re-enable the window scroll when the component unmounts
    return () => {
      document.body.style.overflow = 'visible';
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
        <div className="mt-1 z-10  flex list-none space-x-2 justify-between">
          {scrollSnaps.map((_, index: number) => (
            <DotButton
              key={index}
              totalDots={scrollSnaps.length}
              selected={index === selectedIndex}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
        <div className="mx-auto my-auto flex items-center  ">
          <div
            className="w-full overflow-hidden"
            ref={viewportRef}
          >
            <div className="flex items-start h-fit ">
              <div className="relative min-w-full h-fit text-slate-50  dark:text-gray-400 ">
              
           
                  
                  <div className="[&>*]:text-xl py-10 text-slate-500 dark:text-gray-400 overflow-y-auto w-full justify-center h-screen flex items-center my-auto">
                  <MDX source={data.mdxSource} />
                  </div>
                
                  
              </div>
             
                
              
              {data.slides &&
  JSON.parse(data.slides).map((value: string, index: number) => (
    <div className={`relative min-w-full  flex items-start justify-center h-fit`}  key={`slide-${index}`}>
      <div className="[&>*]:text-xl py-10 text-slate-500 dark:text-gray-400 overflow-y-auto w-full justify-center h-screen flex items-center my-auto">
        <MDX source={data.slidesMdxSource[index]} />
      </div>
    </div>
  ))}

              {data.adjacentPosts.length > 0 && (
                <div className="relative min-w-full mt-10">
                  <div className="relative top-2 z-50 flex w-full justify-center">
                    <span className="bg-white dark:bg-gray-800 pt-3 px-2 text-sm text-slate-400 dark:bg-black dark:text-gray-400">
                      Continue Reading
                    </span>
                  </div>
                  <div className="relative  border dark:border-gray-700 px-8 py-16 text-slate-500 dark:text-gray-400">
                    {data.adjacentPosts && (
                      <>
                        <div className="relative flex justify-between gap-6 flex-col sm:flex-col md:flex-col lg:flex-row">
                          {data.adjacentPosts.map(
                            (value: any, index: number) => (
                              <BlogCard key={index} data={value} />
                            ),
                          )}
                        </div>
                        <div className="mt-8 flex justify-center items-center flex-col">
                          <p className="mb-1 text-[22px] font-bold text-slate-500 dark:bg-bg-gray-800 dark:text-gray-400">
                            Follow Me
                          </p>
                                <div className="h-50 w-50 mb-5 overflow-hidden rounded-full align-middle">
                      {data.user?.image ? (
                        <BlurImage
                          alt={data.user?.name ?? "User Avatar"}
                          width={50}
                          height={50}
                          className="h-full w-full object-cover"
                          src={data.user?.image}
                        />
                      ) : (
                        <div className="absolute flex h-full w-full select-none items-center justify-center bg-stone-100 text-4xl text-stone-500">
                          ?
                        </div>
                      )}
                    </div>
                          <SocialLinks linksData={siteData.links}/>
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