import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import PagesTable from "@/components/pages-table";
import PageButton from "@/components/page-button";
import PageModal from "@/components/modal/page-model";

export default async function StaticPages({
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
      <div className="mb-5 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <div className="">
          <h1 className="font-inter truncate text-lg font-bold dark:text-white sm:w-auto sm:text-2xl">
            Static Pages
          </h1>
          <p className="mt-3 text-base font-normal text-slate-800 dark:text-gray-400">
            Create static pages to show anything on your website.
          </p>
        </div>
        <PageButton btnText="Create">
          <PageModal siteId={params.id} />
        </PageButton>
      </div>
      <PagesTable siteId={params.id} />
    </>
  );
}
