"use client";

import { deleteStaticPage } from "@/lib/actions";
import Link from "next/link";
import { Trash, Eye } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import LeadButton from "./lead-button";
import LeadModal from "./modal/lead-model";
import { Lead, Page } from "@prisma/client";
import { Button } from "@/components/ui/button";
import PageButton from "./page-button";
import PageModal from "./modal/page-model";

interface Post {
  id: string;
  title: string;
}
export default function PageCard({
  baseUrl,
  page,
}: {
  baseUrl: string;
  page: Page;
}) {
  const router = useRouter();

  const openPageInNewTab = () => {
    const pageURL = `${baseUrl}/pages/${page.slug}`;
    window.open(pageURL, "_blank"); // Opens the page URL in a new tab
  };

  const handlePageDelete = () => {
    window.confirm("Are you sure you want to delete page?") &&
      deleteStaticPage(null, page.id, "delete")
        .then(async (res) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            router.refresh();
            toast.success(`Successfully deleted page!`);
          }
        })
        .catch((err: Error) => toast.error(err.message));
  };
  return (
    <tr>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-300">
        {page.name}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
        /{page.slug}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
        {page.published ? "Published" : "Draft"}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={openPageInNewTab}>
            <Eye className="h-4 w-4" />
          </Button>

          <PageButton btnText="Update">
            <PageModal page={page} />
          </PageButton>
          <Button
            variant="destructive"
            size="icon"
            onClick={handlePageDelete}
            type="button"
          >
            <Trash width={18} />
          </Button>
        </div>
      </td>
    </tr>
  );
}
