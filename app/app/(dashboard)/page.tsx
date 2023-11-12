import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getUserPlanAnalytics } from "@/lib/fetchers";
import { redirect } from "next/navigation";

export default async function Overview() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  // check if user has subscription or create subscription for new user
  let subscription = await prisma.subscription.findFirst({
    where: {
      userId: session?.user.id,
    },
  });
  if (!subscription) {
    subscription = await prisma.subscription.create({
      data: {
        planId: 1,
        userId: session?.user.id,
      },
    });
  }


   // check the site who has not token relation and then create
   const sites = await prisma.site.findMany({
    where: {
      token: null,
    },
  });

  sites.forEach(async (site) => {
    await prisma.apiToken.create({
      data: {
        // @ts-ignore
        userId: site.userId,
        siteId: site.id,
      },
    });
  });
  

  // redirect user to dashboard of site if user has only one site
  const result = await getUserPlanAnalytics(session?.user.id as string);

  if (result.sites != 1) {
    redirect("overview");
  } else {
    redirect(`/site/${result.sitesData[0].id}`);
  }

  return <></>;
}
