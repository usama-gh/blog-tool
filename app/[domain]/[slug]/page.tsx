import { notFound } from "next/navigation";
import { getPostData, getPostsForSite, getSiteData } from "@/lib/fetchers";
import BlogCard from "@/components/blog-card";
import BlurImage from "@/components/blur-image";
import MDX from "@/components/mdx";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import Carousel from "@/components/carousel/blog-carousal";

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
  const data = await getPostData(domain, slug);
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
          <p className="px-3.5 font-semibold text-xl text-gray-400">
            {siteData?.user?.name}
          </p>
          <div className="h-7 w-1 bg-slate-200"></div>
          <p className="pl-3 text-2xl font-semibold text-gray-400">
            {data.title}
          </p>
        </div>
        <p className="font-semibold text-lg text-gray-400">{toDateString(data.createdAt, "short")}</p>
      </div>
      <Carousel data={data}></Carousel>
    </>
  );
}
