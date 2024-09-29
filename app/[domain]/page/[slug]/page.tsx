import { notFound } from "next/navigation";
import { getLead, getPageData, getSiteData } from "@/lib/fetchers";

import BlurImage from "@/components/blur-image";
import { r2Asset, toDateString } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import parse from "html-react-parser";
import { LeadDownload } from "@/components/lead-download";

export async function generateMetadata({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const { domain, slug } = params;

  const data = await getPageData(domain, slug);

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
      url: new URL(`https://${params.domain}/pages/${params.slug}`),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@" + domain,
    },
  };
}

export default async function SiteLeadPage({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const { domain, slug } = params;

  const page = await getPageData(domain, slug);

  if (!page) {
    notFound();
  }

  const siteData = await getSiteData(domain);

  return (
    <>
      <div className="animate-fade absolute left-0 top-0 z-30 mx-auto flex w-full w-screen items-center justify-between	bg-gradient-to-b from-[#000000a8] via-[#00000075] to-transparent px-2 pb-5 pt-2 lg:px-2">
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
              <p className="max-w-sm truncate  text-xs font-semibold tracking-normal text-gray-100 drop-shadow-sm dark:text-white dark:hover:text-gray-300 lg:text-sm">
                {" "}
                {siteData?.name}
              </p>
            </Link>
          </div>
          <div className="h-7 w-[0.5px] bg-gray-400 dark:bg-gray-700 lg:w-[1px]"></div>
          <p className="font-regular truncate text-xs text-gray-100 drop-shadow-sm dark:text-white lg:text-sm">
            {page.title}
          </p>
        </div>
        <p className="font-regular hidden overflow-hidden text-ellipsis text-xs text-gray-100 drop-shadow-sm dark:text-white md:block lg:block lg:text-sm">
          {toDateString(page.createdAt, "short")}
        </p>
      </div>

      <div className="relative">
        <div className="mx-auto my-auto flex items-center">
          <div className="relative w-full overflow-hidden">
            <div className="flex">
              <div className="relative h-fit min-w-full  text-slate-50 dark:text-gray-400 ">
                <div
                  className={`absolute left-0 top-0 h-full w-full bg-white dark:bg-gray-800`}
                ></div>

                {/* lead description */}
                <div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full relative z-20 mx-auto flex w-full max-w-2xl items-center justify-center  py-10 pt-20 text-slate-700 scrollbar-thin  scrollbar-track-transparent scrollbar-thumb-gray-200 dark:text-white dark:scrollbar-thumb-gray-800 [&>*]:rounded-xl [&>*]:text-lg">
                  <div className="flex flex-col items-center justify-center gap-4 px-6">
                    <h2 className="text-4xl font-bold">{page.title}</h2>
                    {parse(page.body as string)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
