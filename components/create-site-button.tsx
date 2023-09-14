"use client";

import { useModal } from "@/components/modal/provider";
import { ReactNode } from "react";
import { toast } from "sonner";

export default function CreateSiteButton({
  canCreatePost,
  children,
}: {
  canCreatePost: boolean;
  children: ReactNode;
}) {
  !canCreatePost &&
    toast.error(
      "You have reached your limit of creating new sites. Please upgrade your package",
    );

  const modal = useModal();
  return (
    <button
      onClick={() => modal?.show(children)}
      className="rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-70  dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
      disabled={!canCreatePost}
    >
      Create New Site
    </button>
  );
}
