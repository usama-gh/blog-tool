"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import DomainStatus from "./domain-status";
import DomainConfiguration from "./domain-configuration";
import Uploader from "./uploader";
import va from "@vercel/analytics";
import LoadingCircle from "../icons/loading-circle";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

export default function PostForm({
  title,
  description,
  helpText,
  inputAttrs,
  handleSubmit,
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
}) {
  const { id } = useParams() as { id?: string };
  const router = useRouter();
  const { update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formVal, setFormVal] = useState(inputAttrs.defaultValue);
  const [debouncedData] = useDebounce(formVal, 1000);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (debouncedData === inputAttrs.defaultValue) {
      return;
    }
    setIsLoading(true);
    formRef.current?.requestSubmit();
  }, [debouncedData, inputAttrs.defaultValue]);
  return (
    <form
      ref={formRef}
      action={async (data: FormData) => {
        handleSubmit(data, id, inputAttrs.name).then(async (res: any) => {
          setIsLoading(false);
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track(`Updated ${inputAttrs.name}`, id ? { id } : {});
            if (id) {
              router.refresh();
            } else {
              await update();
              router.refresh();
            }
            toast.success(`Successfully updated ${inputAttrs.name}!`);
          }
        });
      }}
      className="rounded-lg border border-stone-200 bg-white dark:border-stone-700 dark:bg-black"
    >
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
        <div className="flex justify-between">
          <h2 className="font-cal text-xl dark:text-white">{title}</h2>
          {isLoading ? (
            <LoadingCircle />
          ) : (
            <></>
          )}
        </div>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {description}
        </p>
        {inputAttrs.name === "image" || inputAttrs.name === "logo" ? (
          <Uploader
            defaultValue={inputAttrs.defaultValue}
            name={inputAttrs.name}
          />
        ) : (
          <input
            {...inputAttrs}
            required
            className="w-full max-w-md rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
            onChange={(e) => {
              setFormVal(e.target.value);
            }}
            disabled={isLoading}
          />
        )}
      </div>
    </form>
  );
}
