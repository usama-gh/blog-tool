import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LeadsTable from "@/components/leads";
import PageButton from "@/components/page-button";
import BannerModel from "@/components/modal/banner-model";
import BannersTable from "@/components/banners-table";

async function Leads({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <div className="mb-5 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <div className="">
          <h1 className="font-inter truncate text-lg font-bold dark:text-white sm:w-auto sm:text-2xl">
            Banners
          </h1>
          <p className="mt-3 text-base font-normal text-slate-800 dark:text-gray-400">
            Showcase your links, announcement or anything else
          </p>
        </div>
        <PageButton btnText="Create">
          <BannerModel siteId={params.id} />
        </PageButton>
      </div>
      <BannersTable siteId={params.id} />
    </>
  );
}

export default Leads;
