import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

import Image from "next/image";
import PageCard from "./page-card";
import { getUserStaticPages } from "@/lib/fetchers";
import { notFound } from "next/navigation";

export default async function PagesTable({
  siteId,
  limit,
}: {
  siteId?: string;
  limit?: number;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const data = await prisma.site.findUnique({
    where: {
      id: siteId,
    },
  });

  if (!data) {
    notFound();
  }

  const siteURL = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${siteURL}`
    : `http://${data.subdomain}.localhost:3000`;

  const pages = await getUserStaticPages(siteId!);

  return pages.length > 0 ? (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="inline-block min-w-full p-1.5 align-middle">
          <div className="overflow-hidden rounded-lg border dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-6 py-3 text-start text-xs font-light uppercase tracking-widest text-slate-500 dark:text-gray-600"
                  >
                    Page Name
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-6 py-3 text-start text-xs font-light uppercase tracking-widest text-slate-500 dark:text-gray-600"
                  >
                    Url
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-6 py-3 text-start text-xs font-light uppercase tracking-widest text-slate-500 dark:text-gray-600"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-6 py-3 text-start text-xs font-light uppercase tracking-widest text-slate-500 dark:text-gray-600"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {pages.map((page) => (
                  // @ts-ignore
                  <PageCard key={page.id} baseUrl={baseUrl} page={page} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="hide_onboarding flex flex-col items-center space-x-4">
      <h1 className="font-inter text-2xl">No Static Page Yet</h1>
      <Image
        alt="missing post"
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any static page created yet. Create one to get started.
      </p>
    </div>
  );
}
