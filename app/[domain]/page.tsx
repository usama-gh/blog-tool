import Link from "next/link";

import { notFound } from "next/navigation";
import { cn, isDefaultImage, r2Asset, toDateString } from "@/lib/utils";
import {
  getIntegrationsForSite,
  getLeadsForSite,
  getPostsForSite,
  getSiteData,
  getPagesForSite,
  getBannersForSite,
} from "@/lib/fetchers";
import Image from "next/image";
import { Subscribe } from "@/components/subscribe";
import parse from "html-react-parser";
import { Mail,ExternalLink } from "lucide-react";
import UserHeader from "@/components/user-header";
import UserFooter from "@/components/user-footer";

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const [data, posts, leads, pages, banners] = await Promise.all([
    getSiteData(params.domain),
    getPostsForSite(params.domain),
    getLeadsForSite(params.domain),
    getPagesForSite(params.domain),
    getBannersForSite(params.domain),
  ]);
  const imageSrc = isDefaultImage(posts[0]?.image) ? "" : posts[0]?.image || "";

  if (!data) {
    notFound();
  }

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <UserHeader data={data} pages={pages} slug="" />

        <div className="flex flex-wrap items-start gap-5 px-4 sm:flex-nowrap">
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

            {/* marketing banners */}
            <div>
              {banners.length > 0 && (
                <>
                  <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest  text-slate-600 dark:text-gray-500">
                    Links
                  </h3>

                  <div className="flex flex-col gap-y-5">
                    {banners.map((banner, index) => (
                      <div key={`lead-${index}`}>
                        <div className="group ease rounded-3xl  relative flex items-start bg-slate-100 p-2 transition-all hover:bg-slate-200  dark:bg-gray-700  hover:dark:bg-gray-600  md:w-full">
                          {banner.thumbnailFile && (
                            <Image
                              width={50}
                              height={50}
                              className=" group-hover:blur-sm rounded-lg object-cover"
                              src={r2Asset(banner.thumbnailFile)}
                              alt="Thumbnail"
                            />
                          )}
                          <div className="flex p-3 w-full flex-col items-start justify-center   text-left">

                          <ExternalLink
                  size={"1.5rem"}
                  strokeWidth={2}
                  className="mb-2 group-hover:blur-sm float-right absolute right-4 top-4 text-slate-400 dark:text-gray-100"
                />


                            <h2 className="group-hover:blur-sm text-base font-bold tracking-tight text-slate-600  dark:text-white ">
                              {banner.name}
                            </h2>

                            <span className="group-hover:blur-sm line-clamp-2 w-full text-sm leading-6 text-slate-500 dark:text-gray-300">
                              {parse(banner.body)}
                            </span>
                            
                          </div>

                            
                          {banner.showBtn && (
                            <div className="hidden group-hover:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <a
                                href={banner.btnLink!}
                                className="mt-2 w-auto rounded-full border border-slate-500 px-4 py-1 text-center text-sm text-slate-500 hover:border-slate-700 hover:text-slate-600 dark:border-gray-400 dark:bg-transparent dark:text-gray-400 dark:hover:border-gray-300 dark:hover:text-gray-300"
                              >
                                {banner.btnText}
                              </a>
                              </div>
                            )}
                           
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* latest lead resource */}
            <div>
              {leads.length > 0 && (
                <>
                  <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest  text-slate-600 dark:text-gray-500">
                    Latest Resources
                  </h3>

                  <div className="grid grid-cols-1">
                    {leads.map((lead, index) => (
                      <div key={`lead-${index}`}>
                        <Link href={`/resources/${lead.slug}`}>
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
                <p className="font-title text-2xl text-slate-600 dark:text-gray-400">
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
                  <p className="font-title text-2xl text-slate-600 dark:text-gray-400">
                    No posts yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* susbcribe to blog */}
        <UserFooter data={data} domain={params.domain} slug="" />
      </div>
    </>
  );
}
