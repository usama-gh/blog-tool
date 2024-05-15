import { notFound } from "next/navigation";
import { getLead, getPostData, getSiteData } from "@/lib/fetchers";

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

export default async function SiteLeadPage({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const { domain, slug } = params;

  const lead = await getLead(slug);

  if (!lead) {
    notFound();
  }

  const siteData = await getSiteData(params.domain);

  return (
    <>
      <div className="animate-fade absolute left-0 top-0 z-30 mx-auto flex w-full w-screen items-center justify-between	bg-gradient-to-b from-[#000000a8] via-[#0000004d] to-transparent px-2 pb-5 pt-2 lg:px-2">
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
              <p className="max-w-sm truncate  text-xs font-semibold tracking-normal text-gray-100 drop-shadow-sm hover:text-slate-600 dark:text-white dark:hover:text-gray-300 lg:text-sm">
                {" "}
                {siteData?.name}
              </p>
            </Link>
          </div>
          <div className="h-7 w-[0.5px] bg-gray-400 dark:bg-gray-700 lg:w-[1px]"></div>
          <p className="font-regular truncate text-xs text-gray-100 drop-shadow-sm dark:text-white lg:text-sm">
            {lead.title}
          </p>
        </div>
        <p className="font-regular hidden overflow-hidden text-ellipsis text-xs text-gray-100 drop-shadow-sm dark:text-white md:block lg:block lg:text-sm">
          {toDateString(lead.createdAt, "short")}
        </p>
      </div>

      <div className="relative">
        <div className="mx-auto my-auto flex items-center">
          <div className="relative w-full overflow-hidden">
            <div className="flex h-fit items-start ">
              <div className="relative h-fit min-w-full  text-slate-50 dark:text-gray-400 ">
                {/* <Image
                  alt="Mountains"
                  src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  quality={100}
                  fill
                  sizes="100vw"
                  style={{
                    objectFit: "cover",
                  }}
                /> */}
                {/* bg overrelay */}
                <div
                  className={`absolute left-0 top-0 h-full w-full bg-white dark:bg-[#052124]`}
                ></div>

                {/* lead description */}
                <div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full relative z-20 mx-auto my-auto flex h-screen w-full max-w-2xl items-center justify-center overflow-y-auto py-10 pt-20 text-slate-700 scrollbar-thin  scrollbar-track-transparent scrollbar-thumb-gray-200 dark:text-white dark:scrollbar-thumb-gray-800 [&>*]:rounded-xl [&>*]:text-lg">
                  <div className="flex flex-col items-center justify-center gap-4">
                    {lead.thumbnailFile && (
                      <Image
                        alt={lead.title}
                        src={r2Asset(lead.thumbnailFile)}
                        width={100}
                        height={100}
                      />
                    )}

                    <h2 className="text-2xl font-semibold">{lead.title}</h2>
                    {lead.heroDescription && (
                      <p className="text-lg text-slate-700 dark:text-white">
                        {lead.heroDescription}
                      </p>
                    )}
                    {parse(lead.description as string)}

                    <LeadDownload postId="" lead={lead} />
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
