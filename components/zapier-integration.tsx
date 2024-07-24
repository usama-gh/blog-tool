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
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-gray-200 md:shadow dark:md:border-gray-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="font-inter text-2xl font-bold tracking-tight dark:text-white">
          Zapier
        </h2>
        <p className="text-base font-normal text-slate-800 dark:text-gray-400">
          Enter your Zapier Catch Webhook & do cool things
        </p>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="apiKey">Zapier Webhook URL</Label>
          <input
            id="apiKey"
            name="apiKey"
            type="text"
            placeholder="Zapier Webhook URL"
            value={data.webhookUrl}
            onChange={(e) => setData({ ...data, webhookUrl: e.target.value })}
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
            Automatically send new contact to Zapier
          </Label>
        </div>

        <div className="w-full border-t border-gray-500"></div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="postWebhookUrl">Post Publishing Webhook URL</Label>
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
        </div>

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
            Automatically send new contact to Zapier
          </Label>
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-slate-200 bg-slate-50 p-3 dark:border-gray-700 dark:bg-gray-800 md:px-10">
        <SubmitButton btnText="Save" />
      </div>
    </form>
  );
}
