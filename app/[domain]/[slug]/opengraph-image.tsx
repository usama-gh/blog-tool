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
      
            <div tw="flex h-screen  gap-y-6 flex-col items-start justify-center mt-10 w-full relative">
              <div tw="flex items-center justify-center">
                <img
                  tw="w-8 h-8 rounded-full mr-4"
                  src={data.siteLogo}
                  alt={data.siteName}
                />
                <p tw="text-xl font-medium text-white uppercase">{data.siteName}</p>
              </div>
              <h1 tw="text-6xl font-bold text-white leading-none tracking-tight">
              {data.title}
              </h1>
              <div tw="flex items-end justify-between w-full">
                <div tw="mt-4 justify-center flex items-center bg-white px-6 shadow-lg py-2 text-lg font-bold text-gray-900 rounded-full shadow-xl">
                  Read Now
                </div>
              </div>
              <h3 tw="text-white text-xl font-bold tracking-normal uppercase absolute bottom-12 right-14">Typedd</h3>
            </div>
       
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
