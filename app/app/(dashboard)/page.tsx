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

  if (result.sites != 1) {
    redirect("overview");
  } else {
    redirect(`/site/${result.sitesData[0].id}`);
  }

  return <></>;
}
