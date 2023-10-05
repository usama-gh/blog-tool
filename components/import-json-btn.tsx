"use client";

import { useModal } from "@/components/modal/provider";
import { ReactNode } from "react";
import {
  Facebook,
  GithubIcon,
  InstagramIcon,
  LinkIcon,
  LinkedinIcon,
  MailIcon,
  MessageCircleIcon,
  SendIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";
import { FacebookIcon } from "lucide-react";

export default function ImportJSONButton({
  children,
}: {
  children: ReactNode;
}) {
  const modal = useModal();
  return (
    <button
      onClick={() => modal?.show(children)}
      className="flex rounded-lg font-bold items-center justify-center gap-x-1 border px-3 py-1 text-sm transition-all focus:outline-none border-black bg-black text-white hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
    >
      Import <LinkedinIcon width={16} fill="currentColor" strokeWidth="0px"/>   <TwitterIcon  width={16}  fill="currentColor" strokeWidth="0px"/>
    </button>
  );
}
