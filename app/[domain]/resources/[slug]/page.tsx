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
  const data = await getLead(slug);
 
  if (!data) {
    return null;
  }
  const siteData= await getSiteData(domain)
  console.log(siteData)
  const { title,heroDescription } = data;

  return {
    title: title+' | '+siteData?.name,
    description: heroDescription,
    openGraph: {
      title,
      description: heroDescription,
      type: "website",
      url: new URL(`https://${params.domain}/resources/${params.slug}`),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: heroDescription,
      creator: "@" + domain,
    },
    alternates: {
      canonical: new URL(`https://${params.domain}/resources/${params.slug}`), // Use baseUrl for the canonical URL
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
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

  const siteData = await getSiteData(domain);

  return (
    <>
    <div className="container mx-auto max-w-3xl pb-12">

   
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
            {lead.title}
          </p>
        </div>
        <p className="font-regular hidden overflow-hidden text-ellipsis text-xs text-gray-100 drop-shadow-sm dark:text-white md:block lg:block lg:text-sm">
          {toDateString(lead.createdAt, "short")}
        </p>
      </div>

    
      <div className="flex flex-col items-center justify-center gap-4 px-12 py-20 ">
                    {lead.thumbnailFile && (
                      <Image
                        className="rounded-lg"
                        alt={lead.title}
                        src={r2Asset(lead.thumbnailFile)}
                        width={150}
                        height={150}
                      />
                    )}

                    <h2 className="text-4xl font-bold">{lead.title}</h2>
                    {lead.heroDescription && (
                      <p className="text-lg text-slate-700 dark:text-white">
                        {lead.heroDescription}
                      </p>
                    )}
                        </div>

                        <div className="[&>*]:rounded-xl [&>*]:text-lg [&>*]:mb-6lg:px-0 px-6 prose-md w-full prose h-fit mx-auto prose-slate dark:prose-invert sm:prose-lg text-slate-600 dark:text-gray-100 tracking-normal ">
                          <div className="[&>h1]:mb-2 [&>h1]:tracking-tight [&>h1]:leading-snug [&>h2]:tracking-tight">
                          {parse(lead.description as string)}

<LeadDownload postId="" lead={lead} />
                          </div>  
                      
                        </div>
                   
              

</div>
    </>
  );
}
