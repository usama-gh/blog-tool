"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { toast } from "sonner";
import DomainStatus from "./domain-status";
import DomainConfiguration from "./domain-configuration";
import Uploader from "./uploader";
import { useState } from "react";
import BioEditor from "../editor/bio-editor";
import { triggerEvent } from "../usermaven";

export default function Form({
  title,
  description,
  helpText,
  inputAttrs,
  handleSubmit,
  canUseAI,
}: {
  title: string;
  description: string;
  helpText: string;
  inputAttrs: {
    name: string;
    type: string;
    defaultValue: string;
    placeholder?: string;
    maxLength?: number;
    pattern?: string;
  };
  handleSubmit: any;
  canUseAI?: boolean;
}) {
  const { id } = useParams() as { id?: string };
  const router = useRouter();
  const { update } = useSession();

  // eidtor setup
  const [bio, setBio] = useState({ bio: inputAttrs.defaultValue });

  return (
    <form
      action={async (data: FormData) => {
        if (
          inputAttrs.name === "customDomain" &&
          inputAttrs.defaultValue &&
          data.get("customDomain") !== inputAttrs.defaultValue &&
          !confirm("Are you sure you want to change your custom domain?")
        ) {
         
          return;
          
        }
        handleSubmit(
          inputAttrs.name !== "bio" ? data : bio.bio,
          id,
          inputAttrs.name,
        ).then(async (res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            if (id) {
              router.refresh();
            } else {
              await update();
              router.refresh();
            }
            toast.success(`Successfully updated ${inputAttrs.name}!`);
            if(inputAttrs.name==='customDomain'){
              triggerEvent("added_domain", {});
            }
            
          }
        });
      }}
      className="rounded-lg border  border-slate-200 dark:border-gray-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
        <h2 className="font-inter text-xl font-semibold text-slate-500 dark:text-white">
          {title}
        </h2>
        <p className="text-sm text-slate-500 dark:text-gray-400">
          {description}
        </p>
        {inputAttrs.name === "image" || inputAttrs.name === "logo" ? (
          <Uploader
            defaultValue={inputAttrs.defaultValue}
            name={inputAttrs.name}
          />
        ) : inputAttrs.name === "font" ? (
          <div className="flex max-w-sm items-center overflow-hidden rounded-lg border border-gray-600">
            <select
              name="font"
              defaultValue={inputAttrs.defaultValue}
              className="w-full rounded-none border-none bg-white px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-black dark:bg-black dark:text-gray-200 dark:focus:ring-white"
            >
              <option value="font-inter">Inter</option>
              <option value="font-cal">Cal Sans</option>
              <option value="font-lora">Lora</option>
              <option value="font-work">Work Sans</option>
            </select>
          </div>
        ) : inputAttrs.name === "subdomain" ? (
          <div className="flex w-full max-w-md">
            <input
              {...inputAttrs}
              required
              className="z-10 flex-1 rounded-l-md border border-slate-300 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-500 focus:outline-none focus:ring-slate-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700"
            />
            <div className="flex items-center rounded-r-md border border-l-0 border-slate-300 bg-slate-100 px-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {process.env.NEXT_PUBLIC_ROOT_DOMAIN}
            </div>
          </div>
        ) : inputAttrs.name === "customDomain" ? (
          <div className="relative flex w-full max-w-md">
            <input
              {...inputAttrs}
              className="z-10 flex-1 rounded-md border border-slate-300 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-500 focus:outline-none focus:ring-slate-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700"
            />
            {inputAttrs.defaultValue && (
              <div className="absolute right-3 z-10 flex h-full items-center">
                <DomainStatus domain={inputAttrs.defaultValue} />
              </div>
            )}
          </div>
        ) : inputAttrs.name === "description" ? (
          <textarea
            {...inputAttrs}
            rows={3}
            required
            className="w-full max-w-xl rounded-md border border-gray-300 text-sm text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700"
          />
        ) : inputAttrs.name === "bio" ? (
          <BioEditor bio={bio} setBio={setBio} canUseAI={canUseAI} />
        ) : (
          <input
            {...inputAttrs}
            required
            className="w-full max-w-md rounded-md border border-slate-300 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-500 focus:outline-none focus:ring-slate-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700"
          />
        )}
      </div>
      {inputAttrs.name === "customDomain" && inputAttrs.defaultValue && (
        <DomainConfiguration domain={inputAttrs.defaultValue} />
      )}
      <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-slate-200 bg-slate-50 p-3 dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
        <p className="text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
        <FormButton />
      </div>
    </form>
  );
}

function FormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        "flex  items-center justify-center space-x-2 rounded-md border px-3 py-1 text-sm transition-all focus:outline-none",
        pending
          ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-gray-700 dark:hover:border-gray-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-gray-800",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Save Changes</p>}
    </button>
  );
}
