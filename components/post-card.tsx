import BlurImage from "@/components/blur-image";
import { placeholderBlurhash, random } from "@/lib/utils";
import { Post, Site } from "@prisma/client";
import { BarChart, ExternalLink } from "lucide-react";
import Link from "next/link";
import cn from "clsx";

export default function PostCard({
  data,
}: {
  data: Post & { site: Site | null };
}) {
  const url = `${data.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${data.slug}`;

  return (
    <div className="relative rounded-xl  bg-slate-100 pb-10 transition-all hover:bg-slate-200 dark:bg-gray-900/80 dark:hover:bg-gray-900">
      <Link
        href={`/post/${data.id}?siteId=${data.siteId}`}
        className="flex flex-col overflow-hidden relative rounded-lg"
      >
        <div>
          {/* <BlurImage
            alt={data.title ?? "Card thumbnail"}
            width={500}
            height={400}
            className="h-full object-cover"
            src={data.image ?? "/placeholder.png"}
            placeholder="blur"
            blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
          /> */}
      
        </div>
        <div className="p-4">
          <h3 className="font-inter my-0 text-xl font-bold tracking-normal dark:text-white">
            {data.title}
          </h3>
          <p className="mt-2 mb-2 line-clamp-1 text-sm font-normal leading-snug text-slate-500 dark:text-gray-400">
            {data.description}
          </p>
          <span
  className={cn(
    "rounded-md  text-center px-2 py-0.5 text-xs font-medium uppercase",
    data.published
      ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-100" // Classes for "Live" status
      : "bg-yellow-50 text-yellow-800  dark:bg-yellow-950 dark:text-yellow-100" // Classes for "Draft" status
  )}
>
  {data.published ? "Published" : "Draft"}
</span>

        </div>
      </Link>
      <div className="absolute bottom-4 flex w-full px-4">
        <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://${data.site?.subdomain}.localhost:3000/${data.slug}`
          }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          {url} ↗
        </a>
      </div>
    </div>
  );
}
