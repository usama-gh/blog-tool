import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useDebounce } from "use-debounce";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

type UnsplashImageSearchProps = {
  onSelect: (url: string) => void;
};



const UnsplashImageSearch = ({ onSelect }: UnsplashImageSearchProps) => {
  const perPageImages = 10;
  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);

  // debaounce search after 3 seconds
  const [debouncedSearch] = useDebounce(search, 2000);


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
    if (debouncedSearch) {
      setLoading(true);
      fetchImageFromUnsplash();
      setTimeout(() => {
        setLoading(false);
      }, 500);
      
    }
  }, [debouncedSearch]);

  const [loading, setLoading] = useState(true);

  return (
    <div className="w-[250px]">
                    <Input
                      type="text"
                      placeholder="Search"
                      value={search}
                      onChange={(e: any) => setSearch(e.target.value as string)}
                    />

                    {/* showing images */}
                    <ScrollArea className="h-[200px] w-[250px]">
                      <div>
                        <div className="grid grid-cols-2 gap-2 pt-4">
                          {images.map((item: any, idx: number) => (
                            <div className="group relative" key={idx}>
                              {loading ? (
                                    <Skeleton className="h-[100px] w-full rounded-xl" />
                              ) : (
                                <div>
                                <Image
                                  className="h-auto rounded-xl w-full cursor-pointer object-contain"
                                  width={120}
                                  height={60}
                                  src={item.urls.regular}
                                  alt={""}
                                  onClick={() => onSelect(item.urls.regular)}
                                //   onClick={() =>
                                //     handleValueChange(
                                //       "image",
                                //       item.urls.regular as string,
                                //       'unsplash_image',
                                //       item.id || 'default'
                                //     )
                                //   }
                                />
                                </div>
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
                  </div>
  );
};

export default UnsplashImageSearch;
