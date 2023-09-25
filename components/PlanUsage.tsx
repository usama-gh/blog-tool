interface Props {
  title: string;
  planLimit: number | string;
  usage: number;
}

export default function PlanUsage({ title, planLimit, usage }: Props) {
  return (
    <div className="relative flex flex-col rounded-lg bg-stone-100 dark:bg-black shadow-md transition-all hover:shadow-xl">
      {/* plan overview */}
      <div className="flex justify-between  p-8 dark:border-stone-700">
        <div className="flex flex-col">
          <h4 className="text-xl font-medium uppercase text-stone-500 dark:text-white">
            {title}
          </h4>
          <span className="text-lg text-stone-300 dark:text-white">
            Plan Limit: {planLimit}
          </span>
        </div>
      </div>

      {/* plan usage statistic */}
      <div className="mt-auto p-8">
        <h4 className="text-2xl font-medium text-stone-400 dark:text-white">
          {usage}
          {title === "website created" && `/${planLimit}`}
        </h4>
      </div>
    </div>
  );
}
