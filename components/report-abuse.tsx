"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
// ts-ignore because experimental_useFormStatus is not in the types
// @ts-ignore
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import LoadingDots from "./icons/loading-dots";
import { toast } from "sonner";

interface Props {
  isShowBadge: boolean;
}
export default function ReportAbuse({ isShowBadge }: Props) {
  const [open, setOpen] = useState(false);
  const { domain, slug } = useParams() as { domain: string; slug?: string };
  const url = slug ? `https://${domain}/${slug}` : `https://${domain}`;

  return (
    <div className="fixed bottom-2 right-0 lg:right-2">
      {/* <button
        className="rounded-full bg-black p-4 text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 active:shadow-sm"
        onClick={() => setOpen(!open)}
      >
        <AlertTriangle size={24} />
      </button> */}
      {isShowBadge && (
        <Link target="_blank" href={`https://typedd.com`}>
        <span className="ml-4 inline-flex bg-slate-200 text-gray-800 dark:text-gray-100 dark:bg-gray-900 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium">
          Made with Typedd
        </span>
        </Link>
      )}

      {open && (
        <form
          action={async (formData) => {
            const url = formData.get("url") as string;
            // artificial 1s delay
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setOpen(false);
            toast.success(
              "Successfully reported abuse – thank you for helping us keep the internet safe!",
            );
          }}
          className="absolute bottom-20 right-2 flex w-96 flex-col space-y-6 rounded-lg border border-stone-200 bg-white p-8 shadow-lg animate-in slide-in-from-bottom-5"
        >
          <div>
            <h2 className="font-inter text-xl leading-7 text-stone-900">
              Report Abuse
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Found a site with abusive content? Let us know!
            </p>
          </div>

          <div>
            <label
              htmlFor="domain"
              className="block text-sm font-medium leading-6 text-stone-900"
            >
              URL to report
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="url"
                id="url"
                readOnly
                value={url}
                className="block w-full cursor-not-allowed rounded-md border border-stone-200 bg-stone-100 py-1.5 text-stone-900 shadow-sm ring-0 focus:outline-none sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <SubmitButton />
        </form>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        "h flex h-8 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none sm:h-10",
        pending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
          : "border-black bg-black text-white hover:bg-white hover:text-black",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Report Abuse</p>}
    </button>
  );
}
