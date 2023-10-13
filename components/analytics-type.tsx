"use client";

import { getSiteViews, getSiteViewsTest } from "@/lib/actions";
import { ChangeEvent, useEffect, useState } from "react";
import AnalyticsMockup from "./analytics";

const shortMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function AnalyticsType({ data, url, siteViews }: any) {
  const [visitors, setVisitors] = useState(siteViews);
  const [chartData, setChartData] = useState([]);

  const arrangeSiteViews = (visitor: any, type: string) => {
    let data = null;
    if (type === "month") {
      data = visitors.map((visitor: any) => {
        return {
          date: `${shortMonths[visitor.month - 1]} ${visitor.year}`,
          Visitors: Number(visitor.count),
        };
      });
    }

    return data;
  };

  useEffect(() => {
    // const data = arrangeSiteViews(visitors, "month");
    const data = visitors.map((visitor: any) => {
      return {
        date: `${shortMonths[visitor.month - 1]} ${visitor.year}`,
        Visitors: Number(visitor.count),
      };
    });
    setChartData(data);
  }, [visitors]);

  const handleChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    const siteViews = await getSiteViewsTest("clmj1v3m10005uohswu4blh47", type);

    // if (viewType) console.log(siteViews);
  };

  return (
    <>
      <div className="flex items-center justify-center sm:justify-start">
        <div className="flex flex-col items-center space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="flex flex-col items-center space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
            <h1 className="font-inter text-xl font-bold dark:text-white sm:text-3xl">
              Analytics for {data.name}
            </h1>
            <a
              href={`https://${url}`}
              target="_blank"
              rel="noreferrer"
              className="truncate rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              {url} ↗
            </a>
          </div>
          {/* <select
            className="block w-full rounded-md border-gray-200 px-3 py-2 pr-9 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
            onChange={handleChange}
            defaultValue="month"
          >
            <option value="day">By Day</option>
            <option value="week">By Week</option>
            <option value="month">By Month</option>
          </select> */}
        </div>
      </div>
      <AnalyticsMockup chartData={chartData} />
    </>
  );
}
