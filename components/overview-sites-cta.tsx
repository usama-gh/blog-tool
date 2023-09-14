import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import CreateSiteButton from "./create-site-button";
import CreateSiteModal from "./modal/create-site";
import Link from "next/link";

export default async function OverviewSitesCTA() {
  let canCreatePost = false;
  const session = await getSession();
  if (!session) {
    return 0;
  }
  const sites = await prisma.site.count({
    where: {
      userId: session.user.id as string,
    },
  });

  // getting user subscription
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session?.user?.id,
    },
  });

  const planSites = subscription?.websites ?? 1;

  if (planSites > sites) {
    canCreatePost = true;
  }

  return sites > 0 ? (
    <Link
      href="/sites"
      className="rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
    >
      View All Blogs
    </Link>
  ) : (
    <CreateSiteButton canCreatePost={canCreatePost}>
      <CreateSiteModal />
    </CreateSiteButton>
  );
}
