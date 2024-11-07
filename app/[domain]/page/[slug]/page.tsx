import { notFound } from "next/navigation";
import {
  getLead,
  getPageData,
  getPagesForSite,
  getSiteData,
} from "@/lib/fetchers";

import BlurImage from "@/components/blur-image";
import { r2Asset, toDateString } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import parse from "html-react-parser";
import SocialLinks from "@/components/social-links";
import { LeadDownload } from "@/components/lead-download";
import UserHeader from "@/components/user-header";
import UserFooter from "@/components/user-footer";

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
    alternates: {
      canonical: new URL(`https://${params.domain}/pages/${params.slug}`), // Use baseUrl for the canonical URL
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

export default async function StaticPages({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const { domain, slug } = params;

  const [data, page, pages] = await Promise.all([
    getSiteData(params.domain),
    getPageData(domain, slug),
    getPagesForSite(params.domain),
  ]);

  if (!page || !data) {
    notFound();
  }

  return (
    <>
      <div className="mx-auto max-w-6xl">
        <UserHeader data={data} pages={pages} slug={slug} />
        <div className="px-6">
          <h2 className="mb-12 text-center text-center text-4xl font-bold">
            {page.name}
          </h2>
          <div className="my-5 rounded-3xl bg-white dark:bg-gray-800  border border-slate-100 dark:border-gray-800 p-12">
          <div className="[&>*]:rounded-xl [&>*]:text-lg [&>*]:mb-6lg:px-0 px-6 prose-md w-full prose h-fit mx-auto prose-slate dark:prose-invert sm:prose-lg text-slate-600 dark:text-gray-100 tracking-normal ">
          <div className="[&>h1]:mb-2 [&>h1]:tracking-tight [&>h1]:leading-snug [&>h2]:tracking-tight">
          {parse(page.body as string)}
            </div>
            </div>
    
          </div>
        
        </div>
        <div className="mx-auto my-10 h-0.5 w-8 dark:bg-gray-700"></div>
        {/* susbcribe to blog */}
        <UserFooter data={data} domain={params.domain} slug={slug} />
      </div>
    </>
  );
}
