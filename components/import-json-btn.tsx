"use client";

import { useModal } from "@/components/modal/provider";
import { ReactNode } from "react";

export default function ImportJSONButton({
  children,
}: {
  children: ReactNode;
}) {
  const modal = useModal();
  return (
    <button
      onClick={() => modal?.show(children)}
      className="rounded-lg border px-2 py-1 text-sm transition-all focus:outline-none border-black bg-black text-white hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
    >
      Import Tweet JSON
    </button>
  );
}
