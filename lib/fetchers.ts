import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { serialize } from "next-mdx-remote/serialize";
import { replaceExamples, replaceTweets } from "@/lib/remark-plugins";

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
    [`${domain}-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`],
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
    [`${domain}-posts`],
    {
      revalidate: 900,
      tags: [`${domain}-posts`],
    },
  )();
}

export async function getUserPlanAnalytics(userId: string) {
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
      // getting user sites
      let date = new Date();
      let firstDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        1,
      ).toLocaleDateString("sv-SE");
      let lastDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
      ).toLocaleDateString("sv-SE");

      const sites = await prisma.site.findMany({
        where: {
          userId: userId,
        },
        include: {
          _count: {
            select: {
              Vistor: {
                where: {
                  createdAt: {
                    gte: new Date(firstDay),
                    lte: new Date(lastDay),
                  },
                },
              },
            },
          },
        },
      });

      const planId = subscription?.planId ?? 1;
      const planSites = subscription?.websites ?? 1;
      const planVisitors = subscription?.visitors ?? 500;
      let visitors = 0;

      // calculating total visitor of each site in current month
      for (let index = 0; index < sites.length; index++) {
        visitors += sites[index]._count.Vistor;
      }

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
        planSites,
        canCreateSite,
        canUseAI,
      };
    },
    [`${userId}-states`],
    {
      revalidate: 900, // 15 minutes
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

      return {
        ...data,
        mdxSource,
        slidesMdxSource,
        adjacentPosts,
      };
    },
    [`${domain}-${slug}`],
    {
      revalidate: 900, // 15 minutes
      tags: [`${domain}-${slug}`],
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
      remarkPlugins: [replaceTweets, () => replaceExamples(prisma)],
    },
  });

  return mdxSource;
}

async function getSlidesMdxSource(slides: string) {
  // transforms links like <link> to [link](link) as MDX doesn't support <link> syntax
  // https://mdxjs.com/docs/what-is-mdx/#markdown
  const slidesArr = JSON.parse(slides);
  let slidesMdxSource: any = [];
  slidesArr.forEach(async (slide: string) => {
    const content = slide?.replaceAll(/<(https?:\/\/\S+)>/g, "[$1]($1)") ?? "";
    // Serialize the content string into MDX
    const mdxSource = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [replaceTweets, () => replaceExamples(prisma)],
      },
    });
    slidesMdxSource.push(mdxSource);
  });
  return slidesMdxSource;
}
