"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { toast } from "sonner";
import va from "@vercel/analytics";
import { FacebookIcon, GithubIcon, InstagramIcon, LinkIcon, LinkedinIcon, MailIcon, MessageCircleIcon, SendIcon, TwitterIcon, YoutubeIcon } from "lucide-react";

export default function SocialLinksForm({
  handleSubmit,
  links
}: {
  handleSubmit: any;
  links: any
}) {
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
            va.track(`Updated Socials`, id ? { id } : {});
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
      className="rounded-lg border border-stone-200 bg-white dark:border-stone-700 dark:bg-black"
    >
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
        <h4 className="font-cal text-lg dark:text-white">Social Links</h4>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Add some social links
        </p>
        <div className="flex flex-wrap justify-between mt-0">
          <div className="w-[48%] mt-4">
            <h4 className="font-cal text-sm mb-1 font-medium dark:text-white">Facebook</h4>
            <div className="flex items-center absolute rounded-l-md border border-l-0 border-stone-300 bg-stone-100 px-3 py-2.5 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
                <FacebookIcon/>
            </div>
            <input
              name="facebookLink"
              defaultValue={links?.facebookLink}
              type="text"
              placeholder="https://fb.com/elonmusk"
              
              className="w-full pl-20 py-3 rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
            />
          </div>
          <div className="w-[48%] mt-4">
            <h4 className="font-cal text-sm mb-1 font-medium dark:text-white">Twitter</h4>
            <div className="flex items-center absolute rounded-l-md border border-l-0 border-stone-300 bg-stone-100 px-3 py-2.5 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
                <TwitterIcon/>
            </div>
            <input
              name="twitterLink"
              defaultValue={links?.twitterLink}
              type="text"
              placeholder="https://twitter.com/elonmusk"
              
              className="w-full pl-20 py-3 rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
            />
          </div>
          <div className="w-[48%] mt-4">
            <h4 className="font-cal text-sm mb-1 font-medium dark:text-white">Instagram</h4>
            <div className="flex items-center absolute rounded-l-md border border-l-0 border-stone-300 bg-stone-100 px-3 py-2.5 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
                <InstagramIcon/>
            </div>
            <input
              name="instagramLink"
              defaultValue={links?.instagramLink}
              type="text"
              placeholder="https://instagram.com/elon"
              
              className="w-full pl-20 py-3 rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
            />
          </div>
          <div className="w-[48%] mt-4">
            <h4 className="font-cal text-sm mb-1 font-medium dark:text-white">Github</h4>
            <div className="flex items-center absolute rounded-l-md border border-l-0 border-stone-300 bg-stone-100 px-3 py-2.5 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
                <GithubIcon/>
            </div>
            <input
              name="githubLink"
              defaultValue={links?.githubLink}
              type="text"
              placeholder="https://github.com/elonmusk"
              
              className="w-full pl-20 py-3 rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
            />
          </div>
          <div className="w-[48%] mt-4">
            <h4 className="font-cal text-sm mb-1 font-medium dark:text-white">Telegram</h4>
            <div className="flex items-center absolute rounded-l-md border border-l-0 border-stone-300 bg-stone-100 px-3 py-2.5 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
                <SendIcon/>
            </div>
            <input
              name="telegramLink"
              defaultValue={links?.telegramLink}
              type="text"
              placeholder="https://t.me/elonmusk"
              
              className="w-full pl-20 py-3 rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
            />
          </div>
          <div className="w-[48%] mt-4">
            <h4 className="font-cal text-sm mb-1 font-medium dark:text-white">LinkedIn</h4>
            <div className="flex items-center absolute rounded-l-md border border-l-0 border-stone-300 bg-stone-100 px-3 py-2.5 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
                <LinkedinIcon/>
            </div>
            <input
              name="linkedInLink"
              defaultValue={links?.LinkedInLink}
              type="text"
              placeholder="https://linkedin.com/elonmusk"
              
              className="w-full pl-20 py-3 rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
            />
          </div>
          <div className="w-[48%] mt-4">
            <h4 className="font-cal text-sm mb-1 font-medium dark:text-white">Email</h4>
            <div className="flex items-center absolute rounded-l-md border border-l-0 border-stone-300 bg-stone-100 px-3 py-2.5 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
                <MailIcon/>
            </div>
            <input
              name="email"
              defaultValue={links?.email}
              type="text"
              placeholder="elonmusk@gmail.com"
              
              className="w-full pl-20 py-3 rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
            />
          </div>
          <div className="w-[48%] mt-4">
            <h4 className="font-cal text-sm mb-1 font-medium dark:text-white">Youtube</h4>
            <div className="flex items-center absolute rounded-l-md border border-l-0 border-stone-300 bg-stone-100 px-3 py-2.5 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
                <YoutubeIcon/>
            </div>
            <input
              name="youtubeLink"
              defaultValue={links?.youtubeLink}
              type="text"
              placeholder="https://youtube.com/elonmusk"
              
              className="w-full pl-20 py-3 rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
            />
          </div>
          <div className="w-[48%] mt-4">
            <h4 className="font-cal text-sm mb-1 font-medium dark:text-white font">WhatsApp</h4>
            <div className="flex items-center absolute rounded-l-md border border-l-0 border-stone-300 bg-stone-100 px-3 py-2.5 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
                <MessageCircleIcon/>
            </div>
            <input
              name="whatsAppLink"
              defaultValue={links?.whatsAppLink}
              type="text"
              placeholder="+919000000000"
              
              className="w-full pl-20 py-3 rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
            />
          </div>
          <div className="w-[48%] mt-4">
            <h4 className="font-cal text-sm mb-1 font-medium dark:text-white">Website</h4>
            <div className="flex items-center absolute rounded-l-md border border-l-0 border-stone-300 bg-stone-100 px-3 py-2.5 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
                <LinkIcon/>
            </div>
            <input
              name="websiteLink"
              defaultValue={links?.websiteLink}
              type="text"
              placeholder="https://contentdrips.com"
              
              className="w-full pl-20 py-3 rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
        <p className="text-sm text-stone-500 dark:text-stone-400"></p>
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
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Save Changes</p>}
    </button>
  );
}
