"use client";

import { Lead } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import LoadingDots from "./icons/loading-dots";
import { gateSlide } from "@/types";

export const UnblockSlides = ({
  postId,
  siteId,
  gateSlide,
  setGateSlideUnblock,
}: {
  postId: string;
  siteId: string;
  gateSlide: gateSlide;
  setGateSlideUnblock: any;
}) => {
  const [isCollected, setIsCollected] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubscribe = async (e: any) => {
    e.preventDefault();

    try {
      // creating lead collectors
      const res = await fetch("/api/leads", {
        method: "POST",
        body: JSON.stringify({
          email,
          postId: postId,
        }),
      });
      const resData = await res.json();

      // set siteId into localstorage so that the user can not to give email every time for specific site
      localStorage.setItem("siteId", siteId);

      setEmail("");
      // setIsCollected(true);
      setGateSlideUnblock(true);
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  function handleFollow(e: any) {
    const link = document.createElement("a");
    link.href = gateSlide.link!;
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // set siteId into localstorage so that the user can not to give email every time for specific site
    localStorage.setItem("siteId", siteId);
    setGateSlideUnblock(true);
  }

  return (
    <>
      {gateSlide.type === "email" ? (
        <form
          onSubmit={(e) => {
            setLoading(true);
            handleSubscribe(e);
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
          <Button loading={loading} btnText="Subscribe to Unblock" />
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            setLoading(true);
            handleFollow(e);
          }}
          className="mt-5 text-center"
        >
          <Button loading={loading} btnText="Follow to Unblock" />
        </form>
      )}
    </>
  );
};
function Button({ loading, btnText }: { loading: boolean; btnText: string }) {
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
