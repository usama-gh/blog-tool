"use client";

import { regenerateToken } from "@/lib/actions";
import { Copy, RotateCw } from "lucide-react";
import { useState } from "react";

function ApiToken({ id, apiToken }: any) {
  const [token, setToken] = useState(apiToken);

  const handleClick = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Unable to copy to clipboard.", err);
      alert("Copy to clipboard failed.");
    }
  };

  const handleNewToken = async () => {
    const response = await regenerateToken(id);
    if (response) {
      // @ts-ignore
      setToken(response.token);
    }
  };

  return (
    <div className="rounded-lg border  border-slate-200 dark:border-gray-700">
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
        <h2 className="font-inter text-xl font-semibold text-slate-500 dark:text-white">
          API key
        </h2>
        <p className="text-sm text-slate-500 dark:text-gray-400">
          Use this Blog API key to publish posts from different channels
        </p>

        <div className="flex items-center space-x-3">
          <div className="flex w-full max-w-md items-center justify-between rounded-md border border-slate-300 bg-white p-2 text-sm text-slate-900 focus:border-slate-500 dark:border-gray-600 dark:bg-black dark:text-white">
            <span>{token}</span>
            <Copy
              width={15}
              className="cursor-pointer opacity-40 transition duration-200 ease-out hover:opacity-100"
              onClick={() => handleClick(token)}
            />
          </div>
          <div
            className="cursor-pointer"
            title="Regenerate token"
            onClick={handleNewToken}
          >
            <RotateCw width={20} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiToken;
