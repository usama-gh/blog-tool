"use client";

import { toast } from "sonner";
import { Info } from "lucide-react";
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
  const [file, setFile] = useState({
    file: lead ? lead.file : "",
    fileName: lead ? lead.fileName : "",
  });
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
          // @ts-ignore
          data.append("file", file.file);
          data.append("fileName", file.fileName as string);
          // @ts-ignore
          siteId && data.append("siteId", siteId);

          (lead
            ? updateSiteLead(data, lead.id, "update")
            : createSiteLead(data)
          ).then((res: any) => {
            if (res.error) {
              toast.error(res.error);
            } else {
              router.refresh();

              toast.success(
                `Successfully ${lead ? "updated" : "created"} site lead`,
              );
            }
          });
        }
      }}
      className="flex w-full justify-start flex-col lg:flex-row rounded-md bg-white dark:bg-black md:max-w-4xl md:border md:border-gray-200 md:shadow dark:md:border-gray-700"
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
          <CreateSiteFormButton type={type} />
        </div>
      </div>
      <div className="w-[400px] hidden lg:block bg-slate-100 dark:bg-gray-800 text-center px-4">
        <h3 className="text-sm my-5 text-slate-800">Preview</h3>
        <div className="flex flex-col gap-y-2">

                <div>
                  <div className="mx-auto mt-10 max-w-2xl rounded-b-xl shadow-lg">
                    <div className="flex h-8 w-full bg-white dark:bg-gray-600 items-center justify-start space-x-1.5 rounded-t-lg border-b  border-slate-200 dark:border-gray-500 px-3">
                      <span className="h-2 w-2 rounded-full bg-[#ff5f57]"></span>
                      <span className="h-2 w-2 rounded-full bg-[#ffbe2f]"></span>
                      <span className="h-2 w-2 rounded-full bg-[#28ca42]"></span>
                    </div>
                    <div className="h-52 w-full flex items-end justify-center border-t-0 rounded-b-xl bg-white dark:bg-gray-600">

                    <div className="bg-slate-200  rounded-full shadow-sm mb-2 flex">
                      <span className="px-3 py-1 text-[9px]">{data.title}</span><button className="text-[9px] px-2 rounded-full bg-blue-600 text-white">{data.buttonCta}</button>
                  </div>
                    </div>
                   
                  </div>
                  <p className="text-[9px] mt-2 tracking-wide text-slate-500 dark:text-gray-400 py-1">Overlay popup on blog post</p>
                </div>

                <div>
                  <div className="mx-auto mt-10 max-w-2xl rounded-b-xl shadow-lg">
                    <div className="flex h-8 w-full bg-white dark:bg-gray-600 items-center justify-start space-x-1.5 rounded-t-lg  border-b  border-slate-200 dark:border-gray-500 px-3">
                      <span className="h-2 w-2 rounded-full bg-[#ff5f57]"></span>
                      <span className="h-2 w-2 rounded-full bg-[#ffbe2f]"></span>
                      <span className="h-2 w-2 rounded-full bg-[#28ca42]"></span>
                    </div>
                    <div className="h-52 w-full flex items-center justify-center border-t-0 rounded-b-xl bg-white  dark:bg-gray-600">

                          <div>
                              <h2 className="text-sm text-gray-800 dark:text-white font-bold">{data.title}</h2>
                              <p className="text-[9px] text-gray-800 dark:text-white w-[230px] mx-auto">{description}</p>
                              <div className="justify-center rounded-full  flex mt-2">
                      <div className="bg-gray-100 dark:bg-gray-400 h-3 w-16 flex items-center px-2 text-gray-400 dark:text-white text-[5px]">Enter email</div><div className="h-3 text-[5px] text-white  rounded-sm bg-blue-600 flex items-center px-1">{data.buttonCta}</div>
                  </div>
                          </div>
                    </div>
                  </div>
                  <p className="text-[9px] mt-2 tracking-wide text-slate-500 dark:text-gray-400 py-1">Lead magnet slide</p>
                </div>

                

        </div>
       


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
