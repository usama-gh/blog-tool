"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ModalProvider } from "@/components/modal/provider";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {/* top-left, top-center, top-right, bottom-left, bottom-center, bottom-right */}
      {/* position="" */}
      <Toaster className="dark:hidden" />
      <Toaster theme="dark" className="hidden dark:block" />
      <PostHogProvider client={posthog}>
        <ModalProvider>{children}</ModalProvider>
      </PostHogProvider>
    </SessionProvider>
  );
}
