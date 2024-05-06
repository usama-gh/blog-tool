import React, { Dispatch, SetStateAction, useState } from "react";
import { Post } from "@prisma/client";
import { SlideStyle, gateSlide } from "@/types";
import ContentCustomizer from "./editor-content/content-customizer";
import { Trash, Settings2, ChevronRight, ChevronLeft } from "lucide-react";
import { EditorContents } from "./editor-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PostWithSite = Post & { site: { subdomain: string | null } | null };

interface Props {
  index: number;
  data: any;
  post: any;
  setData: Dispatch<SetStateAction<PostWithSite>>;
  updateSlides: any;
  slides: Array<string>;
  setSlides: any;
  slideData: string;
  canUseAI: boolean;
  slidesStyles: SlideStyle[] | [];
  setSlidesStyles: any;
  updateStyleSlides: any;
  gateSlides: gateSlide[] | [];
  setGateSlides: any;
}
export default function ShowSlide(props: Props) {
  const gateSlide = props.gateSlides.find((item) => item.id == props.index + 1);
  const [type, setType] = useState(gateSlide ? gateSlide.type : "email");
  const [link, setLink] = useState(gateSlide ? gateSlide.link : "");

  function handleSlideChange(type: string, e?: any) {
    if (type === "email" || type === "follow") {
      setType(type);
    } else {
      setLink(e.target.value);
    }

    props.setGateSlides(
      props.gateSlides.map((slide: gateSlide) => {
        if (slide.id == props.index + 1) {
          return {
            ...slide,
            type,
            link: e ? e.target.value : link,
          };
        }
      }),
    );
  }

  function handleSwipping(type: "left" | "right", position: number) {
    const currentSlideIndexForStyle = props.index + 1;
    const newSlidePositionForStyle = position + 1;

    const currentSlideContent = props.slides.find(
      (_: string, idx: number) => idx == props.index,
    );

    const isNextSlideIsGated = props.gateSlides.find(
      (slide: gateSlide) => slide.id == newSlidePositionForStyle,
    )
      ? true
      : false;

    if (type === "right") {
      const nextSlideContent = props.slides.find(
        (_: string, idx: number) => idx == position,
      )!;

      // update position for content of slides
      const updatedSlides = props.slides.map(
        (content: string, index: number) => {
          if (index == props.index) {
            return nextSlideContent;
          }
          if (index == position) {
            return currentSlideContent;
          }
          return content;
        },
      );

      props.setSlides(updatedSlides);

      // update position of slides styles
      const updatedStyleSlides = props.slidesStyles.map(
        (slide: SlideStyle, index: number) => {
          if (slide.id == currentSlideIndexForStyle) {
            return {
              ...slide,
              id: newSlidePositionForStyle,
            };
          }
          if (slide.id == newSlidePositionForStyle) {
            return {
              ...slide,
              id: currentSlideIndexForStyle,
            };
          }
          return slide;
        },
      );

      props.setSlidesStyles(updatedStyleSlides);

      // update position of gate slides if side is gated
      if (gateSlide) {
        props.setGateSlides(
          props.gateSlides.map((slide: gateSlide, index: number) => {
            return {
              ...slide,
              id: slide.id + 1,
            };
          }),
        );
      }

      // update next slide is gated
      if (isNextSlideIsGated) {
        props.setGateSlides(
          props.gateSlides.map((slide: gateSlide, index: number) => {
            return {
              ...slide,
              id: position,
            };
          }),
        );
      }
    }

    if (type === "left") {
      const prevSlideContent = props.slides.find(
        (_: string, idx: number) => idx == position,
      )!;

      // update position for content of slides
      const updatedSlides = props.slides.map(
        (content: string, index: number) => {
          if (index == position) {
            return currentSlideContent;
          }
          if (index == props.index) {
            return prevSlideContent;
          }
          return content;
        },
      );

      props.setSlides(updatedSlides);

      // update position of slides styles
      const updatedStyleSlides = props.slidesStyles.map(
        (slide: SlideStyle, index: number) => {
          if (slide.id == currentSlideIndexForStyle) {
            return {
              ...slide,
              id: newSlidePositionForStyle,
            };
          }
          if (slide.id == newSlidePositionForStyle) {
            return {
              ...slide,
              id: currentSlideIndexForStyle,
            };
          }
          return slide;
        },
      );

      props.setSlidesStyles(updatedStyleSlides);

      // update position of gate slides if side is gated
      if (gateSlide) {
        props.setGateSlides(
          props.gateSlides.map((slide: gateSlide, index: number) => {
            return {
              ...slide,
              id: slide.id - 1,
            };
          }),
        );
      }

      // update previus slide is gated
      if (isNextSlideIsGated) {
        props.setGateSlides(
          props.gateSlides.map((slide: gateSlide, index: number) => {
            return {
              ...slide,
              id: props.index + 1,
            };
          }),
        );
      }
    }
  }

  return (
    <div className="group carousel-item	carousel-item relative min-h-[500px] w-[90%] flex-shrink-0  animate-fadeLeft overflow-y-auto">
      {gateSlide && (
        <div>
          <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 transform rounded-full bg-orange-200 px-2 text-sm font-semibold text-black">
            Slides after this will be locked with the gated slide
          </div>
          <Popover>
            <PopoverTrigger className="absolute  bottom-5 left-5 opacity-0 group-hover:opacity-100 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white p-2 shadow-sm">
              <Settings2 strokeWidth={"1.5px"} width={20} />
            </PopoverTrigger>
            <PopoverContent className="mt-2 max-w-sm rounded-xl">
              <div className="rounded text-center ">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Choose Gated Method
                </h3>
                <Tabs
                  defaultValue={type}
                  onValueChange={(value) => handleSlideChange(value)}
                >
                  <TabsList>
                    <TabsTrigger value="email">Subscribe</TabsTrigger>
                    <TabsTrigger value="follow">Follow Link</TabsTrigger>
                  </TabsList>
                  <TabsContent value="email">
                    <p className="text-xs text-gray-400">
                      Subscribe via email to unlock the full slides
                    </p>
                  </TabsContent>
                  <TabsContent value="follow">
                    <Input
                      className="mx-auto max-w-xs"
                      defaultValue={link}
                      onChange={(e) => handleSlideChange("follow", e)}
                      type="email"
                      placeholder="Link to follow"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Unlock slides via links, like social follows or site
                      visits
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      <ContentCustomizer
        style={props.slidesStyles.find(
          (item: SlideStyle) => item.id == props.index + 1,
        )}
        className="group relative h-full max-w-screen-xl overflow-y-auto  rounded-lg bg-slate-100 p-8 dark:bg-gray-900/80 lg:mt-0"
      >
        <>

        
          <div className="opacity-0 group-hover:opacity-100  absolute right-2 top-1 z-20">
        

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">

              {/* <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
        <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-full"
                  onClick={() => handleSwipping("left", props.index - 1)}
                  disabled={props.index == 0}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Move to left</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>


    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
        <Button
                  variant="outline"
                  size="icon"
                
                  className="h-7 w-7 rounded-full"
                  onClick={() => handleSwipping("right", props.index + 1)}
                  disabled={props.index + 1 == props.slides.length}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
        <p>Move to right</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider> */}


            
                
              </div>
              <Trash
                width={14}
                className="cursor-pointer text-red-300 hover:text-red-500"
                onClick={() => {
                  const confirmation = window.confirm(
                    "Are you sure you want to delete?",
                  );
                  if (confirmation) {
                    props.updateSlides("delete", Number(props.index), "");
                  }
                }}
              />
            </div>
          </div>

          <EditorContents
            data={props.data}
            slideData={props.slideData}
            post={props.post}
            slides={props.slides}
            setData={props.setData}
            updateSlides={props.updateSlides}
            index={props.index}
            canUseAI={props.canUseAI}
            slidesStyles={props.slidesStyles}
            updateStyleSlides={props.updateStyleSlides}
          />
          {gateSlide && (
            <div className="z-80 relative">
              {type === "email" ? (
                <div className="mt-5 flex justify-center">
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input type="email" placeholder="Email" />
                    <Button
                      className="bg-gradient-to-tr from-blue-600  to-blue-400 text-white"
                      type="submit"
                    >
                      Subscribe
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-5 flex justify-center">
                  <Button className="bg-gradient-to-tr from-blue-600  to-blue-400 text-white">
                    Click Here
                  </Button>
                </div>
              )}
            </div>
          )}
        </>
      </ContentCustomizer>
    </div>
  );
}
