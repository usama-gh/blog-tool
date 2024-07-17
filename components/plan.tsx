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
    <div className="relative flex flex-col rounded-lg  bg-slate-200 dark:bg-gray-900  transition-all">
      {/* plan overview */}
      <div className="flex justify-between border-b border-slate-300 p-6 dark:border-gray-700">
        <div className="flex flex-col">
          <h4 className="text-2xl font-bold dark:text-white">{plan.name}</h4>
          <span className="text-sm text-gray-600 dark:text-white">
            {plan.payType}
          </span>
        </div>
        <p className="text-3xl font-semibold text-gray-900 dark:text-white">${plan.price}</p>
      </div>
      {/* plan specifications */}
      <div className="p-5 pb-0">
        <ul className="mb-5 ml-5 text-sm list-disc dark:text-white">
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
          className="flex items-center disabled:cursor-not-allowed justify-center space-x-2 uppercase rounded-lg px-5 py-2 text-xs font-regular w-full text-white shadow-lg shadow-blue-800/10 transition-all hover:shadow-blue-800/20 focus:outline-none lg:text-sm tracking-widest bg-gradient-to-br from-blue-600 to-blue-400"
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
