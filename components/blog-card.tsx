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
  return (
    <Link href={`/${data.slug}`} className="w-full">
      <div className="ease overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-lg transition-all duration-200 hover:-translate-y-1 dark:border-gray-600  dark:bg-gray-800">
        {/* <div className="sm:h-120 group relative mx-auto h-52 w-full p-1 overflow-hidden lg:rounded-3xl">
          <BlurImage
            alt={data.title ?? ""}
            blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
            className="h-full w-full object-cover"
            width={700}
            height={300}
            placeholder="blur"
            src={data.image ?? "/placeholder.png"}
          />
        </div> */}
        <div className="m-auto w-full px-8 text-center">
          <p className="m-auto mt-7 text-xs font-semibold text-slate-400 dark:text-gray-400 ">
            {toDateString(data.createdAt, "long")}
          </p>
          <h2 className="mt-1 text-xl font-medium text-slate-600 dark:text-white">
            {data.title}
          </h2>
          <p className="mb-8 mt-1.5 line-clamp-3 w-full text-base text-slate-500 dark:text-gray-400">
            {data.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
