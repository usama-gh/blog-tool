"use client";

import { Lead } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingDots from "./icons/loading-dots";
import { r2Asset } from "@/lib/utils";
import { addSubscriberToIntegrations } from "@/lib/actions";
import { Button } from "./ui/button";

export const LeadDownload = ({
  postId,
  postTitle,
  lead,
}: {
  postId: string;
  postTitle?: string;
  lead: Lead;
}) => {
  const [isCollected, setIsCollected] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [counter, setCounter] = useState(5);

  const [data, setData] = useState({
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    source: postTitle ? "gated_content" : "lead_magnet",
    sourceTitle: postTitle ?? lead.title,
    websiteUrl: "",
  });

  const [showName, setShowName] = useState(false);

  useEffect(() => {
    setData({
      ...data,
      websiteUrl: window.location.href,
    });
  }, []);

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
          email: data.email,
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
        ...data,
        name: "",
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

  const handleNameChange = (e: { target: { value: any } }) => {
    const fullName = e.target.value;
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" "); // Combine remaining parts as last name

    setData({ ...data, name: fullName, firstName, lastName });
  };

  useEffect(() => {
    let timeout: any = null;

    if (lead.delivery === "link") {
      timeout = setTimeout(() => {
        if (counter > 0) {
          setCounter(counter - 1);
        } else {
          window.location.href = lead.file!;
        }
      }, 1000);
    }

    () => {
      timeout && clearTimeout(timeout);
    };
  }, [counter]);

  return (
    <>
      {isCollected ? (
        lead.delivery === "file" ? (
          <p className="mt-5 text-center text-sm font-semibold dark:text-gray-200">
            Thank you for downloading
          </p>
        ) : (
          <div className="mt-5 text-center">
            {/* <p className="flex justify-center text-center text-sm text-slate-700 dark:text-gray-200">
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
            </div> */}
            <div className="">
              <p className="flex justify-center text-center text-sm text-slate-700 dark:text-gray-200">
                You will be redirected automatically after seconds
              </p>
              <h2 className="text-xl font-semibold">{counter}</h2>
            </div>

            <a
              href={lead.file!}
              className="mt-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-black bg-black text-sm text-white transition-all hover:bg-white hover:text-black focus:outline-none dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-black dark:hover:text-white dark:active:bg-gray-800"
            >
              View
            </a>
          </div>
        )
      ) : lead.download === "email" ? (
        <form
          onSubmit={(e) => {
            setLoading(true);
            handleDownload(e);
          }}
        >
          <div className="mt-5 flex w-full items-center gap-3 rounded-xl bg-blue-100 px-8 py-6 shadow-xl dark:bg-gray-900 ">
            {!showName && (
              <div className="flex flex-col items-center gap-3 lg:flex-row">
                <p className="text-md pr-2 tracking-tight">Enter your email</p>
                <input
                  name="name"
                  type="email"
                  placeholder="Enter your email"
                  // onChange={(e) => setEmail(e.target.value)}
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  required
                  className="w-full flex-1 rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-lg text-slate-600 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 dark:focus:ring-white"
                />
                <DownloadLeadButton
                  type="button"
                  loading={loading}
                  btnText={lead.buttonCta as string}
                  onClick={handleSubscribeClick}
                />
              </div>
            )}
            {showName && (
              <div className=" flex flex-col items-center gap-3 lg:flex-row">
                <p className="text-md pr-2 tracking-tight">Enter your name</p>
                <input
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={data.name}
                  onChange={handleNameChange}
                  required
                  className="w-full flex-1 rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-lg text-slate-600 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 dark:focus:ring-white"
                />
                <DownloadLeadButton
                  type="submit"
                  loading={loading}
                  btnText={"Download"}
                />
              </div>
            )}
          </div>
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
        className="font-regular flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 px-5 py-2 text-lg tracking-wide text-white shadow-lg shadow-blue-800/10 transition-all hover:shadow-blue-800/20 focus:outline-none"
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
