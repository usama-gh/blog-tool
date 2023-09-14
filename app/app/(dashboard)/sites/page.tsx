import { Suspense } from "react";
import Sites from "@/components/sites";
import PlacholderCard from "@/components/placeholder-card";
import CreateSiteButton from "@/components/create-site-button";
import CreateSiteModal from "@/components/modal/create-site";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function AllSites({ params }: { params: { id: string } }) {
  let canCreatePost = false;
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  // getting user subscription
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session?.user?.id,
    },
  });
  // getting user sites
  const sites = await prisma.site.count({
    where: {
      userId: session?.user?.id,
    },
  });

  const planSites = subscription?.websites ?? 1;

  if (planSites > sites) {
    canCreatePost = true;
  }

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            All Sites
          </h1>
          <CreateSiteButton canCreatePost={canCreatePost}>
            <CreateSiteModal />
          </CreateSiteButton>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <PlacholderCard key={i} />
              ))}
            </div>
          }
        >
          {/* @ts-expect-error Server Component */}
          <Sites siteId={params.id} />
        </Suspense>
      </div>
    </div>
  );
}
