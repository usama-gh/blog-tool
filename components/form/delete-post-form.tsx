"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useFormStatus } from 'react-dom'
import { toast } from "sonner";
import { deletePost } from "@/lib/actions";

export default function DeletePostForm({ postName }: { postName: string }) {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  return (
    <form
      action={async (data: FormData) =>
        window.confirm("Are you sure you want to delete your post?") &&
        deletePost(data, id, "delete").then((res) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            router.refresh();
            router.push(`/site/${res.siteId}`);
            toast.success(`Successfully deleted post!`);
          }
        })
      }
      className="rounded-lg dark:bg-black"
    >
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10 hidden">
        {/* <h2 className="font-inter text-xl dark:text-white">Delete Post</h2> */}
        {/* <p className="text-sm text-gray-500 dark:text-gray-400">
          Deletes your post permanently. Type in the name of your post{" "}
          <b>{postName}</b> to confirm.
        </p> */}

        {/* <input
          name="confirm"
          type="text"
          required
          pattern={postName}
          placeholder={postName}
          className="w-full max-w-md rounded-md border border-gray-300 text-sm text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700"
        /> */}
      </div>

        <div className="w-32 mx-auto">
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
        "flex h-8 w-32 items-center justify-center space-x-2 rounded-full border text-sm transition-all focus:outline-none sm:h-8",
        pending
          ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          : "border-red-600 bg-transparent hover:bg-red-100 bg-opacity-20  text-red-600 hover:text-red-600 dark:hover:bg-transparent",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Delete Post</p>}
    </button>
  );
}
