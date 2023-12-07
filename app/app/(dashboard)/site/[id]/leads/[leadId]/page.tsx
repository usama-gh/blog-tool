import LeadCollectors from "@/components/collectors";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export default async function Lead({ params }: { params: { leadId: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const lead = await prisma.lead.findUnique({
    where: {
      id: params.leadId,
    },
    include: {
      LeadCollector: {
        include: {
          post: true,
        },
      },
    },
  });

  if (!lead || lead.userId !== session.user.id) {
    notFound();
  }

  return (
    <>
      <div className="mb-5 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <div className="">
          <h1 className="font-inter truncate text-lg font-bold dark:text-white sm:w-auto sm:text-2xl">
            {lead.name}
          </h1>
          <p className="mt-3 text-base font-normal text-slate-800 dark:text-gray-600">
            Leads collected from your resources
          </p>
        </div>
      </div>
      {/* @ts-ignore */}
      <LeadCollectors collectors={lead.LeadCollector} />
    </>
  );
}
