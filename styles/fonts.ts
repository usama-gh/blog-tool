import localFont from "next/font/local";
import { Inter, Lora, Work_Sans, Figtree, Jost } from "next/font/google";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
export const cal = localFont({
  src: "./CalSans-SemiBold.otf",
  variable: "--font-cal",
  display: "swap",
});

export const calTitle = localFont({
  src: "./CalSans-SemiBold.otf",
  variable: "--font-title",
  display: "swap",
});
export const lora = Lora({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});
export const work = Work_Sans({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});

export const figtree = Figtree({
  variable: "--font-title",
  subsets: ["latin"],
  display: "swap",
});

export const jost = Jost({
  variable: "--font-title",
  subsets: ["latin"],
  display: "swap",
});

export const fontMapper = {
  "font-cal": calTitle.variable,
  "font-lora": lora.variable,
  "font-work": work.variable,
  "font-figtree": figtree.variable,
  "font-jost": jost.variable,
} as Record<string, string>;