import Image from "next/image";
import LoginButton from "./login-button";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div>
      <Image
        alt="SlidesBites social blog builder"
        width={800}
        height={800}
        className="absolute left-0 left-1/2 top-8 -z-10 mx-auto w-auto -translate-x-1/2 transform dark:scale-110 "
        src="/login-visual.png"
      />

      <div className="relative mx-5 rounded-xl bg-white py-10 shadow-xl shadow-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:shadow-gray-800 sm:mx-auto sm:w-full sm:max-w-md ">
        <Image
          alt="SlidesBites social blog builder"
          width={100}
          height={100}
          className="relative mx-auto h-12 w-auto dark:scale-110 dark:rounded-full dark:border dark:border-gray-400"
          src="/logo.png"
        />
        <h1 className="font-inter mt-6 text-center text-3xl dark:text-white">
          Typedd
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Build a social blog for your personal brand
        </p>

        <div className="mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
          <Suspense
            fallback={
              <div className="my-2 h-10 w-full rounded-md border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800" />
            }
          >
            <LoginButton />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
