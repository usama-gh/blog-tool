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
import { customAlphabet } from "nanoid";
import { LeadData } from "@/types";
import { Switch } from "@/components/ui/switch";
import parse from "html-react-parser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  10,
); // 10-character random string

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
    heroDescription: (lead ? lead.heroDescription : "") as string,
    thumbnail: (lead ? lead.thumbnail : "") as string,
    thumbnailFile: (lead ? lead.thumbnailFile : "") as string,
    featured: (lead ? lead.featured : false) as boolean,
    buttonCta: (lead ? lead.buttonCta : "") as string,
    download: (lead ? lead.download : "email") as string,
    delivery: (lead ? lead.delivery : "file") as string,
    link: (lead && lead.delivery === "link" ? lead.file : "") as string,
  });
  const [fileName, setFileName] = useState(lead ? lead.fileName : "");
  const [originalFile, setOriginalFile] = useState<File>();
  const [thumbnail, setThumbnail] = useState(lead ? lead.thumbnail : "");
  const [originalThumbnail, setOriginalThumbnail] = useState<File>();
  const [description, setDescription] = useState(data.description);
  const type = lead ? "Update" : "Create";

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

  return (
    <form
      action={async () => {
        if (data.delivery === "file" && !fileName) {
          toast.error("Please select a file");
        } else {
          let fileUrl = lead ? lead.file : "";
          if (originalFile) {
            fileUrl = `${nanoid()}.${originalFile?.type.split("/")[1]}`;

            // uploading file to r2 server
            await uploadToR2(fileUrl, originalFile);
          }

          let thumbnailFileUrl = lead ? lead.thumbnailFile : "";
          if (originalThumbnail) {
            thumbnailFileUrl = `${nanoid()}.${
              originalThumbnail?.type.split("/")[1]
            }`;

            // uploading file to r2 server
            await uploadToR2(thumbnailFileUrl, originalThumbnail);
          }

          const body: LeadData = {
            siteId: (lead ? lead.siteId : siteId) as string,
            name: data.name,
            title: data.title,
            description: description as string,
            buttonCta: data.buttonCta,
            download: data.download,
            delivery: data.delivery,
            url: (data.delivery === "file" ? fileUrl : data.link) as string,
            fileName: fileName as string,
            thumbnailFile: (thumbnail ? thumbnailFileUrl ?? "" : "") as string,
            thumbnail: thumbnail as string,
            heroDescription: data.heroDescription,
            featured: data.featured,
          };

          (lead
            ? updateSiteLead(body, lead.id, "update")
            : createSiteLead(body)
          ).then(async (res: any) => {
            if (res.error) {
              toast.error(res.error);
            } else {
              modal?.hide();
              router.refresh();
              toast.success(
                `Successfully ${lead ? "updated" : "created"} lead magnet`,
              );
            }
          });
        }
      }}
      className="flex w-full flex-col justify-start rounded-md bg-white dark:bg-black md:max-w-5xl md:border md:border-gray-200 md:shadow dark:md:border-gray-700 lg:flex-row"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10 lg:min-w-[500px]">
        <h2 className="font-inter mb-2 text-2xl font-bold dark:text-white">
          {type} your lead magnet
        </h2>

        <Tabs defaultValue="basic info" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="basic info">Basic Info</TabsTrigger>
            <TabsTrigger value="more details">Delivery</TabsTrigger>
          </TabsList>

          <TabsContent value="basic info" className="flex flex-col space-y-2">
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="name"
                className="pt-1 text-xs font-medium text-slate-500 dark:text-gray-400"
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
                className="pt-3 text-xs font-medium text-slate-500 dark:text-gray-400"
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
                htmlFor="heroDescription"
                className="pt-3 text-xs font-medium text-slate-500 dark:text-gray-400"
              >
                Description (Max. 67 chars limit)
              </label>

              <textarea
                name="heroDescription"
                placeholder="Build your SaaS in just two weeks! Free Guide"
                value={data.heroDescription}
                onChange={(e) =>
                  setData({ ...data, heroDescription: e.target.value })
                }
                maxLength={67}
                required
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-black dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
              ></textarea>
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="description"
                className="pt-3 text-xs font-medium  text-slate-500 dark:text-gray-400"
              >
                Body
              </label>
              <span className="lead-body h-full max-h-[150px] overflow-y-auto">
                <NovelEditor
                  text={description}
                  setText={setDescription}
                  canUseAI={false}
                />
              </span>
            </div>
          </TabsContent>
          <TabsContent value="more details" className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <label
                htmlFor="delivery"
                className="mb-2 text-xs font-medium text-slate-500 dark:text-gray-400"
              >
                Delivery Method
              </label>
              <div className="flex gap-x-6">
                <div className="flex">
                  <input
                    type="radio"
                    name="delivery"
                    className="mt-0.5 shrink-0 rounded-full border-gray-200 text-blue-600 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                    id="file"
                    value="file"
                    onChange={(e) =>
                      setData({ ...data, delivery: e.target.value })
                    }
                    checked={data.delivery === "file"}
                  />
                  <label
                    htmlFor="file"
                    className="ms-2 text-sm text-gray-500 dark:text-gray-400"
                  >
                    File Download
                  </label>
                </div>

                <div className="flex">
                  <input
                    type="radio"
                    name="delivery"
                    className="mt-0.5 shrink-0 rounded-full border-gray-200 text-blue-600 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                    id="link"
                    value="link"
                    onChange={(e) =>
                      setData({ ...data, delivery: e.target.value })
                    }
                    checked={data.delivery === "link"}
                  />
                  <label
                    htmlFor="link"
                    className="ms-2 text-sm text-gray-500 dark:text-gray-400"
                  >
                    Links
                  </label>
                </div>
              </div>
            </div>

            {data.delivery === "file" ? (
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="description"
                  className="pt-3 text-xs font-medium  text-slate-500 dark:text-gray-400"
                >
                  Upload file
                </label>
                <FileUploader
                  fileName={fileName}
                  setFileName={setFileName}
                  setOriginalFile={setOriginalFile}
                  inputId="leadFile"
                  labelText="Upload your file"
                />
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="description"
                  className="text-xs font-medium text-slate-500  dark:text-gray-400"
                >
                  Links
                </label>
                <textarea
                  name="link"
                  placeholder="Link"
                  value={data.link}
                  onChange={(e) => setData({ ...data, link: e.target.value })}
                  rows={3}
                  className="bg-stslateone-50 w-full rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black  focus:outline-none focus:ring-black dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
                  required={data.delivery === "link"}
                />
              </div>
            )}

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
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="btnCta"
                className="pt-3 text-xs font-medium text-slate-500 dark:text-gray-400"
              >
                Button CTA
              </label>
              <input
                name="buttonCta"
                type="text"
                placeholder="Download Book"
                value={data.buttonCta}
                onChange={(e) =>
                  setData({ ...data, buttonCta: e.target.value })
                }
                required
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-black dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="download"
                className="pt-3 text-xs font-medium text-slate-500 dark:text-gray-400"
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
                    onChange={(e) =>
                      setData({ ...data, download: e.target.value })
                    }
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
                    onChange={(e) =>
                      setData({ ...data, download: e.target.value })
                    }
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

            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-3 pt-3">
                <label
                  htmlFor="btnCta"
                  className="block text-xs font-medium text-slate-500 dark:text-gray-400"
                >
                  Featured
                </label>
                <Switch
                  defaultChecked={data.featured}
                  onCheckedChange={() =>
                    setData({ ...data, featured: !data.featured })
                  }
                />
              </div>
            </div>

            {/* <div className="flex items-center justify-end rounded-b-lg border-t border-slate-200 bg-slate-50 p-3 dark:border-gray-700 dark:bg-gray-800 md:px-10"> */}
            <div className="pt-4">
              <CreateSiteFormButton type={type} />
            </div>
            {/* </div> */}
          </TabsContent>
        </Tabs>
      </div>

      <div className="hidden w-[600px] bg-slate-100 px-4 text-center dark:bg-gray-800 lg:block">
        <h3 className="my-5 text-sm text-slate-100">Preview</h3>
        <div className="flex flex-col gap-y-2">
          <Carousel>
            <CarouselContent>
              <CarouselItem className="basis-9/10">
                <div>
                  <div className="mx-auto mt-10 max-w-2xl rounded-b-xl shadow-lg">
                    <div className="flex h-8 w-full items-center justify-start space-x-1.5 rounded-t-lg border-b border-slate-200 bg-white  px-3 dark:border-gray-500 dark:bg-gray-600">
                      <span className="h-2 w-2 rounded-full bg-[#ff5f57]"></span>
                      <span className="h-2 w-2 rounded-full bg-[#ffbe2f]"></span>
                      <span className="h-2 w-2 rounded-full bg-[#28ca42]"></span>
                    </div>
                    <div className="flex h-52 w-full items-end justify-center rounded-b-xl border-t-0 bg-white dark:bg-gray-600">
                      <div className="mb-2  flex rounded-full bg-slate-200 shadow-sm">
                        <span className="px-3 py-1 text-[9px]">
                          {data.title}
                        </span>
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
              </CarouselItem>
              <CarouselItem>
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

                        {/* <Markdown>{description}</Markdown> */}
                        {parse(description)}
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
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="ml-9" />
            <CarouselNext className="mr-6" />
          </Carousel>
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
          <p>{type} Lead Magnet</p>
        )}
      </button>
    </>
  );
}
