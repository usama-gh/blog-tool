import { headers } from "next/headers";
import {
  getPostsForSite,
  getSiteAllLeads,
  getSiteStaticPages,
} from "@/lib/fetchers";
import prisma from "@/lib/prisma";

export default async function Sitemap() {
  const headersList = headers();
  const domain =
    headersList
      .get("host")
      ?.replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) ??
    "vercel.pub";

  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  const posts = await prisma.post.findMany({
    where: {
      site: subdomain ? { subdomain } : { customDomain: domain },
      published: true,
    },
  });

  const leads = await prisma.lead.findMany({
    where: {
      site: subdomain ? { subdomain } : { customDomain: domain },
    },
  });
  const pages = await prisma.page.findMany({
    where: {
      site: subdomain ? { subdomain } : { customDomain: domain },
    },
  });

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
    },
    ...pages.map((page) => ({
      url: `https://${domain}/page/${page.slug}`,
      lastModified: new Date(),
    })),
    ...posts.map(({ slug }) => ({
      url: `https://${domain}/${slug}`,
      lastModified: new Date(),
    })),
    ...leads.map((lead) => ({
      url: `https://${domain}/resources/${lead.slug}`,
      lastModified: new Date(),
    })),
  ];
}
