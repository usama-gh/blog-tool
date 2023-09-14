import { PaddleLoader } from "@/components/PaddleLoader";
import PlanUsage from "@/components/PlanUsage";
import Plan from "@/components/plan";
import { plans } from "@/data";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function Plans() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  // getting user subscription
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  // getting user sites
  let date = new Date();
  let firstDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    1,
  ).toLocaleDateString("sv-SE");
  let lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).toLocaleDateString("sv-SE");
  const sites = await prisma.site.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      _count: {
        select: {
          Vistor: {
            where: {
              createdAt: {
                gte: new Date(firstDay),
                lte: new Date(lastDay),
              },
            },
          },
        },
      },
    },
  });

  const planId = subscription?.planId ?? 1;
  const planSites = subscription?.websites ?? 1;
  const planVisitors = subscription?.visitors ?? 500;
  let visitors = 0;

  // calculating total visitor of each site in current month
  for (let index = 0; index < sites.length; index++) {
    visitors += sites[index]._count.Vistor;
  }
  // let date = new Date();
  // let firstDay = new Date(
  //   date.getFullYear(),
  //   date.getMonth(),
  //   1,
  // ).toLocaleDateString("sv-SE");
  // let lastDay = new Date(
  //   date.getFullYear(),
  //   date.getMonth() + 1,
  //   0,
  // ).toLocaleDateString("sv-SE");

  // for (let index = 0; index < sites.length; index++) {
  //   let siteVisitors = await prisma.vistor.findMany({
  //     where: {
  //       siteId: sites[index].id,
  //       createdAt: {
  //         gte: new Date(firstDay),
  //         lte: new Date(lastDay),
  //       },
  //     },
  //   });
  //   visitors += siteVisitors.length;
  // }

  return (
    <>
      <PaddleLoader subscriptionId={subscription?.id} />
      <div className="flex max-w-screen-xl flex-col p-8">
        <div className="flex flex-col space-y-2">
          <h1 className="font-cal text-3xl font-bold dark:text-white">Plans</h1>
          <p className="text-lg font-semibold dark:text-white">
            Enjoy all benefits of SlideBites with just one time payment
          </p>
        </div>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <Plan
              key={plan.id}
              plan={plan}
              isCurrentPlan={plan.id == planId}
              email={session.user.email}
            />
          ))}
        </div>
        {/* Grid End */}

        {/* plan usage */}
        <div className="mb-3 mt-12 flex flex-col">
          <h2 className="font-cal text-2xl font-normal dark:text-white">
            Plan Usage
          </h2>
        </div>
        {/* plan usage end */}
        <div className="flex flex-wrap gap-5">
          <PlanUsage
            title="website views"
            planLimit={subscription?.planId != 3 ? planVisitors : "Unlimited"}
            usage={visitors}
          />
          <PlanUsage
            title="website created"
            planLimit={planSites}
            usage={sites.length}
          />
        </div>
      </div>
    </>
  );
}
