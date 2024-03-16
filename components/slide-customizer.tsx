"use client";

import { convertRgba, convertToRgba } from "@/lib/utils";
import { SlideStyle } from "@/types";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { RgbaColorPicker } from "react-colorful";
import { upload } from "@vercel/blob/client";

const SlideCustomizer = ({
  slidesStyles,
  index,
  updateStyleSlides,
}: {
  slidesStyles: SlideStyle[] | [];
  index: number;
  updateStyleSlides: any;
}) => {
  const [textColor, setTextColor] = useState({ r: 0, g: 0, b: 0, a: 1 });
  const [bgColor, setBgColor] = useState({ r: 241, g: 245, b: 249, a: 1 });
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [image, setImage] = useState("");
  const imageRef = useRef(null);
  const presetColors = ["#cd9323", "#1a53d8", "#9a2151", "#0d6416", "#8d2808"];

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

      setImage(slide.bgImage);
    }
  }, []);

  function openImageDialog() {
    // @ts-ignore
    imageRef?.current?.click();
  }

  async function handleImageUpload(e: any) {
    // delete image from vercel blob if exists
    if (image) {
      await deleteImage();
    }

    // get image url from file reader
    const file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      const dataURL = reader.result;
      setImage(dataURL as string);
    };

    // upload image to vercel blob
    const newBlob = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });

    if (newBlob.url) {
      handleValueChange("image", newBlob.url);
    }
  }

  async function deleteImage() {
    const response = await fetch("/api/upload", {
      method: "DELETE",
      body: JSON.stringify({ image }),
    });
    const { success } = await response.json();
    if (success) {
      setImage("");
      handleValueChange("image", "");
    }
  }

  function handleValueChange(type: string, value: any) {
    if (type === "text") {
      setTextColor(value);
    }

    if (type === "bg") {
      setBgColor(value);
      console.log(value)
    }
    if (type === "image") {
      setImage(value);
    }

    const slide = {
      textColor: convertToRgba(type === "text" ? value : textColor),
      bgColor: convertToRgba(type === "bg" ? value : bgColor),
      bgImage: type === "image" ? value : image,
    };

    updateStyleSlides(index, slide);
  }

  return (
    <>
      {/* text color picker wrapper */}
      <div className="absolute bottom-5 right-5 rounded-full bg-white px-3 py-2 shadow-sm">
        <div className="flex items-center gap-x-2">
          {/* <div className="relative flex items-center gap-x-2">
            {showTextColorPicker && (
              <span className="absolute -top-4 left-0 z-20  -translate-x-1/2 -translate-y-full rounded-xl	bg-white p-2 shadow-sm">
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
          </div>
          <div className="h-4 w-[2px] bg-gray-200"></div> */}
          <div className="relative flex items-center gap-x-2">
            {showBgColorPicker && (
              <span className="absolute -top-4 left-0  z-20  -translate-x-1/2  -translate-y-full rounded-xl bg-white p-2 shadow-sm">
                  <div className="picker">


                 
                <RgbaColorPicker
                  color={bgColor}
                  onChange={(color) => handleValueChange("bg", color)}
                />
                
                {presetColors.map((presetColor) => (
          <button
            key={presetColor}
            className="picker__swatch"
            style={{ background: presetColor }}
            onClick={(presetColor) => setBgColor(presetColor)}
          />
        ))}
         </div>
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
                  onClick={deleteImage}
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
