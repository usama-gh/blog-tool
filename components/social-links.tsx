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
    <div className="mt-5 flex items-center justify-center">
      {links.facebookLink && (
        <a
          href={links.facebookLink}
          className="ml-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FacebookIcon />
        </a>
      )}
      {links.instagramLink && (
        <a
          href={links.instagramLink}
          className="ml-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramIcon />
        </a>
      )}
      {links.twitterLink && (
        <a
          href={links.twitterLink}
          className="ml-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TwitterIcon />
        </a>
      )}
      {links.githubLink && (
        <a
          href={links.githubLink}
          className="ml-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon />
        </a>
      )}
      {links.telegramLink && (
        <a
          href={links.telegramLink}
          className="ml-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SendIcon />
        </a>
      )}
      {links.email && (
        <a
          href={links.email}
          className="ml-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MailIcon />
        </a>
      )}
      {links.linkedInLink && (
        <a
          href={links.linkedInLink}
          className="ml-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedinIcon />
        </a>
      )}
      {links.youtubeLink && (
        <a
          href={links.youtubeLink}
          className="ml-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <YoutubeIcon />
        </a>
      )}
      {links.whatsappLink && (
        <a
          href={links.whatsappLink}
          className="ml-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircleIcon />
        </a>
      )}
      {links.websiteLink && (
        <a
          href={links.websiteLink}
          className="ml-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkIcon />
        </a>
      )}
    </div>
  );
}
