import { Suspense } from "react";
import Sites from "@/components/sites";
import OverviewStats from "@/components/overview-stats";
import Posts from "@/components/posts";
import Link from "next/link";
import PlacholderCard from "@/components/placeholder-card";
import OverviewSitesCTA from "@/components/overview-sites-cta";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getUserPlanAnalytics } from "@/lib/fetchers";
import { redirect } from "next/navigation";

export default async function Overview() {
  const session = await getSession();

  // check if user has subscription or create subscription for new user
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session?.user.id,
    },
  });
  if (!subscription) {
    await prisma.subscription.create({
      data: {
        planId: 1,
        userId: session?.user.id,
      },
    });
  }

  // redirect user to dashboard of site if user has only one site
  const result = await getUserPlanAnalytics(session?.user.id as string);
  if (result.sites == 1) {
    redirect(`/site/${result.sitesData[0].id}`);
  }

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="font-inter text-3xl font-bold dark:text-white">
          Overview
        </h1>
        <OverviewStats />
      </div>

      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-inter text-md hidden font-semibold uppercase tracking-wide dark:text-white lg:block">
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
        <h1 className="font-inter text-md font-semibold uppercase tracking-wide dark:text-white">
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
  );
}
