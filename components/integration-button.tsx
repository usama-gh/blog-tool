"use client";

import { useModal } from "@/components/modal/provider";
import { ReactNode } from "react";
import { toast } from "sonner";
import { triggerEvent } from "./usermaven";

export default function IntegrationButton({
  children,
}: {
  children: ReactNode;
}) {
  const modal = useModal();
  // modal?.show(children);

  return (
    <>
      <button
        onClick={() => modal?.show(children)}
        className="rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white shadow-md transition-all hover:bg-white hover:text-black active:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-gray-700  dark:hover:border-gray-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-gray-800 lg:text-lg"
      >
        Integrations
      </button>
    </>
  );
}
