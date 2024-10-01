import Image from "next/image";
import React from "react";
import parse from "html-react-parser";
import SocialLinks from "@/components/social-links";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Page } from "@prisma/client";
import { cn } from "@/lib/utils";

export default function UserHeader({
  data,
  pages,
  slug,
}: {
  data: any;
  pages: Page[];
  slug: string;
}) {
  const url = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${url}`
    : `http://${data.subdomain}.localhost:3000`;

  return (
    <>
      <div className="ease left-0 right-0 top-0 z-30 flex w-full transition-all duration-150 dark:bg-gray-800 dark:text-white">
        <div className="mx-auto w-full max-w-3xl py-12 text-center">
          <div>
            <div className="flex w-full flex-col items-center justify-center gap-3 px-4 text-center">
              <div className="text-center">
                {data.logo ? (
                  <Image
                    alt={data.user?.name ?? "User Avatar"}
                    width={80}
                    height={80}
                    className="mb-3 rounded-3xl object-cover"
                    src={data.logo}
                  />
                ) : (
                  <div className="absolute flex h-full w-full select-none items-center justify-center bg-slate-100 text-4xl text-stone-500">
                    ?
                  </div>
                )}
              </div>

              <h1 className="bg-gradient-to-br from-slate-600 to-slate-600 bg-clip-text font-title text-lg font-bold text-transparent dark:from-gray-50 dark:to-gray-500  dark:drop-shadow-md">
                {data.name}
              </h1>
              {/* only show bio and social links on homepage */}
              {slug === "" && (
                <>
                  {data?.bio && (
                    <div className="font-regular site-bio text-md overflow-hidden text-center">
                      {parse(data.bio)}
                    </div>
                  )}

                  <SocialLinks linksData={data.links} />
                </>
              )}
            </div>

            {/* susbcribe to blog */}
            <div className="w-1/4 ">{/* <Subscribe siteId={data.id} /> */}</div>

            {/* show pages menu */}


            
          

{pages.length > 0 && (
  <nav className="flex justify-center items-center p-4">
    <div className="border border-slate-300 rounded-full">
      <ul className="flex items-center divide-x divide-slate-300 px-3 py-1">
        <li className="px-3 first:pl-0 last:pr-0">
          <Link href={baseUrl} passHref legacyBehavior>
            <a
              className={`text-slate-500 hover:text-slate-800 transition-colors duration-200 ${
                !slug ? "text-slate-700 rounded-full" : ""
              }`}
            >
              Home
            </a>
          </Link>
        </li>
        {pages.map((page: Page) => (
          <li key={page.id} className="px-3 first:pl-0 last:pr-0">
            <Link href={`${baseUrl}/page/${page.slug}`} passHref legacyBehavior>
              <a
                className={`text-slate-500 hover:text-slate-800 transition-colors duration-200 ${
                  page.slug === slug ? "text-slate-700 rounded-full" : ""
                }`}
              >
                {page.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </nav>
)}



          </div>
        </div>
      </div>
    </>
  );
}
