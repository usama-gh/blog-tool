"use client";
import Script from "next/script";
import React from "react";

export default function CheckoutBtn() {
  return (
    <>
      <Script
        src="https://cdn.paddle.com/paddle/paddle.js"
        onLoad={() => {
          // @ts-ignore
        //   Paddle.Environment.set("sandbox");
          // @ts-ignore
          Paddle.Setup({ vendor: 107521 });
        }}
      ></Script>
      <div
        className="bg-dark mt-10 rounded-lg p-2 text-center font-semibold text-white dark:bg-white dark:text-black"
        onClick={() => {
          // @ts-ignore
          Paddle.Checkout.open({
            product: 600728,
          });
        }}
      >
        Current Plan
      </div>
    </>
  );
}
