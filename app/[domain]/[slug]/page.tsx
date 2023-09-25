import { notFound } from "next/navigation";
import { getPostData, getPostsForSite, getSiteData } from "@/lib/fetchers";

import BlurImage from "@/components/blur-image";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import Carousel from "@/components/carousel/blog-carousal";
import Link from "next/link";
import { headers } from 'next/headers';
import { addVisitor, getSiteViews } from "@/lib/actions";

export async function generateMetadata({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const { domain, slug } = params;
  const data = await getPostData(domain, slug);
  if (!data) {
    return null;
  }
  const { title, description } = data;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@vercel",
    },
  };
}

export default async function SitePostPage({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const { domain, slug } = params;
  const ip = headers().get('X-Forwarded-For');
  const referrer = headers().get('referer');
  const getReferrer = ()=>{
    if (referrer?.includes("google")) {
      return "Google";
    } else if (referrer?.includes("bing")) {
      return "Bing";
    } else if (referrer?.includes("email")) {
      return "Email";
    } else if (referrer?.includes("t.co")) {
      return "Twitter";
    } else {
      return "Other";
    }
  }
  const data = await getPostData(domain, slug)
  const res = await addVisitor(ip as string, getReferrer(), data?.id as string, data?.siteId as string)
  const siteData = await getSiteData(params.domain);
  if (!data) {
    notFound();
  }

  return (
    <>
      <div className="mx-auto flex items-center justify-between px-2 lg:px-10 py-3">
        <div className="flex items-center">
          <div className="h[25px] w-[25px] overflow-hidden rounded-full">
            {siteData?.user?.image ? (
              <BlurImage
                alt={siteData.user?.name ?? "User Avatar"}
                width={20}
                height={20}
                className="h-full w-full scale-100 rounded-full object-cover blur-0 duration-700 ease-in-out"
                src={siteData.user?.image}
              />
            ) : (
              <div className="absolute flex h-full w-full select-none items-center justify-center bg-stone-100 text-4xl text-stone-500">
                ?
              </div>
            )}
          </div>
          <Link href="/" className="px-3.5  font-regular tracking-widest uppercase text-[8px] lg:text-sm text-slate-500 dark:text-gray-400 dark:hover:text-gray-300 hover:text-slate-600">
            {siteData?.user?.name}
          </Link>
          <div className="h-7 w-[2px] bg-slate-200 dark:bg-gray-700"></div>
          <p className="pl-3 text-[12px] text-xs truncate lg:text-sm font-regular text-slate-500 dark:text-gray-400">
            {data.title}
          </p>
        </div>
        <p className="font-regular text-[10px] text-ellipsis overflow-hidden lg:text-sm text-slate-500 dark:text-gray-400">{toDateString(data.createdAt, "short")}</p>
      </div>

      <Carousel data={data} siteData={siteData}></Carousel>
    </>
  );
}
