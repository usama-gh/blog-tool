"use client";

import { SubscribeReponse } from "@/types";
import LoadingDots from "./icons/loading-dots";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { toast } from "sonner";

export const Subscribe = ({ siteId }: { siteId: string }) => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false); // New state variable

  const addToSubscribe = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/subscribe", {
      method: "POST",
      body: JSON.stringify({
        email,
        siteId,
      }),
    });

    const response: SubscribeReponse = await res.json();

    if (!response.success) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      setEmail("");
      setIsSubscribed(true);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      {/* <div className="mx-auto h-[2px] w-8 bg-slate-300 dark:bg-gray-600"></div> */}
      <div className="relative mx-auto w-full rounded-2xl  px-8 py-4 text-center text-slate-400 dark:text-gray-400">
        {isSubscribed ? (
          // Display both success messages
          <>
            <p className="mb-1 font-semibold text-slate-800 dark:text-gray-300">
              Thank you for subscribing!
            </p>
            <p className="text-sm text-slate-800 dark:text-gray-300">
              You are now subscribed to the newsletter.
            </p>
          </>
        ) : (
          // Display the form
          <>
            <p className="text-sm text-slate-500 dark:border-gray-600 dark:text-gray-400">
              Subscribe to get future posts, exclusive content & much more.
            </p>

            <form
              onSubmit={addToSubscribe}
              className="mt-3 flex items-center gap-x-1"
            >
              <input
                name="name"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full flex-1 rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 dark:focus:ring-white"
              />
              <SubscribeButton />
            </form>
          </>
        )}
      </div>
    </div>
  );
};

function SubscribeButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={cn(
        "flex h-10 w-auto items-center justify-center space-x-2 rounded-md border px-4 py-1 text-sm transition-all focus:outline-none",
        pending
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          : "border-0 bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-800 dark:border dark:border-black dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:border-gray-400 dark:hover:bg-transparent dark:hover:text-white dark:active:bg-gray-800",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Subscribe</p>}
    </button>
  );
}
