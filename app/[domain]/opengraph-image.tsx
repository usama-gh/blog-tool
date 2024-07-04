/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from "next/og";
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
  WHERE 
  (
      site.subdomain = ${subdomain}
      OR site."customDomain" = ${domain}
  )
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
      <div style={{background:'linear-gradient(90deg, #0f172a, #334155)'}}  tw="flex flex-col w-full h-screen justify-center items-center relative px-24">
        <div tw="flex gap-y-6 flex-col items-center justify-center w-full relative">
          <div tw="flex items-center justify-center">
            <img
              tw="w-24 h-24 mb-2 rounded-full"
              src={data.logo}
              alt={data.siteName}
            />
          </div>

          <h1 style={{
  background: 'linear-gradient(to top right, #ffffff, #7989a1)',
 backgroundClip: 'text',
color: 'transparent',
}}
 tw="text-6xl font-bold leading-none tracking-tight">
           {data.name}
         </h1>
        
       
        </div>


        <h3 tw="absolute bottom-4 text-slate-500  text-xl font-bold tracking-wide uppercase text-center mt-10">
          Typedd.com
        </h3>
        
      </div>
    ),
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
    //   </div>
    // </div>
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
