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
      <div className="mx-auto flex items-center justify-between px-10 pt-6 pb-5">
        <div className="flex items-center">
          <div className="h-11 w-11 overflow-hidden rounded-full">
            {siteData?.user?.image ? (
              <BlurImage
                alt={siteData.user?.name ?? "User Avatar"}
                width={47}
                height={47}
                className="h-full w-full scale-100 object-cover blur-0 duration-700 ease-in-out"
                src={siteData.user?.image}
              />
            ) : (
              <div className="absolute flex h-full w-full select-none items-center justify-center bg-stone-100 text-4xl text-stone-500">
                ?
              </div>
            )}
          </div>
          <Link href="/" className="px-3.5 font-semibold text-xl text-gray-400">
            {siteData?.user?.name}
          </Link>
          <div className="h-7 w-1 bg-slate-200"></div>
          <p className="pl-3 text-2xl font-semibold text-gray-400">
            {data.title}
          </p>
        </div>
        <p className="font-semibold text-lg text-gray-400">{toDateString(data.createdAt, "short")}</p>
      </div>
      <Carousel data={data} siteData={siteData}></Carousel>
    </>
  );
}
