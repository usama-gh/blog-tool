import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import LeadCard from "./lead-card";
import { getSiteMarketingBanners } from "@/lib/fetchers";
import BannerCard from "./banner-card";

export default async function BannersTable({
  siteId,
  limit,
}: {
  siteId?: string;
  limit?: number;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const banners = await getSiteMarketingBanners(siteId!);

  return banners.length > 0 ? (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="inline-block min-w-full p-1.5 align-middle">
          <div className="overflow-hidden rounded-lg border dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-6 py-3 text-start text-xs font-light uppercase tracking-widest text-slate-500 dark:text-gray-600"
                  >
                    Banner Name
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-6 py-3 text-start text-xs font-light uppercase tracking-widest text-slate-500 dark:text-gray-600"
                  >
                    Created On
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-6 py-3 text-start text-xs font-light uppercase tracking-widest text-slate-500 dark:text-gray-600"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {banners.map((banner) => (
                  <BannerCard key={banner.id} banner={banner} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="hide_onboarding flex flex-col items-center space-x-4">
      <h1 className="font-inter text-2xl">No Marketing Banners Yet</h1>
      <Image
        alt="missing post"
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any marketing banner created yet. Create one to get
        started.
      </p>
    </div>
  );
}
