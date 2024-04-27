import React, { Dispatch, SetStateAction, useState } from "react";
import { Post } from "@prisma/client";
import { SlideStyle, gateSlide } from "@/types";
import ContentCustomizer from "./editor-content/content-customizer";
import { Trash, Settings2 } from "lucide-react";
import { EditorContents } from "./editor-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  slideData: string;
  canUseAI: boolean;
  slidesStyles: SlideStyle[] | [];
  updateStyleSlides: any;
  gateSlides: gateSlide[] | [];
  setGateSlides: any;
}
export default function ShowSlide(props: Props) {
  const gateSlide = props.gateSlides.find((item) => item.id == props.index + 1);
  const [type, setType] = useState(gateSlide ? gateSlide.type : "email");
  const [link, setLink] = useState(gateSlide ? gateSlide.link : "");

  function handleSlideChange(type: string, e?: any) {
    console.log("type changed", type);

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

  return (
    <div className="carousel-item carousel-item relative min-h-[500px] w-[90%]  flex-shrink-0 overflow-y-auto">
      {gateSlide && (
        <div>
          <Popover>
            <PopoverTrigger className="absolute  bottom-5 left-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white p-2 shadow-sm">
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
        className="relative h-full max-w-screen-xl overflow-y-auto  rounded-lg bg-slate-100 p-8 dark:bg-gray-900/80 lg:mt-0"
      >
        <>
          <Trash
            width={18}
            className="absolute right-4 top-4 z-20 cursor-pointer text-red-300 hover:text-red-500"
            onClick={() => {
              const confirmation = window.confirm(
                "Are you sure you want to delete?",
              );
              if (confirmation) {
                props.updateSlides("delete", Number(props.index), "");
              }
            }}
          />

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
            <div>
              {type === "email" ? (
                <div className="mt-5 flex justify-center">
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input type="email" placeholder="Email" />
                    <Button
                      className="bg-gradient-to-tr from-lime-600  to-lime-400 text-black"
                      type="submit"
                    >
                      Subscribe
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-5 flex justify-center">
                  <Button className="bg-gradient-to-tr from-lime-600  to-lime-400 text-black">
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
