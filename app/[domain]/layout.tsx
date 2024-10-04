import { ReactNode } from "react";
import prisma from "@/lib/prisma";
import CTA from "@/components/cta";
import ReportAbuse from "@/components/report-abuse";
import { notFound, redirect } from "next/navigation";
import { getSiteData, getUserPlanAnalytics } from "@/lib/fetchers";
import { fontMapper } from "@/styles/fonts";
import { Metadata } from "next";

function sanitizeDomain(domain: string): string {
 
   // Check if the input domain is a valid URL or domain without a scheme
   let url;

   // Try to create a URL object to check if it's a valid URL
   try {
     url = new URL(domain); // This works if 'domain' already includes the scheme
   } catch {
     // If it throws an error, it means the domain doesn't include a scheme
     // Ensure the domain starts with 'http://' or 'https://'
     if (!/^https?:\/\//i.test(domain)) {
       domain = `https://${domain}`;
     }
     url = new URL(domain); // Create the URL object again after prepending the scheme
   }
 
   // Get the hostname (domain)
   const baseDomain = url.hostname;
 
   // Split the pathname into parts, filtering out empty strings
   const pathParts = url.pathname.split('/').filter(part => part !== '');
 
   // Remove duplicate base domain from the path if it exists
   if (pathParts.length > 0 && pathParts[0] === baseDomain) {
     pathParts.shift(); // Remove the first part if it's a duplicate
   }
 
   // Reconstruct the pathname without the duplicate
   url.pathname = '/' + pathParts.join('/');
 
   return url.toString(); // Return the sanitized URL as a string

}


export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata | null> {
  const data = await getSiteData(params.domain);

  const domain = decodeURIComponent(params.domain);

  console.log(domain)
  // const sanitizedDomain = sanitizeDomain(params.domain);


  
  
  if (!data) {
    return null;
  }
  const {
    name: title,
    description,
    image,
    logo,
  } = data as {
    name: string;
    description: string;
    image: string;
    logo: string;
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: new URL(`https://${params.domain}`),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@" + title,
    },
    icons: [logo],
    alternates: {
      canonical: new URL(`https://${params.domain}`),
    },
    metadataBase: new URL(`https://${params.domain}`),
    robots: {
      index: true,
      follow: true,
      nocache: true,
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
