import Link from "next/link";

import { notFound } from "next/navigation";
import BlurImage from "@/components/blur-image";
import {
  cn,
  isDefaultImage,
  placeholderBlurhash,
  r2Asset,
  toDateString,
} from "@/lib/utils";
import {
  getIntegrationsForSite,
  getLeadsForSite,
  getPostsForSite,
  getSiteData,
} from "@/lib/fetchers";
import Image from "next/image";
import SocialLinks from "@/components/social-links";
import { Subscribe } from "@/components/subscribe";
import parse from "html-react-parser";

import { Mail } from "lucide-react";

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const [data, posts, leads] = await Promise.all([
    getSiteData(params.domain),
    getPostsForSite(params.domain),
    getLeadsForSite(params.domain),
  ]);
  const imageSrc = isDefaultImage(posts[0]?.image) ? "" : posts[0]?.image || "";

  if (!data) {
    notFound();
  }

  return (
    <>
      <div className="mx-auto max-w-6xl">
        <div className="ease left-0 right-0 top-0 z-30 flex w-full transition-all duration-150 dark:bg-gray-800 dark:text-white">
          <div className="mx-auto w-full max-w-3xl py-12 text-center">
            <div>
              <div className="flex w-full flex-col items-center justify-center gap-3 px-4 text-center">
                <div className=" text-center">
                  {data.logo ? (
                    <Image
                      alt={data.user?.name ?? "User Avatar"}
                      width={80}
                      height={80}
                      className="mb-3 rounded-3xl object-cover"
                      src={data.logo}
                    />
                  ) : (
                    <div className="absolute flex h-full w-full select-none items-center justify-center bg-slate-100 text-4xl text-stone-500">
                      ?
                    </div>
                  )}
                </div>

                <h1 className="font-title bg-gradient-to-br from-slate-600 to-slate-600 bg-clip-text text-lg font-bold text-transparent dark:from-gray-50 dark:to-gray-500  dark:drop-shadow-md">
                  {data.name}
                </h1>
                {data?.bio && (
                  <div className="font-regular site-bio text-md overflow-hidden text-center">
                    {parse(data.bio)}
                  </div>
                )}

                <SocialLinks linksData={data.links} />
              </div>
              {/* susbcribe to blog */}
              <div className="w-1/4 ">
                {/* <Subscribe siteId={data.id} /> */}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-5 px-4 sm:flex-nowrap	">
          <div className="flex w-full flex-col gap-y-5 sm:w-1/4">
            <div className="rounded-3xl bg-teal-100 py-6 text-left dark:bg-teal-700">
              <div className="px-6">
                <Mail
                  size={"2.5rem"}
                  strokeWidth={0.9}
                  className="mb-2 text-teal-700 dark:text-teal-100"
                />
              </div>

              <Subscribe
                siteId={data.id}
                view="homepage"
                searchKey={params.domain}
                type="domain"
              />
            </div>

            <div>
              {leads.length > 0 && (
                <>
                  <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest  text-slate-600 dark:text-gray-500">
                    Latest Resources
                  </h3>

                  <div className="grid grid-cols-1">
                    {leads.map((lead, index) => (
                      <div key={`lead-${index}`}>
                        <Link href={`/resources/${lead.id}`}>
                          <div className="ease mb-5 rounded-3xl bg-slate-100 p-6 transition-all hover:bg-slate-200  dark:bg-gray-700  hover:dark:bg-gray-600  md:w-full">
                            {lead.thumbnailFile && (
                              <Image
                                width={80}
                                height={80}
                                className="mb-3 rounded-lg object-cover"
                                src={r2Asset(lead.thumbnailFile)}
                                alt="Thumbnail"
                              />
                            )}

                            <div className="flex w-full flex-col items-start justify-center gap-y-2  text-left">
                              <h2 className="text-xl font-bold tracking-tight text-slate-600  dark:text-white ">
                                {lead.title}
                              </h2>

                              {lead.heroDescription && (
                                <span className="line-clamp-3 w-full text-base leading-6 text-slate-500 dark:text-gray-300">
                                  {parse(lead.heroDescription)}
                                </span>
                              )}

                              <button className="mt-2 w-auto rounded-full border border-slate-500 px-4 py-1 text-center text-sm text-slate-500 hover:border-slate-700 hover:text-slate-600 dark:border-gray-400 dark:bg-transparent dark:text-gray-400 dark:hover:border-gray-300 dark:hover:text-gray-300">
                                View
                              </button>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="w-full sm:w-3/4">
            {posts.length > 0 ? (
              <div className="">
                <div>
                  <Link href={`/${posts[0].slug}`}>
                    <div className="ease relative mb-5  h-[30rem]   overflow-hidden rounded-3xl bg-slate-100	 p-6  transition-all hover:bg-slate-200 dark:bg-gray-700 hover:dark:bg-gray-600  md:w-full">
                      {!isDefaultImage(posts[0].image) && (
                        <Image
                          src={imageSrc}
                          alt="Post Image"
                          layout="fill"
                          objectFit="cover"
                          objectPosition="center"
                          quality={100}
                          className="absolute left-0 top-0 z-0"
                        />
                      )}

                      {!isDefaultImage(posts[0].image) && (
                        <div className="absolute left-0 top-0 z-20 h-full w-full bg-gradient-to-t from-black  via-[#0000008c] to-transparent"></div>
                      )}

                      <div className="flex h-full flex-col items-end justify-between">
                        <div>
                          <button
                            className={cn(
                              "text-md relative z-20 rounded-full border px-4 py-1 text-center",
                              isDefaultImage(posts[0].image)
                                ? "border-slate-500 text-slate-500 hover:border-slate-700 hover:text-slate-600 dark:border-gray-400 dark:bg-transparent dark:text-gray-400 dark:hover:border-gray-300 dark:hover:text-gray-300"
                                : "border-white bg-white text-black",
                            )}
                          >
                            Read More
                          </button>
                        </div>
                        <div className="relative z-30 flex w-full flex-col items-start justify-start gap-y-2 text-left">
                          <p
                            className={cn(
                              "text-base tracking-normal text-slate-500 dark:text-gray-400",
                              !isDefaultImage(posts[0].image) && "text-white",
                            )}
                          >
                            {toDateString(posts[0].createdAt, "long")}
                          </p>
                          <h2
                            className={cn(
                              "max-w-4xl text-2xl font-semibold tracking-tight text-slate-600  dark:text-white md:text-3xl",
                              !isDefaultImage(posts[0].image) && "text-white",
                            )}
                          >
                            {posts[0].title}
                          </h2>
                          <p
                            className={cn(
                              "line-clamp-3 w-full max-w-2xl text-lg leading-6 text-slate-500 dark:text-gray-300",
                              !isDefaultImage(posts[0].image) && "text-white",
                            )}
                          >
                            {posts[0].description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
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

            <div className="grid grid-cols-1 gap-5 pb-16 md:grid-cols-2">
              {posts.length > 0 ? (
                posts.slice(1).map((post, index) => (
                  <div key={`post-${index}`}>
                    <Link href={`/${post.slug}`}>
                      <div className="ease relative h-[19.5rem] overflow-hidden rounded-3xl bg-slate-100 p-6 transition-all hover:bg-slate-200 dark:bg-gray-700 hover:dark:bg-gray-600 md:w-full">
                        {!isDefaultImage(post.image) && post.image && (
                          <div>
                            <Image
                              src={post.image}
                              alt="Post Image"
                              layout="fill"
                              objectFit="cover"
                              objectPosition="center"
                              quality={100}
                              className="absolute left-0 top-0 z-0"
                            />
                            <div className="absolute left-0 top-0 z-20 h-full w-full bg-gradient-to-t from-black  via-[#0000008c] to-transparent"></div>
                          </div>
                        )}

                        <div className="flex h-full flex-col justify-between">
                          <div className="relative z-20 flex justify-end">
                            <button
                              className={cn(
                                "rounded-full border px-4 py-1 text-center text-sm",
                                isDefaultImage(post.image)
                                  ? "border-slate-500 text-slate-500 hover:border-slate-700 hover:text-slate-600 dark:border-gray-400 dark:bg-transparent dark:text-gray-400 dark:hover:border-gray-300 dark:hover:text-gray-300"
                                  : "border-white bg-white text-black",
                              )}
                            >
                              Read More
                            </button>
                          </div>
                          <div className="flex items-end justify-start">
                            <div className="relative z-30 flex w-full flex-col items-start justify-start gap-y-2 text-left">
                              <p
                                className={cn(
                                  "text-sm tracking-normal text-slate-500 dark:text-gray-400",
                                  !isDefaultImage(post.image) && "text-white",
                                )}
                              >
                                {toDateString(post.createdAt, "long")}
                              </p>
                              <h2
                                className={cn(
                                  "text-lg font-semibold tracking-tight text-slate-600  dark:text-white md:text-2xl",
                                  !isDefaultImage(post.image) && "text-white",
                                )}
                              >
                                {post.title}
                              </h2>
                              <p
                                className={cn(
                                  "leading-2 line-clamp-2 w-full text-sm text-slate-500 dark:text-gray-300",
                                  !isDefaultImage(post.image) && "text-white",
                                )}
                              >
                                {post.description}
                              </p>
                            </div>
                          </div>
                        </div>
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
        </div>

        {/* susbcribe to blog */}

        <div></div>
        <div className="mx-4 mb-10 rounded-3xl bg-teal-100 py-16 text-center dark:bg-teal-700">
          <div className=" mx-auto mb-4 text-center">
            {data.logo ? (
              <Image
                alt={data.user?.name ?? "User Avatar"}
                width={80}
                height={80}
                className="mx-auto rounded-full object-cover shadow-xl"
                src={data.logo}
              />
            ) : (
              <div className="absolute flex h-full w-full select-none items-center justify-center bg-slate-100 text-4xl text-stone-500">
                ?
              </div>
            )}
          </div>

          <h2 className="mb-2 text-3xl font-bold text-teal-700 dark:text-teal-50">
            Subscribe to my newsletter
          </h2>
          <Subscribe
            siteId={data.id}
            view="homepage"
            searchKey={params.domain}
            type="domain"
          />
        </div>
      </div>
    </>
  );
}
