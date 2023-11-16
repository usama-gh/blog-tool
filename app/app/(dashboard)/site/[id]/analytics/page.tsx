import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import AnalyticsMockup from "@/components/analytics";
import { getSiteViews } from "@/lib/actions";
import AnalyticsType from "@/components/analytics-type";

export default async function SiteAnalytics({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const data = await prisma.site.findUnique({
    where: {
      id: params.id,
    },
  });
  if (!data || data.userId !== session.user.id) {
    notFound();
  }

  return (
    <>
      {/* <AnalyticsType data={data} url={url} siteViews={siteViews} /> */}
      <iframe
        src={`https://typedd-analytics.vercel.app/?token=${process.env.NEXT_PUBLIC_TINYBIRD_DASHBOARD_URL}&host=https%3A%2F%2Fui.tinybird.co&project_id=${params.id}`}
        title="description"
        className="h-full min-h-screen"
      ></iframe>
    </>
  );
}
