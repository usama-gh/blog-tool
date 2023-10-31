"use client";
import { Copy } from "lucide-react";

function ApiToken({ token }: any) {
  const handleClick = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Unable to copy to clipboard.", err);
      alert("Copy to clipboard failed.");
    }
  };
  return (
    <div className="rounded-lg border  border-slate-200 dark:border-gray-700">
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
        <h2 className="font-inter text-xl font-semibold text-slate-500 dark:text-white">
          Api Token
        </h2>
        <p className="text-sm text-slate-500 dark:text-gray-400">
          Send this api token with api request as a bearer token to create post
          in the blog.
        </p>

        <div className="flex w-full max-w-md items-center justify-between rounded-md border border-slate-300 bg-white p-2 text-sm text-slate-900 focus:border-slate-500 dark:border-gray-600 dark:bg-black dark:text-white">
          <span>{token}</span>
          <Copy
            width={15}
            className="cursor-pointer opacity-40 transition duration-200 ease-out hover:opacity-100"
            onClick={() => handleClick(token)}
          />
        </div>
      </div>
    </div>
  );
}

export default ApiToken;
