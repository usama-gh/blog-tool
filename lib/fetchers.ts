import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { serialize } from "next-mdx-remote/serialize";
import { replaceExamples, replaceTweets } from "@/lib/remark-plugins";
import { plans } from "@/data";
import { getSession } from "./auth";
import { redirect } from "next/navigation";
import rehypeRaw from "rehype-raw";
import { SlideStyle, gateSlide, leadSlide } from "@/types";
import { styledSlide } from "./utils";

export async function getSiteIntegrations(siteId: string) {
  return await unstable_cache(
    async () => {
      return prisma.integration.findMany({
        where: {
          siteId,
        },
      });
    },
    [`${siteId}-integrations`],
    {
      revalidate: 900,
      tags: [`${siteId}-integrations`],
    },
  )();
}

export async function getSiteData(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      return prisma.site.findUnique({
        where: subdomain ? { subdomain } : { customDomain: domain },
        include: { user: true },
      });
    },
    [`${domain}-metadata`, "site-info"],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`, "site-info"],
    },
  )();
}

export async function getPostsForSite(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      return prisma.post.findMany({
        where: {
          site: subdomain ? { subdomain } : { customDomain: domain },
          published: true,
        },
        select: {
          title: true,
          description: true,
          slug: true,
          image: true,
          imageBlurhash: true,
          createdAt: true,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
    },
    [`${domain}-posts`, "site-info"],
    {
      revalidate: 900,
      tags: [`${domain}-posts`, "site-info"],
    },
  )();
}

export async function getLeadsForSite(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;
  const site = await prisma.site.findUnique({
    where: subdomain ? { subdomain } : { customDomain: domain },
  });

  return await unstable_cache(
    async () => {
      return prisma.lead.findMany({
        where: {
          site: subdomain ? { subdomain } : { customDomain: domain },
          featured: true,
        },
      });
    },
    [`${site?.id}-leads`],
    {
      revalidate: 900,
      tags: [`${site?.id}-leads`],
    },
  )();
}

export async function getSiteAllLeads(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;
  return prisma.lead.findMany({
    where: {
      site: subdomain ? { subdomain } : { customDomain: domain },
    },
  });
}

export async function getPagesForSite(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;
  const site = await prisma.site.findUnique({
    where: subdomain ? { subdomain } : { customDomain: domain },
  });

  return await unstable_cache(
    async () => {
      return prisma.page.findMany({
        where: {
          site: subdomain ? { subdomain } : { customDomain: domain },
          published: true,
        },
      });
    },
    [`${site?.id}-pages`],
    {
      revalidate: 900,
      tags: [`${site?.id}-pages`],
    },
  )();
}

export async function getBannersForSite(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;
  const site = await prisma.site.findUnique({
    where: subdomain ? { subdomain } : { customDomain: domain },
  });

  return await unstable_cache(
    async () => {
      return prisma.banner.findMany({
        where: {
          site: subdomain ? { subdomain } : { customDomain: domain },
        },
      });
    },
    [`${site?.id}-banners`],
    {
      revalidate: 900,
      tags: [`${site?.id}-banners`],
    },
  )();
}

export async function getIntegrationsForSite(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;
  const site = await prisma.site.findUnique({
    where: subdomain ? { subdomain } : { customDomain: domain },
  });

  return await unstable_cache(
    async () => {
      return prisma.integration.findMany({
        where: {
          site: subdomain ? { subdomain } : { customDomain: domain },
          active: true,
        },
      });
    },
    [`${site?.id}-integrations`],
    {
      revalidate: 900,
      tags: [`${site?.id}-integrations`],
    },
  )();
}

export async function getUserPlanAnalytics(userId?: string) {
  if (!userId) {
    const session = await getSession();

    if (!session?.user) {
      redirect("/login");
    }
    userId = session.user.id;
  }

  return await unstable_cache(
    async () => {
      let isShowBadge = false;
      let canCreateSite = false;
      let canUseAI = false;

      const subscription = await prisma.subscription.findFirst({
        where: {
          userId: userId,
        },
      });

      const sites = await prisma.site.findMany({
        where: {
          userId: userId,
        },
        include: {
          views: {
            select: {
              views: true,
            },
          },
        },
      });

      const planId = subscription?.planId ?? 1;
      const planSites = subscription?.websites ?? 1;
      const planVisitors = subscription?.visitors ?? 500;

      // calculating total visitor of each site in current month
      const visitors = sites.reduce(
        // @ts-ignore
        (total, site) => total + site?.views[0]?.views,
        0,
      );

      // let visitors = 0;
      // for (let index = 0; index < sites.length; index++) {
      //   visitors += sites[index]?.views[0]?.views || 0;
      // }

      // calculating can badge will show
      if (planId == 1 || planVisitors < visitors) {
        isShowBadge = true;
      }

      // calculating can user create new site
      if (planSites > sites.length) {
        canCreateSite = true;
      }
      // calculating can user can use AI feature
      if (planId !== 1) {
        canUseAI = true;
      }

      return {
        subscription,
        planId,
        visitors,
        planVisitors,
        isShowBadge,
        sites: sites.length,
        sitesData: sites,
        planSites,
        canCreateSite,
        canUseAI,
      };
    },
    [`${userId}-states`],
    {
      revalidate: 300, // 5 minutes
      tags: [`${userId}-states`],
    },
  )();
}

export async function getPostData(domain: string, slug: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      const data = await prisma.post.findFirst({
        where: {
          site: subdomain ? { subdomain } : { customDomain: domain },
          slug,
          published: true,
        },
        include: {
          site: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!data) return null;

      const [mdxSource, slidesMdxSource, adjacentPosts] = await Promise.all([
        getMdxSource(data.content!),
        getSlidesMdxSource(data.slides!),
        prisma.post.findMany({
          where: {
            site: subdomain ? { subdomain } : { customDomain: domain },
            published: true,
            NOT: {
              id: data.id,
            },
          },
          select: {
            slug: true,
            title: true,
            createdAt: true,
            description: true,
            slides: true,
            image: true,
            imageBlurhash: true,
          },
        }),
      ]);

      const leadSlides: leadSlide[] | [] = data.leadSlides
        ? JSON.parse(data.leadSlides)
        : [];

      return {
        ...data,
        mdxSource,
        slidesMdxSource,
        adjacentPosts,
        leadSlide: leadSlides.length > 0 ? leadSlides[0] : null,
      };
    },
    [`${domain}-${slug}`, `${slug}-styles`, `${slug}-lead`],
    {
      revalidate: 900, // 15 minutes
      tags: [`${domain}-${slug}`, `${slug}-styles`, `${slug}-lead`],
    },
  )();
}

export async function getPageData(domain: string, slug: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;
  const site = await prisma.site.findFirst({
    where: {
      ...(subdomain
        ? {
            subdomain,
          }
        : { customDomain: domain }),
    },
  });

  return await prisma.page.findFirst({
    where: {
      site: subdomain ? { subdomain } : { customDomain: domain },
      slug,
      published: true,
    },
  });

  // return await unstable_cache(
  //   async () => {
  //     return await prisma.page.findFirst({
  //       where: {
  //         site: subdomain ? { subdomain } : { customDomain: domain },
  //         slug,
  //         published: true,
  //       },
  //     });
  //   },
  //   [`${site?.id}-pages`,''],
  //   {
  //     revalidate: 900, // 15 minutes
  //     tags: [`${site?.id}-pages`],
  //   },
  // )();
}

export async function getLead(slug: string) {
  return await unstable_cache(
    async () => {
      const lead = await prisma.lead.findFirst({
        where: {
          slug: slug,
        },
      });

      if (!lead) return null;

      return lead;
    },
    [`${slug}-lead`],
    {
      revalidate: 900, // 15 minutes
      tags: [`${slug}-lead`],
    },
  )();
}

export async function getPostLead(
  leadId: string,
  postId: string,
  siteId: string,
) {
  return await unstable_cache(
    async () => {
      const lead = await prisma.lead.findFirst({
        where: {
          id: leadId,
        },
      });

      if (!lead) return null;

      return lead;
    },
    [`${postId}-leads`],
    {
      revalidate: 300, // 5 minutes
      tags: [`${siteId}-leads`],
    },
  )();
}

async function getMdxSource(postContents: string) {
  // transforms links like <link> to [link](link) as MDX doesn't support <link> syntax
  // https://mdxjs.com/docs/what-is-mdx/#markdown
  const content =
    postContents?.replaceAll(/<(https?:\/\/\S+)>/g, "[$1]($1)") ?? "";
  // Serialize the content string into MDX
  const mdxSource = await serialize(content, {
    mdxOptions: {
      // @ts-ignore
      rehypePlugins: [rehypeRaw],
      format: "md",
    },
  });

  return mdxSource;
}

async function getSlidesMdxSource(slides: string) {
  if (!slides) {
    // Handle the case where slides is null or undefined
    return [];
  }

  // transforms links like <link> to [link](link) as MDX doesn't support <link> syntax
  // https://mdxjs.com/docs/what-is-mdx/#markdown
  const slidesArr = JSON.parse(slides);
  let slidesMdxSource: any[] = [];

  for (const slide of slidesArr) {
    const content = slide?.replaceAll(/<(https?:\/\/\S+)>/g, "[$1]($1)") ?? "";
    // Serialize the content string into MDX
    // const mdxSource = await serialize(content, {
    //   mdxOptions: {
    //     remarkPlugins: [replaceTweets, () => replaceExamples(prisma)],
    //     format: "mdx",
    //   },
    // });
    const mdxSource = await serialize(content, {
      mdxOptions: {
        // @ts-ignore
        rehypePlugins: [rehypeRaw],
        format: "md",
      },
    });
    slidesMdxSource.push(mdxSource);
  }

  return slidesMdxSource;
}

export async function getUserDetails() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }
  return await unstable_cache(
    async () => {
      const user = await prisma.user.findFirst({
        where: {
          id: session?.user.id,
        },
      });

      const name = user?.name?.split(" ") || [];
      let firstName, lastName;

      if (name?.length > 2) {
        firstName = name.slice(0, 2).join(" ");
        lastName = name.slice(2).join(" ");
      } else {
        firstName = name[0];
        lastName = name[1];
      }

      const subscription = await prisma.subscription.findFirst({
        where: {
          userId: session?.user.id,
        },
      });

      const plan = plans.find((item) => item.id == subscription?.planId);
      const sites = await prisma.site.findMany({
        where: {
          userId: session?.user.id,
        },
        select: {
          id: true,
          subdomain: true,
          customDomain: true,
          userId: true,
        },
      });

      let sitesData: any = [];
      sites.forEach((site) => {
        let domain = null;
        if (site.customDomain) {
          domain = site.customDomain;
        } else {
          domain = `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
        }

        sitesData.push(domain);
      });

      return {
        ...session?.user,
        createdAt: user?.createdAt,
        firstName,
        lastName,
        planName: plan?.name,
        sitesCreated: sites.length,
        sites: sitesData,
      };
    },
    [`user-details`],
    {
      revalidate: 900,
      tags: [`user-details`],
    },
  )();
}

export async function getSiteStaticPages(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;
  const site = await prisma.site.findUnique({
    where: subdomain ? { subdomain } : { customDomain: domain },
  });

  return await unstable_cache(
    async () => {
      return await prisma.page.findMany({
        where: {
          site: subdomain ? { subdomain } : { customDomain: domain },
        },
      });
    },
    [`${site?.id}-pages`],
    {
      revalidate: 900, // 15 minutes
      tags: [`${site?.id}-pages`],
    },
  )();
}

export async function getUserStaticPages(siteId: string) {
  return await unstable_cache(
    async () => {
      return await prisma.page.findMany({
        where: {
          siteId: siteId,
        },
      });
    },
    [`${siteId}-pages`],
    {
      revalidate: 900, // 15 minutes
      tags: [`${siteId}-pages`],
    },
  )();
}

export async function getSiteMarketingBanners(siteId: string) {
  return await unstable_cache(
    async () => {
      return await prisma.banner.findMany({
        where: {
          siteId,
        },
      });
    },
    [`${siteId}-banners`],
    {
      revalidate: 900, // 15 minutes
      tags: [`${siteId}-banners`],
    },
  )();
}
