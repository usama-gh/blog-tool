"use server";

import prisma from "@/lib/prisma";
import { Integration, Lead, Post, Site } from "@prisma/client";
import { revalidateTag } from "next/cache";
import {
  withIntegrationAuth,
  withLeadAuth,
  withPostAuth,
  withSiteAuth,
} from "./auth";
import { getSession } from "@/lib/auth";
import {
  addDomainToVercel,
  // getApexDomain,
  removeDomainFromVercelProject,
  // removeDomainFromVercelTeam,
  validDomainRegex,
} from "@/lib/domains";
import { del, put } from "@vercel/blob";
import { customAlphabet } from "nanoid";
import { getBlurDataURL } from "@/lib/utils";
import { createId as cuid } from "@paralleldrive/cuid2";
import {
  AddIntegrationData,
  IntegrationData,
  LeadData,
  SubscribeData,
  leadSlide,
} from "@/types";
import { getIntegrationsForSite } from "./fetchers";
import { Resend } from "resend";

export const deleteFileFromBlob = async (urlToDelete: string) => {
  await del(urlToDelete);
  return true;
};
const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7,
); // 7-character random string

export const createSite = async (formData: FormData) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const bio = formData.get("description") as string;
  const subdomain = formData.get("subdomain") as string;
  let logo = formData.get("image") as string;
  if (
    logo !==
    "https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png"
  ) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return {
        error:
          "Missing BLOB_READ_WRITE_TOKEN token. Note: Vercel Blob is currently in beta – ping @steventey on Twitter for access.",
      };
    }

    const file = formData.get("logo") as File;
    const filename = `${nanoid()}.${file.type.split("/")[1]}`;

    const { url } = await put(filename, file, {
      access: "public",
    });
    logo = url;
  }

  try {
    // creating site
    const response = await prisma.site.create({
      data: {
        name,
        description,
        bio,
        subdomain,
        logo,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    // creating site visitors row
    await prisma.vistor.create({
      data: {
        user: {
          connect: {
            id: session.user.id,
          },
        },
        site: {
          connect: {
            id: response.id,
          },
        },
        views: 0,
      },
    });

    // @ts-ignore
    await prisma.apiToken.create({
      data: {
        userId: session?.user.id,
        siteId: response.id,
      },
    });

    await revalidateTag(
      `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    );
    revalidateTag(`${session.user.id}-states`);

    return response;
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: `This subdomain is already taken`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};

export const updateSite = withSiteAuth(
  async (formData: FormData, site: Site, key: string) => {
    const value = formData.get(key) as string;

    try {
      let response;

      if (key === "customDomain") {
        if (value.includes("vercel.pub")) {
          return {
            error: "Cannot use vercel.pub subdomain as your custom domain",
          };

          // if the custom domain is valid, we need to add it to Vercel
        } else if (validDomainRegex.test(value)) {
          response = await prisma.site.update({
            where: {
              id: site.id,
            },
            data: {
              customDomain: value,
            },
          });
          await addDomainToVercel(value);

          // empty value means the user wants to remove the custom domain
        } else if (value === "") {
          response = await prisma.site.update({
            where: {
              id: site.id,
            },
            data: {
              customDomain: null,
            },
          });
        }

        // if the site had a different customDomain before, we need to remove it from Vercel
        if (site.customDomain && site.customDomain !== value) {
          response = await removeDomainFromVercelProject(site.customDomain);

          /* Optional: remove domain from Vercel team 

          // first, we need to check if the apex domain is being used by other sites
          const apexDomain = getApexDomain(`https://${site.customDomain}`);
          const domainCount = await prisma.site.count({
            where: {
              OR: [
                {
                  customDomain: apexDomain,
                },
                {
                  customDomain: {
                    endsWith: `.${apexDomain}`,
                  },
                },
              ],
            },
          });

          // if the apex domain is being used by other sites
          // we should only remove it from our Vercel project
          if (domainCount >= 1) {
            await removeDomainFromVercelProject(site.customDomain);
          } else {
            // this is the only site using this apex domain
            // so we can remove it entirely from our Vercel team
            await removeDomainFromVercelTeam(
              site.customDomain
            );
          }
          
          */
        }
      } else if (key === "image" || key === "logo") {
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          return {
            error:
              "Missing BLOB_READ_WRITE_TOKEN token. Note: Vercel Blob is currently in beta – ping @steventey on Twitter for access.",
          };
        }

        const file = formData.get(key) as File;
        const filename = `${nanoid()}.${file.type.split("/")[1]}`;

        const { url } = await put(filename, file, {
          access: "public",
        });

        const blurhash = key === "image" ? await getBlurDataURL(url) : null;

        response = await prisma.site.update({
          where: {
            id: site.id,
          },
          data: {
            [key]: url,
            ...(blurhash && { imageBlurhash: blurhash }),
          },
        });
      } else if (key === "links") {
        const formDataObj: any = {};
        formData.forEach((value, key) => (formDataObj[key] = value));
        response = await prisma.site.update({
          where: {
            id: site.id,
          },
          data: {
            links: JSON.stringify(formDataObj),
          },
        });
      } else {
        response = await prisma.site.update({
          where: {
            id: site.id,
          },
          data: {
            [key]: value,
          },
        });
      }
      console.log(
        "Updated site data! Revalidating tags: ",
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
        `${site.customDomain}-metadata`,
      );
      await revalidateTag(
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
      );
      site.customDomain &&
        (await revalidateTag(`${site.customDomain}-metadata`));

      revalidateTag("site-info");
      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This ${key} is already taken`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

export const updateSiteBio = withSiteAuth(
  async (content: string, site: Site, key: string) => {
    try {
      let response;

      response = await prisma.site.update({
        where: {
          id: site.id,
        },
        data: {
          [key]: content,
        },
      });
      revalidateTag("site-info");
      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This ${key} is already taken`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

export const deleteSite = withSiteAuth(async (_: FormData, site: Site) => {
  try {
    const response = await prisma.site.delete({
      where: {
        id: site.id,
      },
    });
    await revalidateTag(
      `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    );
    await revalidateTag(`${site.userId}-states`);
    response.customDomain &&
      (await revalidateTag(`${site.customDomain}-metadata`));
    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
});

export const getSiteFromPostId = async (postId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      siteId: true,
    },
  });
  return post?.siteId;
};

export const createPost = withSiteAuth(async (_: FormData, site: Site) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const response = await prisma.post.create({
    data: {
      title:'Untitled Post',
      description:'Add description of this untitled post',
      siteId: site.id,
      userId: session.user.id,
    },
  });

  await revalidateTag(
    `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`,
  );
  await revalidateTag(`${response.id}-lead`);
  site.customDomain && (await revalidateTag(`${site.customDomain}-posts`));

  return response;
});

// creating a separate function for this because we're not using FormData
export const updatePost = async (data: Post) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const post = await prisma.post.findUnique({
    where: {
      id: data.id,
    },
    include: {
      site: true,
    },
  });
  if (!post || post.userId !== session.user.id) {
    return {
      error: "Post not found",
    };
  }
  try {
    const response = await prisma.post.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
        slides: data.slides,
        styling: data.styling,
        gateSlides: data.gateSlides,
        leadId: data.leadId,
        leadSlides: data.leadSlides,
      },
    });

    await revalidateTag(
      `${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`,
    );
    await revalidateTag(
      `${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${post.slug}`,
    );
    await revalidateTag(`${post.slug}-lead`);
    await revalidateTag(`${post.slug}-styles`);

    // await revalidateTag(`${data.id}-post`);
    // if the site has a custom domain, we need to revalidate those tags too
    post.site?.customDomain &&
      (await revalidateTag(`${post.site?.customDomain}-posts`),
      await revalidateTag(`${post.site?.customDomain}-${post.slug}`));

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const updatePostMetadata = withPostAuth(
  async (
    formData: FormData,
    post: Post & {
      site: Site;
    },
    key: string,
  ) => {
    const value = formData.get(key) as string;

    try {
      let response;
      if (key === "image") {
        const file = formData.get("image") as File;
        const filename = `${nanoid()}.${file.type.split("/")[1]}`;

        const { url } = await put(filename, file, {
          access: "public",
        });

        const blurhash = await getBlurDataURL(url);

        response = await prisma.post.update({
          where: {
            id: post.id,
          },
          data: {
            image: url,
            imageBlurhash: blurhash,
          },
        });
      } else if (key === "unsplashImage") {
        const blurhash = await getBlurDataURL(value);
        response = await prisma.post.update({
          where: {
            id: post.id,
          },
          data: {
            image: value,
            imageBlurhash: blurhash,
          },
        });
      } else if (key === "leadId") {
        const lead = formData.get("leadId") as string;

        if (lead !== "null") {
          response = await prisma.post.update({
            where: {
              id: post.id,
            },
            data: {
              leadId: lead,
            },
          });
        } else {
          response = await prisma.post.update({
            where: {
              id: post.id,
            },
            data: {
              leadId: null,
            },
          });
        }
      } else {
        response = await prisma.post.update({
          where: {
            id: post.id,
          },
          data: {
            [key]: key === "published" ? value === "true" : value,
          },
        });
      }

      await revalidateTag(
        `${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`,
      );
      await revalidateTag(
        `${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${post.slug}`,
      );

      // if the site has a custom domain, we need to revalidate those tags too
      post.site?.customDomain &&
        (await revalidateTag(`${post.site?.customDomain}-posts`),
        await revalidateTag(`${post.site?.customDomain}-${post.slug}`));

      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This slug is already in use`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

export const deletePost = withPostAuth(async (_: FormData, post: Post) => {
  try {
    const response = await prisma.post.delete({
      where: {
        id: post.id,
      },
      select: {
        siteId: true,
      },
    });
    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
});

export const editUser = async (
  formData: FormData,
  _id: unknown,
  key: string,
) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const value = formData.get(key) as string;

  try {
    const response = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        [key]: value,
      },
    });
    return response;
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: `This ${key} is already in use`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};

export const updateSubscription = async (data: any) => {
  try {
    const response = await prisma.subscription.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        planId: data.planId,
        priceId: data.priceId,
        websites: data.websites,
        visitors: data.visitors,
        checkoutId: data.checkoutId,
        transactionId: data.transactionId,
      },
    });
    await revalidateTag(`${data.userId}-states`);

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const addVisitor = async (siteId: string) => {
  try {
    const response = await prisma.vistor.update({
      where: {
        siteId: siteId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const getSiteViews = async (siteId: string, type: string) => {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const visitors = await prisma.$queryRaw`
  SELECT
      DATE_PART('month', "createdAt") AS month,
      DATE_PART('year', "createdAt") AS year,
      COUNT(*) AS count
  FROM
      "Vistor"
  WHERE
      "siteId" = ${siteId} AND
      "createdAt" >= ${oneYearAgo}
  GROUP BY
      month, year
  `;

  return visitors;
};

export const getSiteViewsTest = async (siteId: string, type: string) => {
  let visitors = null;
  const oldDataLimit = new Date();
  if (type === "month") {
    oldDataLimit.setFullYear(oldDataLimit.getFullYear() - 1);

    visitors = await prisma.$queryRaw`
    SELECT
      DATE_PART('month', "createdAt") AS month,
      DATE_PART('year', "createdAt") AS year,
      COUNT(*) AS count
    FROM
      "Vistor"
    WHERE
      "siteId" = ${siteId} AND
      "createdAt" >= ${oldDataLimit}
    GROUP BY
      month, year
    `;
  } else if (type === "day") {
    oldDataLimit.setDate(oldDataLimit.getDate() - 60);

    visitors = await prisma.$queryRaw`
    SELECT
      DATE_PART('day', "createdAt") AS day,
      DATE_PART('month', "createdAt") AS month,
      DATE_PART('year', "createdAt") AS year,
      COUNT(*) AS count
    FROM
      "Vistor"
    WHERE
      "siteId" = ${siteId} AND
      "createdAt" >= ${oldDataLimit}
    GROUP BY
      day, month, year
    `;
  } else {
    oldDataLimit.setDate(oldDataLimit.getDate() - 7 * 26);
    visitors = await prisma.$queryRaw`
    SELECT
      DATE_PART('week', "createdAt") AS week,
      DATE_PART('month', "createdAt") AS month,
      DATE_PART('year', "createdAt") AS year,
      COUNT(*) AS count
    FROM
      "Vistor"
    WHERE
      "siteId" = ${siteId} AND
      "createdAt" >= ${oldDataLimit}
    GROUP BY
      week, month, year
    `;
  }

  return visitors;
};

export const regenerateToken = async (id: string) => {
  try {
    const response = await prisma.apiToken.update({
      where: {
        id,
      },
      data: {
        token: cuid(),
      },
    });

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const createSiteLead = async (data: LeadData) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  try {
    // creating site lead
    const response = await prisma.lead.create({
      data: {
        name: data.name,
        title: data.title,
        description: data.description,
        buttonCta: data.buttonCta,
        file: data.url,
        fileName: data.fileName,
        download: data.download,
        delivery: data.delivery,
        heroDescription: data.heroDescription,
        thumbnail: data.thumbnail,
        thumbnailFile: data.thumbnailFile,
        featured: data.featured,
        user: {
          connect: {
            id: session.user.id,
          },
        },
        site: {
          connect: {
            id: data.siteId,
          },
        },
      },
    });

    revalidateTag(`${data.siteId}-leads`);
    revalidateTag(`${response.id}-lead`);

    return response;
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: `Error`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};

export const updateSiteLead = withLeadAuth(
  async (data: LeadData, lead: Lead, key: string) => {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }

    // const isFileChange = lead.fileName !== fileName;

    // if (isFileChange) {
    //   if (!process.env.BLOB_READ_WRITE_TOKEN) {
    //     return {
    //       error:
    //         "Missing BLOB_READ_WRITE_TOKEN token. Note: Vercel Blob is currently in beta – ping @steventey on Twitter for access.",
    //     };
    //   }
    //   // delete old file from vercel blob
    //   await del(lead.file as string);
    // }

    try {
      const response = await prisma.lead.update({
        where: {
          id: lead.id,
        },
        data: {
          name: data.name,
          title: data.title,
          description: data.description,
          buttonCta: data.buttonCta,
          file: data.url,
          fileName: data.fileName,
          download: data.download,
          delivery: data.delivery,
          heroDescription: data.heroDescription,
          thumbnail: data.thumbnail,
          thumbnailFile: data.thumbnailFile,
          featured: data.featured,
        },
      });

      // update lead download type in  lead mangnet connected to post
      const posts = await prisma.post.findMany({
        where: {
          leadId: lead.id,
        },
      });

      if (posts.length > 0) {
        for (const post of posts) {
          const slides = post.leadSlides ? JSON.parse(post.leadSlides) : [];
          let leadSlides = [];
          if (slides.length > 0) {
            leadSlides = slides.map((slide: leadSlide) => {
              return slide.leadId == lead.id
                ? {
                    ...slide,
                    type: data.download,
                    ctaBtnText: data.buttonCta ?? "Download",
                  }
                : slide;
            });
            await prisma.post.update({
              where: {
                id: post.id,
              },
              data: {
                leadSlides: JSON.stringify(leadSlides),
              },
            });
            revalidateTag(`${post.slug}-lead`);
          }
        }
      }

      revalidateTag(`${lead.siteId}-leads`);
      revalidateTag(`${lead.id}-lead`);
      return response;
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  },
);

export const updateLeadImage = withLeadAuth(
  async (formData: FormData, lead: Lead) => {
    const file = formData.get("url") as string;

    try {
      const response = await prisma.lead.update({
        where: {
          id: lead.id,
        },
        data: {
          file,
        },
      });
      await revalidateTag(`${lead.siteId}-leads`);
      await revalidateTag(`${lead.id}-lead`);
      return response;
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  },
);

export const deleteSiteLead = withLeadAuth(async (_: FormData, lead: Lead) => {
  const leadId = lead.id;
  try {
    const leadPosts = await prisma.post.findMany({
      where: {
        leadId: {
          contains: leadId,
        },
      },
    });

    if (leadPosts.length > 0) {
      return {
        error:
          "Lead is connected with one or multiple posts. Please disconnect lead from posts and try again.",
      };
    }

    // deleting all collectors of lead
    await prisma.leadCollector.deleteMany({
      where: {
        leadId: {
          contains: leadId,
        },
      },
    });

    // updating posts who contains lead data
    await prisma.post.updateMany({
      where: {
        leadId: {
          contains: leadId,
        },
      },
      data: {
        leadId: null,
      },
    });

    const siteId = lead.siteId;
    // deleteing lead
    const file = lead.file;
    const response = await prisma.lead.delete({
      where: {
        id: leadId,
      },
    });
    // deleting file from blob
    // file && (await del(file));

    await revalidateTag(`${siteId}-leads`);
    revalidateTag(`${leadId}-lead`);
    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
});

export const createSiteIntegeration = async (data: IntegrationData) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  try {
    // creating site integeration
    const response = await prisma.integration.create({
      data: {
        type: data.type,
        apiKey: data.apiKey,
        audienceId: data.audienceId,
        webhookUrl: data.webhookUrl,
        active: data.active,
        postWebhookUrl: data.postWebhookUrl,
        postWebhookActive: data.postWebhookActive,
        user: {
          connect: {
            id: session.user.id,
          },
        },
        site: {
          connect: {
            id: data.siteId,
          },
        },
      },
    });

    revalidateTag(`${data.siteId}-integrations`);

    return response;
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: `Error`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};

export const updateSiteIntegeration = withIntegrationAuth(
  async (integration: Integration, data: IntegrationData, key?: string) => {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }

    try {
      // updating site integeration
      const response = await prisma.integration.update({
        where: {
          id: integration.id,
        },
        data: {
          type: data.type,
          apiKey: data.apiKey,
          audienceId: data.audienceId,
          webhookUrl: data.webhookUrl,
          active: data.active,
          postWebhookUrl: data.postWebhookUrl,
          postWebhookActive: data.postWebhookActive,
          user: {
            connect: {
              id: session.user.id,
            },
          },
          site: {
            connect: {
              id: data.siteId,
            },
          },
        },
      });

      revalidateTag(`${data.siteId}-integrations`);
      return response;
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  },
);

export const deleteSiteIntegeration = withIntegrationAuth(
  async (
    integration: Integration,
    data: IntegrationData | null,
    key?: string,
  ) => {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }
    const siteId = integration.siteId;

    try {
      // updating site integeration
      const response = await prisma.integration.delete({
        where: {
          id: integration.id,
        },
      });

      revalidateTag(`${siteId}-integrations`);
      return response;
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  },
);

export const addSubscriberToIntegrations = async (
  searchKey: string,
  key: string,
  data: AddIntegrationData,
) => {
  try {
    let integrations: Integration[] | [] = [];
    let site: Site | null = null;

    if (key === "domain") {
      const subdomain = searchKey.endsWith(
        `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      )
        ? searchKey.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
        : null;

      // fetch integration data
      integrations = await prisma.integration.findMany({
        where: {
          site: subdomain ? { subdomain } : { customDomain: searchKey },
          active: true,
        },
      });
      // fetch site data
      site = await prisma.site.findUnique({
        where: subdomain ? { subdomain } : { customDomain: searchKey },
      });
    } else if (key === "siteId") {
      // fetch integration data
      integrations = await prisma.integration.findMany({
        where: {
          site: { id: searchKey },
          active: true,
        },
      });

      // fetch site data
      site = await prisma.site.findUnique({
        where: {
          id: searchKey,
        },
      });
    }

    const url: string = site?.customDomain
      ? site?.customDomain
      : `${site?.subdomain}. ${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

    const resendIntegration = integrations.find(
      (integration) => integration.type === "resend" && integration.active,
    );
    const zapierIntegration = integrations.find(
      (integration) => integration.type === "zapier" && integration.active,
    );

    // send data to resend integration
    if (resendIntegration) {
      const resend = new Resend(resendIntegration.apiKey as string);
      await resend.contacts.create({
        ...data,
        unsubscribed: false,
        audienceId: resendIntegration.audienceId as string,
      });
    }

    // send data to zapier integration
    if (zapierIntegration) {
      const date = new Date();

      // sending data to zapier integration using fetch API
      const zapierRequest = await fetch(
        zapierIntegration.webhookUrl as string,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: data.source ?? "subscribe_form",
            source_title: data.sourceTitle ?? "Subscribe Form",
            lead_email: data.email,
            lead_first_name: data.firstName,
            lead_second_name: data.lastName,
            date: new Date(),
            // date: `${date.getDate()}-${
            //   date.getMonth() + 1
            // }-${date.getFullYear()}`,
            website_url: data.websiteUrl ?? url,
          }),
        },
      );
      // const response = await zapierRequest.json();
      // console.log("zapier response: " + JSON.stringify(response));
    }

    return true;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const sendPostToZapier = async (
  url: string,
  data: {
    title: string;
    slug: string;
    content: string;
  },
) => {
  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: data.title,
      slug: data.slug,
      content: data.content,
      date: new Date(),
    }),
  });
  const response = await request.json();
  console.log("zapier response: " + JSON.stringify(response));

  return true;
};
