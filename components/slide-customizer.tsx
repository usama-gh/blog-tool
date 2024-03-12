"use client";

import { convertRgba, convertToRgba } from "@/lib/utils";
import { SlideStyle } from "@/types";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { RgbaColorPicker, HexColorPicker } from "react-colorful";

const SlideCustomizer = ({
  slidesStyles,
  data,
  setData,
  index,
  updateStyleSlides,
}: {
  slidesStyles: SlideStyle[] | [];
  data: any;
  setData: any;
  index: number;
  updateStyleSlides: any;
}) => {
  const [textColor, setTextColor] = useState({ r: 0, g: 0, b: 0, a: 1 });
  const [bgColor, setBgColor] = useState({ r: 241, g: 245, b: 249, a: 1 });
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
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

  function handleValueChange(type: string, value: any) {
    if (type === "text") {
      setTextColor(value);
    }

    if (type === "bg") {
      setBgColor(value);
    }

    const slide = {
      textColor: type === "text" ? value : textColor,
      bgColor: type === "bg" ? value : bgColor,
      image: image,
    };

    updateStyleSlides(index, slide);
  }

  // arrange original data from databse
  useEffect(() => {
    // @ts-ignore
    const slide: SlideStyle | null = slidesStyles.find(
      (item: SlideStyle) => item.id == index,
    );

    if (slide) {
      const text = convertRgba(slide.textColor);
      setTextColor({
        r: Number(text[0]),
        g: Number(text[1]),
        b: Number(text[2]),
        a: Number(text[3]),
      });

      const bg = convertRgba(slide.bgColor);
      setBgColor({
        r: Number(bg[0]),
        g: Number(bg[1]),
        b: Number(bg[2]),
        a: Number(bg[3]),
      });
    }
  }, []);

  return (
    <>
      {/* text color picker wrapper */}
      <div className="absolute bottom-5 right-5 rounded-full bg-white px-3 py-2 shadow-sm">
        <div className="flex items-center gap-x-2">
          <div className="relative flex items-center gap-x-2">
            {showTextColorPicker && (
              <span className="absolute -top-4 left-0 z-20  -translate-x-1/2 -translate-y-full rounded-xl	bg-white p-2 shadow-sm shadow-xl">
                <RgbaColorPicker
                  color={textColor}
                  onChange={(color) => handleValueChange("text", color)}
                />
              </span>
            )}
            <p className="text-xs text-gray-500">TEXT</p>
            <div
              onClick={() => {
                setShowBgColorPicker(false);
                setShowTextColorPicker((state) => !state);
              }}
              className="shadow-base h-5 w-5 cursor-pointer rounded-full"
              style={{ backgroundColor: convertToRgba(textColor) }}
            ></div>
            {/* <input
            type="color"
            className="input-color"
            defaultValue={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          /> */}
          </div>
          <div className="h-4 w-[2px] bg-gray-200"></div>
          <div className="relative flex items-center gap-x-2">
            {showBgColorPicker && (
              <span className="absolute -top-4 left-0  z-20  -translate-x-1/2  -translate-y-full rounded-xl bg-white p-2 shadow-sm  shadow-xl">
                <RgbaColorPicker
                  color={bgColor}
                  onChange={(color) => handleValueChange("bg", color)}
                />
              </span>
            )}

            <p className="text-xs text-gray-500">BG</p>
            <div
              onClick={() => {
                setShowTextColorPicker(false);
                setShowBgColorPicker((state) => !state);
              }}
              className="shadow-base h-5 w-5 cursor-pointer rounded-full"
              style={{ backgroundColor: convertToRgba(bgColor) }}
            ></div>
            {/* <input
              type="color"
              className="input-color"
              defaultValue={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            /> */}
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
    </>
  );
};

export default SlideCustomizer;
