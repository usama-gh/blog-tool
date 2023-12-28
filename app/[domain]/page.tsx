import Link from "next/link";
import { notFound } from "next/navigation";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import { getPostsForSite, getSiteData } from "@/lib/fetchers";
import Image from "next/image";
import SocialLinks from "@/components/social-links";
/* @ts-ignore*/
import { MarkdownRenderer } from "markdown-react-renderer";
import { Subscribe } from "@/components/subscribe";

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
          <div className="mx-auto py-12 md:w-2/6">
            <div className="m-auto flex w-full flex-col items-center justify-center">
              <div className="h-50 w-50 mb-5 overflow-hidden rounded-full align-middle">
                {data.logo ? (
                  <BlurImage
                    alt={data.user?.name ?? "User Avatar"}
                    width={50}
                    height={50}
                    className="h-full w-full object-cover"
                    src={data.logo}
                  />
                ) : (
                  <div className="absolute flex h-full w-full select-none items-center justify-center bg-slate-100 text-4xl text-stone-500">
                    ?
                  </div>
                )}
              </div>
              <h1 className="bg-gradient-to-br   from-slate-600 to-slate-600 bg-clip-text text-lg font-bold text-transparent dark:from-gray-50 dark:to-gray-500  dark:drop-shadow-md">
                {data.name}
              </h1>
              <div
                className="font-regular site-bio overflow-hidden text-md  "
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
            {/* susbcribe to blog */}
            <Subscribe siteId={data.id} />
          </div>
        </div>

        <div className="mx-auto w-full max-w-2xl px-2 pb-16">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div key={`post-${index}`}>
                <Link href={`/${post.slug}`}>
                  <div
                    className="ease mx-auto mb-5 max-w-screen-xl rounded-3xl  border border-slate-200 px-4 py-8 transition-all hover:border-slate-300 dark:overflow-hidden
               dark:border-gray-700 dark:bg-gray-800 dark:shadow-none dark:hover:border-gray-600 md:w-full"
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
                    <div className="m-auto flex w-full flex-col items-center justify-center gap-y-2 px-8 text-center">
                      <p className="m-auto text-sm tracking-normal text-slate-500 dark:text-gray-400">
                        {toDateString(post.createdAt, "long")}
                      </p>
                      <h2 className="text-2xl font-semibold tracking-tight text-slate-600  dark:text-white md:text-3xl">
                        {post.title}
                      </h2>
                      <p className="line-clamp-3 w-full text-base leading-6 text-slate-500 dark:text-gray-300">
                        {post.description}
                      </p>
                      <button className="mt-2 w-auto rounded-full border border-slate-500 px-4 py-2 text-center text-sm text-slate-500 hover:border-slate-700 hover:text-slate-600 dark:border-gray-600 dark:bg-transparent dark:text-gray-300 dark:hover:border-gray-300 dark:hover:text-gray-300">
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
    </>
  );
}
