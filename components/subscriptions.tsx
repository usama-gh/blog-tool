"use client";

// import { Helmet } from "react-helmet";
import Script from "next/script";
import { PaddleLoader } from "./PaddleLoader";

export default function Subscriptions() {
  //   const handleClick = () => {
  //     const Paddle = window.Paddle;
  //     Paddle.Checkout.open({
  //       product: 567487,
  //       email: "usman@gmail.com",
  //       successCallback: (data: any, err: any) => {
  //         console.log(data);
  //         //ADD YOUR EXTRA LOGIC TO SEND TO BACKEND
  //       },
  //     });
  //   };
  return (
    <>
      <PaddleLoader />
      <div className="">
        <p>Subscription packages</p>
        <button
          className="mt-3 rounded-md bg-indigo-500 px-2 py-2 text-white outline-none"
          onClick={() => {
            // @ts-ignore
            Paddle.Checkout.open({
              //   product: "pro_01h9mgfgf29z0z33ka8a6rqkgb",
              product: 12345,
              successCallback: (res: any) => {
                console.log(res);
              },
            });
          }}
        >
          Buy Now
        </button>
      </div>
    </>
  );
}
