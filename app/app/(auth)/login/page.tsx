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
        className="absolute left-1/2 transform -translate-x-1/2 -z-10 top-8 left-0 mx-auto w-auto dark:scale-110 "
        src="/login-visual.png"
      />

<div className="relative mx-5 bg-white dark:bg-gray-700 dark:shadow-gray-800 rounded-xl shadow-xl shadow-gray-200 py-10 dark:border-gray-700 sm:mx-auto sm:w-full sm:max-w-md ">


<Image
  alt="SlidesBites social blog builder"
  width={100}
  height={100}
  className="relative mx-auto h-12 w-auto dark:scale-110 dark:rounded-full dark:border dark:border-gray-400"
  src="/logo.png"
/>
<h1 className="mt-6 text-center font-inter text-3xl dark:text-white">
SlideBites
</h1>
<p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
  Build a social blog for your personal brand  
  
</p>

<div className="mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
  <Suspense
    fallback={
      <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
    }
  >
    <LoginButton />
  </Suspense>
</div>
</div>
    </div>
   
  );
}
