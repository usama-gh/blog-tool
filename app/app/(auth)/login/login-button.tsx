"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";

export default function LoginButton() {
  const [loading, setLoading] = useState(false);

  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    errorMessage && toast.error(errorMessage);
  }, [error]);

  return (
    <button
      disabled={loading}
      onClick={() => {
        setLoading(true);
        signIn("github");
        // signIn("google");
      }}
      className={`${
        loading
          ? "cursor-not-allowed bg-gray-50 dark:bg-gray-800"
          : "bg-white hover:bg-gray-50 active:bg-gray-100 dark:bg-black dark:hover:border-white dark:hover:bg-black"
      } group my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-gray-200 transition-colors duration-75 focus:outline-none dark:border-gray-700`}
    >
      {loading ? (
        <LoadingDots color="#A8A29E" />
      ) : (
        <>
          <Image src="/google.svg" width={20} height={20} alt="google" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Login with Google
          </p>
        </>
      )}
    </button>
  );
}
