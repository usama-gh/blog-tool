import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SiteAnalytics({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      {/* <AnalyticsType data={data} url={url} siteViews={siteViews} /> */}
      <iframe
        src={`https://typedd-analytics.vercel.app/?token=${process.env.NEXT_PUBLIC_TINYBIRD_DASHBOARD_URL}&host=https%3A%2F%2Fui.tinybird.co&project_id=${params.id}`}
        title="description"
        className="h-full min-h-screen w-full"
      ></iframe>
    </>
  );
}
