import { ReactNode } from "react";
import prisma from "@/lib/prisma";
import CTA from "@/components/cta";
import ReportAbuse from "@/components/report-abuse";
import { notFound, redirect } from "next/navigation";
import { getSiteData, getUserPlanAnalytics } from "@/lib/fetchers";
import { fontMapper } from "@/styles/fonts";
import { Metadata } from "next";
import { headers } from 'next/headers';

export async function generateMetadata({ 
  params, 
}: { 
  params: { domain: string }; 
}): Promise<Metadata | null> { 
  const data = await getSiteData(params.domain); 

  if (!data) { 
    return null; 
  }

  const { 
    name: title, 
    description, 
    image, 
    logo, 
    subdomain,
    customDomain,
  } = data as { 
    name: string; 
    description: string; 
    image: string; 
    logo: string; 
    subdomain: string;
    customDomain?: string;
  }; 

  const headersList = headers();
  const host = headersList.get('host') || 'typedd.com';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

  let domain = `${protocol}://${host}`;

  // If there's a custom domain in the data, use it
  if (customDomain) {
    domain = `https://${customDomain}`;
  }

  return { 
    title, 
    description, 
    openGraph: { 
      title, 
      description, 
      type: "website", 
      url: domain,
    }, 
    twitter: { 
      card: "summary_large_image", 
      title, 
      description, 
      creator: "@" + title, 
    }, 
    icons: [logo], 
    alternates: { 
      canonical: domain,
    }, 
    metadataBase: new URL(domain),
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

export async function generateStaticParams() {
  const [subdomains, customDomains] = await Promise.all([
    prisma.site.findMany({
      select: {
        subdomain: true,
      },
    }),
    prisma.site.findMany({
      where: {
        NOT: {
          customDomain: null,
        },
      },
      select: {
        customDomain: true,
      },
    }),
  ]);

  const allPaths = [
    ...subdomains.map(({ subdomain }) => subdomain),
    ...customDomains.map(({ customDomain }) => customDomain),
  ].filter((path) => path) as Array<string>;

  return allPaths.map((domain) => ({
    params: {
      domain,
    },
  }));
}

export default async function SiteLayout({
  params,
  children,
}: {
  params: { domain: string };
  children: ReactNode;
}) {
  let isShowBadge = false;
  const { domain } = params;
  const data = await getSiteData(domain);

  if (!data) {
    notFound();
  }

  if (data?.userId) {
    const result = await getUserPlanAnalytics(data?.userId);
    isShowBadge = result.isShowBadge;
  }

  // Optional: Redirect to custom domain if it exists
  if (
    domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    data.customDomain &&
    process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true"
  ) {
    return redirect(`https://${data.customDomain}`);
  }

  return (
    <div className={fontMapper[data.font]} id="font_comes">
      <div className="overflow-hidden bg-gradient-to-br from-white to-slate-100  dark:from-gray-800 dark:to-gray-950 font-title">{children}</div>

      {params.domain == `demo.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` ||
      params.domain == `platformize.co` ? (
        <CTA />
      ) : (
        <ReportAbuse isShowBadge={isShowBadge} />
      )}
    </div>
  );
}
