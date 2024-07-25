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

export default function ZapierIntegration({
  integration,
}: {
  integration: Integration | null | undefined;
}) {
  const { id: siteId } = useParams() as { id?: string };

  const router = useRouter();

  const [data, setData] = useState({
    id: integration?.id,
    siteId: siteId as string,
    type: integration?.type ?? "zapier",
    webhookUrl: integration?.webhookUrl ?? "",
    active: integration?.active ?? false,
    postWebhookUrl: integration?.postWebhookUrl ?? "",
    postWebhookActive: integration?.postWebhookActive ?? false,
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
          toast.success(`Successfully integrated Zapier`);
        }
      }}
      className="w-full rounded-md bg-white dark:bg-gray-900   shadow-xl"
    >
      <div className="relative flex flex-col space-y-6 p-5 md:p-10">

        <div>
        <h2 className="font-inter text-2xl font-bold tracking-tight dark:text-white">
          Zapier/Make
        </h2>
        <p className="text-base font-normal text-slate-800 dark:text-gray-400">
          Enter your Zapier Catch Webhook & do cool things
        </p>
        </div>
       

        <div className="flex flex-col space-y-2">
          <Label htmlFor="leadapiKey">Webhook URL When Leads Is Collected</Label>
          <input
            id="leadapiKey"
            name="leadapiKey"
            type="text"
            placeholder="Webhook for contact URL"
            value={data.webhookUrl}
            onChange={(e) => setData({ ...data, webhookUrl: e.target.value })}
            required
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-black dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
          />

<div className="flex items-center space-x-2">
          <Switch
            id="zapierContact"
            name="zapierContact"
            checked={data.active}
            onCheckedChange={(value) => setData({ ...data, active: value })}
          />
          <Label htmlFor="zapierContact">
            Automatically send new contact to Zapier
          </Label>
        </div>

        </div>

       

       
        <div className="flex flex-col space-y-2">
          <Label htmlFor="postWebhookUrl">Webhook URL When Post Is Published</Label>
          <input
            id="postWebhookUrl"
            name="postWebhookUrl"
            type="text"
            placeholder="Post Publishing Webhook URL"
            value={data.postWebhookUrl}
            onChange={(e) =>
              setData({ ...data, postWebhookUrl: e.target.value })
            }
            required
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-black dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
          />
           <div className="flex items-center space-x-2">
          <Switch
            id="postWebhookActive"
            name="postWebhookActive"
            checked={data.postWebhookActive}
            onCheckedChange={(value) =>
              setData({ ...data, postWebhookActive: value })
            }
          />
          <Label htmlFor="postWebhookActive">
            Automatically hit webhook on every post publish
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
