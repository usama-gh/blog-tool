"use client";

import useUsermaven from "@/lib/hooks/useUsermaven";
import { usermavenClient, UsermavenClient } from "@usermaven/sdk-js";
import { AnalyticsBrowser } from '@june-so/analytics-next';

interface pageProps {
  email: string;
  id: string;
  image: string;
  name: string;
  username: string;
  createdAt?: Date;
  firstName?: string;
  lastName?: string;
  planName?: string;
  sitesCreated: number;
  sites: any;
}

interface userProps {
  user: {
    email: string;
    id: string;
    image: string;
    name: string;
    username: string;
    createdAt?: Date;
    firstName?: string;
    lastName?: string;
    planName?: string;
    sitesCreated: number;
    sites: any;
  };
}

// export function CreateUsermavenUser(user: pageProps) {
//   // Init Usermaven
//   const usermaven: UsermavenClient = usermavenClient({
//     key: process.env.NEXT_PUBLIC_USERMAVEN_KEY as string,
//     tracking_host: "https://events.usermaven.com",
//   });

//   if (usermaven) {
//     usermaven.id({
//       // Required attributes
//       id: user.id,
//       email: user.email,
//       created_at: user?.createdAt,

//       // Recommended attributes
//       first_name: user?.firstName,
//       last_name: user?.lastName,

//       // Optional attributes (you can name attributes what you wish)
//       custom: {
//         plan_name: user?.planName,
//         sitesCreated: user.sitesCreated,
//         sites: user.sites,
//       },
//     });
//   }
//   return;
// }

export default function CreateUsermavenUser({ user }: userProps) {
  const usermaven = useUsermaven();

  const analytics = AnalyticsBrowser.load({
    writeKey: 'E9yxAiNvGLLQn5Rg',
  });


  if (usermaven) {
    usermaven.id({
      // Required attributes
      id: user.id,
      email: user.email,
      created_at: user?.createdAt,

      // Recommended attributes
      first_name: user?.firstName,
      last_name: user?.lastName,

      // Optional attributes (you can name attributes what you wish)
      custom: {
        plan_name: user?.planName,
      },
    });
  }

  return <div className="hidden"></div>;
}

export const triggerEvent = async (event: string, paylaod: object) => {
  // Init Usermaven
  const usermaven: UsermavenClient = usermavenClient({
    key: process.env.NEXT_PUBLIC_USERMAVEN_KEY as string,
    tracking_host: "https://events.usermaven.com",
  });

  if (usermaven) {
    usermaven.track(event, paylaod);
  }
};
