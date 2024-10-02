"use client";

import { toast } from "sonner";
import { createMarketingBanner, updateMarketingBanner } from "@/lib/actions";
import { useRouter } from "next/navigation";
// ts-ignore because experimental_useFormStatus is not in the types
// @ts-ignore
import { useFormStatus } from "react-dom";
import { cn, r2Asset } from "@/lib/utils";
import Image from "next/image";
import LoadingDots from "@/components/icons/loading-dots";
import { useModal } from "./provider";
import { useEffect, useRef, useState } from "react";
import { Banner } from "@prisma/client";
import NovelEditor from "../editor/novel-editor";
import { BannerData } from "@/types";
import { Switch } from "@/components/ui/switch";
import parse from "html-react-parser";
import { customAlphabet } from "nanoid";
import { triggerEvent } from "@/components/posthug";
import FileUploader from "../form/file-uploader";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  10,
); // 10-character random string

export default function BannerModel({
  siteId,
  banner,
}: {
  siteId?: string;
  banner?: Banner;
}) {
  const router = useRouter();
  const modal = useModal();

  const [data, setData] = useState({
    name: (banner ? banner.name : "") as string,
    body: (banner ? banner.body : "") as string,
    showBtn: (banner ? banner.showBtn : false) as boolean,
    btnText: (banner ? banner.btnText : "") as string,
    btnLink: (banner ? banner.btnLink : "") as string,
    thumbnail: (banner ? banner.thumbnail : "") as string,
    thumbnailFile: (banner ? banner.thumbnailFile : "") as string,
  });

  const [thumbnail, setThumbnail] = useState(banner ? banner.thumbnail : "");
  const [originalThumbnail, setOriginalThumbnail] = useState<File>();

  const type = banner ? "Update" : "Create";

  async function uploadToR2(fileUrl: string, file: File) {
    try {
      const response = await fetch("/api/r2", {
        method: "POST",
        body: JSON.stringify({ key: fileUrl }),
      });
      const { url } = await response.json();
      await fetch(url, {
        method: "PUT",
        body: file,
      });
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    }
  }

  const handleAction = async () => {
    let thumbnailFileUrl = banner?.thumbnailFile ?? "";
    if (originalThumbnail) {
      thumbnailFileUrl = `${nanoid()}.${originalThumbnail.type.split("/")[1]}`;
      await uploadToR2(thumbnailFileUrl, originalThumbnail);
    }
    
    triggerEvent("created_marketing_banner", {});

    const body: BannerData = {
      siteId: banner?.siteId ?? (siteId as string),
      name: data.name,
      body: data.body,
      showBtn: data.showBtn,
      btnText: data.btnText,
      btnLink: data.btnLink,
      thumbnailFile: thumbnail ? thumbnailFileUrl : "",
      thumbnail: thumbnail as string,
    };

    const response = banner
      ? await updateMarketingBanner(body, banner.id, "update")
      : await createMarketingBanner(body);

    if (response.error) {
      toast.error(response.error);
    } else {
      modal?.hide();
      router.refresh();
      toast.success(
        `Successfully ${banner ? "updated" : "created"} marketing banner`,
      );
    }
  };

  const handleBodyChange = (newBody: string) => {
    if (newBody !== "<p></p>") {
      setData((prevData) => ({ ...prevData, body: newBody }));
    }
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await handleAction();
      }}
      className="flex w-full flex-col justify-start rounded-md bg-white dark:bg-black md:max-w-6xl md:border md:border-gray-200 md:shadow dark:md:border-gray-700 lg:flex-row"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10 lg:min-w-[500px]">
        <h2 className="font-inter mb-2 text-2xl font-bold dark:text-white">
          {type} your marketing banner
        </h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="name"
            className="pt-1 text-xs font-medium text-slate-500 dark:text-gray-400"
          >
            Banner Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="SaaS guide #1"
            autoFocus
            value={data.name}
            onChange={(e) =>
              setData((prevData) => ({ ...prevData, name: e.target.value }))
            }
            required
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-black dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="body"
            className="pt-3 text-xs font-medium  text-slate-500 dark:text-gray-400"
          >
            Body
          </label>
          <span className="lead-body h-full max-h-[150px] overflow-y-auto">
            <NovelEditor
              text={data.body}
              setText={handleBodyChange}
              canUseAI={false}
            />
          </span>
        </div>
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="description"
            className="pt-3 text-xs font-medium  text-slate-500 dark:text-gray-400"
          >
            Upload Thumbnail
          </label>
          <FileUploader
            fileName={thumbnail}
            setFileName={setThumbnail}
            setOriginalFile={setOriginalThumbnail}
            inputId="thumbnailFile"
            labelText="Upload your thumbnail"
          />
          <div id="preview"></div>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-3 pt-3">
            <label
              htmlFor="showBtn"
              className="block text-xs font-medium text-slate-500 dark:text-gray-400"
            >
              Show Button?
            </label>
            <Switch
              defaultChecked={data.showBtn}
              onCheckedChange={(value) =>
                setData((prevData) => ({ ...prevData, showBtn: value }))
              }
            />
          </div>
        </div>

        {data.showBtn && (
          <>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="btnText"
                className="pt-3 text-xs font-medium text-slate-500 dark:text-gray-400"
              >
                Button Text
              </label>

              <input
                name="btnText"
                type="text"
                placeholder="Free Guide"
                value={data.btnText}
                onChange={(e) =>
                  setData((prevData) => ({
                    ...prevData,
                    btnText: e.target.value,
                  }))
                }
                maxLength={50}
                required
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-black dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="btnLink"
                className="pt-3 text-xs font-medium text-slate-500 dark:text-gray-400"
              >
                Button Link
              </label>

              <input
                name="btnLink"
                type="text"
                placeholder="Download Link"
                value={data.btnLink}
                onChange={(e) =>
                  setData((prevData) => ({
                    ...prevData,
                    btnLink: e.target.value,
                  }))
                }
                maxLength={50}
                required
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-black dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
              />
            </div>
          </>
        )}

        <div className="pt-4">
          <CreateSiteFormButton type={type} />
        </div>
      </div>

      <div className="hidden w-[700px] bg-slate-100 px-4 text-center dark:bg-gray-800 lg:block">
        <div className="flex flex-col h-full items-center justify-center">
          <div>
          <h3 className="my-5 text-sm text-slate-800 dark:text-gray-200">Preview</h3>
            <div>
              <div className="flex w-full w-[240px] flex-col items-start  dark:bg-gray-700 rounded-2xl bg-white p-4 shadow">

             

                {data.thumbnail ? (
        <Image     src={r2Asset(data.thumbnailFile)} width={100} height={100} alt="Thumbnail" className="mb-4 w-20 object-cover rounded-xl shadow-sm" />
      ) : (
        <div></div>
      )}

      
             

                <h3 className="text-left font-bold text-gray-800 dark:text-white placeholder-gray-500">
                  {data.name || "Marketing Name"}
                </h3>
                <span className="rounded-full text-sm bg-transparent  dark:text-white text-left text-gray-800 placeholder-gray-500">
                  {parse(data.body as string)}
                </span>
                {data.showBtn && (
                  <button className="mt-2 w-auto rounded-full border border-slate-500 px-4 py-1 text-center text-sm text-slate-500 hover:border-slate-700 hover:text-slate-600 dark:border-gray-400 dark:bg-transparent dark:text-gray-400 dark:hover:border-gray-300 dark:hover:text-gray-300">
                    {data.btnText}
                  </button>
                )}
              </div>
            </div>
          </div>
          <h3 className="my-5 text-sm text-slate-400 dark:text-gray-300">This appears on homepage in left sidebar</h3>
        
        </div>
      </div>
    </form>
  );
}
function CreateSiteFormButton({ type }: { type: string }) {
  const { pending } = useFormStatus();
  return (
    <>
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
        {pending ? (
          <>
            <LoadingDots color="#808080" />
            <p>Please wait</p>
          </>
        ) : (
          <p>{type} Marketing Banner</p>
        )}
      </button>
    </>
  );
}
