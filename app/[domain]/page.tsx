import Link from "next/link";
import { notFound } from "next/navigation";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import { getPostsForSite, getSiteData } from "@/lib/fetchers";
import Image from "next/image";
import SocialLinks from "@/components/social-links";
/* @ts-ignore*/
import { MarkdownRenderer } from "markdown-react-renderer";

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const [data, posts] = await Promise.all([
    getSiteData(params.domain),
    getPostsForSite(params.domain),
  ]);

  if (!data) {
    notFound();
  }

  return (
    <>
      <div className="">
        <div className="ease left-0 right-0 top-0 z-30 flex w-full transition-all duration-150 dark:bg-gray-800 dark:text-white">
          <div className="mx-auto mt-[76px] md:w-2/6">
            <div className="m-auto flex w-full flex-col items-center justify-center">
              <div className="h-50 w-50 mb-5 overflow-hidden rounded-full align-middle">
                {data.user?.image ? (
                  <BlurImage
                    alt={data.user?.name ?? "User Avatar"}
                    width={50}
                    height={50}
                    className="h-full w-full object-cover"
                    src={data.user?.image}
                  />
                ) : (
                  <div className="absolute flex h-full w-full select-none items-center justify-center bg-stone-100 text-4xl text-stone-500">
                    ?
                  </div>
                )}
              </div>
              <h1 className="mb-2.5 text-sm font-semibold tracking-widest text-slate-600 dark:text-gray-200 lg:text-lg">
                {data.name}
              </h1>
              <div
                className="font-regular site-bio overflow-hidden text-slate-500 dark:text-gray-200"
                // style={{
                //   display: "-webkit-box",
                //   WebkitLineClamp: 2,
                //   WebkitBoxOrient: "vertical",
                // }}
              >
                {/* @ts-ignore*/}
                <MarkdownRenderer markdown={data?.bio} />
              </div>
              <SocialLinks linksData={data.links} />
            </div>
          </div>
        </div>

        <div className="w-full px-2 pb-16 pt-16 max-w-2xl mx-auto">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div key={`post-${index}`}>
                <Link href={`/${post.slug}`}>
                  <div
                    className="ease transition-all md:w-full mx-auto mb-5  max-w-screen-xl rounded-3xl border border-slate-200 hover:border-slate-300 px-4 py-8
               dark:overflow-hidden dark:border-gray-700 dark:bg-gray-800 dark:shadow-none dark:hover:border-gray-600"
                  >
                    {/* {index == 0 ? (
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
                  )} */}
                    <div className="m-auto w-full px-8 text-center flex flex-col justify-center items-center gap-y-2">
                      <p className="m-auto text-sm tracking-normal text-slate-500 dark:text-gray-400">
                        {toDateString(post.createdAt, "long")}
                      </p>
                      <h2 className="text-2xl md:text-3xl tracking-tight font-semibold  text-slate-600 dark:text-white">
                        {post.title}
                      </h2>
                      <p className="w-full leading-6 text-base text-slate-500 dark:text-gray-300">
                        {post.description}
                      </p>
                      <button  className="mt-2 w-auto text-center text-sm px-4 py-2 rounded-full dark:bg-transparent border border-slate-500 text-slate-500 dark:border-gray-600 hover:text-slate-600 hover:border-slate-700 dark:text-gray-300">Read More</button>
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
    </>
  );
}
