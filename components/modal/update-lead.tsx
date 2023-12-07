"use client";

import { toast } from "sonner";
import { updateSiteLead } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { useModal } from "./provider";
import { useState } from "react";
import FileUploader from "../form/file-uploader";
import { Lead } from "@prisma/client";

export default function UpdateLeadModal({ lead }: { lead: Lead }) {
  const router = useRouter();
  const modal = useModal();

  const [form, setForm] = useState({
    name: lead.name as string,
    title: lead.title as string,
    description: lead.description as string,
    buttonCta: lead.buttonCta as string,
    download: lead.download as string,
  });
  const [file, setFile] = useState(lead.file);

  return (
    <form
      action={async (data: FormData) => {
        if (!file) {
          toast.error("Please select a file");
        } else {
          data.append("file", file);
          data.append("oldFile", lead.file as string);
          updateSiteLead(data, lead.id, "update").then((res: any) => {
            if (res.error) {
              toast.error(res.error);
            } else {
              router.refresh();
              modal?.hide();
              toast.success(`Successfully updated lead`);
            }
          });
        }
      }}
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-gray-200 md:shadow dark:md:border-gray-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="font-inter text-2xl dark:text-white">
          Update your lead magnet
        </h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-slate-500 dark:text-gray-400"
          >
            Campaign Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="Saas guid #1"
            autoFocus
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-black dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="title"
            className="text-sm font-medium text-slate-500 dark:text-gray-400"
          >
            Title CTA
          </label>
          <input
            name="title"
            type="text"
            placeholder="Build your Saas in two weeks! Free Guide"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            maxLength={32}
            required
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-black dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-slate-500"
          >
            Body
          </label>
          <textarea
            name="description"
            placeholder="Description about the lead"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="bg-stslateone-50 w-full rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black  focus:outline-none focus:ring-black dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-slate-500"
          >
            Upload your file
          </label>
          <FileUploader defaultValue={file} name="file" setFile={setFile} />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="btnCta"
            className="text-sm font-medium text-slate-500 dark:text-gray-400"
          >
            Button CTA
          </label>
          <input
            name="buttonCta"
            type="text"
            placeholder="Download Book"
            value={form.buttonCta}
            onChange={(e) => setForm({ ...form, buttonCta: e.target.value })}
            required
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-black dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="download"
            className="text-sm font-medium text-slate-500 dark:text-gray-400"
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
                onChange={(e) => setForm({ ...form, download: e.target.value })}
                checked={form.download === "free"}
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
                onChange={(e) => setForm({ ...form, download: e.target.value })}
                checked={form.download === "email"}
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
        <CreateSiteFormButton />
      </div>
    </form>
  );
}
function CreateSiteFormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        "flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
        pending
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-black dark:hover:text-white dark:active:bg-gray-800",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Update Lead</p>}
    </button>
  );
}
