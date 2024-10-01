import { Suspense } from "react";
import Sites from "@/components/sites";
import OverviewStats from "@/components/overview-stats";
import Posts from "@/components/posts";
import PlacholderCard from "@/components/placeholder-card";
import OverviewSitesCTA from "@/components/overview-sites-cta";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserDetails } from "@/lib/fetchers";
import CreateUsermavenUser from "@/components/usermaven";
import { QueryBlog } from "@/components/query-blog";

export default async function Overview() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const user = await getUserDetails();

  return (
    <>
      <QueryBlog />
      {/* <CreateUsermavenUser user={user} /> */}
      <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
        <div className="flex flex-col gap-y-6">
          <h1 className="font-inter hide_onboarding text-3xl font-bold dark:text-white">
            Overview
          </h1>
          <OverviewStats />
        </div>

        <div className="flex flex-col gap-y-6">
          <div className="flex items-center justify-between">
            <h1 className="font-inter text-md hide_onboarding hidden font-semibold uppercase tracking-wide dark:text-white lg:block">
              Your Blog
            </h1>
            <Suspense fallback={null}>
              <OverviewSitesCTA />
            </Suspense>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <PlacholderCard key={i} />
                ))}
              </div>
            }
          >
            <Sites limit={4} />
          </Suspense>
        </div>

        <div className="flex flex-col space-y-6">
          <h1 className="font-inter text-md hide_onboarding font-semibold uppercase tracking-wide dark:text-white">
            Recent Posts
          </h1>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <PlacholderCard key={i} />
                ))}
              </div>
            }
          >
            <Posts limit={8} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
