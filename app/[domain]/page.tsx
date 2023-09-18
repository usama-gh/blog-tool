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
      <div className="h-full bg-gradient-to-b from-white to-[#F4F8FF] dark:bg-gray-800 dark:bg-none">
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
              <h3 className="mb-2.5 text-lg font-light tracking-widest text-slate-600 dark:text-gray-200">
                {data.name}
              </h3>
              <div
                className="font-regular site-bio overflow-hidden text-slate-500 dark:text-gray-200"
                // style={{
                //   display: "-webkit-box",
                //   WebkitLineClamp: 2,
                //   WebkitBoxOrient: "vertical",
                // }}
              >
                {/* @ts-ignore*/}
                <MarkdownRenderer markdown={data.bio} />
              </div>
              <SocialLinks linksData={data.links} />
            </div>
          </div>
        </div>

        <div className="w-full pb-16 pt-16">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div key={`post-${index}`}>
                <Link href={`/${post.slug}`}>
                  <div
                    className="ease md: w-100 mx-auto mb-5  max-w-screen-xl rounded-3xl border border-stone-100 bg-white p-1
                shadow-[0_0px_13px_0px_rgba(148,163,184,0.12)] dark:overflow-hidden dark:border-gray-700 dark:bg-gray-800 dark:shadow-none md:w-3/6 lg:w-2/6"
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
                    <div className="m-auto w-full px-8 text-center">
                      <p className="m-auto mt-7 text-xs font-semibold text-slate-400 dark:text-gray-500">
                        {toDateString(post.createdAt, "long")}
                      </p>
                      <h2 className="mt-1 text-xl font-medium text-slate-600 dark:text-white">
                        {post.title}
                      </h2>
                      <p className="mb-8 mt-1.5 w-full text-base text-slate-500 dark:text-gray-400">
                        {post.description}
                      </p>
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
