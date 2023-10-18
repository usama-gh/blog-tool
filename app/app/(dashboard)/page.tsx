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

  // checking for each user site have visitor row if not then create
  result.sitesData.forEach(async (site) => {
    await prisma.vistor.upsert({
      where: {
        siteId: site.id,
      },
      update: {},
      create: {
        siteId: site.id,
        userId: site.userId,
        views: 0,
      },
    });
  });

  if (result.sites != 1) {
    redirect("overview");
  } else {
    redirect(`/site/${result.sitesData[0].id}`);
  }

  return <></>;
}
