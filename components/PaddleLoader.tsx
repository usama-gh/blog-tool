"use client";

import Script from "next/script";
import { plans } from "@/data";
import axios from "axios";

interface Props {
  subscriptionId?: string;
}

export function PaddleLoader({ subscriptionId }: Props) {
  return (
    <Script
      //   src="https://cdn.paddle.com/paddle/paddle.js"
      src="https://cdn.paddle.com/paddle/v2/paddle.js"
      onLoad={() => {
        if (process.env.NEXT_PUBLIC_PADDLE_SANDBOX) {
          // @ts-ignore
          Paddle.Environment.set("sandbox");
        }
        // @ts-ignore
        Paddle.Setup({
          seller: Number(process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID),
          pwAuth: process.env.NEXT_PUBLIC_PADDLE_VENDOR_AUTH_CODE,
          eventCallback: async function (res: any) {
            if (res.name == "checkout.completed") {
              let plan = plans.find(
                (plan) => plan.priceId == res.data.items[0].price_id,
              );

              await axios
                .post(`api/subscription`, {
                  id: subscriptionId,
                  planId: plan?.id,
                  name: plan?.name,
                  priceId: plan?.priceId,
                  websites: plan?.websites,
                  visitors: plan?.views,
                  checkoutId: res.data.id,
                  transactionId: res.data.transaction_id,
                })
                .then(function (response) {
                  // @ts-ignore
                  Paddle.Checkout.close();
                })
                .catch(function (error) {
                  console.log(error.message);
                });
            }
          },
        });
      }}
    />
  );
}
