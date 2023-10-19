import { Suspense } from "react";
import Sites from "@/components/sites";
import PlacholderCard from "@/components/placeholder-card";
import CreateSiteButton from "@/components/create-site-button";
import CreateSiteModal from "@/components/modal/create-site";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserPlanAnalytics } from "@/lib/fetchers";

export default async function AllSites({ params }: { params: { id: string } }) {
  let canCreateSite = false;
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }
  const result = await getUserPlanAnalytics(session.user.id as string);
  canCreateSite = result.canCreateSite;

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-inter text-3xl font-bold dark:text-white hide_onboarding">
            All Sites
          </h1>
          <CreateSiteButton canCreateSite={canCreateSite}>
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
