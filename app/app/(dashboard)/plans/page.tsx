import { PaddleLoader } from "@/components/PaddleLoader";
import PlanUsage from "@/components/PlanUsage";
import Plan from "@/components/plan";
import { plans } from "@/data";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getUserPlanAnalytics } from "@/lib/fetchers";

export default async function Plans() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const result = await getUserPlanAnalytics(session.user.id as string);

  return (
    <>
      <PaddleLoader
        subscriptionId={result.subscription?.id}
        userId={session.user.id}
      />
      <div className="flex max-w-screen-xl flex-col p-8">
        <div className="flex flex-col space-y-2">
          <h1 className="font-inter text-3xl font-bold dark:text-white">Plans</h1>
          <p className="text-lg font-regular text-slate-800 dark:text-white">
            Enjoy all benefits of Typedd with just one time payment. Limited to first 100 users only
          </p>
        </div>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <Plan
              key={plan.id}
              plan={plan}
              isCurrentPlan={plan.id == result.planId}
              email={session.user.email}
            />
          ))}
        </div>
        {/* Grid End */}

        {/* plan usage */}
        <div className="mb-3 mt-12 flex flex-col">
          <h2 className="font-inter uppercase tracking-widest text-sm text-slate-800 font-normal dark:text-white">
            Plan Usage
          </h2>
        </div>
        {/* plan usage end */}
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          <PlanUsage
            title="page views"
            planLimit={
              // result.subscription?.planId != 3
              //   ? result.planVisitors
              //   : "Unlimited"
              result.planVisitors
            }
            usage={result.visitors}
          />
          <PlanUsage
            title="blogs made"
            planLimit={result.planSites}
            usage={result.sites}
          />
        </div>
      </div>
    </>
  );
}
