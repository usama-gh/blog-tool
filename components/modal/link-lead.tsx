"use client";
// ts-ignore because experimental_useFormStatus is not in the types
// @ts-ignore
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { Lead } from "@prisma/client";
import { useModal } from "./provider";

export default function LinkLeadModal({
  leads,
  leadId,
  setLeadId,
  type,
  createLeadSlide,
}: {
  leads: Lead[];
  leadId?: string | null | undefined;
  setLeadId?: any;
  type: "lead" | "leadId";
  createLeadSlide?: any;
}) {
  const modal = useModal();

  return (
    <form
      action={async (data: FormData) => {
        const leadId = data.get("lead") !== "" ? data.get("lead") : null;
        if (type === "leadId") {
          setLeadId(leadId);
        } else {
          createLeadSlide(leads.find((lead: Lead) => lead.id === leadId));
        }

        modal?.hide();
      }}
      className="w-full rounded-md bg-white pt-0 dark:bg-black md:max-w-md md:border md:border-gray-200 md:shadow dark:md:border-gray-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="font-inter text-2xl font-semibold dark:text-white">
          Attach your lead magnet
        </h2>

        <div className="flex flex-col space-y-2 pt-6">
          <label
            htmlFor="lead"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Select the lead magnet which you want to link
          </label>
          <select
            id="lead"
            name="lead"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500"
            defaultValue={leadId as string}
          >
            <option value="">None</option>
            {leads?.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-slate-200 bg-slate-50 p-3 dark:border-gray-700 dark:bg-gray-800 md:px-10">
        <AttachLeadButton />
      </div>
    </form>
  );
}
function AttachLeadButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        "flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
        pending
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-black dark:hover:text-white dark:active:bg-gray-800",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Submit</p>}
    </button>
  );
}
