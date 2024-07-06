"use client";

import { SubscribeReponse } from "@/types";
import LoadingDots from "./icons/loading-dots";
import { cn } from "@/lib/utils";

import { useState } from "react";
// ts-ignore because experimental_useFormStatus is not in the types
// @ts-ignore
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Integration } from "@prisma/client";
import { addSubscriberToIntegrations } from "@/lib/actions";

export const Subscribe = ({
  siteId,
  view,
  searchKey,
  type,
}: {
  siteId: string;
  view: string;
  searchKey: string;
  type: string;
}) => {
  const [data, setData] = useState({
    name: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  const [showName, setShowName] = useState(false);

  const [isSubscribed, setIsSubscribed] = useState(false); // New state variable

  const handleSubscribeClick = () => {
    if (!data.email) {
      toast.error("Please enter your email address");
      return;
    }
    setShowName(true);
  };

  const addToSubscribe = async (e: any) => {
    e.preventDefault();

    // send subscription data to bloggers integrations
    addSubscriberToIntegrations(searchKey, type, data);

    const res = await fetch("/api/subscribe", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        siteId,
      }),
    });

    const response: SubscribeReponse = await res.json();

    if (!response.success) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      setData({
        name: "",
        firstName: "",
        lastName: "",
        email: "",
      });
      setShowName(false);
      setIsSubscribed(true);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      {view === "homepage" ? (
        <div className="relative mx-auto  w-full rounded-3xl bg-teal-100 px-6 dark:bg-teal-700">
          {isSubscribed ? (
            // Display both success messages
            <>
              <p className="mb-1 font-semibold tracking-wide text-teal-700  dark:text-gray-300">
                Thank you for subscribing!
              </p>
              <p className="text-sm tracking-tight text-teal-700  dark:text-gray-300">
                You are now subscribed to my newsletter.
              </p>
            </>
          ) : (
            // Display the form
            <>
              <p className="text-base text-teal-700 dark:text-teal-100 ">
                Subscribe to get future posts, exclusive content & much more.
              </p>

              <form onSubmit={addToSubscribe}>
                {!showName && (
                  <div className="mt-3 flex  gap-y-2">
                    <input
                      name="name"
                      type="email"
                      placeholder="Enter your email"
                      value={data.email}
                      onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                      }
                      required
                      className="w-full flex-1 rounded-l-md border-0 bg-white text-xs  text-gray-900"
                    />

                    <SubscribeButton
                      view={view}
                      type="button"
                      btnText="Subscribe"
                      onClick={handleSubscribeClick}
                    />
                  </div>
                )}
                {/* Additional form fields */}
                {showName && (
                  <NameAttributesInputs
                    data={data}
                    setData={setData}
                    view={view}
                  />
                )}
              </form>
            </>
          )}
        </div>
      ) : (
        <div className="relative mx-auto w-full rounded-2xl  px-8 py-4 text-center">
          {isSubscribed ? (
            // Display both success messages
            <>
              <p className="mb-1 font-semibold  dark:text-gray-300">
                Thank you for subscribing!
              </p>
              <p className="text-sm dark:text-gray-300">
                You are now subscribed to the newsletter.
              </p>
            </>
          ) : (
            // Display the form
            <>
              <p className="text-sm ">
                Subscribe to get future posts, exclusive content & much more.
              </p>

              <form onSubmit={addToSubscribe}>
                <div className="mt-3 flex items-center gap-x-1">
                  <input
                    name="name"
                    type="email"
                    placeholder="Enter your email"
                    value={data.email}
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                    required
                    className="w-full flex-1 rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 dark:focus:ring-white"
                  />
                  <SubscribeButton
                    view={view}
                    type="button"
                    btnText="Subscribe"
                    onClick={handleSubscribeClick}
                  />
                </div>

                {/* Additional form fields */}
                {showName && (
                  <NameAttributesInputs
                    data={data}
                    setData={setData}
                    view={view}
                  />
                )}
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

function NameAttributesInputs({
  data,
  setData,
  view,
}: {
  data: {
    name: string;
    firstName: string;
    lastName: string;
  };
  setData: any;
  view: string;
}) {
  const handleNameChange = (e: { target: { value: any } }) => {
    const fullName = e.target.value;
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" "); // Combine remaining parts as last name

    setData({ ...data, name: fullName, firstName, lastName });
  };
  return (
    <div className="mt-3 flex gap-y-2">
      <input
        name="name"
        type="text"
        placeholder="Your Full Name"
        value={data.name}
        onChange={handleNameChange}
        required
        className="w-full flex-1 rounded-l-md border-0 bg-white text-xs  text-gray-900"
      />
      {/* <input
        name="lastName"
        type="text"
        placeholder="Enter your last name"
        value={data.lastName}
        onChange={(e) => setData({ ...data, lastName: e.target.value })}
        required
        className="w-full flex-1 rounded-md border-0 bg-white text-xs"
      /> */}
      <SubscribeButton
        view={view}
        type="submit"
        btnText="Confirm"
        roundedLeft={false}
      />
    </div>
  );
}

function SubscribeButton({
  view,
  type,
  btnText,
  roundedLeft,
  onClick,
}: {
  view: string;
  type: "submit" | "button";
  btnText: string;
  roundedLeft?: boolean;
  onClick?: () => void;
}) {
  const { pending } = useFormStatus();
  return (
    <div>
      {view === "homepage" ? (
        <button
          type={type}
          className={cn(
            "flex h-8 w-auto items-center justify-center space-x-2  px-4 py-1 text-xs text-white transition-all focus:outline-none",
            pending ? "cursor-not-allowed " : "border-0 bg-teal-600",
            roundedLeft ? "rounded-r-md" : "rounded-r-md",
          )}
          disabled={pending}
          onClick={onClick}
        >
          {pending ? <LoadingDots color="#808080" /> : <p>{btnText}</p>}
        </button>
      ) : (
        <button
          type={type}
          className={cn(
            "flex h-10 w-auto items-center justify-center space-x-2 rounded-md border px-4 py-1 text-sm transition-all focus:outline-none",
            pending
              ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              : "border-0 bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-800 dark:border  dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:border-gray-400 dark:hover:bg-transparent dark:hover:text-white dark:active:bg-gray-800",
          )}
          disabled={pending}
          onClick={onClick}
        >
          {pending ? <LoadingDots color="#808080" /> : <p>{btnText}</p>}
        </button>
      )}
    </div>
  );
}
