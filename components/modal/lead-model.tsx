"use client";

import { toast } from "sonner";
import { Info } from "lucide-react";
import { createSiteLead, updateLeadImage, updateSiteLead } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { useModal } from "./provider";
import { useState } from "react";
import FileUploader from "../form/file-uploader";
import { Lead } from "@prisma/client";
import NovelEditor from "../editor/novel-editor";
// @ts-ignore
import { upload } from "@vercel/blob/client";

export default function LeadModal({
  siteId,
  lead,
}: {
  siteId?: string;
  lead?: Lead;
}) {
  const router = useRouter();
  const modal = useModal();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: (lead ? lead.name : "") as string,
    title: (lead ? lead.title : "") as string,
    description: (lead ? lead.description : "") as string,
    buttonCta: (lead ? lead.buttonCta : "") as string,
    download: (lead ? lead.download : "email") as string,
  });
  const [file, setFile] = useState({
    file: lead ? lead.file : "",
    fileName: lead ? lead.fileName : "",
  });
  const [description, setDescription] = useState(data.description);
  const type = lead ? "Update" : "Create";

  return (
    <form
      action={async (data: FormData) => {
        if (!file.file || !file.fileName) {
          toast.error("Please select a file");
        } else {
          data.append("description", description);
          data.append("fileName", file.fileName as string);
          // @ts-ignore
          siteId && data.append("siteId", siteId);

          (lead
            ? updateSiteLead(data, lead.id, "update")
            : createSiteLead(data)
          ).then(async (res: any) => {
            if (res.error) {
              toast.error(res.error);
            } else {
              if (file.file !== lead?.file) {
                setLoading(true);
                try {
                  const blob = await upload(
                    file.fileName as string,
                    // @ts-ignore
                    file.file,
                    {
                      access: "public",
                      handleUploadUrl: "/api/leads/upload",
                      clientPayload: res.id,
                    },
                  );
                  setLoading(false);
                } catch (error: any) {
                  toast.error("Error uploading file.");
                  return;
                }
              }
              modal?.hide();
              router.refresh();
              toast.success(
                `Successfully ${lead ? "updated" : "created"} lead magnet`,
              );
            }
          });
        }
      }}
      className="flex w-full flex-col justify-start rounded-md bg-white dark:bg-black md:max-w-4xl md:border md:border-gray-200 md:shadow dark:md:border-gray-700 lg:flex-row"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10 lg:min-w-[500px]">
        <h2 className="font-inter mb-5 text-2xl font-bold dark:text-white">
          {type} your lead magnet
        </h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="name"
            className="text-xs font-medium text-slate-500 dark:text-gray-400"
          >
            Campaign Name
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
            Title CTA (Max. 50 chars limit)
          </label>

          <input
            name="title"
            type="text"
            placeholder="Build your SaaS in just two weeks! Free Guide"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            maxLength={50}
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
          <span className="lead-body max-h-[100px] overflow-y-auto">
            <NovelEditor
              text={description}
              setText={setDescription}
              canUseAI={false}
            />
          </span>

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
          <FileUploader
            defaultValue={file.file}
            name="file"
            setFile={setFile}
            oldFileName={file.fileName}
          />
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
        <div className="flex items-center justify-end rounded-b-lg border-t border-slate-200 bg-slate-50 p-3 dark:border-gray-700 dark:bg-gray-800 md:px-10">
          <CreateSiteFormButton type={type} loading={loading} />
        </div>
      </div>
      <div className="hidden w-[400px] bg-slate-100 px-4 text-center dark:bg-gray-800 lg:block">
        <h3 className="my-5 text-sm text-slate-800">Preview</h3>
        <div className="flex flex-col gap-y-2">
          <div>
            <div className="mx-auto mt-10 max-w-2xl rounded-b-xl shadow-lg">
              <div className="flex h-8 w-full items-center justify-start space-x-1.5 rounded-t-lg border-b border-slate-200 bg-white  px-3 dark:border-gray-500 dark:bg-gray-600">
                <span className="h-2 w-2 rounded-full bg-[#ff5f57]"></span>
                <span className="h-2 w-2 rounded-full bg-[#ffbe2f]"></span>
                <span className="h-2 w-2 rounded-full bg-[#28ca42]"></span>
              </div>
              <div className="flex h-52 w-full items-end justify-center rounded-b-xl border-t-0 bg-white dark:bg-gray-600">
                <div className="mb-2  flex rounded-full bg-slate-200 shadow-sm">
                  <span className="px-3 py-1 text-[9px]">{data.title}</span>
                  <button className="rounded-full bg-blue-600 px-2 text-[9px] text-white">
                    {data.buttonCta}
                  </button>
                </div>
              </div>
            </div>
            <p className="mt-2 py-1 text-[9px] tracking-wide text-slate-500 dark:text-gray-400">
              Overlay popup on blog post
            </p>
          </div>

          <div>
            <div className="mx-auto mt-10 max-w-2xl rounded-b-xl shadow-lg">
              <div className="flex h-8 w-full items-center justify-start space-x-1.5 rounded-t-lg border-b border-slate-200  bg-white  px-3 dark:border-gray-500 dark:bg-gray-600">
                <span className="h-2 w-2 rounded-full bg-[#ff5f57]"></span>
                <span className="h-2 w-2 rounded-full bg-[#ffbe2f]"></span>
                <span className="h-2 w-2 rounded-full bg-[#28ca42]"></span>
              </div>
              <div className="flex h-52 w-full items-center justify-center rounded-b-xl border-t-0 bg-white  dark:bg-gray-600">
                <div>
                  <h2 className="text-sm font-bold text-gray-800 dark:text-white">
                    {data.title}
                  </h2>
                  <p className="mx-auto w-[230px] text-[9px] text-gray-800 dark:text-white">
                    {description}
                  </p>
                  <div className="mt-2 flex  justify-center rounded-full">
                    {data.download === "email" && (
                      <div className="flex h-3 w-16 items-center bg-gray-100 px-2 text-[5px] text-gray-400 dark:bg-gray-400 dark:text-white">
                        Enter email
                      </div>
                    )}

                    <div className="flex h-3 items-center  rounded-sm bg-blue-600 px-1 text-[5px] text-white">
                      {data.buttonCta}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-2 py-1 text-[9px] tracking-wide text-slate-500 dark:text-gray-400">
              Lead magnet slide
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
function CreateSiteFormButton({
  type,
  loading,
}: {
  type: string;
  loading: boolean;
}) {
  const { pending } = useFormStatus();
  const isLoading = pending || loading ? true : false;
  return (
    <>
      <button
        type="submit"
        className={cn(
          "flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
          isLoading
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-black dark:hover:text-white dark:active:bg-gray-800",
        )}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <LoadingDots color="#808080" />
            <p>Please wait</p>
          </>
        ) : (
          <p>{type} Lead Magnet</p>
        )}
      </button>
    </>
  );
}
