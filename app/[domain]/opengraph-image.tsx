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
      <div tw="flex flex-col items-center justify-center w-full min-h-screen bg-white">
        <div tw="flex flex-col items-center justify-center mt-8">
          <h1 tw="text-6xl font-bold text-gray-900 leading-none tracking-tight">
            {data.name}
          </h1>
          <div tw="flex items-center justify-center">
            <img
              tw="w-12 h-12 rounded-full mr-4"
              src={data.logo}
              alt={data.name}
            />
          </div>
          {data.image !==
            "https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/hxfcV5V-eInX3jbVUhjAt1suB7zB88uGd1j20b.png" && (
            <img
              tw="mt-4 w-5/6 rounded-2xl border border-gray-200 shadow-md"
              src={data.image}
              alt={data.name}
            />
          )}
        </div>
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
