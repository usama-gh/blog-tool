import Link from "next/link";
import { notFound } from "next/navigation";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import BlogCard from "@/components/blog-card";
import { getPostsForSite, getSiteData } from "@/lib/fetchers";
import Image from "next/image";
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

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const [data, posts] = await Promise.all([
    getSiteData(params.domain),
    getPostsForSite(params.domain),
  ]);

  const links = data?.links ? JSON.parse(data?.links) : {};

  if (!data) {
    notFound();
  }

  return (
    <>
      <div className="h-full bg-gradient-to-b from-white to-[#F4F8FF] dark:bg-black dark:bg-none">
        <div className="ease left-0 right-0 top-0 z-30 flex w-full transition-all duration-150 dark:bg-black dark:text-white">
          <div className="mx-auto mt-[76px] md:w-2/6">
            <Link
              href="/"
              className="m-auto flex w-full flex-col items-center justify-center"
            >
              <div className="h-84 w-84 mb-5 overflow-hidden rounded-full align-middle">
                {data.user?.image ? (
                  <BlurImage
                    alt={data.user?.name ?? "User Avatar"}
                    width={84}
                    height={84}
                    className="h-full w-full object-cover"
                    src={data.user?.image}
                  />
                ) : (
                  <div className="absolute flex h-full w-full select-none items-center justify-center bg-stone-100 text-4xl text-stone-500">
                    ?
                  </div>
                )}
              </div>
              <h3 className="mb-2.5 font-cal text-2xl font-semibold text-slate-600">
                {data.name}
              </h3>
              <p
                className="overflow-hidden text-ellipsis text-center text-xl font-semibold text-slate-500"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {data.description}
              </p>
              <div className="mb-16 mt-5 flex items-center justify-center">
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
            </Link>
          </div>
        </div>

        <div className="w-full pb-16">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div
                key={`post-${index}`}
                className="ease md: w-100 mx-auto mb-5  max-w-screen-xl rounded-3xl border-2 border-stone-100 bg-white p-1
                shadow-[0_4px_22px_0px_rgba(148,163,184,0.17)] dark:overflow-hidden dark:border-stone-700 dark:bg-black md:w-3/6 lg:w-2/6"
              >
                <Link href={`/${post.slug}`}>
                  {index == 0 ? (
                    <div className="sm:h-120 group relative mx-auto h-52 w-full overflow-hidden rounded-3xl">
                      <BlurImage
                        alt={post.title ?? ""}
                        blurDataURL={post.imageBlurhash ?? placeholderBlurhash}
                        className="h-full w-full object-cover group-hover:scale-105 group-hover:duration-300"
                        width={700}
                        height={300}
                        placeholder="blur"
                        src={post.image ?? "/placeholder.png"}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className="m-auto w-full px-8 text-center">
                    <p className="m-auto mt-7 text-xs font-semibold text-slate-400 dark:text-stone-400">
                      {toDateString(post.createdAt, "long")}
                    </p>
                    <h2 className="mt-1 text-xl font-medium text-slate-600 dark:text-white">
                      {post.title}
                    </h2>
                    <p className="mb-8 mt-1.5 w-full text-base text-slate-500 dark:text-stone-400">
                      {post.description}
                    </p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <Image
                alt="missing post"
                src="https://illustrations.popsy.co/gray/success.svg"
                width={400}
                height={400}
                className="dark:hidden"
              />
              <Image
                alt="missing post"
                src="https://illustrations.popsy.co/white/success.svg"
                width={400}
                height={400}
                className="hidden dark:block"
              />
              <p className="font-title text-2xl text-stone-600 dark:text-stone-400">
                No posts yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
