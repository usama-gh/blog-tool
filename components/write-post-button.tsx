"use client";

import { useState, useTransition } from "react";
import { createPost } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import LoadingDots from "@/components/icons/loading-dots";

interface PageProps {
  sites: any;
}
export default function WritePostButton({ sites }: PageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  let url = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  const handleSubmit = (siteId: string | null) => {
    if (!siteId || siteId == "") {
      return;
    }

    startTransition(async () => {
      const post = await createPost(null, siteId, null);
      router.refresh();
      router.push(`/post/${post.id}?siteId=${siteId}`);
    });
  };

  return sites.length == 1 ? (
    <button
      onClick={() => handleSubmit(sites[0].id)}
      className={cn(
        "flex h-8 w-36  items-center justify-center space-x-2 rounded-lg border text-sm font-medium transition-all focus:outline-none sm:h-9",
        isPending
          ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          : "border border-black bg-black text-white hover:bg-white hover:text-black active:bg-gray-100 dark:border-gray-700 dark:hover:border-gray-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-gray-800",
      )}
      disabled={isPending}
    >
      {isPending ? <LoadingDots color="#808080" /> : <p>Write a Post</p>}
    </button>
  ) : (
    <select
      className={cn(
        "flex h-8 w-36 items-center justify-center space-x-2 rounded-lg border text-sm transition-all focus:outline-none focus:ring-gray-200 focus:ring-offset-0 sm:h-9",
        isPending
          ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          : "border border-black bg-black text-white hover:bg-white hover:text-black active:bg-gray-100 dark:border-gray-700 dark:hover:border-gray-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-gray-800",
      )}
      onChange={(e) => handleSubmit(e.target.value)}
    >
      <option value="" defaultChecked>
        Write a Post
      </option>
      {sites.map((site: any) => (
        <option key={site.id} value={site.id}>
          {site.subdomain}.{url}
        </option>
      ))}
    </select>
  );
}
