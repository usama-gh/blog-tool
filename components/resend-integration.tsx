"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createSiteIntegeration, updateSiteIntegeration } from "@/lib/actions";
import { useParams } from "next/navigation";
import { Integration } from "@prisma/client";
import SubmitButton from "./submit-button";

export default function ResendIntegration({
  integration,
}: {
  integration: Integration | null | undefined;
}) {
  const { id: siteId } = useParams() as { id?: string };

  const router = useRouter();

  const [data, setData] = useState({
    id: integration?.id,
    siteId: siteId as string,
    type: integration?.type ?? "resend",
    apiKey: integration?.apiKey ?? "",
    audienceId: integration?.audienceId ?? "",
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
          toast.success(`Successfully integrated Resend`);
        }
      }}
      className="w-full rounded-md bg-white dark:bg-gray-900 shadow-xl"
    >
      <div className="relative flex flex-col space-y-6 p-5 md:p-10">

        <div>
        <h2 className="flex gap-x-2 items-center font-inter text-2xl font-bold tracking-tight dark:text-white hover:text-blue-600">
           <a href="https://resend.com" target="_blank">Resend</a>
          </h2>
        <p className="text-base font-normal text-slate-800 dark:text-gray-400">
          Send your subscriber to Resend so you can send newsletters
        </p> 

        </div>
       

        <div className="flex flex-col space-y-2">
          <Label htmlFor="apiKey">Resend API Key</Label>
          <input
            id="apiKey"
            name="apiKey"
            type="text"
            placeholder="Resend API Key"
            value={data.apiKey}
            onChange={(e) => setData({ ...data, apiKey: e.target.value })}
            required
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-black dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="audienceId">Resend Audience ID</Label>
          <input
            id="audienceId"
            name="audienceId"
            type="text"
            placeholder="Resend Audience ID"
            value={data.audienceId}
            onChange={(e) => setData({ ...data, audienceId: e.target.value })}
            required
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-black dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            name="active"
            checked={data.active}
            onCheckedChange={(value) => setData({ ...data, active: value })}
          />
          <Label htmlFor="active">
            Automatically send new contact to Resend
          </Label>
        </div>
      </div>
      <br></br>
      <div className="flex items-center justify-end rounded-b-lg border-t border-slate-200 bg-slate-50 p-3 dark:border-gray-700 dark:bg-gray-800 md:px-10">
        <SubmitButton btnText="Save" />
      </div>
    </form>
  );
}
