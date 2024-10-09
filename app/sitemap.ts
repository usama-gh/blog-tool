import { headers } from "next/headers";
import {
  getPostsForSite,
  getSiteAllLeads,
  getSiteStaticPages,
} from "@/lib/fetchers";

export default async function Sitemap() {
  const headersList = headers();
  const domain =
    headersList
      .get("host")
      ?.replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) ??
    "vercel.pub";

  const posts = await getPostsForSite(domain);
  const leads = await getSiteAllLeads(domain);
  const pages = await getSiteStaticPages(domain);

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
