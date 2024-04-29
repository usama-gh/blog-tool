"use client";

import { useModal } from "@/components/modal/provider";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Magnet } from "lucide-react";

export default function LeadButton({
  btnText,
  style,
  disable,
  children,
}: {
  btnText: any;
  style?: string | null;
  disable?: boolean;
  children: ReactNode;
}) {
  const modal = useModal();

  return (
    <>
      <button
        onClick={() => modal?.show(children)}
        className={cn(
          "rounded-lg flex items-center gap-x-2 bg-slate-600 dark:bg-gray-700 px-2 py-1.5 text-sm font-medium text-white shadow-md transition-all hover:bg-white hover:text-black active:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70  dark:hover:bg-black dark:hover:text-white dark:active:bg-gray-100 lg:text-md",
          style,
        )}
        disabled={disable}
      >
      <Magnet
            width={18} /> {btnText}
      </button>
    </>
  );
}
