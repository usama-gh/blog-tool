/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const runtime = "edge";

export default async function PostOG({
  params,
}: {
  params: { domain: string };
}) {
  const { domain } = params;

  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  const response = await sql`
  SELECT site.name, site.image,site.logo, "user".name as "authorName", "user".image as "authorImage"
  FROM "Site" AS site 
  INNER JOIN "User" AS "user" ON site."userId" = "user".id 
  WHERE site.subdomain = ${subdomain}
  LIMIT 1;
`;

  const data = response.rows[0];

  if (!data) {
    return new Response("Not found", { status: 404 });
  }

  const clashData = await fetch(
    new URL("@/styles/Inter-Bold.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
  (
        data.image !== "https://ige9ec25vizexnyy.public.blob.vercel-storage.com/WFClpH0wjj2gu1mBXIlms-MnS5yKErN4UsYCqCMs4tezoQ6G2IXS.png" ? (
          <div tw="h-full w-full">
            <img
              tw="w-full"
              src={data.image}
              alt={data.title}
            />
          </div>
        ) : (
          <div tw="flex flex-col bg-gradient-to-r from-slate-900 to-slate-700 justify-center items-start relative bg-slate-800  px-24">
            <span tw="absolute right-5 top-5  scale-50">
              <svg  width="153" height="153" viewBox="0 0 153 153" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M125.278 135.432C157.825 108.493 162.372 60.27 135.433 27.7226C108.494 -4.82479 60.2704 -9.37128 27.723 17.5677C-4.8244 44.5068 -9.37089 92.73 17.5681 125.277C44.5072 157.825 92.7304 162.371 125.278 135.432ZM54.5864 51.7648C51.1498 51.4408 48.1013 53.9641 47.7773 57.4006C47.4533 60.8371 49.9765 63.8857 53.4131 64.2097L86.9095 67.3677L83.7514 100.864C83.4274 104.301 85.9507 107.349 89.3872 107.673C92.8237 107.997 95.8723 105.474 96.1963 102.037L99.9409 62.3186C100.265 58.882 97.7417 55.8335 94.3052 55.5095L54.5864 51.7648Z" fill="#FBE54F" />
              </svg>
            </span>
            <span tw="absolute -left-8 scale-75 top-80">
              <svg width="105" height="62" viewBox="0 0 105 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M44.8378 58.5613C49.1057 62.7047 55.8943 62.7047 60.1622 58.5613L101.023 18.8924C108.111 12.0113 103.239 0 93.3607 0H11.6393C1.76064 0 -3.1108 12.0113 3.97706 18.8924L44.8378 58.5613Z" fill="#75FBF0" />
              </svg>
            </span>
            <div tw="flex gap-y-6 flex-col items-start justify-center mt-10 w-full relative">
              <div tw="flex items-center justify-center">
                <img
                  tw="w-8 h-8 rounded-full mr-4"
                  src={data.siteLogo}
                  alt={data.siteName}
                />
                <p tw="text-xl font-medium text-slate-400 uppercase">{data.siteName}</p>
              </div>
              <h1 tw="text-6xl font-bold text-slate-100 leading-none tracking-tight">
              {data.title}
              </h1>
              <div tw="flex items-end justify-between w-full">
                <div tw="mt-4 justify-center flex items-center bg-[#2dd4bf] shadow-[#2dd4bf30] px-6 shadow- py-2 text-lg font-bold text-slate-900 rounded-full shadow-xl">
                  Read Now
                </div>
              </div>
              <h3 tw="text-slate-500 text-xl font-bold tracking-normal uppercase absolute bottom-12 right-14">Typedd</h3>
            </div>
          </div>
        )
              
      // <div tw="flex flex-col items-center justify-center w-full min-h-screen bg-white">
      //   <div tw="flex flex-col items-center justify-center mt-8">
      //     <h1 tw="text-6xl font-bold text-gray-900 leading-none tracking-tight">
      //       {data.name}
      //     </h1>
      //     <div tw="flex items-center justify-center">
      //       <img
      //         tw="w-12 h-12 rounded-full mr-4"
      //         src={data.logo}
      //         alt={data.name}
      //       />
      //     </div>
      //     {data.image !==
      //       "https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/hxfcV5V-eInX3jbVUhjAt1suB7zB88uGd1j20b.png" && (
      //       <img
      //         tw="mt-4 w-5/6 rounded-2xl border border-gray-200 shadow-md"
      //         src={data.image}
      //         alt={data.name}
      //       />
      //     )}
      //   </div>
      // </div>
    ),
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: "Clash",
          data: clashData,
        },
      ],
      emoji: "blobmoji",
    },
  );
}
