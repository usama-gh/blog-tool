import Link from "next/link";
import { notFound } from "next/navigation";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import BlogCard from "@/components/blog-card";
import { getPostsForSite, getSiteData } from "@/lib/fetchers";
import Image from "next/image";

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
      <div className="h-full bg-gradient-to-b from-white to-[#F4F8FF] dark:bg-black dark:bg-none">
        <div className="ease left-0 right-0 w-full top-0 z-30 flex transition-all duration-150 dark:bg-black dark:text-white">
          <div className="mx-auto mt-[76px] md:w-2/6">
            <Link
              href="/"
              className="m-auto flex w-full flex-col items-center justify-center"
            >
              <div className="mb-5 h-84 w-84 overflow-hidden rounded-full align-middle">
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <g clip-path="url(#clip0_225_4)">
                    <path
                      d="M10.7443 0.511322C16.6786 0.511322 21.4887 5.32209 21.4887 11.2557C21.4887 17.19 16.6786 22 10.7443 22C4.81003 22 0 17.1899 0 11.2557C0 5.32209 4.81011 0.511322 10.7443 0.511322Z"
                      fill="#64748B"
                    />
                    <path
                      d="M12.0522 7.9081H13.4369V5.86264H11.8092V5.87002C9.8369 5.93987 9.43268 7.04853 9.39705 8.21296H9.393V9.23436H8.04999V11.2375H9.393V16.6069H11.417V11.2375H13.075L13.3952 9.23436H11.4177V8.61726C11.4177 8.22373 11.6795 7.9081 12.0522 7.9081Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_225_4">
                      <rect
                        width="21.4887"
                        height="21.4887"
                        fill="white"
                        transform="translate(0 0.511322)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  className="mx-1.5"
                >
                  <g clip-path="url(#clip0_225_8)">
                    <path
                      d="M16.1618 0.519989H5.46002C2.49489 0.519989 0.0750732 2.93981 0.0750732 5.90494V16.6237C0.0750732 19.5718 2.49489 21.9916 5.46002 21.9916H16.1788C19.1439 21.9916 21.5637 19.5718 21.5637 16.6067V5.90494C21.5467 2.93981 19.1269 0.519989 16.1618 0.519989ZM7.23228 17.9018H4.16491V9.04047H7.23228V17.9018ZM5.68155 7.6772C4.81246 7.6772 4.11378 6.97852 4.11378 6.10943C4.11378 5.24034 4.81246 4.54166 5.68155 4.54166C6.55064 4.54166 7.24932 5.24034 7.24932 6.10943C7.23228 6.97852 6.5336 7.6772 5.68155 7.6772ZM17.4739 17.9018H17.4569H14.9007V13.6075C14.9007 12.568 14.7644 11.2388 13.35 11.2388C11.9015 11.2388 11.6629 12.3635 11.6629 13.5393V17.9018H9.10679V9.04047H11.4925V10.2333H11.5607C11.9356 9.5517 12.8047 9.02343 14.168 9.02343C16.9797 9.02343 17.4739 10.6423 17.4739 13.0451V17.9018Z"
                      fill="#64748B"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_225_8">
                      <rect
                        width="21.4887"
                        height="21.4887"
                        fill="white"
                        transform="translate(0.0754395 0.511322)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <g clip-path="url(#clip0_225_12)">
                    <path
                      d="M21.1525 4.48936C20.815 4.63908 20.4679 4.76545 20.1132 4.86804C20.5331 4.39321 20.8532 3.83451 21.0486 3.22312C21.0924 3.08608 21.047 2.93607 20.9344 2.84644C20.8219 2.75675 20.6656 2.746 20.5417 2.81941C19.7886 3.2661 18.976 3.58711 18.124 3.77482C17.2658 2.93621 16.1001 2.45895 14.8951 2.45895C12.3515 2.45895 10.282 4.52831 10.282 7.07188C10.282 7.27221 10.2947 7.47143 10.3198 7.66788C7.16342 7.39074 4.22897 5.83933 2.21388 3.36751C2.14207 3.2794 2.03144 3.23192 1.91817 3.241C1.80484 3.24988 1.70301 3.31379 1.64575 3.41201C1.23705 4.1133 1.02098 4.91539 1.02098 5.73147C1.02098 6.84299 1.41783 7.8976 2.11885 8.72165C1.90569 8.64783 1.69885 8.55557 1.50143 8.44597C1.39544 8.38698 1.26609 8.38789 1.1608 8.44826C1.05544 8.50864 0.989376 8.61969 0.986603 8.74106C0.986118 8.76151 0.986118 8.78196 0.986118 8.80269C0.986118 10.4618 1.87908 11.9556 3.2443 12.7697C3.12701 12.758 3.0098 12.741 2.89334 12.7188C2.77328 12.6958 2.64983 12.7379 2.56886 12.8295C2.48776 12.921 2.46093 13.0485 2.4983 13.165C3.00363 14.7426 4.30466 15.9031 5.87749 16.2569C4.57299 17.074 3.08119 17.5019 1.51515 17.5019C1.18839 17.5019 0.859751 17.4827 0.538114 17.4447C0.378335 17.4257 0.225558 17.52 0.171143 17.672C0.116728 17.824 0.174401 17.9935 0.310334 18.0806C2.32216 19.3705 4.64841 20.0524 7.03747 20.0524C11.7341 20.0524 14.6721 17.8376 16.3098 15.9797C18.3519 13.663 19.5231 10.5966 19.5231 7.56674C19.5231 7.44017 19.5211 7.31234 19.5172 7.18494C20.3229 6.57792 21.0166 5.84328 21.5811 4.99891C21.6668 4.87068 21.6575 4.70119 21.5582 4.58314C21.459 4.46503 21.2937 4.42683 21.1525 4.48936Z"
                      fill="#64748B"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_225_12">
                      <rect
                        width="21.4887"
                        height="21.4887"
                        fill="white"
                        transform="translate(0.15155 0.511322)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </Link>
          </div>
        </div>

        <div className="w-full pb-16">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div
                key={`post-${index}`}
                className="ease md: mx-auto mb-5 w-100  max-w-screen-xl rounded-3xl border-2 border-stone-100 bg-white p-1
                shadow-[0_4px_22px_0px_rgba(148,163,184,0.17)] dark:overflow-hidden dark:border-stone-700 dark:bg-black md:w-3/6 lg:w-2/6"
              >
                <Link href={`/${post.slug}`}>
                  {index == 0 ? (
                    <div className="sm:h-120 group relative mx-auto h-52 w-full overflow-hidden rounded-3xl">
                      <BlurImage
                        alt={post.title ?? ""}
                        blurDataURL={
                          post.imageBlurhash ?? placeholderBlurhash
                        }
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
