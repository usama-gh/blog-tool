"use client";

import { deleteSiteLead } from "@/lib/actions";
import Link from "next/link";
import { Trash, Eye } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import LeadButton from "./lead-button";
import LeadModal from "./modal/lead-model";
import { Lead } from "@prisma/client";
import { Button } from "@/components/ui/button";

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
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-300">
        {lead.name}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
        {lead.posts?.length > 0
          ? lead.posts?.map((post) => (
              <p
                className="mb-2 rounded-full bg-slate-200 w-fit  px-2 py-1 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
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
          <Button
                  variant="secondary"
            
          >
            <Link href={`leads/${lead.id}`}><span className="flex items-center gap-x-2"><Eye width={18} />View Leads</span></Link>
          </Button>

          <LeadButton btnText="Manage">
            <LeadModal lead={lead} />
          </LeadButton>
          <Button
          variant="destructive"
           size="icon"
            onClick={handleLeadDelete}
            type="button"
          
          >
            <Trash width={18} />
          </Button>
        </div>
      </td>
    </tr>
  );
}
