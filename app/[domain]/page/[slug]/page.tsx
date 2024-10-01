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
          <h2 className="mb-5 text-center text-4xl font-bold text-center">{page.name}</h2>
          {parse(page.body as string)}
        </div>
          <div className="h-0.5 w-8 dark:bg-gray-700 my-10 mx-auto"></div>
        {/* susbcribe to blog */}
        <UserFooter data={data} domain={params.domain} slug={slug} />
      </div>
    </>
  );
}
