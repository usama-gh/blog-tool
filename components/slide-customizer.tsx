"use client";

import { convertRgba, convertToRgba } from "@/lib/utils";
import { RgbaColorType, SlideStyle } from "@/types";
import { Image as ImageIcon, Palette } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { RgbaColorPicker } from "react-colorful";
import { upload } from "@vercel/blob/client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { categories, categoriesImages } from "@/data";
import { useDebounce } from "use-debounce";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
  const perPageImages = 10;
  const defaultTextColor = { r: 0, g: 0, b: 0, a: 1 };
  const defaultBgColor = { r: 241, g: 245, b: 249, a: 1 };
  const [slideStyle, setSlideStyle] = useState<SlideStyle | undefined>();
  const [textColor, setTextColor] = useState(defaultTextColor);
  const [bgColor, setBgColor] = useState(defaultBgColor);
  const [image, setImage] = useState("");
  const [showResetBtn, setShowResetBtn] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [images, setImages] = useState([]);
  const imageRef = useRef(null);
  const componentRef = useRef(null);
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
    },
  ];

  // debaounce search after 3 seconds
  const [debouncedSearch] = useDebounce(search, 2000);

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
    // delete image from vercel blob if exists and image is uploaded to vercel blob
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
    if (image.includes("blob.vercel-storage.com")) {
      const response = await fetch("/api/upload", {
        method: "DELETE",
        body: JSON.stringify({ image }),
      });
      const { success } = await response.json();
    }

    setImage("");
    handleValueChange("image", "");
  }

  function changeEditorTextColor(type: string, value: any) {
    // select all the text in editor and change the color
    const textLength = editor.getHTML().length;
    editor.commands.unsetColor();
    // editor.commands;
    editor.commands.setTextSelection({
      from: 0,
      to: textLength,
    });

    const color =
      type === "reset" ? "var(--novel-black)" : convertToRgba(value);

    editor.chain().setColor(color).run();
  }

  async function resetStyle() {
    setImage("");
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

    // delete image from vercel blob if exists
    if (slideStyle?.bgImage) {
      const oldImage = slideStyle.bgImage;
      const response = await fetch("/api/upload", {
        method: "DELETE",
        body: JSON.stringify({ image: oldImage }),
      });
    }
  }

  async function handleValueChange(type: string, value: any, source: string | null = null, id: string | null = null) {
    alert('ran')
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

    if (source === 'unsplash_image' && id) {
      // Make an API call to Unsplash to register the download
      const unsplashDownloadUrl = `https://api.unsplash.com/photos/${id}/download`;
      try {
        const response = await fetch(unsplashDownloadUrl, {
          headers: {
            Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error downloading image: ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log(`Unsplash download triggered: ${data.url}`);
      } catch (error) {
        console.error('Failed to trigger Unsplash download', error);
      }
    }

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

  // fetching images from unsplash api
  async function fetchImageFromUnsplash() {
    const request = await fetch(
      `https://api.unsplash.com/search/photos?query=${debouncedSearch}&per_page=${perPageImages}`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
        },
      },
    );
    const images = await request.json();
    setImages(images.results);
  }

  // search images from unsplash when user search
  useEffect(() => {
    let timeout: any = null;
    if (debouncedSearch) {
      setLoading(true);
      fetchImageFromUnsplash();
      timeout = setTimeout(() => {
        setLoading(false);
      }, 500);
    } else {
      timeout = setTimeout(() => {
        setLoading(false);
      }, 500);
      setCategory("gradients");
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [debouncedSearch]);

  // show image when category change
  useEffect(() => {
    if (category) {
      const data = categoriesImages.find((item) => item.category === category);

      // @ts-ignore
      setImages(data.images ?? []);
    } else {
      setImages([]);
    }
  }, [category]);

  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* text color picker wrapper */}

      <Popover>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger
                ref={componentRef}
              
                className="shadow-sm absolute bottom-2 right-2 flex  items-center justify-center  opacity-0  transition ease-in-out group-hover:opacity-100"
              >
                <Button size="icon" variant="secondary">
                <Palette strokeWidth={"1.5px"} width={20} />
                </Button>
               
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Customize design</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <PopoverContent className="mt-2 w-auto rounded-lg shadow-lg border-0 py-2">
          <div className="flex items-center gap-x-2">
            <div className="relative flex items-center gap-x-2">
              <p className="text-xs text-gray-500">TEXT</p>

              <Popover>
                <PopoverTrigger>
                  <div
                    className="shadow-base h-5 w-5 cursor-pointer rounded-full"
                    style={{ backgroundColor: convertToRgba(textColor) }}
                  ></div>
                </PopoverTrigger>
                <PopoverContent className="w-min">
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
                </PopoverContent>
              </Popover>
            </div>
            <div className="h-4 w-[2px] bg-gray-200"></div>
            <div className="relative flex items-center gap-x-2">
              <p className="text-xs text-gray-500">BG</p>

              <Popover>
                <PopoverTrigger>
                  <div
                    className="shadow-base h-5 w-5 cursor-pointer rounded-full"
                    style={{ backgroundColor: convertToRgba(bgColor) }}
                  ></div>
                </PopoverTrigger>
                <PopoverContent className="w-min">
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
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger>
                
                    <ImageIcon className="text-gray-500" strokeWidth={"1.5px"} width={20} />
                
                </PopoverTrigger>
                <PopoverContent className="w-min rounded-xl shadow-2xl border-0 my-4">
                  <div className="w-[250px]">
                    <Input
                      type="text"
                      placeholder="Search"
                      value={search}
                      onChange={(e: any) => setSearch(e.target.value as string)}
                    />
                    {/* showing categories */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {categories.map((item: string) => (
                        <Button
                          variant={category === item ? "default" : "outline"}
                          size="xs"
                          className="capitalize basis-1/4 max-w-[22%]"
                          key={item}
                          onClick={() =>
                            category === item
                              ? setCategory("")
                              : setCategory(item)
                          }
                        >
                          {item}
                        </Button>
                      ))}
                    </div>

                    {/* showing images */}
                    <ScrollArea className="h-[200px] w-[250px]">
                      <div>
                        <div className="grid grid-cols-2 gap-4">
                          {images.map((item: any, idx: number) => (
                            <div className="group relative mb-3" key={idx}>
                              {loading ? (
                               
                                    <Skeleton className="h-[30px] w-full rounded-full" />
                                    
                               
                              
                              ) : (
                                <Image
                                  className="h-auto rounded-xl w-full cursor-pointer object-contain"
                                  width={120}
                                  height={60}
                                  src={item.urls.regular}
                                  alt={item.id}
                                  onClick={() =>
                                    handleValueChange(
                                      "image",
                                      item.urls.regular as string,
                                      'unsplash_image',
                                      item.id
                                    )
                                  }
                                />
                              )}
                              {item.user && (
                                <span className="absolute left-0 bottom-0 flex items-end justify-center p-1 opacity-0 transition-opacity group-hover:opacity-100">
                                  <small className="text-[8px] text-white">
                                    Photo by{" "}
                                    <a
                                      href={item.user?.links?.self}
                                      className="text-blue-400 hover:text-blue-300"
                                    >
                                      {item.user?.name}
                                    </a>{" "}
                                    on{" "}
                                    <a
                                      href="https://unsplash.com"
                                      className="text-blue-400 hover:text-blue-300"
                                    >
                                      Unsplash
                                    </a>
                                  </small>
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </ScrollArea>
                    <div className="mt-3">
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full"
                        onClick={openImageDialog}
                      >
                        Upload Image
                      </Button>
                      <input
                        type="file"
                        ref={imageRef}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {image && (
                <>
                  {/* <Image
                className="h-6 rounded-lg"
                src="https://lh3.googleusercontent.com/JjewRHousCsko0Q3ZgeYV63GurlKuHv_m7eCMSjTOeQIs_M4CEINyAsc9qmh4P04Bg8gOlDRa9LjaHDT8IvjSWmoZGZ0ny8S5aAAweM=s3000"
                width={40}
                height={25}
                alt="background image"
              /> */}
                  <Image
                    className="h-6 rounded-lg"
                    width={20}
                    height={20}
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
        </PopoverContent>
      </Popover>
    </>
  );
};

export default SlideCustomizer;
