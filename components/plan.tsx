"use client";

interface Props {
  plan: {
    id: number;
    name: string;
    price: number;
    payType: string;
    priceId: string;
    specifications: string[];
    views: number;
    websites: number;
    badgeShow: boolean;
    AIAssistance: boolean;
    upcomingFeatures: boolean;
  };
  isCurrentPlan: boolean;
  email: string;
}

export default function Plan({ plan, isCurrentPlan, email }: Props) {
  return (
    <div className="relative flex flex-col rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
      {/* plan overview */}
      <div className="flex justify-between border-b border-stone-200 p-8 dark:border-stone-700">
        <div className="flex flex-col">
          <h4 className="text-2xl font-bold dark:text-white">{plan.name}</h4>
          <span className="text-md text-stone-200 dark:text-white">
            {plan.payType}
          </span>
        </div>
        <p className="text-3xl text-gray-500 dark:text-white">${plan.price}</p>
      </div>
      {/* plan specifications */}
      <div className="p-8 pb-0">
        <ul className="mb-5 ml-5 list-disc dark:text-white">
          {plan.specifications.map((item: any) => (
            <li key={item} className="mb-1">
              {item}
            </li>
          ))}
        </ul>
      </div>
      {/* plan buy button */}
      <div className="mt-auto p-8">
        <button
          type="button"
          disabled={isCurrentPlan}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-gray-800 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-90 dark:focus:ring-gray-900 dark:focus:ring-offset-gray-800"
          onClick={() => {
            // @ts-ignore
            Paddle.Checkout.open({
              items: [
                {
                  priceId: plan.priceId,
                  quantity: 1,
                },
              ],
              customer: {
                email: email,
              },
            });
          }}
        >
          {isCurrentPlan ? "Current Plan" : "Buy"}
        </button>
      </div>
    </div>
  );
}
