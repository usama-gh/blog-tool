import Link from "next/link";
import BlurImage from "./blur-image";

import type { Post } from "@prisma/client";
import { placeholderBlurhash, toDateString } from "@/lib/utils";

interface BlogCardProps {
  data: Pick<
    Post,
    "slug" | "image" | "imageBlurhash" | "title" | "description" | "createdAt"
  >;
}


export default function BlogCard({ data }: BlogCardProps) {
  const isImageBackground = data.image !== "https://ige9ec25vizexnyy.public.blob.vercel-storage.com/tQidqrn-Z2Nd3W4IJXq3XBZZMOllnA06WIkhlq.jpeg";

  return (
    <Link href={`/${data.slug}`} className="w-full">
   

  
<div
  className={`w-full ease flex flex-col items-start justify-left overflow-hidden h-[300px] rounded-3xl transition-all duration-200 hover:-translate-y-1 ${
    isImageBackground ? 'bg-cover bg-center relative ' : 'bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700'
  }`}
  style={isImageBackground ? { backgroundImage: `url(${data.image ?? "/placeholder.png"})` } : {}}
>
  
  {isImageBackground && (
    <div className="absolute inset-0 bg-gradient-to-t from-black  via-[#0000008c] to-transparent"></div>
  )}
  
  <div className="flex h-full flex-col items-start p-5 w-full justify-between">
    
  <div className="relative z-20 flex justify-end w-full">
    
  {isImageBackground ? (

<button className="rounded-full border px-4 py-1 text-center text-sm border-white bg-white text-black">Read More</button>
      ) : (

        <button className="rounded-full border px-4 py-1 text-center text-sm border-slate-500 text-slate-500 hover:border-slate-700 hover:text-slate-600 dark:border-gray-400 dark:bg-transparent dark:text-gray-400 dark:hover:border-gray-300 dark:hover:text-gray-300">Read More</button>

       
      )}
    </div>

    <div className="relative text-left z-10">
      <p className={`mt-7 text-xs font-regular ${
        isImageBackground ? 'text-white' : 'text-slate-400 dark:text-gray-400'
      }`}>
        {toDateString(data.createdAt, "long")}
      </p>
      <h2 className={`mt-1 text-xl font-bold ${
        isImageBackground ? 'text-white' : 'text-slate-600 dark:text-white'
      }`}>
        {data.title}
      </h2>
      <p className={`mt-1.5 line-clamp-3 w-full text-sm ${
        isImageBackground ? 'text-white' : 'text-slate-500 dark:text-gray-400'
      }`}>
        {data.description}
      </p>
    </div>
  </div>
</div>


    </Link>
  );
}
