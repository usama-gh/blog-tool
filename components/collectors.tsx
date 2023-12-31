import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import DownloadLead from "./download-lead";
import { Collector } from "@/types";

export default async function LeadCollectors({
  collectors,
  name,
}: {
  collectors: Collector[] | [];
  name: string;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  return collectors.length > 0 ? (
    <>
      <DownloadLead collectors={collectors} name={name} />
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="inline-block min-w-full p-1.5 align-middle">
            <div className="overflow-hidden rounded-lg border dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-light uppercase tracking-widest text-slate-500 dark:text-gray-600"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-light uppercase tracking-widest text-slate-500 dark:text-gray-600"
                    >
                      Post's Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-light uppercase tracking-widest text-slate-500 dark:text-gray-600"
                    >
                      Collected At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {collectors.map((collector) => (
                    <tr key={collector.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                        {collector.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                        {collector.post?.title}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                        {new Date(
                          collector.createdAt.toString(),
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
      <h1 className="font-inter text-2xl">No Collector Yet</h1>
      <Image
        alt="missing post"
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">This lead has no collector yet.</p>
    </div>
  );
}
