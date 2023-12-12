"use client";

import { Collector } from "@/types";
import Papa from "papaparse";

export default function DownloadLead({
  collectors,
  name,
}: {
  collectors: Collector[] | [];
  name: string;
}) {
  const handleDownload = async () => {
    const leads = [["Email", "Post's Name", "Collected At"]];
    await collectors.map((item: Collector) => {
      let lead = [
        item.email,
        item.post?.title,
        new Date(item.createdAt.toString()).toLocaleString(),
      ];
      // @ts-ignore
      leads.push(lead);
    });

    const csv = Papa.unparse(leads);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.setAttribute("download", `${name}.csv`);
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex justify-end">
      <button
        onClick={handleDownload}
        type="button"
        className="rounded-lg border border-slate-600 bg-slate-600 px-2 py-0.5 text-xs font-medium text-white shadow-md transition-all hover:bg-white hover:text-black active:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-gray-700  dark:hover:border-gray-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-gray-800 lg:text-sm"
      >
        Download CSV
      </button>
    </div>
  );
}
