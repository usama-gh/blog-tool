"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Uploader from "./uploader";
import LoadingCircle from "../icons/loading-circle";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

export default function PostForm({
  title,
  description,
  helpText,
  inputAttrs,
  handleSubmit,
  postTitle,
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
  postTitle?: string | null;
  handleSubmit: any;
}) {
  const { id } = useParams() as { id?: string };
  const router = useRouter();
  const { update } = useSession();

  const makeSlug = (title: string | null | undefined) => {
    return title
      ?.toLowerCase()
      ?.replace(/[`~!@#$%^*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi, "")
      ?.replaceAll(" ", "-");
  };
  const [isLoading, setIsLoading] = useState(false);
  // const [slug, setSlug] = useState(makeSlug(postTitle));
  const [slug, setSlug] = useState(inputAttrs.defaultValue);

  const [debouncedData] = useDebounce(slug, 1000);
  const formRef = useRef<HTMLFormElement>(null);
  const firstRender = useRef<boolean>(true);
  const firstRenderDebounce = useRef<boolean>(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    setSlug(makeSlug(postTitle)!);
  }, [postTitle]);

  useEffect(() => {
    if (firstRenderDebounce.current) {
      firstRenderDebounce.current = false;
      return;
    }

    if (debouncedData === makeSlug(postTitle)) {
      return;
    }
    setIsLoading(true);
    formRef.current?.requestSubmit();
  }, [debouncedData, postTitle, slug]);

  const deleteDefaultValue = (props: any) => {
    delete props.defaultValue;
    return props;
  };

  return (
    <form
      ref={formRef}
      action={async (data: FormData) => {
        if (!slug) {
          setIsLoading(false);
          toast.error("Slug required");
          return;
        }
        let formData = new FormData();
        formData.append("slug", slug!);
        handleSubmit(formData, id, inputAttrs.name).then(async (res: any) => {
          setIsLoading(false);
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
          }
        });
      }}
      className="rounded-lg border border-gray-200 bg-transparent dark:border-gray-700 dark:bg-black"
    >
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
        <div className="flex justify-between">
          <h2 className="font-semibold font-inter text-slate-500 text-xl dark:text-white">{title}</h2>
          {isLoading ? <LoadingCircle /> : <></>}
        </div>
        <p className="text-sm text-slate-500 dark:text-gray-400">
          {description}
        </p>
        {inputAttrs.name === "image" || inputAttrs.name === "logo" ? (
          <Uploader
            defaultValue={inputAttrs.defaultValue}
            name={inputAttrs.name}
          />
        ) : (
          <input
            // {...inputAttrs}
            {...deleteDefaultValue(inputAttrs)}
            value={slug}
            required
            className="w-full max-w-md rounded-md bg-transparent border border-slate-300 text-sm text-slate-900 placeholder-gray-300 focus:border-slate-500 focus:outline-none focus:ring-slate-500 dark:border-slate-600 dark:bg-black dark:text-white dark:placeholder-gray-700"
            onChange={(e) => {
              setSlug(e.target.value);
            }}
            disabled={isLoading}
          />
        )}
      </div>
      {/* <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
        <p className="text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
        <FormButton />
      </div> */}
    </form>
  );
}

// function FormButton() {
//   const { pending } = useFormStatus();
//   return (
//     <button
//       className={cn(
//         "flex h-8 w-32 items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none sm:h-10",
//         pending
//           ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
//           : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-gray-700 dark:hover:border-gray-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-gray-800",
//       )}
//       disabled={pending}
//     >
//       {pending ? <LoadingDots color="#808080" /> : <p>Save Changes</p>}
//     </button>
//   );
// }
