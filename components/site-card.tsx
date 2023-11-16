import BlurImage from "@/components/blur-image";
import { placeholderBlurhash, random } from "@/lib/utils";
import { Site } from "@prisma/client";
import { BarChart, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function SiteCard({ data }: { data: Site }) {
  const url = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  return (
    <div className="relative rounded-lg border border-gray-200 pb-10 transition-all hover:border-gray-300 dark:border-gray-700 dark:hover:border-white">
      <Link
        href={`/site/${data.id}`}
        className="flex flex-col overflow-hidden rounded-lg"
      >
        {/* <BlurImage
          alt={data.name ?? "Card thumbnail"}
          width={500}
          height={400}
          className="h-44 object-cover"
          src={data.image ?? "/placeholder.png"}
          placeholder="blur"
          blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
        /> */}
        <div className="p-4">
          <h3 className="font-inter my-0 truncate text-xl font-bold tracking-wide dark:text-white">
            {data.name}
          </h3>
          <p className="mt-2 line-clamp-1 text-sm font-normal leading-snug text-gray-500 dark:text-gray-400">
            {data.description}
          </p>
        </div>
      </Link>
      <div className="absolute bottom-4 flex w-full flex-col justify-between px-4">
        <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://${data.subdomain}.localhost:3000`
          }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          {url} ↗
        </a>
        {/* <Link
          href={`/site/${data.id}/analytics`}
          className="flex items-center rounded-md bg-green-100 px-2 py-1 text-sm font-medium text-green-600 transition-colors hover:bg-green-200 dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400 dark:hover:bg-green-800 dark:hover:bg-opacity-50"
        >
         
          <p>{random(10, 40)}%</p>
        </Link> */}
      </div>
    </div>
  );
}
