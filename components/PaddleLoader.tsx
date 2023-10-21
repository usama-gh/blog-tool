"use client";

import Script from "next/script";
import { plans } from "@/data";
import axios from "axios";
import { updateSubscription } from "@/lib/actions";
import { toast } from "sonner";

interface Props {
  subscriptionId?: string;
  userId?: string;
}

export function PaddleLoader({ subscriptionId, userId }: Props) {
  return (
    <Script
      //   src="https://cdn.paddle.com/paddle/paddle.js"
      src="https://cdn.paddle.com/paddle/v2/paddle.js"
      onLoad={() => {
        // if (process.env.NEXT_PUBLIC_PADDLE_SANDBOX) {
        //   // @ts-ignore
        //   Paddle.Environment.set("sandbox");
        // }
        // @ts-ignore
        Paddle.Setup({
          seller: Number(process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID),
          pwAuth: process.env.NEXT_PUBLIC_PADDLE_VENDOR_AUTH_CODE,
          eventCallback: async function (res: any) {
            if (res.name == "checkout.completed") {
              let plan = plans.find(
                (plan) => plan.priceId == res.data.items[0].price_id,
              );

              try {
                updateSubscription({
                  userId,
                  id: subscriptionId,
                  planId: plan?.id,
                  name: plan?.name,
                  priceId: plan?.priceId,
                  websites: plan?.websites,
                  visitors: plan?.views,
                  checkoutId: res.data.id,
                  transactionId: res.data.transaction_id,
                }).then((res: any) => {
                  if (res.error) {
                    toast.error(res.error);
                  } else {
                    // @ts-ignore
                    Paddle.Checkout.close();
                    window.location.reload();
                  }
                });
              } catch (error) {
                // @ts-ignore
                toast.error(error.message);
              }
            }
          },
        });
      }}
    />
  );
}
