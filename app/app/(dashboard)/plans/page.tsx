import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import PaddleLoader from "@/components/paddle/paddleLoader";
import Plans from "@/components/plans";
import { PaddleSDK } from "paddle-sdk";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const client = new PaddleSDK(
		process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID as string,
		process.env.NEXT_PUBLIC_PADDLE_KEY as string
  );
  const products = (await client.getProducts()).products;

  return (
    <>
      <PaddleLoader />
      <div className="flex max-w-screen-xl flex-col  p-8">
        <h1 className="font-cal text-3xl font-bold dark:text-white">Upgrade</h1>
        <h2 className="mt-4 text-2xl dark:text-white">
          Enjoy all benefits of SlideBites with just one time payment
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => {
            return <Plans {...product}></Plans>;
          })}
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
