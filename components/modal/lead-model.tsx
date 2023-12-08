"use client";

import { toast } from "sonner";
import { createSiteLead, updateSiteLead } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { useModal } from "./provider";
import { useState } from "react";
import FileUploader from "../form/file-uploader";
import { Lead } from "@prisma/client";
import NovelEditor from "../editor/novel-editor";

export default function LeadModal({
  siteId,
  lead,
}: {
  siteId?: string;
  lead?: Lead;
}) {
  const router = useRouter();
  const modal = useModal();

  const [data, setData] = useState({
    name: (lead ? lead.name : "") as string,
    title: (lead ? lead.title : "") as string,
    description: (lead ? lead.description : "") as string,
    buttonCta: (lead ? lead.buttonCta : "") as string,
    download: (lead ? lead.download : "free") as string,
  });
  const [file, setFile] = useState(lead ? lead.file : "");
  const [description, setDescription] = useState(data.description);
  const type = lead ? "Update" : "Create";

  return (
    <form
      action={async (data: FormData) => {
        console.log("submitted");

        if (!file) {
          toast.error("Please select a file");
        } else {
          data.append("description", description);
          data.append("file", file);
          // @ts-ignore
          siteId && data.append("siteId", siteId);
          lead && data.append("oldFile", lead.file as string);

          (lead
            ? updateSiteLead(data, lead.id, "update")
            : createSiteLead(data)
          ).then((res: any) => {
            if (res.error) {
              toast.error(res.error);
            } else {
              router.refresh();
              modal?.hide();
              toast.success(
                `Successfully ${lead ? "updated" : "created"} site lead`,
              );
            }
          });
        }
      }}
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-gray-200 md:shadow dark:md:border-gray-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="font-inter mb-5 text-2xl font-bold dark:text-white">
          {type} your lead magnet
        </h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="name"
            className="text-xs font-medium text-slate-500 dark:text-gray-400"
          >
            Compaign Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="SaaS guide #1"
            autoFocus
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            required
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-black dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="title"
            className="text-xs font-medium text-slate-500 dark:text-gray-400"
          >
            Title CTA
          </label>
          <input
            name="title"
            type="text"
            placeholder="Build your SaaS in just two weeks! Free Guide"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            maxLength={32}
            required
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-black dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="description"
            className="text-xs font-medium text-slate-500  dark:text-gray-400"
          >
            Body
          </label>
          <NovelEditor
            text={description}
            setText={setDescription}
            canUseAI={false}
          />
          {/* <textarea
            name="description"
            placeholder="Description about the lead"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            rows={3}
            className="bg-stslateone-50 w-full rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black  focus:outline-none focus:ring-black dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
          /> */}
        </div>
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="description"
            className="text-xs font-medium text-slate-500  dark:text-gray-400"
          >
            Upload file
          </label>
          <FileUploader defaultValue={file} name="file" setFile={setFile} />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="btnCta"
            className="text-xs font-medium text-slate-500 dark:text-gray-400"
          >
            Button CTA
          </label>
          <input
            name="buttonCta"
            type="text"
            placeholder="Download Book"
            value={data.buttonCta}
            onChange={(e) => setData({ ...data, buttonCta: e.target.value })}
            required
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-black dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="download"
            className="text-xs font-medium text-slate-500 dark:text-gray-400"
          >
            Download settings
          </label>
          <div className="flex gap-x-6">
            <div className="flex">
              <input
                type="radio"
                name="download"
                className="mt-0.5 shrink-0 rounded-full border-gray-200 text-blue-600 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                id="free"
                value="free"
                onChange={(e) => setData({ ...data, download: e.target.value })}
                checked={data.download === "free"}
              />
              <label
                htmlFor="free"
                className="ms-2 text-sm text-gray-500 dark:text-gray-400"
              >
                Free Download
              </label>
            </div>

            <div className="flex">
              <input
                type="radio"
                name="download"
                className="mt-0.5 shrink-0 rounded-full border-gray-200 text-blue-600 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                id="email"
                value="email"
                onChange={(e) => setData({ ...data, download: e.target.value })}
                checked={data.download === "email"}
              />
              <label
                htmlFor="email"
                className="ms-2 text-sm text-gray-500 dark:text-gray-400"
              >
                Email required
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-slate-200 bg-slate-50 p-3 dark:border-gray-700 dark:bg-gray-800 md:px-10">
        <CreateSiteFormButton type={type} />
      </div>
    </form>
  );
}
function CreateSiteFormButton({ type }: { type: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={cn(
        "flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
        pending
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-black dark:hover:text-white dark:active:bg-gray-800",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>{type} Lead Magnet</p>}
    </button>
  );
}
