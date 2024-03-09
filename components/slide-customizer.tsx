"use client";

import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

const SlideCustomizer = () => {
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#f1f5f9");
  const [image, setImage] = useState("");
  const imageRef = useRef(null);

  function openImageDialog() {
    // @ts-ignore
    imageRef?.current?.click();
  }

  function handleImageUpload(e: any) {
    const file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      const dataURL = reader.result;
      setImage(dataURL as string);
    };
  }

  return (
    <div className="absolute bottom-5 right-5 rounded-full bg-white px-3 py-2 shadow-sm">
      <div className="flex items-center gap-x-2">
        <div className="flex items-center space-x-2">
          <p className="text-xs text-gray-500">TEXT</p>
          {/* <div
            className={`shadow-base h-5 w-5 cursor-pointer rounded-full ${textColor}`}
          ></div> */}
          <input
            type="color"
            className="input-color"
            defaultValue={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />
        </div>
        <div className="h-4 w-[2px] bg-gray-200"></div>
        <div className="flex items-center space-x-2">
          <p className="text-xs text-gray-500">BG</p>
          {/* <div className="shadow-base h-5 w-5 rounded-full bg-red-600"></div> */}
          <input
            type="color"
            className="input-color"
            defaultValue={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600"
            onClick={openImageDialog}
          >
            <ImageIcon strokeWidth={"1.5px"} width={20} />
          </button>
          <input
            type="file"
            ref={imageRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          {image && (
            <>
              {/* <Image
                className="h-6 rounded-lg"
                src="https://lh3.googleusercontent.com/JjewRHousCsko0Q3ZgeYV63GurlKuHv_m7eCMSjTOeQIs_M4CEINyAsc9qmh4P04Bg8gOlDRa9LjaHDT8IvjSWmoZGZ0ny8S5aAAweM=s3000"
                width={40}
                height={25}
                alt="background image"
              /> */}
              <img
                className="h-6 rounded-lg"
                src={`${image}`}
                alt="background image"
              />
              <button
                type="button"
                className="text-xs text-red-400"
                onClick={() => setImage("")}
              >
                Remove
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlideCustomizer;
