// "use client";

// import React from "react";
import Image from "next/image";
import MDX from "../mdx";
import { SlideStyle } from "@/types";

const SlideContent = ({
  content,
  style,
}: {
  content: any;
  style: SlideStyle | undefined;
}) => {
  return (
    <>
      {style?.bgImage && (
        <Image
          layout="fill"
          className="pointer-events-none object-cover object-center"
          src={style.bgImage}
          alt="image"
        />
      )}
      {style?.bgColor && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: style.bgColor,
          }}
        />
      )}
      <div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full my-auto flex h-screen w-full flex-1 items-center justify-center overflow-y-auto py-10 text-slate-600 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:text-gray-400 dark:scrollbar-thumb-gray-800 [&>*]:text-xl">
        <MDX source={content} />
      </div>
    </>
  );
};
export default SlideContent;
