"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ModalProvider } from "@/components/modal/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {/* top-left, top-center, top-right, bottom-left, bottom-center, bottom-right */}
      {/* position="" */}
      <Toaster className="dark:hidden" />
      <Toaster theme="dark" className="hidden dark:block" />
      <ModalProvider>{children}</ModalProvider>
    </SessionProvider>
  );
}
