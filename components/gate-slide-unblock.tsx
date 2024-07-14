"use client";

import { Lead } from "@prisma/client";

import { useState } from "react";
import { toast } from "sonner";
import LoadingDots from "./icons/loading-dots";
import { gateSlide } from "@/types";
import { addSubscriberToIntegrations } from "@/lib/actions";

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

  const [data, setData] = useState({
    name: "",
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

  const handleNameChange = (e: { target: { value: any } }) => {
    const fullName = e.target.value;
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" "); // Combine remaining parts as last name

    setData({ ...data, name: fullName, firstName, lastName });
  };

  const handleSubscribe = async (e: any) => {
    e.preventDefault();

    try {
      // send subscription data to bloggers integrations
      addSubscriberToIntegrations(siteId, "siteId", data);

      // creating lead collectors
      const res = await fetch("/api/leads", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
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
    <div className="mb-[80px] bg-blue-100 dark:bg-gray-900 mx-auto flex  shadow-xl px-8 py-6 items-center justify-center">
      <>
        {gateSlide.type === "email" ? (
          <div>
            <form
              onSubmit={(e) => {
                setLoading(true);
                handleSubscribe(e);
              }}
            >

{!showName && (
              <div className="flex items-center gap-3 lg:flex-row flex-col">
                <p className="pr-2 text-md tracking-tight">Enter your email</p>
                <input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  required
                  className="text-base w-full flex-1 rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-slate-600 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 dark:focus:ring-white lg:text-lg"
                />
                <Button
                  type="button"
                  loading={loading}
                  btnText="Unlock"
                  onClick={handleSubscribeClick}
                />
              </div>
)}
              {showName && (
                <div className="flex items-center gap-3">
                   <p className="pr-2 text-md tracking-tight">Enter your name</p>
                  <input
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={data.name}
                    onChange={handleNameChange}
                    required
                    className="text-base w-full flex-1 rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-slate-600 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 dark:focus:ring-white lg:text-lg"
                  />
                  <Button type="submit" loading={loading} btnText="Unlock" />
                </div>
              )}
            </form>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              setLoading(true);
              handleFollow(e);
            }}
            className="mt-5 text-center"
          >
            <Button type="submit" loading={loading} btnText="Click Here" />
          </form>
        )}
      </>
    </div>
  );
};
function Button({
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
        className="flex tracking-wide items-center justify-center space-x-2 rounded-lg px-5 py-2 text-lg font-regular text-white shadow-lg shadow-blue-800/10 transition-all hover:shadow-blue-800/20 focus:outline-none bg-gradient-to-br from-blue-600 to-blue-400"
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
