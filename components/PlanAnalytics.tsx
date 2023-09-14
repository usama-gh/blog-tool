import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

const PlanAnalytics = async () => {
  let canCreatePost = false;
  let isShowBadge = false;

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
  const sites = await prisma.site.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const planSites = subscription?.websites ?? 1;
  const planVisitors = subscription?.visitors ?? 500;

  // calculating total visitor of each site in current month
  let visitors = 0;
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

  for (let index = 0; index < sites.length; index++) {
    let siteVisitors = await prisma.vistor.findMany({
      where: {
        siteId: sites[index].id,
        createdAt: {
          gte: new Date(firstDay),
          lte: new Date(lastDay),
        },
      },
    });
    visitors += siteVisitors.length;
  }

  if (planSites > sites.length) {
    canCreatePost = true;
  }

  if (planVisitors <= visitors) {
    isShowBadge = true;
  }

  // -----------Start-----------------
  // let isShowBadge = false;
  // const session = await getSession();

  // if (!session?.user) {
  //   redirect("/login");
  // }

  // // getting user subscription
  // const subscription = await prisma.subscription.findFirst({
  //   where: {
  //     userId: session.user.id,
  //   },
  // });

  // // getting user sites
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
  // const sites = await prisma.site.findMany({
  //   where: {
  //     userId: session.user.id,
  //   },
  //   include: {
  //     _count: {
  //       select: {
  //         Vistor: {
  //           where: {
  //             createdAt: {
  //               gte: new Date(firstDay),
  //               lte: new Date(lastDay),
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  // });

  // const planId = subscription?.planId ?? 1;
  // const planVisitors = subscription?.visitors ?? 500;
  // let visitors = 0;

  // // calculating total visitor of each site in current month
  // for (let index = 0; index < sites.length; index++) {
  //   visitors += sites[index]._count.Vistor;
  // }

  // if (planId == 1 || planVisitors <= visitors) {
  //   isShowBadge = true;
  // }
  // ------------End------------------

  return { canCreatePost, isShowBadge };
};

export default PlanAnalytics;
