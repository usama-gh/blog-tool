import { getSession } from "@/lib/auth";
import CreateSiteButton from "./create-site-button";
import CreateSiteModal from "./modal/create-site";
import Link from "next/link";
import { getUserPlanAnalytics } from "@/lib/fetchers";
import WritePostButton from "./write-post-button";

export default async function OverviewSitesCTA() {
  let canCreateSite = false;
  const session = await getSession();
  if (!session) {
    return 0;
  }
  const result = await getUserPlanAnalytics(session.user.id as string);
  canCreateSite = result.canCreateSite;

  return result.sites > 0 ? (
    <div className="flex gap-x-2">
      <WritePostButton sites={result.sitesData} />
      <Link
        href="/sites"
        className="rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
      >
        View All Blogs
      </Link>
    </div>
  ) : (
    <>
      <CreateSiteButton canCreateSite={canCreateSite}>
        <CreateSiteModal />
      </CreateSiteButton>
    </>
  );
}
