import "@/styles/globals.css";
import { cal, inter } from "@/styles/fonts";
import { Providers } from "./providers";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const title =
  "Typedd – Turn your social media posts into blogs & create a personal social blog";
const description =
  "Easily turn your social media posts into blogs and build a personal blog for yourself. It has a new way to read blog which is more interactive. Built for personal brands";
const image = "/og-image.png";

export const metadata: Metadata = {
  title,
  description,
  icons: ["/favicon.ico"],
  openGraph: {
    title,
    description,
    images: [image],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
    creator: "@typedd",
  },
  metadataBase: new URL("https://typedd.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={
          "h-full min-h-screen overflow-y-auto bg-gradient-to-b from-white to-[#F4F8FF] tracking-tight dark:bg-gray-800 dark:bg-none " +
          cn(cal.variable, inter.variable)
        }
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
