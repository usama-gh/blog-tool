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
import { getLeadsForSite, getPostsForSite, getSiteData } from "@/lib/fetchers";
import Image from "next/image";
import SocialLinks from "@/components/social-links";
import { Subscribe } from "@/components/subscribe";
import parse from "html-react-parser";

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

  if (!data) {
    notFound();
  }

  return (
    <>
      <div className="mx-auto max-w-6xl">
        <div className="ease left-0 right-0 top-0 z-30 flex w-full transition-all duration-150 dark:bg-gray-800 dark:text-white">
          <div className="py-12 mx-auto max-w-3xl w-full text-center">
            <div>
              <div className="w-full flex flex-col items-center text-center justify-center gap-3">
                
             

                <div className=" text-center">
                  {data.logo ? (
                    <Image
                      alt={data.user?.name ?? "User Avatar"}
                      width={80}
                      height={80}
                      className="object-cover rounded-2xl mb-3"
                      src={data.logo}
                    />
                  ) : (
                    <div className="absolute flex h-full w-full select-none items-center justify-center bg-slate-100 text-4xl text-stone-500">
                      ?
                    </div>
                  )}
                </div>

                  <h1 className="bg-gradient-to-br from-slate-600 to-slate-600 bg-clip-text text-lg font-bold text-transparent dark:from-gray-50 dark:to-gray-500  dark:drop-shadow-md">
                    {data.name}
                  </h1>
                  {data?.bio && (
                    <div className="font-regular site-bio text-md text-center overflow-hidden">
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

        <div className="flex items-start gap-3">
        <div className="w-1/4">
          <div className="">
        
                <Subscribe siteId={data.id} view="homepage" />
                </div>
                </div>
              <div className="w-3/4">






              {posts.length > 0 ? (
          <div className="mx-auto w-full max-w-screen-xl md:mb-28 lg:w-5/6">

<div>
                <Link href={`/${posts[0].slug}`}>
                  <div
                    className="ease mb-5 rounded-3xl border border-slate-200 px-4 py-8 transition-all hover:border-slate-300 dark:overflow-hidden dark:border-gray-700 dark:bg-gray-800 dark:shadow-none dark:hover:border-gray-600 md:w-full"
                    style={{
                      backgroundImage: `url(${
                        !isDefaultImage(posts[0].image) ? posts[0].image : ""
                      })`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <div className="m-auto flex w-full flex-col items-center justify-center gap-y-2 px-8 text-center">
                      <p
                        className={cn(
                          "m-auto text-sm tracking-normal text-slate-500 dark:text-gray-400",
                          !isDefaultImage(posts[0].image) && "text-white",
                        )}
                      >
                        {toDateString(posts[0].createdAt, "long")}
                      </p>
                      <h2
                        className={cn(
                          "text-2xl font-semibold tracking-tight text-slate-600  dark:text-white md:text-3xl",
                          !isDefaultImage(posts[0].image) && "text-white",
                        )}
                      >
                        {posts[0].title}
                      </h2>
                      <p
                        className={cn(
                          "line-clamp-3 w-full text-base leading-6 text-slate-500 dark:text-gray-300",
                          !isDefaultImage(posts[0].image) && "text-white",
                        )}
                      >
                        {posts[0].description}
                      </p>
                      <button
                        className={cn(
                          "mt-2 w-auto rounded-full border border-slate-500 px-4 py-2 text-center text-sm text-slate-500 hover:border-slate-700 hover:text-slate-600 dark:border-gray-600 dark:bg-transparent dark:text-gray-300 dark:hover:border-gray-300 dark:hover:text-gray-300",
                          !isDefaultImage(posts[0].image) &&
                            "border-white bg-white text-black",
                        )}
                      >
                        Read More
                      </button>
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
      


        <div className="grid grid-cols-1 gap-4 px-2 pb-16 md:grid-cols-2">
          {posts.length > 0 ? (
            posts.slice(1).map((post, index) => (
              <div key={`post-${index}`}>
                <Link href={`/${post.slug}`}>
                  <div
                    className="ease mb-5 rounded-3xl border border-slate-200 px-4 py-8 transition-all hover:border-slate-300 dark:overflow-hidden dark:border-gray-700 dark:bg-gray-800 dark:shadow-none dark:hover:border-gray-600 md:w-full"
                    style={{
                      backgroundImage: `url(${
                        !isDefaultImage(post.image) ? post.image : ""
                      })`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <div className="m-auto flex w-full flex-col items-center justify-center gap-y-2 px-8 text-center">
                      <p
                        className={cn(
                          "m-auto text-sm tracking-normal text-slate-500 dark:text-gray-400",
                          !isDefaultImage(post.image) && "text-white",
                        )}
                      >
                        {toDateString(post.createdAt, "long")}
                      </p>
                      <h2
                        className={cn(
                          "text-2xl font-semibold tracking-tight text-slate-600  dark:text-white md:text-3xl",
                          !isDefaultImage(post.image) && "text-white",
                        )}
                      >
                        {post.title}
                      </h2>
                      <p
                        className={cn(
                          "line-clamp-3 w-full text-base leading-6 text-slate-500 dark:text-gray-300",
                          !isDefaultImage(post.image) && "text-white",
                        )}
                      >
                        {post.description}
                      </p>
                      <button
                        className={cn(
                          "mt-2 w-auto rounded-full border border-slate-500 px-4 py-2 text-center text-sm text-slate-500 hover:border-slate-700 hover:text-slate-600 dark:border-gray-600 dark:bg-transparent dark:text-gray-300 dark:hover:border-gray-300 dark:hover:text-gray-300",
                          !isDefaultImage(post.image) &&
                            "border-white bg-white text-black",
                        )}
                      >
                        Read More
                      </button>
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


      

        {leads.length > 0 && (
          <>
            <h3 className="mb-5 text-lg font-semibold tracking-tight  text-slate-600 dark:text-white md:text-xl">
              Latest Resources
            </h3>

            <div className="grid grid-cols-1 gap-4 px-2 pb-16 md:grid-cols-2">
              {leads.map((lead, index) => (
                <div key={`lead-${index}`}>
                  <Link href={`/resources/${lead.id}`}>
                    <div
                      className="ease mb-5 rounded-3xl border border-slate-200 px-4 py-8 transition-all hover:border-slate-300 dark:overflow-hidden dark:border-gray-700 dark:bg-gray-800 dark:shadow-none dark:hover:border-gray-600 md:w-full"
                      style={{
                        backgroundImage: `url(${
                          lead.thumbnailFile ? r2Asset(lead.thumbnailFile) : ""
                        })`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="m-auto flex w-full flex-col items-center justify-center gap-y-2 px-8 text-center">
                        <p
                          className={cn(
                            "m-auto text-sm tracking-normal text-slate-500 dark:text-gray-400",
                            lead.thumbnailFile && "text-white",
                          )}
                        >
                          {toDateString(lead.createdAt, "long")}
                        </p>
                        <h2
                          className={cn(
                            "text-2xl font-semibold tracking-tight text-slate-600  dark:text-white md:text-3xl",
                            lead.thumbnailFile && "text-white",
                          )}
                        >
                          {lead.title}
                        </h2>
                        <p
                          className={cn(
                            "line-clamp-3 w-full text-base leading-6 text-slate-500 dark:text-gray-300",
                            lead.thumbnailFile && "text-white",
                          )}
                        >
                          {lead.description}
                        </p>
                        <button
                          className={cn(
                            "mt-2 w-auto rounded-full border border-slate-500 px-4 py-2 text-center text-sm text-slate-500 hover:border-slate-700 hover:text-slate-600 dark:border-gray-600 dark:bg-transparent dark:text-gray-300 dark:hover:border-gray-300 dark:hover:text-gray-300",
                            lead.thumbnailFile &&
                              "border-white bg-white text-black",
                          )}
                        >
                          Read More
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

        {/* susbcribe to blog */}
        <div className="mb-10">
          <Subscribe siteId={data.id} />
        </div>
      </div>
    </>
  );
}
