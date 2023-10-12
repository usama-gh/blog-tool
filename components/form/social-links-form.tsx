"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { toast } from "sonner";
import { useEffect } from 'react';
import {
  FacebookIcon,
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

export default function SocialLinksForm({
  handleSubmit,
  links,
}: {
  handleSubmit: any;
  links: any;
}) {

  useEffect(() => {
    // Check if the URL contains "#socials"
    if (window.location.hash === '#socials') {
      // Scroll to the section with the id "socials"
      const socialsSection = document.getElementById('socials');
      if (socialsSection) {
        socialsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const { id } = useParams() as { id?: string };
  const router = useRouter();
  const { update } = useSession();
  return (
    <form
      action={async (data: FormData) => {
        handleSubmit(data, id, "links").then(async (res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            if (id) {
              router.refresh();
            } else {
              await update();
              router.refresh();
            }
            toast.success(`Successfully updated Social Links!`);
          }
        });
      }}
      className="rounded-lg border  border-slate-200 dark:border-gray-700"
      id="socials"
    >
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
        <h4 className="font-inter text-lg dark:text-white">Social Links</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add some social links
        </p>
        <div className="mt-0 flex flex-wrap justify-between">
          <div className="mt-4 w-[48%]">
            <h4 className="mb-1 font-inter text-sm font-medium dark:text-white">
              Facebook
            </h4>
            <div className="absolute flex items-center rounded-l-md border border-l-0 border-gray-300 bg-gray-100 px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              <FacebookIcon />
            </div>
            <input
              name="facebookLink"
              defaultValue={links?.facebookLink}
              type="text"
              placeholder="https://fb.com/elonmusk"
              className="w-full rounded-md border border-gray-300 py-3 pl-20 text-sm text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700"
            />
          </div>
          <div className="mt-4 w-[48%]">
            <h4 className="mb-1 font-inter text-sm font-medium dark:text-white">
              Twitter
            </h4>
            <div className="absolute flex items-center rounded-l-md border border-l-0 border-gray-300 bg-gray-100 px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              <TwitterIcon />
            </div>
            <input
              name="twitterLink"
              defaultValue={links?.twitterLink}
              type="text"
              placeholder="https://twitter.com/elonmusk"
              className="w-full rounded-md border border-gray-300 py-3 pl-20 text-sm text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700"
            />
          </div>
          <div className="mt-4 w-[48%]">
            <h4 className="mb-1 font-inter text-sm font-medium dark:text-white">
              Instagram
            </h4>
            <div className="absolute flex items-center rounded-l-md border border-l-0 border-gray-300 bg-gray-100 px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              <InstagramIcon />
            </div>
            <input
              name="instagramLink"
              defaultValue={links?.instagramLink}
              type="text"
              placeholder="https://instagram.com/elon"
              className="w-full rounded-md border border-gray-300 py-3 pl-20 text-sm text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700"
            />
          </div>
          <div className="mt-4 w-[48%]">
            <h4 className="mb-1 font-inter text-sm font-medium dark:text-white">
              Github
            </h4>
            <div className="absolute flex items-center rounded-l-md border border-l-0 border-gray-300 bg-gray-100 px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              <GithubIcon />
            </div>
            <input
              name="githubLink"
              defaultValue={links?.githubLink}
              type="text"
              placeholder="https://github.com/elonmusk"
              className="w-full rounded-md border border-gray-300 py-3 pl-20 text-sm text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700"
            />
          </div>
          <div className="mt-4 w-[48%]">
            <h4 className="mb-1 font-inter text-sm font-medium dark:text-white">
              Telegram
            </h4>
            <div className="absolute flex items-center rounded-l-md border border-l-0 border-gray-300 bg-gray-100 px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              <SendIcon />
            </div>
            <input
              name="telegramLink"
              defaultValue={links?.telegramLink}
              type="text"
              placeholder="https://t.me/elonmusk"
              className="w-full rounded-md border border-gray-300 py-3 pl-20 text-sm text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700"
            />
          </div>
          <div className="mt-4 w-[48%]">
            <h4 className="mb-1 font-inter text-sm font-medium dark:text-white">
              LinkedIn
            </h4>
            <div className="absolute flex items-center rounded-l-md border border-l-0 border-gray-300 bg-gray-100 px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              <LinkedinIcon />
            </div>
            <input
              name="linkedInLink"
              defaultValue={links?.LinkedInLink}
              type="text"
              placeholder="https://linkedin.com/elonmusk"
              className="w-full rounded-md border border-gray-300 py-3 pl-20 text-sm text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700"
            />
          </div>
          <div className="mt-4 w-[48%]">
            <h4 className="mb-1 font-inter text-sm font-medium dark:text-white">
              Email
            </h4>
            <div className="absolute flex items-center rounded-l-md border border-l-0 border-gray-300 bg-gray-100 px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              <MailIcon />
            </div>
            <input
              name="email"
              defaultValue={links?.email}
              type="text"
              placeholder="elonmusk@gmail.com"
              className="w-full rounded-md border border-gray-300 py-3 pl-20 text-sm text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700"
            />
          </div>
          <div className="mt-4 w-[48%]">
            <h4 className="mb-1 font-inter text-sm font-medium dark:text-white">
              Youtube
            </h4>
            <div className="absolute flex items-center rounded-l-md border border-l-0 border-gray-300 bg-gray-100 px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              <YoutubeIcon />
            </div>
            <input
              name="youtubeLink"
              defaultValue={links?.youtubeLink}
              type="text"
              placeholder="https://youtube.com/elonmusk"
              className="w-full rounded-md border border-gray-300 py-3 pl-20 text-sm text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700"
            />
          </div>
          <div className="mt-4 w-[48%]">
            <h4 className="font mb-1 font-inter text-sm font-medium dark:text-white">
              WhatsApp
            </h4>
            <div className="absolute flex items-center rounded-l-md border border-l-0 border-gray-300 bg-gray-100 px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              <MessageCircleIcon />
            </div>
            <input
              name="whatsAppLink"
              defaultValue={links?.whatsAppLink}
              type="text"
              placeholder="+919000000000"
              className="w-full rounded-md border border-gray-300 py-3 pl-20 text-sm text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700"
            />
          </div>
          <div className="mt-4 w-[48%]">
            <h4 className="mb-1 font-inter text-sm font-medium dark:text-white">
              Website
            </h4>
            <div className="absolute flex items-center rounded-l-md border border-l-0 border-gray-300 bg-gray-100 px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              <LinkIcon />
            </div>
            <input
              name="websiteLink"
              defaultValue={links?.websiteLink}
              type="text"
              placeholder="https://contentdrips.com"
              className="w-full rounded-md border border-slate-300 py-3 pl-20 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-500 focus:outline-none focus:ring-slate-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-slate-200 bg-slate-50 p-3 dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
        <p className="text-sm text-slate-500 dark:text-gray-400"></p>
        <FormButton />
      </div>
    </form>
  );
}

function FormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        "flex h-8 w-32 items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none sm:h-10",
        pending
          ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-gray-700 dark:hover:border-gray-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-gray-800",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Save Changes</p>}
    </button>
  );
}
