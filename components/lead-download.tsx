"use client";

import { Lead } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import LoadingDots from "./icons/loading-dots";
import { r2Asset } from "@/lib/utils";
import { addSubscriberToIntegrations } from "@/lib/actions";

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

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [showName, setShowName] = useState(false);

  const handleSubscribeClick = () => {
    if (!data.email) {
      toast.error("Please enter your email address");
      return;
    }
    setShowName(true);
  };

  const handleDownload = async (e: any) => {
    e.preventDefault();

    try {
      // send subscription data to bloggers integrations
      addSubscriberToIntegrations(lead.siteId, "siteId", data);

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
        link.href = r2Asset(lead.file!);
        link.setAttribute("download", `${lead.fileName}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setData({
        firstName: "",
        lastName: "",
        email: "",
      });
      setShowName(false);
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
          <p className="mt-5 text-center text-sm font-semibold dark:text-gray-200">
            Thank you for downloading
          </p>
        ) : (
          <div className="mt-5 text-center">
            <p className="flex justify-center text-center text-sm text-slate-700 dark:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
                />
              </svg>
            </p>
            <div className="mt-4 rounded-md bg-slate-100 p-2 text-slate-800 dark:bg-gray-600 dark:text-gray-100">
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
            // onChange={(e) => setEmail(e.target.value)}
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            required
            className="w-full flex-1 rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 dark:focus:ring-white"
          />
          <DownloadLeadButton
            type="button"
            loading={loading}
            btnText={lead.buttonCta as string}
            onClick={handleSubscribeClick}
          />

          {showName && (
            <div className="mt-3 flex flex-col gap-4">
              <input
                name="firstName"
                type="text"
                placeholder="Enter your first name"
                value={data.firstName}
                onChange={(e) =>
                  setData({ ...data, firstName: e.target.value })
                }
                required
                className="w-full flex-1 rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 dark:focus:ring-white"
              />
              <input
                name="lastName"
                type="text"
                placeholder="Enter your last name"
                value={data.lastName}
                onChange={(e) => setData({ ...data, lastName: e.target.value })}
                required
                className="w-full flex-1 rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 dark:focus:ring-white"
              />
              <DownloadLeadButton
                type="submit"
                loading={loading}
                btnText={"Download"}
              />
            </div>
          )}
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
            type="submit"
            loading={loading}
            btnText={lead.buttonCta as string}
          />
        </form>
      )}
    </>
  );
};
function DownloadLeadButton({
  type,
  loading,
  btnText,
  onClick,
}: {
  type: "submit" | "button";
  loading: boolean;
  btnText: string;
  onClick?: () => void;
}) {
  return (
    <>
      <button
        type={type}
        disabled={loading}
        className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        onClick={onClick}
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
