"use client";

import { deleteSiteLead } from "@/lib/actions";
import Link from "next/link";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import LeadButton from "./lead-button";
import UpdateLeadModal from "./modal/update-lead";
import { Lead } from "@prisma/client";

interface Post {
  id: string;
  title: string;
}
export default function LeadCard({
  lead,
}: {
  lead: Lead & {
    posts: Post[] | [];
    _count: {
      LeadCollector: number;
    };
  };
}) {
  const router = useRouter();

  const handleLeadDelete = () => {
    window.confirm("Are you sure you want to delete lead?") &&
      deleteSiteLead(null, lead.id, "delete")
        .then(async (res) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            router.refresh();
            toast.success(`Successfully deleted lead!`);
          }
        })
        .catch((err: Error) => toast.error(err.message));
  };
  return (
    <tr>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
        {lead.name}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
        {lead.posts?.length > 0
          ? lead.posts?.map((post) => (
              <p
                className="mb-2 rounded-md bg-slate-400/50 p-1.5 text-gray-700"
                key={post.id}
              >
                {post.title}
              </p>
            ))
          : "No linked post yet"}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
        {lead._count.LeadCollector}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-black bg-black px-2 py-0.5 text-sm font-medium text-white shadow-md transition-all hover:bg-white hover:text-black active:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-gray-700  dark:hover:border-gray-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-gray-800 lg:text-base"
          >
            <Link href={`leads/${lead.id}`}>View</Link>
          </button>

          <LeadButton btnText="Manage">
            <UpdateLeadModal lead={lead} />
          </LeadButton>
          <button
            onClick={handleLeadDelete}
            type="button"
            className="rounded-lg border border-black bg-black px-2 py-0.5 text-sm font-medium text-white shadow-md transition-all hover:bg-white hover:text-black active:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-gray-700  dark:hover:border-gray-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-gray-800 lg:text-base"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
