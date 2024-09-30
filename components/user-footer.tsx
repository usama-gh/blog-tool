import React from "react";
import Image from "next/image";
import { Subscribe } from "@/components/subscribe";
import parse from "html-react-parser";
import SocialLinks from "@/components/social-links";

export default function UserFooter({
  data,
  domain,
  slug,
}: {
  data: any;
  domain: string;
  slug: string;
}) {
  return (
    <>
      {/* only show bio and social links on footer on static pages */}
      {slug !== "" && (
        <div className="mb-5">
          {data?.bio && (
            <div className="font-regular site-bio text-md overflow-hidden text-center">
              {parse(data.bio)}
            </div>
          )}

          <SocialLinks linksData={data.links} />
        </div>
      )}
      <div className="mx-4 mb-10 rounded-3xl bg-teal-100 py-16 text-center dark:bg-teal-700">
        <div className=" mx-auto mb-4 text-center">
          {data.logo ? (
            <Image
              alt={data.user?.name ?? "User Avatar"}
              width={80}
              height={80}
              className="mx-auto rounded-full object-cover shadow-xl"
              src={data.logo}
            />
          ) : (
            <div className="absolute flex h-full w-full select-none items-center justify-center bg-slate-100 text-4xl text-stone-500">
              ?
            </div>
          )}
        </div>

        <h2 className="mb-2 text-3xl font-bold text-teal-700 dark:text-teal-50">
          Subscribe to my newsletter
        </h2>
        <Subscribe
          siteId={data.id}
          view="homepage"
          searchKey={domain}
          type="domain"
        />
      </div>
    </>
  );
}
