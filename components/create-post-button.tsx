"use client";

import { useTransition } from "react";
import { createPost } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import LoadingDots from "@/components/icons/loading-dots";
import { triggerEvent } from "@/components/posthug";

export default function CreatePostButton() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          const post = await createPost(null, id, null);
          router.refresh();
          triggerEvent("created_post", {});
          router.push(`/post/${post.id}?siteId=${post.siteId}`);
        })
      }
      className={cn(
        "bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center space-x-2 rounded-lg px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-800/10 transition-all hover:shadow-blue-800/20 focus:outline-none lg:text-lg",
        { "cursor-not-allowed text-white": isPending } // Correct conditional class usage
      )}      
      disabled={isPending}
    >
      {isPending ? <LoadingDots color="#808080" /> : "Create New Post"}
    </button>
  );
}
