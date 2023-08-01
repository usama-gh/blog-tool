"use client";

import { toast } from "sonner";
import { createSite } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { useModal } from "./provider";
import va from "@vercel/analytics";
import { useEffect, useState } from "react";

export default function ImportJsonModal({setSlideWithJson}:any) {
  const router = useRouter();
  const modal = useModal();

  const [data, setData] = useState('');

  return (
    <form
      action={async () => {
        const importedData = JSON.parse(data);
        let tweetImageWithContent = importedData.tweet.text;
        importedData.tweet.images.forEach((image:string) => {
            tweetImageWithContent += '\n\n' + `![](${image})`
        })
        setSlideWithJson(importedData.threads.map((thread: any) => {
            let imagesContent = '';
            thread.images.forEach((image: string) => {
                imagesContent += '\n\n' + `![](${image})`
            });
            return thread.content + imagesContent
        }), tweetImageWithContent)
        modal?.hide(); 
      }
      }
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700"
    >
      <div className="relative flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <textarea
            name="json"
            placeholder="Paste JSON here"
            value={data}
            onChange={(e) => setData(e.target.value)}
            rows={3}
            className="w-full h-60 rounded-md border border-stone-200 bg-stone-50 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <CreateJsonButton />
      </div>
    </form>
  );
}
function CreateJsonButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        "flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
        pending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800",
      )}
      disabled={pending}
    >
      Import JSON
    </button>
  );
}
