"use client";

import React, { useEffect, useState } from "react";
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

export default function SocialLinks({ linksData }: { linksData: any }) {
  const [links, setLinks] = useState<any>({});
  useEffect(() => {
    linksData && setLinks(JSON.parse(linksData));
  }, [linksData]);

  return (
    <div className="mt-5 flex items-center justify-center text-slate-500  dark:text-gray-400">
      {links.facebookLink && (
        <a
          href={links.facebookLink}
          className="ml-1 hover:text-slate-800 dark:hover:text-gray-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FacebookIcon strokeWidth="1.5" color="currentColor" />
        </a>
      )}
      {links.instagramLink && (
        <a
          href={links.instagramLink}
          className="ml-1 hover:text-slate-800 dark:hover:text-gray-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramIcon strokeWidth="1.5" color="currentColor" />
        </a>
      )}
      {links.twitterLink && (
        <a
          href={links.twitterLink}
          className="ml-1 hover:text-slate-800 dark:hover:text-gray-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TwitterIcon strokeWidth="1.5" color="currentColor"/>
        </a>
      )}
      {links.githubLink && (
        <a
          href={links.githubLink}
          className="ml-1 hover:text-slate-800 dark:hover:text-gray-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon strokeWidth="1.5" color="currentColor"/>
        </a>
      )}
      {links.telegramLink && (
        <a
          href={links.telegramLink}
          className="ml-1 hover:text-slate-800 dark:hover:text-gray-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SendIcon strokeWidth="1.5" color="currentColor"/>
        </a>
      )}
      {links.email && (
        <a
          href={links.email}
          className="ml-1 hover:text-slate-800 dark:hover:text-gray-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MailIcon strokeWidth="1.5" color="currentColor"/>
        </a>
      )}
      {links.linkedInLink && (
        <a
          href={links.linkedInLink}
          className="ml-1 hover:text-slate-800 dark:hover:text-gray-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedinIcon  strokeWidth="1.5" color="currentColor"/>
        </a>
      )}
      {links.youtubeLink && (
        <a
          href={links.youtubeLink}
          className="ml-1 hover:text-slate-800 dark:hover:text-gray-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <YoutubeIcon strokeWidth="1.5" color="currentColor"/>
        </a>
      )}
      {links.whatsappLink && (
        <a
          href={links.whatsappLink}
          className="ml-1 hover:text-slate-800 dark:hover:text-gray-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircleIcon strokeWidth="1.5" color="currentColor"/>
        </a>
      )}
      {links.websiteLink && (
        <a
          href={links.websiteLink}
          className="ml-1 hover:text-slate-800 dark:hover:text-gray-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkIcon strokeWidth="1.5" color="currentColor"/>
        </a>
      )}
    </div>
  );
}
