"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ExternalLink } from 'lucide-react';
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createSiteIntegeration, updateSiteIntegeration } from "@/lib/actions";
import { useParams } from "next/navigation";
import { Integration } from "@prisma/client";
import SubmitButton from "./submit-button";

export default function PlunkIntegration({
  integration,
}: {
  integration: Integration | null | undefined;
}) {
  const { id: siteId } = useParams() as { id?: string };

  const router = useRouter();

  const [data, setData] = useState({
    id: integration?.id,
    siteId: siteId as string,
    type: integration?.type ?? "plunk",
    plunkKey: integration?.plunkKey ?? "",
    active: integration?.active ?? false,
  });

  return (
    <form
      action={async () => {
        const response = await (data.id
          ? updateSiteIntegeration(data.id, data)
          : createSiteIntegeration(data));

        if (response.error) {
          toast.error(response.error);
        } else {
          router.refresh();
          toast.success(`Successfully integrated Plunk`);
        }
      }}
      className="w-full rounded-md bg-white shadow-xl   dark:bg-gray-900"
    >
      <div className="relative flex flex-col space-y-6 p-5 md:p-10">
        <div>
          <h2 className="flex gap-x-2 items-center font-inter text-2xl font-bold tracking-tight dark:text-white hover:text-blue-600">
           <a href="https://useplunk.com" target="_blank">Plunk</a>
          </h2>
          <p className="text-base font-normal text-slate-800 dark:text-gray-400">
            Most affordable email sending tool
          </p>
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="leadapiKey">Secret Key</Label>
          <input
            id="leadapiKey"
            name="leadapiKey"
            type="text"
            placeholder="Secret Key"
            value={data.plunkKey}
            onChange={(e) => setData({ ...data, plunkKey: e.target.value })}
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-black dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
          />

          <div className="flex items-center space-x-2">
            <Switch
              id="plunkContact"
              name="plunkContact"
              checked={data.active}
              onCheckedChange={(value) => setData({ ...data, active: value })}
            />
            <Label htmlFor="plunkContact">
              Automatically send new contacts to Plunk
            </Label>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-slate-200 bg-slate-50 p-3 dark:border-gray-700 dark:bg-gray-800 md:px-10">
        <SubmitButton btnText="Save" />
      </div>
    </form>
  );
}
