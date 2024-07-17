interface Props {
  title: string;
  planLimit: number | string;
  usage: number;
}

export default function PlanUsage({ title, planLimit, usage }: Props) {
  return (
    <div className="relative flex flex-col rounded-lg  bg-slate-200 dark:bg-gray-900  transition-all">
      {/* plan overview */}
      <div className="flex justify-between  p-8 dark:border-gray-600">
        <div className="flex flex-col">
          <h4 className="text-md font-medium uppercase tracking-widest text-gray-500 dark:text-white">
            {title}
          </h4>
          <span className="text-lg text-sm text-gray-400 dark:text-white">
            Plan Limit: {planLimit}
          </span>
        </div>
      </div>

      {/* plan usage statistic */}
      <div className="mt-auto p-8">
        <h4 className="text-2xl font-medium text-gray-800 dark:text-white">
          {usage}
          {title === "website created" && `/${planLimit}`}
        </h4>
      </div>
    </div>
  );
}
