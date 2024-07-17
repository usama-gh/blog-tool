import { PaddleLoader } from "@/components/PaddleLoader";
import PlanUsage from "@/components/PlanUsage";
import Plan from "@/components/plan";
import { plans } from "@/data";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
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
          <div className="flex items-center justify-center">
          <div className="flex flex-col justify-center items-center">
              <h3 className="text-sm italic max-w-lg text-gray-800 dark:text-white tracking-wide mb-4">One of our customer says</h3>

              <div
                className="aspect-auto p-8 border border-gray-100 rounded-3xl bg-white dark:bg-gray-800 dark:border-gray-700 shadow-2xl shadow-gray-600/10 dark:shadow-none">
                <div className="flex gap-4">
                    <img className="w-12 h-12 rounded-full" src="https://typedd.com/wp-content/uploads/2023/12/image-5-e1702754608163.jpg" alt="user avatar" width="400" height="400" loading="lazy"/>
                    <div>
                        <h6 className="text-lg font-medium text-gray-700 dark:text-white">Donald Chan</h6>
                        <p className="text-sm text-gray-500 dark:text-gray-300">Founder & CEO</p>
                    </div>
                </div>
                <p className="mt-8">Rather than let those posts disappear into the void, you can extend their shelf life by curating them onto a Typedd blog & <strong>build a new audience</strong> through it.<br/><br/> So your content gets a second wind in the form of <strong>SEO</strong> traffic.
                </p>
            </div>

          </div>
        

            
       

          </div>
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
