import { notFound } from "next/navigation";
import { getPostData, getPostLead, getSiteData } from "@/lib/fetchers";

import BlurImage from "@/components/blur-image";
import { toDateString } from "@/lib/utils";
import Carousel from "@/components/carousel/blog-carousal";
import Link from "next/link";
import { addVisitor } from "@/lib/actions";
import Script from "next/script";

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
      type: "website",
      url: new URL(`https://${params.domain}/${params.slug}`),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@" + domain,
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

  // increment the views count to visit row
  await addVisitor(data?.siteId as string);

  const siteData = await getSiteData(params.domain);
  if (!data) {
    notFound();
  }

  let lead = null;
  if (data.leadId) {
    lead = await getPostLead(data.leadId, data.id);
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/gh/usama-gh/typedd-analytics@main/middleware/src/index.js"
        id={`${data?.siteId}`}
        nonce="XUENAJFW"
        data-project={`${data?.siteId}`}
        data-token={`${process.env.NEXT_PUBLIC_TINYBIRD_TRACKER_TOKEN}`}
      />
      <div className="animate-fade	mx-auto flex w-screen items-center justify-between px-2 py-3 lg:px-4">
        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-2">
            <Link href="/">
              <div className="h-[17px] w-[17px] overflow-hidden rounded-full lg:h-[25px] lg:w-[25px]">
                {siteData?.logo ? (
                  <BlurImage
                    alt={siteData?.logo ?? "User Avatar"}
                    width={20}
                    height={20}
                    className="h-full w-full scale-100 rounded-full object-cover blur-0 duration-700 ease-in-out"
                    src={
                      siteData?.logo ??
                      "https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png"
                    }
                  />
                ) : (
                  <div className="absolute flex h-full w-full select-none items-center justify-center bg-stone-100 text-4xl text-stone-500">
                    ?
                  </div>
                )}
              </div>
            </Link>
            <Link href="/">
              <p className="max-w-sm truncate  text-xs font-semibold tracking-normal text-slate-500 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-300 lg:text-sm">
                {" "}
                {siteData?.name}
              </p>
            </Link>
          </div>
          <div className="h-7 w-[1px] bg-slate-200 dark:bg-gray-700 lg:w-[2px]"></div>
          <p className="font-regular truncate text-xs  text-slate-500 dark:text-gray-400 lg:text-sm">
            {data.title}
          </p>
        </div>
        <p className="font-regular hidden overflow-hidden text-ellipsis text-xs text-slate-500 dark:text-gray-400 md:block lg:block lg:text-sm">
          {toDateString(data.createdAt, "short")}
        </p>
      </div>

      <Carousel data={data} siteData={siteData} lead={lead}></Carousel>
    </>
  );
}
