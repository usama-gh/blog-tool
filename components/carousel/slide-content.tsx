// "use client";

// import React from "react";
import Image from "next/image";
import MDX from "../mdx";
import { SlideStyle } from "@/types";
import { isDefultStyle } from "@/lib/utils";

const SlideContent = ({
  content,
  style,
}: {
  content: any;
  style: SlideStyle | undefined;
}) => {
  return (
    <>
    <div className="w-full" style={{
      backgroundImage: `url(${style?.bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
         <div
       style={{
        backgroundColor: style?.bgColor, // Use the provided RGBA value
        opacity: isDefultStyle("bg", style?.bgColor as string) ? 0 : 0.8, // Adjust overlay opacity
      }}
        className={`absolute top-0 left-0 w-full h-full ${
          isDefultStyle("bg", style?.bgColor as string) ? "" : "bg-" + style?.bgColor
        }}`} // Adjust overlay opacity
      ></div>

<div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full relative z-20 my-auto pt-40 flex h-screen w-full flex-1 items-center justify-center overflow-y-auto py-10 text-slate-600 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:text-gray-400 dark:scrollbar-thumb-gray-800 [&>*]:text-xl">
        <MDX source={content} />
      </div>
    </div>
     
      
    </>
  );
};
export default SlideContent;
