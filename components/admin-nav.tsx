"use client";

import Link from "next/link";
import { ArrowLeft, BarChart3, Menu, Settings, BarChart2 } from "lucide-react";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments,
} from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";

export default function AdminNav({ children }: { children: ReactNode }) {
  const segments = useSelectedLayoutSegments();
  console.log(segments);

  const { id } = useParams() as { id?: string };

  const tabs = useMemo(() => {
    if (segments[0] === "stats" && id) {
      return [
        {
          name: "Back to All Stats",
          href: "/admin/stats",
          isActive: false,
          icon: <ArrowLeft width={18} />,
        },
      ];
    }
    return [
      {
        name: "Back to User Area",
        href: "/overview",
        isActive: false,
        icon: <ArrowLeft width={18} />,
      },
      {
        name: "Stats",
        href: "/admin/stats",
        isActive: segments[0] === "stats",
        icon: <BarChart2 width={18} />,
      },
    ];
  }, [segments, id]);

  const [showSidebar, setShowSidebar] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    // hide sidebar on path change
    setShowSidebar(false);
  }, [pathname]);

  return (
    <>
      <button
        className={`fixed z-20 ${
          // left align for Editor, right align for other pages
          segments[0] === "post" && segments.length === 2 && !showSidebar
            ? "left-5 top-5"
            : "right-5 top-7"
        } text-gray-400 sm:hidden`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu width={20} />
      </button>
      <div
        className={`transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } fixed z-10 flex h-full w-full flex-col justify-between border-r border-slate-200 bg-slate-100 p-4 transition-all dark:border-gray-700 dark:bg-gray-900 sm:w-60 sm:translate-x-0`}
      >
        <div className="grid gap-2">
          <div className="flex items-center space-x-2 rounded-lg px-2 py-1.5">
            <Link
              href="/"
              className="rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-800 dark:text-white">
                Typedd (Admin)
              </h3>
              {/* <Image
                src="/logo.png"
                width={24}
                height={24}
                alt="Logo"
                className="dark:scale-110 dark:rounded-full dark:border dark:border-stone-400"
              /> */}
            </Link>
          </div>
          <div className="grid gap-1">
            {tabs.map(({ name, href, isActive, icon }) => (
              <Link
                key={name}
                href={href}
                className={`flex items-center space-x-3 ${
                  isActive ? "bg-slate-200 text-black dark:bg-gray-800" : ""
                } rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-slate-200 active:bg-slate-300 dark:text-white dark:hover:bg-gray-700 dark:active:bg-gray-800`}
              >
                {icon}
                <span className="text-sm font-medium">{name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="my-2 border-t border-slate-200 dark:border-gray-700" />
          {children}
        </div>
      </div>
    </>
  );
}
