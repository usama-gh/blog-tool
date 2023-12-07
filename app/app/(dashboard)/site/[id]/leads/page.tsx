import LeadButton from "@/components/lead-button";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LeadsTable from "@/components/leads";
import CreateLeadModal from "@/components/modal/create-lead";

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
            Leads
          </h1>
          <p className="mt-3 text-base font-normal text-slate-800 dark:text-gray-600">
            Leads collected from your resources
          </p>
        </div>
        <LeadButton btnText="Create New Lead">
          <CreateLeadModal siteId={params.id} />
        </LeadButton>
      </div>
      <LeadsTable siteId={params.id} />
    </>
  );
}

export default Leads;
