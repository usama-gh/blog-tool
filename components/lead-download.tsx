"use client";

import { Lead } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import LoadingDots from "./icons/loading-dots";

export const LeadDownload = ({
  postId,
  lead,
}: {
  postId: string;
  lead: Lead;
}) => {
  const [isCollected, setIsCollected] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleDownload = async (e: any) => {
    e.preventDefault();

    try {
      // creating lead collectors
      const res = await fetch("/api/leads", {
        method: "POST",
        body: JSON.stringify({
          email,
          postId: postId,
          leadId: lead.id,
        }),
      });

      const resData = await res.json();
      if (resData.success && lead.delivery === "file") {
        const link = document.createElement("a");
        link.href = `${process.env.NEXT_PUBLIC_STORAGE_URL}/${lead.file}`;
        link.setAttribute("download", `${lead.fileName}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setEmail("");
      setIsCollected(true);
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <>
      {isCollected ? (
        lead.delivery === "file" ? (
          <p className="mt-5 text-center text-2xl font-semibold dark:text-gray-200">
            Thank you for downloading
          </p>
        ) : (
          <div className="mt-5 text-center">
            <p className="text-xl dark:text-gray-200">Here's the link</p>
            <div className="mt-4 rounded-md bg-gray-300/80 p-2">
              {lead.file}
            </div>
          </div>
        )
      ) : lead.download === "email" ? (
        <form
          onSubmit={(e) => {
            setLoading(true);
            handleDownload(e);
          }}
          className="mt-5 flex items-center gap-3"
        >
          <input
            name="name"
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full flex-1 rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 dark:focus:ring-white"
          />
          <DownloadLeadButton
            loading={loading}
            btnText={lead.buttonCta as string}
          />
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            setLoading(true);
            handleDownload(e);
          }}
          className="mt-5 text-center"
        >
          <DownloadLeadButton
            loading={loading}
            btnText={lead.buttonCta as string}
          />
        </form>
      )}
    </>
  );
};
function DownloadLeadButton({
  loading,
  btnText,
}: {
  loading: boolean;
  btnText: string;
}) {
  return (
    <>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
      >
        {loading ? (
          <>
            <LoadingDots color="#f3f3f3" />
            <p>Please wait</p>
          </>
        ) : (
          btnText
        )}
      </button>
    </>
  );
}
