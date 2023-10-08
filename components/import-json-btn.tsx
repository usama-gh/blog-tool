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
      className="flex h-7 lg:w-40 items-center justify-center gap-x-2 rounded-lg text-sm transition-all focus:outline-none border border-black bg-black text-white hover:bg-white hover:text-black active:bg-gray-100 dark:border-gray-700 dark:hover:border-gray-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-gray-800"
    >
      Import posts <span className="flex gap-x-1 hidden lg:flex"><LinkedinIcon width={16} fill="currentColor" strokeWidth="0px"/><TwitterIcon  width={16}  fill="currentColor" strokeWidth="0px"/></span>
    </button>
  );
}
