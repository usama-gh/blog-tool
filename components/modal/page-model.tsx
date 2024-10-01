"use client";

import { toast } from "sonner";
import {
  createStaticPage,
  updateLeadImage,
  updateStaticPage,
} from "@/lib/actions";

import { useRouter } from "next/navigation";
// ts-ignore because experimental_useFormStatus is not in the types
// @ts-ignore
import { useFormStatus } from "react-dom";
import { cn, makeSlug } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { useModal } from "./provider";
import { useEffect, useRef, useState } from "react";
import { Page } from "@prisma/client";
import NovelEditor from "../editor/novel-editor";
import { PageData } from "@/types";
import { Switch } from "@/components/ui/switch";
import { useDebounce } from "use-debounce";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function PageModal({
  siteId,
  page,
}: {
  siteId?: string;
  page?: Page;
}) {
  const router = useRouter();
  const modal = useModal();



  const [slug, setSlug] = useState((page ? page.slug : "") as string);
  const [data, setData] = useState({
    name: (page ? page.name : "") as string,
    // slug: (page ? page.slug : "") as string,
    slug,
    body: (page ? page.body : "") as string,
    title: (page ? page.title : "") as string,
    description: (page ? page.description : "") as string,
    published: (page ? page.published : false) as boolean,
  });
  const [body, setBody] = useState(data.body);
  const firstRender = useRef<boolean>(true);
  const firstRenderDebounce = useRef<boolean>(true);

  const type = page ? "Update" : "Create";
  // const [debouncedSlug] = useDebounce(slug, 1000);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    // const slugFromName = makeSlug(data.name)!;

    // if (data.slug === slugFromName) {
    //   setData({ ...data, slug: slugFromName });
    // }
    // setSlug(makeSlug(data.name)!);

    setData({ ...data, slug: makeSlug(data.name)! });
  }, [data.name]);

  useEffect(() => {
    setData({ ...data, body });
  }, [body]);

  // useEffect(() => {

  //   // if title is save then don't change
  //   if (debouncedSlug === makeSlug(data.name)) {
  //     return;
  //   }

  //   if (firstRenderDebounce.current) {
  //     firstRenderDebounce.current = false;
  //     return;
  //   }

  //   setData({ ...data, slug });
  // }, [debouncedSlug]);

  const handleAction = async () => {
    const body: PageData = {
      siteId: page?.siteId ?? (siteId as string),
      name: data.name,
      slug: data.slug,
      body: data.body,
      title: data.title,
      description: data.description,
      published: data.published,
    };

    const response = page
      ? await updateStaticPage(body, page.id, "update")
      : await createStaticPage(body);

    if (response.error) {
      toast.error(response.error);
    } else {
      modal?.hide();
      router.refresh();
      toast.success(`Successfully ${page ? "updated" : "created"} page`);
    }
  };

  return (
    <div
      className="flex w-full flex-col justify-start rounded-md bg-white dark:bg-black md:max-w-6xl md:border md:border-gray-200 md:shadow dark:md:border-gray-700 lg:flex-row"
    >
      <div className="relative flex w-full flex-col space-y-4 p-5 md:p-10" id="our_modal">
        <h2 className="font-inter mb-2 text-2xl font-bold dark:text-white">
          {type} your page
        </h2>

        <div className="flex items-center gap-5">
          <div className="flex flex-1 flex-col space-y-2">
            <label
              htmlFor="name"
              className="pt-1 text-xs font-medium text-slate-500 dark:text-gray-400"
            >
              Page Name
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

          <div className="flex w-full flex-1 flex-col space-y-2">
            <label
              htmlFor="slug"
              className="pt-1 text-xs font-medium text-slate-500 dark:text-gray-400"
            >
              Page Slug
            </label>
            <input
              name="slug"
              type="text"
              placeholder="SaaS guide #1"
              value={data.slug}
              onChange={(e) => setData({ ...data, slug: e.target.value })}
              required
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-black dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="body"
            className="pt-3 text-xs font-medium  text-slate-500 dark:text-gray-400"
          >
            Body
          </label>
          <div className="relative">
            <NovelEditor text={body} setText={setBody} canUseAI={false} />
          </div>
        </div>


        <Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger className="hover:no-underline">SEO settings</AccordionTrigger>
    <AccordionContent>
    <div className="flex flex-col space-y-2">
          <label
            htmlFor="title"
            className="pt-3 text-xs font-medium text-slate-500 dark:text-gray-400"
          >
            Meta Title
          </label>

          <input
            name="title"
            type="text"
            placeholder="Build your SaaS in just two weeks! Free Guide"
            value={data.title || data.name}
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
            Meta Description
          </label>

          <textarea
            name="heroDescription"
            placeholder="Build your SaaS in just two weeks! Free Guide"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            required
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-black dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
          ></textarea>
        </div>
    </AccordionContent>
  </AccordionItem>
</Accordion>


    

        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-3 pt-3">
            <label
              htmlFor="btnCta"
              className="block text-xs font-medium text-slate-500 dark:text-gray-400"
            >
              Publish
            </label>
            <Switch
              defaultChecked={data.published}
              onCheckedChange={(value: boolean) =>
                setData({ ...data, published: value })
              }
            />
          </div>
        </div>

        <div className="pt-4">
        <CreateSiteFormButton type={type} handleAction={handleAction} />
        </div>
      </div>
    </div>
  );
}
function CreateSiteFormButton({
  type,
  handleAction,
}: {
  type: string;
  handleAction: () => Promise<void>;
}) {
  const { pending } = useFormStatus();
  return (
    <>
      <button
        type="button" // Change this to "button" to prevent form submission
        className={cn(
          "flex h-10 px-4 items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
          pending
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-black dark:hover:text-white dark:active:bg-gray-800",
        )}
        onClick={async () => {
          if (!pending) {
            await handleAction(); // Directly call handleAction on button click
          }
        }}
        disabled={pending}
      >
        {pending ? (
          <>
            <LoadingDots color="#808080" />
            <p>Please wait</p>
          </>
        ) : (
          <p>{type} Page</p>
        )}
      </button>
    </>
  );
}
