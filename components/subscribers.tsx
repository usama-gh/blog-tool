import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import LeadCard from "./lead-card";
import DownloadSubscibers from "./download-subscribers";

async function Subscribers({
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

  const site = await prisma.site.findUnique({
    where: {
      id: siteId as string,
    },
  });

  if (!site) {
    notFound();
  }

  const subscribers = await prisma.subscriber.findMany({
    where: {
      siteId: siteId as string,
    },
    include: {
      site: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    ...(limit ? { take: limit } : {}),
  });

  return subscribers.length > 0 ? (
    <>
      <DownloadSubscibers
        subscribers={subscribers}
        name={site.name as string}
      />
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
                      #
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-6 py-3 text-start text-xs font-light uppercase tracking-widest text-slate-500 dark:text-gray-600"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-6 py-3 text-start text-xs font-light uppercase tracking-widest text-slate-500 dark:text-gray-600"
                    >
                      Subscribed On
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {subscribers.map((subscriber, index) => (
                    // @ts-ignore
                    <tr key={subscriber.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-300">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                        {subscriber.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                        {new Date(
                          subscriber.createdAt.toString(),
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="hide_onboarding flex flex-col items-center space-x-4">
      <h1 className="font-inter text-2xl">No Subscribers Yet</h1>
      <Image
        alt="missing post"
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any subscribers yet.
      </p>
    </div>
  );
}

export default Subscribers;
