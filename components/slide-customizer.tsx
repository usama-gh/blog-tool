"use client";

import { convertRgba, convertToRgba } from "@/lib/utils";
import { RgbaColorType, SlideStyle } from "@/types";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { RgbaColorPicker } from "react-colorful";
import { upload } from "@vercel/blob/client";

const SlideCustomizer = ({
  slidesStyles,
  index,
  updateStyleSlides,
  editor,
}: {
  slidesStyles: SlideStyle[] | [];
  index: number;
  updateStyleSlides: any;
  editor: any;
}) => {
  const defaultTextColor = { r: 0, g: 0, b: 0, a: 1 };
  const defaultBgColor = { r: 241, g: 245, b: 249, a: 1 };
  const [slideStyle, setSlideStyle] = useState<SlideStyle | undefined>();
  const [textColor, setTextColor] = useState(defaultTextColor);
  const [bgColor, setBgColor] = useState(defaultBgColor);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [image, setImage] = useState("");
  const [showResetBtn, setShowResetBtn] = useState(false);
  const imageRef = useRef(null);
  // const presetColors = ["#cd9323", "#1a53d8", "#9a2151", "#0d6416", "#8d2808"];
  const presetColors = [
    {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
    },
    {
        r: 2,
        g: 159,
        b: 93,
        a: 1,
    },
    {
        r: 38,
        g: 118,
        b: 118,
        a: 1,
    },
    {
        r: 63,
        g: 119,
        b: 6,
        a: 1,
    },
    {
        r: 93,
        g: 93,
        b: 93,
        a: 1,
    },
    {
        r: 95,
        g: 27,
        b: 206,
        a: 1,
    },
    {
        r: 96,
        g: 83,
        b: 16,
        a: 1,
    },
    {
        r: 129,
        g: 62,
        b: 13,
        a: 1,
    },
    {
        r: 146,
        g: 59,
        b: 10,
        a: 1,
    },
    {
        r: 198,
        g: 255,
        b: 255,
        a: 1,
    },
    {
        r: 205,
        g: 112,
        b: 4,
        a: 1,
    },
    {
        r: 215,
        g: 255,
        b: 238,
        a: 1,
    },
    {
        r: 220,
        g: 78,
        b: 121,
        a: 1,
    },
    {
        r: 227,
        g: 255,
        b: 198,
        a: 1,
    },
    {
        r: 233,
        g: 219,
        b: 255,
        a: 1,
    },
    {
        r: 243,
        g: 243,
        b: 243,
        a: 1,
    },
    {
        r: 251,
        g: 56,
        b: 80,
        a: 1,
    },
    {
        r: 255,
        g: 197,
        b: 204,
        a: 1,
    },
    {
        r: 255,
        g: 219,
        b: 230,
        a: 1,
    },
    {
        r: 255,
        g: 220,
        b: 200,
        a: 1,
    },
    {
        r: 255,
        g: 229,
        b: 197,
        a: 1,
    },
    {
        r: 255,
        g: 234,
        b: 219,
        a: 1,
    },
    {
      r: 255,
      g: 255,
      b: 255,
      a: 1,
  },
    {
        r: 255,
        g: 240,
        b: 163,
        a: 1,
    }
   
];



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

      setSlideStyle(slide);
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

  function changeEditorTextColor(type: string, value: any) {
    // select all the text in editor and change the color
    const textLength = editor.storage.markdown.getMarkdown().length;
    editor.commands.unsetColor();
    editor.commands.setTextSelection({
      from: 0,
      to: textLength,
    });

    const color =
      type === "reset" ? "var(--novel-black)" : convertToRgba(value);

    editor.chain().setColor(color).run();
  }

  async function resetStyle() {
    // delete image from vercel blob if exists
    if (slideStyle?.bgImage) {
      await deleteImage();
    }

    setTextColor(defaultTextColor);
    changeEditorTextColor("reset", defaultTextColor);
    setBgColor(defaultBgColor);

    const slide = {
      textColor: convertToRgba(defaultTextColor),
      bgColor: convertToRgba(defaultBgColor),
      bgImage: "",
    };

    updateStyleSlides(index, slide);
    setShowResetBtn(false);
  }

  function handleValueChange(type: string, value: any) {
    if (type === "text") {
      setTextColor(value);
      changeEditorTextColor("change", value);
    }

    if (type === "bg") {
      setBgColor(value);
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

  useEffect(() => {
    // checking for text color changes
    if (
      textColor.r !== defaultTextColor.r ||
      textColor.g !== defaultTextColor.g ||
      textColor.b !== defaultTextColor.b ||
      textColor.a !== defaultTextColor.a
    ) {
      setShowResetBtn(true);
    }

    // cehcking for bg color changes
    if (
      bgColor.r != defaultBgColor.r ||
      bgColor.g != defaultBgColor.g ||
      bgColor.b != defaultBgColor.b ||
      bgColor.a != defaultBgColor.a
    ) {
      setShowResetBtn(true);
    }

    // checking for image changes
    if (image !== "") {
      setShowResetBtn(true);
    }
  }, [textColor, bgColor, image]);

  return (
    <>
      {/* text color picker wrapper */}
      <div className="absolute bottom-5 right-5 rounded-full bg-white px-3 py-2 shadow-sm">
        <div className="flex items-center gap-x-2">
          <div className="relative flex items-center gap-x-2">
            {showTextColorPicker && (
              <span className="absolute -top-4 left-0 z-20  -translate-x-1/2 -translate-y-full rounded-xl	bg-white p-2 shadow-sm">
                <div className="picker">
                  <RgbaColorPicker
                    color={textColor}
                    onChange={(color) => handleValueChange("text", color)}
                  />
                  {presetColors.map((color, index) => (
                    <button
                      key={`text-${index}`}
                      className="picker__swatch"
                      style={{ background: convertToRgba(color) }}
                      onClick={() => handleValueChange("text", color)}
                    />
                  ))}
                </div>
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
          <div className="h-4 w-[2px] bg-gray-200"></div>
          <div className="relative flex items-center gap-x-2">
            {showBgColorPicker && (
              <span className="absolute -top-4 left-0  z-20  -translate-x-1/2  -translate-y-full rounded-xl bg-white p-2 shadow-sm">
                <div className="picker">
                  <RgbaColorPicker
                    color={bgColor}
                    onChange={(color) => handleValueChange("bg", color)}
                  />

                  {presetColors.map((color, index) => (
                    <button
                      key={`bg-${index}`}
                      className="picker__swatch"
                      style={{ background: convertToRgba(color) }}
                      onClick={() => handleValueChange("bg", color)}
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

            {showResetBtn && (
              <button
                type="button"
                className="text-xs text-blue-400"
                onClick={resetStyle}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SlideCustomizer;
