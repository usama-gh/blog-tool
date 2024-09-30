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
              <div className="mt-5 flex items-center justify-center border-y py-1">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <Link href={baseUrl} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Home
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    {pages.map((page: Page) => (
                      <NavigationMenuItem key={page.id} className="">
                        <Link
                          href={`${baseUrl}/page/${page.slug}`}
                          legacyBehavior
                          passHref
                          className=""
                        >
                          <NavigationMenuLink
                            className={cn(
                              navigationMenuTriggerStyle(),
                              page.slug === slug &&
                                "!bg-accent !text-accent-foreground",
                            )}
                          >
                            {page.name}
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
