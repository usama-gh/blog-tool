import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Subscribers from "@/components/subscribers";

async function Subscibers({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <div className="mb-5 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <div className="">
          <h1 className="font-inter truncate text-lg font-bold dark:text-white sm:w-auto sm:text-2xl">
            Subscribers
          </h1>
          <p className="mt-3 text-base font-normal text-slate-800 dark:text-gray-400">
            List of people who are subscribed to your posts
          </p>
        </div>
      </div>

      <Subscribers siteId={params.id} />
    </>
  );
}

export default Subscibers;
