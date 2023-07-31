"use client";

import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { DotButton, NextButton, PrevButton } from "./carousel-buttons";
import useEmblaCarousel from "embla-carousel-react";
import MDX from "../mdx";
import BlogCard from "../blog-card";
import {
  Facebook,
  GithubIcon,
  InstagramIcon,
  LinkIcon,
  LinkedinIcon,
  MailIcon,
  MessageCircleIcon,
  SendIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";
import { FacebookIcon } from "lucide-react";

const Carousel = ({ data, siteData }: any) => {
  const [viewportRef, embla] = useEmblaCarousel({
    skipSnaps: false,
    watchDrag: false,
    dragFree: true,
  });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState<boolean>(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [scrollSnaps, setScrollSnaps] = useState<Array<ReactNode>>([]);

  const links = JSON.parse(siteData.links);

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
                    <MDX source={data.slidesMdxSource[index]} />
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
                        <div className="mt-5 flex justify-center items-center flex-col">
                          <p className="mb-1 text-[22px] font-extrabold text-stone-500 dark:bg-black dark:text-stone-400">
                            Follow Me
                          </p>
                          <div className="mb-16 mt-5 flex items-center justify-center">
                            {links.facebookLink && (
                              <a
                                href={links.facebookLink}
                                className="ml-1"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FacebookIcon />
                              </a>
                            )}
                            {links.instagramLink && (
                              <a
                                href={links.instagramLink}
                                className="ml-1"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <InstagramIcon />
                              </a>
                            )}
                            {links.twitterLink && (
                              <a
                                href={links.twitterLink}
                                className="ml-1"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <TwitterIcon />
                              </a>
                            )}
                            {links.githubLink && (
                              <a
                                href={links.githubLink}
                                className="ml-1"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <GithubIcon />
                              </a>
                            )}
                            {links.telegramLink && (
                              <a
                                href={links.telegramLink}
                                className="ml-1"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <SendIcon />
                              </a>
                            )}
                            {links.email && (
                              <a
                                href={links.email}
                                className="ml-1"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <MailIcon />
                              </a>
                            )}
                            {links.linkedInLink && (
                              <a
                                href={links.linkedInLink}
                                className="ml-1"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <LinkedinIcon />
                              </a>
                            )}
                            {links.youtubeLink && (
                              <a
                                href={links.youtubeLink}
                                className="ml-1"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <YoutubeIcon />
                              </a>
                            )}
                            {links.whatsappLink && (
                              <a
                                href={links.whatsappLink}
                                className="ml-1"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <MessageCircleIcon />
                              </a>
                            )}
                            {links.websiteLink && (
                              <a
                                href={links.websiteLink}
                                className="ml-1"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <LinkIcon />
                              </a>
                            )}
                          </div>
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
