import { usermavenClient, UsermavenClient } from "@usermaven/sdk-js";
import { useEffect, useState } from "react";

export default function useUsermaven() {
  const [usermaven, setUsermaven] = useState<UsermavenClient | null>(null);

  useEffect(() => {
    // Init Usermaven
    const usermaven: UsermavenClient = usermavenClient({
      key: process.env.NEXT_PUBLIC_USERMAVEN_KEY as string,
      tracking_host: "https://events.usermaven.com",
    });

    setUsermaven(usermaven);
  }, []);

  return usermaven;
}
