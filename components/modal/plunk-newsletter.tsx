"use client";

import { toast } from "sonner";
import { createSite } from "@/lib/actions";
import { useRouter } from "next/navigation";
// ts-ignore because experimental_useFormStatus is not in the types
// @ts-ignore
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { useModal } from "./provider";
import { useEffect, useState } from "react";
import LogoUploader from "../form/logo-uploader";
import { triggerEvent } from "@/components/posthug";
import NobelEditor from "../editor/novel-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Post } from "@prisma/client";

interface ModelProps {
  data: Post;
  plunkKey: string;
  isSend: boolean;
  subscribers: string[] | [];
  successAction: () => void;
}
export default function PlunkNewsletter(props: ModelProps) {
  const router = useRouter();
  const modal = useModal();
  const [gatedSlidesIds, setgatedSlidesIds] = useState(() => {
    const ids: number[] = [];
    const gateSides: any[] = JSON.parse(props.data.gateSlides ?? "[]");
    gateSides.forEach((slide: { id: string; type: string }) => {
      ids.push(Number(slide.id));
    });

    const leadSides: any[] = JSON.parse(props.data.leadSlides ?? "[]");
    leadSides.forEach((slide: { id: string; name: string; leadId: string }) => {
      ids.push(Number(slide.id));
    });

    return ids;
  });

  const [slides, setSlides] = useState(() => {
    let slideData: string[] = [];

    const slides = JSON.parse(props.data.slides ?? "[]");

    slides.forEach((slide: string, idx: number) => {
      if (!gatedSlidesIds.includes(idx + 1)) {
        slideData.push(slide);
      }
    });

    return slideData;
  });

  const [subscribers] = useState<string[] | []>(() => {
    const emails: string[] | [] = [];

    props?.subscribers?.forEach((email: string) => {
      // @ts-ignore
      if (emails.includes(email)) {
        return; // ignore duplicates
      }
      // @ts-ignore
      emails.push(email);
    });

    return emails;
  });
  const [receivers, setReceivers] = useState<string | string[]>("all");
  const [subject, setSubject] = useState(props.data.title!);
  const [body, setBody] = useState(() => {
    let content = props.data.content!;
    slides.forEach((slide) => {
      content += "\n\n" + slide;
    });
    return content;
  });

  // const [body, setBody] = useState(props.data.content!);

  function handleSubscribersChange(value: string) {
    if (value === "all") {
      setReceivers(props.subscribers);
    } else {
      setReceivers([value]);
    }
  }

  async function createCompaign() {
    try {
      const request = await fetch("https://api.useplunk.com/v1/campaigns", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${props.plunkKey as string}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          body,
          style: "HTML",
          recipients: receivers,
        }),
      });

      const response = await request.json();
      return response;
    } catch (error) {
      console.error("Error sending compaign:", error);
    }
  }

  async function sendCompaign(id: string) {
    try {
      await fetch("https://api.useplunk.com/v1/campaigns/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${props.plunkKey as string}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          delay: 1,
          live: false,
        }),
      });

      return true;
    } catch (error) {
      console.error("Error sending compaign:", error);
    }
  }

  return (
    <form
      action={async () => {
        const compaign = await createCompaign();
        if (compaign.error) {
          toast.error("Failed to create compaign!");
          return;
        }
        await sendCompaign(compaign.id);

        toast.success("Newsletter sent successfully!");
        modal?.hide();
        props.successAction();
      }}
      className="w-full  rounded-md bg-white dark:bg-black md:max-w-4xl md:border md:border-gray-200 md:shadow dark:md:border-gray-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <div className="mb-4">
        <h2 className="font-inter text-3xl font-bold tracking-tight dark:text-white">
          Send newsletter
        </h2>
        <h2 className="font-inter text-base dark:text-white">
          Send out newsletter using Plunk. More integrations comign soon.
        </h2>
        </div>
       

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-slate-500 dark:text-gray-400"
          >
            To
          </label>
          <Select onValueChange={handleSubscribersChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Subscribers" />
            </SelectTrigger>
            <SelectContent className="">
              {subscribers.length > 0 && (
                <SelectItem value="all">All Subscribers</SelectItem>
              )}
              {subscribers.map((email: string, idx: number) => (
                <SelectItem key={idx} value={email}>
                  {email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="subject"
            className="text-sm font-medium text-slate-500 dark:text-gray-400"
          >
            Subject
          </label>
          <input
            name="subject"
            type="text"
            placeholder="Newsletter Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
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
          <div className="max-h-[40vh] overflow-auto">
          <NobelEditor text={body} setText={setBody} canUseAI={false} />
          </div>
         
        </div>
      </div>
      <div className="flex items-center justify-between rounded-b-lg border-t border-slate-200 bg-slate-50 p-3 dark:border-gray-700 dark:bg-gray-800 md:px-10">
        {props.isSend && <p>You already send newsletter for this post</p>}

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
        "flex h-8 w-16 items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
        pending
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-black dark:hover:text-white dark:active:bg-gray-800",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Send</p>}
    </button>
  );
}
