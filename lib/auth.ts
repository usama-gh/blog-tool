import { getServerSession, type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { BannerData, IntegrationData, LeadData, PageData } from "@/types";
import { PostHog } from "posthog-node";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          gh_username: profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
  ],
  pages: {
    signIn: `/login`,
    verifyRequest: `/login`,
    error: "/login", // Error code passed in query string as ?error=
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
        domain: VERCEL_DEPLOYMENT
          ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
          : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }

      return token;
    },
    session: async ({ session, token }) => {
      session.user = {
        ...session.user,
        // @ts-expect-error
        id: token.sub,
        // username: token?.user?.username || token?.user?.gh_username,
        username: session?.user?.name
          ?.split(" ")
          ?.join("")
          ?.toLocaleLowerCase(),
      };

      return session;
    },
  },
  events: {
    createUser: async (message) => {
      const client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      });

      await client.shutdown();

      client.capture({
        distinctId: message.user.id,
        event: "signed_up",
        properties: {
          name: message.user.name,
          email: message.user.email,
        },
      });
    },
  },
};

export function getSession() {
  return getServerSession(authOptions) as Promise<{
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      image: string;
    };
  } | null>;
}

export function withSiteAuth(action: any) {
  return async (
    formData: FormData | null,
    siteId: string,
    key: string | null,
  ) => {
    const session = await getSession();
    if (!session) {
      return {
        error: "Not authenticated",
      };
    }
    const site = await prisma.site.findUnique({
      where: {
        id: siteId,
      },
    });
    if (!site || site.userId !== session.user.id) {
      return {
        error: "Not authorized",
      };
    }

    return action(formData, site, key);
  };
}

export function withPostAuth(action: any) {
  return async (
    formData: FormData | null,
    postId: string,
    key: string | null,
  ) => {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
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

    return action(formData, post, key);
  };
}

export function withLeadAuth(action: any) {
  return async (data: LeadData | null, leadId: string, key: string | null) => {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }
    const lead = await prisma.lead.findUnique({
      where: {
        id: leadId,
      },
    });
    if (!lead || lead.userId !== session.user.id) {
      return {
        error: "Lead not found",
      };
    }

    return action(data, lead, key);
  };
}

export function withPageAuth(action: any) {
  return async (data: PageData | null, pageId: string, key: string | null) => {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }
    const page = await prisma.page.findUnique({
      where: {
        id: pageId,
      },
    });
    if (!page || page.userId !== session.user.id) {
      return {
        error: "Page not found",
      };
    }

    return action(data, page, key);
  };
}

export function withBannerAuth(action: any) {
  return async (
    data: BannerData | null,
    bannerId: string,
    key: string | null,
  ) => {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }
    const banner = await prisma.banner.findUnique({
      where: {
        id: bannerId,
      },
    });
    if (!banner || banner.userId !== session.user.id) {
      return {
        error: "Marketing banner not found",
      };
    }

    return action(data, banner, key);
  };
}

export function withIntegrationAuth(action: any) {
  return async (
    id: string,
    data: IntegrationData | null,
    key?: string | null,
  ) => {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }
    const integration = await prisma.integration.findUnique({
      where: {
        id,
      },
    });
    if (!integration || integration.userId !== session.user.id) {
      return {
        error: "Integration not found",
      };
    }

    return action(integration, data, key);
  };
}
