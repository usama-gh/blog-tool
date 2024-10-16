"use client";

import { toast } from "sonner";
import { Info,ChevronRight } from "lucide-react";
import { createSiteLead, updateLeadImage, updateSiteLead } from "@/lib/actions";
import { useRouter } from "next/navigation";
// ts-ignore because experimental_useFormStatus is not in the types
// @ts-ignore
import { useFormStatus } from "react-dom";
import { cn, makeSlug, r2Asset } from "@/lib/utils";
import Image from "next/image";
import LoadingDots from "@/components/icons/loading-dots";
import { useModal } from "./provider";
import { useEffect, useRef, useState } from "react";
import FileUploader from "../form/file-uploader";
import { Lead } from "@prisma/client";
import NovelEditor from "../editor/novel-editor";
import { customAlphabet } from "nanoid";
import { LeadData } from "@/types";
import { triggerEvent } from "@/components/posthug";
import { Switch } from "@/components/ui/switch";
import parse from "html-react-parser";
import { Button } from "@/components/ui/button";
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
    slug: (lead ? lead.slug : "") as string,
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
  const firstRender = useRef<boolean>(true);
  const [fileName, setFileName] = useState(lead ? lead.fileName : "");
  const [originalFile, setOriginalFile] = useState<File>();
  const [thumbnail, setThumbnail] = useState(lead ? lead.thumbnail : "");
  const [originalThumbnail, setOriginalThumbnail] = useState<File>();
  const [description, setDescription] = useState(data.description);
  const type = lead ? "Update" : "Create";

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    setData({ ...data, slug: makeSlug(data.title)! });
  }, [data.title]);

  const handleAction = async () => {
    if (data.delivery === "file" && !fileName) {
      toast.error("Please select a file");
      return;
    }

    let fileUrl = lead?.file ?? "";
    if (originalFile) {
      fileUrl = `${nanoid()}.${originalFile.type.split("/")[1]}`;
      await uploadToR2(fileUrl, originalFile);
    }

    let thumbnailFileUrl = lead?.thumbnailFile ?? "";
    if (originalThumbnail) {
      thumbnailFileUrl = `${nanoid()}.${originalThumbnail.type.split("/")[1]}`;
      await uploadToR2(thumbnailFileUrl, originalThumbnail);
    }

    const body: LeadData = {
      siteId: lead?.siteId ?? (siteId as string),
      name: data.name,
      title: data.title,
      slug: data.slug,
      description: description as string,
      buttonCta: data.buttonCta,
      download: data.download,
      delivery: data.delivery,
      url: data.delivery === "file" ? fileUrl : (data.link as string),
      fileName: fileName as string,
      thumbnailFile: thumbnail ? thumbnailFileUrl : "",
      thumbnail: thumbnail as string,
      heroDescription: data.heroDescription,
      featured: data.featured,
    };

    const response = lead
      ? await updateSiteLead(body, lead.id, "update")
      : await createSiteLead(body);

    if (response.error) {
      toast.error(response.error);
    } else {
      modal?.hide();
      router.refresh();
      triggerEvent("created_lead_magnet", {});
      toast.success(`Successfully ${lead ? "updated" : "created"} lead magnet`);
    }
  };

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
      onSubmit={async (e) => {
        e.preventDefault();
        await handleAction();
      }}
      id="our_modal"
      className="flex w-full max-h-[90vh]  overflow-y-auto flex-col justify-start rounded-md bg-white dark:bg-black md:max-w-6xl md:border md:border-gray-200 md:shadow dark:md:border-gray-700"
    >

      <div className="w-full px-5 py-5 flex justify-between items-center">
      <h2 className="font-inter  text-2xl font-bold dark:text-white">
          {type} your lead magnet
        </h2>
        <div>
              <CreateSiteFormButton type={type} />
            </div>
      </div>
      <div className="flex flex-col lg:flex-row">
      <div className="relative flex flex-col gap-y-4 p-5 md:p-6 lg:min-w-[500px] border border-gray-200">
     

        <Tabs defaultValue="basic info" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="basic info">Basic Info</TabsTrigger>
            <TabsTrigger value="landingpage">Landing Page</TabsTrigger>
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
                htmlFor="slug"
                className="pt-3 text-xs font-medium text-slate-500 dark:text-gray-400"
              >
                Lead Slug
              </label>

              <input
                name="slug"
                type="text"
                placeholder="build-your-saas-in-just-two weeks-free-guide"
                value={data.slug}
                onChange={(e) => setData({ ...data, slug: e.target.value })}
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

            <div>


            <TabsList className="mt-2 bg-transparent">  
            <TabsTrigger value="landingpage"><Button variant="outline" size="icon">
      <ChevronRight className="h-4 w-4" />
    </Button></TabsTrigger>
            </TabsList>

              </div>

            
          

        
         
          </TabsContent>
          <TabsContent value="landingpage">
          <div className="flex flex-col space-y-2">
              <label
                htmlFor="description"
                className="pt-3 text-xs font-medium  text-slate-500 dark:text-gray-400"
              >
                Landing Page (Markdown)
              </label>
              <span className="h-full max-h-[700px] overflow-y-auto">
                <NovelEditor
                  text={description}
                  setText={setDescription}
                  canUseAI={false}
                />
              </span>
            </div>
            <TabsList className="mt-2 bg-transparent">  
            <TabsTrigger value="more details"><Button variant="outline" size="icon">
      <ChevronRight className="h-4 w-4" />
    </Button></TabsTrigger>
            </TabsList>

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
              <div id="preview"></div>
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
                  Featured on homepage?
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
           
            {/* </div> */}
          </TabsContent>
        </Tabs>
      </div>

      <div className="hidden w-[700px] bg-slate-100 px-4 text-center dark:bg-gray-800 lg:block">
        <div className="flex h-full items-start justify-center">
          <div>
            <h3 className="my-5 text-sm text-slate-800 dark:text-gray-200">
              Preview
            </h3>
            <div className="">
              <Tabs defaultValue="preview_1" className="w-[400px]">
                <TabsList>
                  <TabsTrigger value="preview_1">1</TabsTrigger>
                  <TabsTrigger value="preview_2">2</TabsTrigger>
                  <TabsTrigger value="preview_3">3</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="preview_1"
                  className="flex items-center justify-center"
                >
                  <div>
                    <div className="flex w-full max-w-md items-center space-x-2 rounded-full bg-white p-2 shadow">
                      <span className="max-w-xl flex-grow overflow-x-auto rounded-full bg-transparent px-4 py-2 text-gray-800 placeholder-gray-500">
                        {data.name || "Text"}
                      </span>
                      <button className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        {data.buttonCta || "Try Now"}
                      </button>
                    </div>

                    <p className="mt-2 py-1 text-xs tracking-wide text-gray-500 dark:text-gray-400">
                      Overlay popup on posts
                    </p>
                  </div>
                </TabsContent>
                <TabsContent
                  value="preview_2"
                  className="flex items-center justify-center"
                >
                  <div>
                    <div className="flex max-w-xs flex-col items-center rounded-3xl bg-white  p-5 text-left dark:bg-gray-600">
                      <div className="justify-left flex flex-col  items-start gap-y-2">
                        {data.thumbnail ? (
                          <Image
                            src={r2Asset(data.thumbnailFile)}
                            width={150}
                            height={200}
                            alt="Thumbnail"
                            className="mb-4 h-32 w-32 rounded-full object-cover shadow-sm"
                          />
                        ) : (
                          <div></div>
                        )}
                        <h3 className="text-xl font-bold tracking-normal text-gray-800 dark:text-white">
                          {data.title || "Title of lead magnet"}
                        </h3>
                        <p className="items-start text-sm text-gray-600 dark:text-gray-200">
                          {data.heroDescription || "Description"}
                        </p>
                        <button className="mt-2 rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                          View
                        </button>
                      </div>
                    </div>
                    <p className="mt-4 py-1 text-center text-xs tracking-wide text-gray-500 dark:text-gray-400">
                      Card that appears on homepage
                    </p>
                  </div>
                </TabsContent>
                <TabsContent
                  value="preview_3"
                  className="flex items-center justify-center"
                >
                  <div>
                    <div className="flex w-full flex-col items-center space-x-2 rounded-sm bg-white p-4 dark:bg-gray-700   ">
                      <div className="mx-auto flex flex-col items-center">
                        {data.thumbnail ? (
                          <Image
                            src={r2Asset(data.thumbnailFile)}
                            width={150}
                            height={200}
                            alt="Thumbnail"
                            className="mb-4 h-32 w-32 rounded-full object-cover shadow-sm"
                          />
                        ) : (
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                            <span className="text-xl font-medium text-gray-500 dark:text-gray-300">
                              S
                            </span>
                          </div>
                        )}
                        <h2 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">
                          {data.title || "Title of lead magnet"}
                        </h2>
                        <p className="mb-4 text-center text-gray-900  dark:text-white">
                          {parse(description || "Description")}
                        </p>
                        <button className="rounded-full bg-blue-500 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-600">
                          {data.buttonCta || "Try Now"}
                        </button>
                      </div>
                    </div>
                    <p className="mt-4 py-1 text-center text-xs tracking-wide text-gray-500 dark:text-gray-400">
                      Lead magnet page/slide
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
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
          "flex px-3 h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
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
