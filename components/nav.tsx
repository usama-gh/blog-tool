"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Edit3,
  Globe,
  LayoutDashboard,
  Megaphone,
  Menu,
  Newspaper,
  Rss,
  Settings,
  TrophyIcon,
  ChromeIcon,
  Shield,
} from "lucide-react";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments,
} from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { getSiteFromPostId } from "@/lib/actions";
import { triggerEvent } from "./usermaven";
import { useSession } from "next-auth/react";
import { isUserAdmin } from "@/lib/utils";

const externalLinks = [
  {
    name: "Our Chrome Extension",
    href: "https://chrome.google.com/webstore/detail/typedd-%E2%9C%A8-turn-social-medi/pinieadejoomhpjbfocfpnocoapbdplo?",
    icon: <ChromeIcon width={18} />,
  },
  {
    name: "Upgrade",
    href: "/plans",
    icon: <TrophyIcon width={18} />,
  },
];
export default function Nav({ children }: { children: ReactNode }) {
  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };

  const [siteId, setSiteId] = useState<string | null>();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const session = useSession();

  useEffect(() => {
    if (segments[0] === "post" && id) {
      getSiteFromPostId(id).then((id) => {
        setSiteId(id);
      });
    }
  }, [segments, id]);

  useEffect(() => {
    if (session.data?.user?.email) {
      const admin = isUserAdmin(session.data.user.email);
      setIsAdmin(admin);
    }
  }, [session]);

  const tabs = useMemo(() => {
    if (segments[0] === "site" && id) {
      return [
        {
          name: "Back to All Blogs",
          href: "/sites",
          icon: <ArrowLeft width={18} />,
        },
        {
          name: "Posts",
          href: `/site/${id}`,
          isActive: segments.length === 2,
          icon: <Newspaper width={18} />,
        },
        {
          name: "Add Social Links",
          href: `/site/${id}/settings#socials`,
          icon: <Megaphone width={18} />,
        },
        {
          name: "Analytics",
          href: `/site/${id}/analytics`,
          isActive: segments.includes("analytics"),
          icon: <BarChart3 width={18} />,
        },

        {
          name: "Blog Settings",
          href: `/site/${id}/settings`,
          isActive: segments.includes("settings"),
          icon: <Settings width={18} />,
        },
      ];
    } else if (segments[0] === "post" && id) {
      return [
        {
          name: "Back to All Posts",
          href: siteId ? `/site/${siteId}` : "/sites",
          icon: <ArrowLeft width={18} />,
        },
        {
          name: "Editor",
          href: `/post/${id}`,
          isActive: segments.length === 2,
          icon: <Edit3 width={18} />,
        },
      ];
    } else if (isAdmin) {
      return [
        {
          name: "Overview",
          href: "/overview",
          // isActive: segments.length === 0,
          isActive: segments[0] === "overview",
          icon: <LayoutDashboard width={18} />,
        },
        {
          name: "Your Blogs",
          href: "/sites",
          isActive: segments[0] === "sites",
          icon: <Globe width={18} />,
        },
        {
          name: "Plans",
          href: "/plans",
          isActive: segments[0] === "plans",
          icon: <Rss width={18} />,
        },
        {
          name: "My Account",
          href: "/settings",
          isActive: segments[0] === "settings",
          icon: <Settings width={18} />,
        },
        {
          name: "Admin Area",
          href: "/admin/stats",
          isActive: false,
          icon: <Shield width={18} />,
        },
      ];
    }
    return [
      {
        name: "Overview",
        href: "/overview",
        // isActive: segments.length === 0,
        isActive: segments[0] === "overview",
        icon: <LayoutDashboard width={18} />,
      },
      {
        name: "Your Blogs",
        href: "/sites",
        isActive: segments[0] === "sites",
        icon: <Globe width={18} />,
      },
      {
        name: "Plans",
        href: "/plans",
        isActive: segments[0] === "plans",
        icon: <Rss width={18} />,
      },
      {
        name: "My Account",
        href: "/settings",
        isActive: segments[0] === "settings",
        icon: <Settings width={18} />,
      },
    ];
  }, [segments, id, siteId, isAdmin]);

  const [showSidebar, setShowSidebar] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    // hide sidebar on path change
    setShowSidebar(false);
  }, [pathname]);

  triggerEvent("pageview", {});

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
                Typedd
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
                  isActive ? "bg-slate-200 text-black dark:bg-gray-700" : ""
                } rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-slate-200 active:bg-slate-300 dark:text-white dark:hover:bg-gray-700 dark:active:bg-gray-800`}
              >
                {icon}
                <span className="text-sm font-medium">{name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="grid gap-1">
            {externalLinks.map(({ name, href, icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-slate-200 active:bg-slate-300 dark:text-white dark:hover:bg-gray-700 dark:active:bg-gray-800"
              >
                <div className="flex items-center space-x-3">
                  {icon}
                  <span className="text-sm font-medium">{name}</span>
                </div>
                <p>↗</p>
              </a>
            ))}
          </div>
          <div className="my-2 border-t border-slate-200 dark:border-gray-700" />
          {children}
        </div>
      </div>
    </>
  );
}
