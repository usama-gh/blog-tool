
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import PaddleLoader from "@/components/paddle/paddleLoader";
import Plans from "@/components/plans";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <PaddleLoader />
      <div className="flex max-w-screen-xl flex-col  p-8">
        <h1 className="font-cal text-3xl font-bold dark:text-white">Upgrade</h1>
        <h2 className="mt-4 text-2xl dark:text-white">
          Enjoy all benefits of SlideBites with just one time payment
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Plans></Plans>
          <div className="relative rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
            <div className="flex justify-between border-b border-stone-200 p-8 dark:border-stone-700">
              <div className="flex flex-col">
                <h4 className="text-2xl font-bold dark:text-white">Starter</h4>
                <span className="text-[x-small] text-stone-200 dark:text-white">
                  Pay Once
                </span>
              </div>
              <p className="text-3xl text-gray-500 dark:text-white">$0</p>
            </div>
            <div className="p-8">
              <ul className="ml-5 list-disc dark:text-white">
                <li className="mb-1">5000 views per month</li>
                <li className="mb-1">1 website</li>
                <li className="mb-1">
                  Import Twitter threads, LinkedIn posts & Facebook posts.
                </li>
                <li className="mb-1">AI Assitant</li>
                <li className="mb-1">All upcoming features</li>
              </ul>
              <div className="bg-dark mt-10 rounded-lg p-2 text-center font-semibold text-white dark:bg-white dark:text-black">
                Current Plan
              </div>
            </div>
          </div>
          <div className="relative rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
            <div className="flex justify-between border-b border-stone-200 p-8 dark:border-stone-700">
              <div className="flex flex-col">
                <h4 className="text-2xl font-bold dark:text-white">Ultimate</h4>
                <span className="text-[x-small] text-stone-200 dark:text-white">
                  Pay Once
                </span>
              </div>
              <p className="text-3xl text-gray-500 dark:text-white">$0</p>
            </div>
            <div className="p-8">
              <ul className="ml-5 list-disc dark:text-white">
                <li className="mb-1">40000 views per month</li>
                <li className="mb-1">4 websites</li>
                <li className="mb-1">
                  Import Twitter threads, LinkedIn posts & Facebook posts.
                </li>
                <li className="mb-1">AI Assitant</li>
                <li className="mb-1">All upcoming features</li>
              </ul>
              <div className="bg-dark mt-10 rounded-lg p-2 text-center font-semibold text-white dark:bg-white dark:text-black">
                Current Plan
              </div>
            </div>
          </div>
          <div className="relative rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
            <div className="flex justify-between border-b border-stone-200 p-8 dark:border-stone-700">
              <div className="flex flex-col">
                <h4 className="text-2xl font-bold dark:text-white">Elite</h4>
                <span className="text-[x-small] text-stone-200 dark:text-white">
                  Pay Once
                </span>
              </div>
              <p className="text-3xl text-gray-500 dark:text-white">$0</p>
            </div>
            <div className="p-8">
              <ul className="ml-5 list-disc dark:text-white">
                <li className="mb-1">Unlimited views per month</li>
                <li className="mb-1">Unlimited websites</li>
                <li className="mb-1">
                  Import Twitter threads, LinkedIn posts & Facebook posts.
                </li>
                <li className="mb-1">AI Assitant</li>
                <li className="mb-1">All upcoming features</li>
              </ul>
              <div className="bg-dark mt-10 rounded-lg p-2 text-center font-semibold text-white dark:bg-white dark:text-black">
                Current Plan
              </div>
            </div>
          </div>
        </div>
        <h3 className="mt-8 font-cal font-medium tracking-widest dark:text-white">
          PLAN USAGE
        </h3>
        <div className="mt-5 grid grid-cols-6 gap-4">
          <div className="relative justify-between rounded-lg border border-stone-200 p-5 shadow-md transition-all dark:border-stone-700">
            <p className="text-[small] font-bold tracking-wider dark:text-white">
              WEBSITE VIEWS
            </p>
            <p className="text-[12px] tracking-widest dark:text-white">
              Plan limit: 50,000
            </p>
            <p className="mt-16 text-3xl font-bold dark:text-white">340</p>
          </div>
          <div className="relative justify-between rounded-lg border border-stone-200 p-5 shadow-md transition-all dark:border-stone-700">
            <p className="text-[small] font-bold tracking-wider dark:text-white">
              WEBSITE CREATED
            </p>
            <p className="text-[12px] tracking-widest dark:text-white">
              Plan limit: 5
            </p>
            <p className="mt-16 text-3xl font-bold dark:text-white">1/5</p>
          </div>
        </div>
      </div>
    </>
  );
}
