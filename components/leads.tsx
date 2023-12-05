import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import LeadCard from "./lead-card";

async function LeadsTable({
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

  const leads = await prisma.lead.findMany({
    where: {
      userId: session.user.id as string,
      ...(siteId ? { siteId } : {}),
    },
    orderBy: {
      updatedAt: "desc",
    },
    ...(limit ? { take: limit } : {}),
    include: {
      posts: {
        select: {
          id: true,
          title: true,
        },
      },
      _count: {
        select: { LeadCollector: true },
      },
    },
  });

  return leads.length > 0 ? (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="inline-block min-w-full p-1.5 align-middle">
          <div className="overflow-hidden rounded-lg border dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500"
                  >
                    Compaign
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500"
                  >
                    Posts to appear in
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500"
                  >
                    Leads collected
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium uppercase text-gray-500"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {leads.map((lead) => (
                  // @ts-ignore
                  <LeadCard key={lead.id} lead={lead} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="hide_onboarding flex flex-col items-center space-x-4">
      <h1 className="font-inter text-2xl">No Leads Yet</h1>
      <Image
        alt="missing post"
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any leads yet. Create one to get started.
      </p>
    </div>
  );
}

export default LeadsTable;
