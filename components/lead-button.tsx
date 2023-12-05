"use client";

import { useModal } from "@/components/modal/provider";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function LeadButton({
  btnText,
  style,
  children,
}: {
  btnText: string;
  style?: string | null;
  children: ReactNode;
}) {
  const modal = useModal();

  return (
    <>
      <button
        onClick={() => modal?.show(children)}
        className={cn(
          "rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white shadow-md transition-all hover:bg-white hover:text-black active:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-gray-700  dark:hover:border-gray-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-gray-800 lg:text-base",
          style,
        )}
      >
        {btnText}
      </button>
    </>
  );
}
