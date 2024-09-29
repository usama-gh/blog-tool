"use client";

import { deleteMarketingBanner, deleteSiteLead } from "@/lib/actions";
import Link from "next/link";
import { Trash, Eye } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import LeadButton from "./lead-button";
import LeadModal from "./modal/lead-model";
import { Banner, Lead } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { toDateString } from "@/lib/utils";
import PageButton from "./page-button";
import BannerModel from "./modal/banner-model";

interface Post {
  id: string;
  title: string;
}
export default function BannerCard({ banner }: { banner: Banner }) {
  const router = useRouter();

  const handleLeadDelete = () => {
    window.confirm("Are you sure you want to delete marketing banner?") &&
      deleteMarketingBanner(null, banner.id, "delete")
        .then(async (res) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            router.refresh();
            toast.success(`Successfully deleted maerketing banner!`);
          }
        })
        .catch((err: Error) => toast.error(err.message));
  };
  return (
    <tr>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-300">
        {banner.name}
      </td>

      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
        {toDateString(banner.createdAt, "short")}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
        <div className="flex gap-2">
          <PageButton btnText="Update">
            <BannerModel banner={banner} />
          </PageButton>
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
