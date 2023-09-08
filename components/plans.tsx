"use client"
import React from "react";
import PaddleLoader from "./paddle/paddleLoader"; 

export default function Plans() {
               
                setTimeout(() => {
                   // @ts-ignore
                   console.log(Paddle.Product)
                   //@ts-ignore
                  console.log(Paddle.Product.Prices({
                    product: "pro_01h89rf3zste4aacdsnxcjkgef",
                  }))
                }, 2000);
  return (

    <>
          <div className="relative rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
      <div className="flex justify-between border-b border-stone-200 p-8 dark:border-stone-700">
        <div className="flex flex-col">
          <h4 className="text-2xl font-bold dark:text-white">Free</h4>
          <span className="text-[x-small] text-stone-200 dark:text-white">
            Pay Once
          </span>
        </div>
        <p className="text-3xl text-gray-500 dark:text-white">$0</p>
      </div>
      <div className="p-8">
        <ul className="ml-5 list-disc dark:text-white">
          <li className="mb-1">500 views per month</li>
          <li className="mb-1">1 website</li>
          <li className="mb-1">Has ‘Made with SlideBites’ badge</li>
          <li className="mb-1">
            Import Twitter threads, LinkedIn posts & Facebook posts.
          </li>
        </ul>
        <div
          className="bg-dark mt-10 rounded-lg p-2 text-center font-semibold text-white dark:bg-white dark:text-black"
          onClick={() => {
             // @ts-ignore
            Paddle.Checkout.open({
              product: "pro_01h89rf3zste4aacdsnxcjkgef",
            });

          }}
        >
          Current Plan
        </div>
      </div>
    </div>
    </>
  );
}
