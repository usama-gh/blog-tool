"use client";

import { Post } from "@prisma/client";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import { replaceLinks } from "@/lib/remark-plugins";
import { Tweet } from "react-tweet";
import BlurImage from "@/components/blur-image";
import styles from './mdx.module.css'

export default function MDX({ source, gated }: { source: MDXRemoteProps; gated?: boolean }) {
  const components = {
    a: replaceLinks,
    BlurImage,
    Examples,
    Tweet,
  };

  const pbClass = gated ? '' : 'pb-[120px] my-auto';




  return (
    <article
      className={`lg:px-0 px-6 prose-md w-full prose h-fit mx-auto prose-slate dark:prose-invert sm:prose-lg text-slate-600 dark:text-gray-100 tracking-normal ${pbClass} ${styles.root}`}
      suppressHydrationWarning={true}
    >
      <div className="pb-18 [&>h1]:mb-2 [&>h1]:tracking-tight [&>h1]:leading-snug [&>h2]:tracking-tight">
        {/* @ts-ignore */}
        <MDXRemote {...source} components={components}/>
      </div>
    </article>
  );
}
// export default function MDX({ source }: { source: MDXRemoteProps }) {
//   const components = {
//     a: replaceLinks,
//     BlurImage,
//     Examples,
//     Tweet,
//   };

//   return (
//     <article
//       className={`lg:px-0 px-6  prose-md w-full prose h-fit prose-slate my-auto dark:prose-invert sm:prose-lg text-slate-600 dark:text-gray-100 pb-[120px]  ${styles.root}`}
//       suppressHydrationWarning={true}
//     >
//       <div className=" pb-18">
//       {/* @ts-ignore */}
//       <MDXRemote {...source} components={components}/>

      
//       </div>
//     </article>
//   );
// }

interface ExampleCardProps
  extends Pick<Post, "description" | "image" | "imageBlurhash"> {
  name: string | null;
  url: string | null;
}

function Examples({ data }: { data: string }) {
  if (!data) return null;
  const parsedData = JSON.parse(data) as Array<ExampleCardProps>;
  return (
    <div className="not-prose my-10 grid grid-cols-1 gap-x-4 gap-y-4 lg:-mx-36 lg:mb-20 lg:grid-cols-3 lg:gap-y-8">
      {parsedData.map((d) => (
        <ExamplesCard data={d} key={d.name} />
      ))}
    </div>
  );
}

function ExamplesCard({ data }: { data: ExampleCardProps }) {
  return (
    <a href={`https://${data.url}`} target="_blank" rel="noreferrer">
      <div className="ease hidden rounded-2xl border-2 border-gray-100 bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl lg:block">
        <div className="overflow-hidden rounded-t-2xl">
          <BlurImage
            alt={data.name ?? "Card Thumbnail"}
            width={500}
            height={400}
            className="h-64 w-full object-cover"
            src={data.image ?? "/placeholder.png"}
            placeholder="blur"
            blurDataURL={data.imageBlurhash ?? undefined}
          />
        </div>
        <div className="h-36 px-5 py-6">
          <h3 className="truncate font-inter text-2xl font-bold tracking-wide">
            {data.name}
          </h3>
          <p className="mt-3 text-base italic leading-snug text-gray-800">
            {data.description}
          </p>
        </div>
      </div>
      <div className="ease flex h-36 items-center overflow-hidden rounded-xl border-2 border-gray-100 bg-white transition-all duration-200 focus:border-black active:border-black md:h-48 lg:hidden">
        <div className="relative h-full w-2/5">
          <BlurImage
            alt={data.name ?? "Card thumbnail"}
            width={500}
            height={400}
            className="h-full object-cover"
            src={`/examples/${data.image}`}
            placeholder="blur"
            blurDataURL={data.imageBlurhash ?? undefined}
          />
        </div>
        <div className="w-3/5 px-5 py-6">
          <h3 className="my-0 truncate font-inter text-xl font-bold tracking-wide dark:text-white">
            {data.name}
          </h3>
          <p className="mt-3 text-sm font-normal italic leading-snug text-gray-800">
            {data.description}
          </p>
        </div>
      </div>
    </a>
  );
}
