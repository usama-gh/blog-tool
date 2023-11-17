import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import BlogStats from "@/components/blog-stats";
import { Globe, Globe2, Users } from "lucide-react";

export default async function Stats() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  let blogs = await prisma.site.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      views: {
        orderBy: {
          views: "asc",
        },
        select: {
          views: true,
        },
      },
      _count: {
        select: { posts: true },
      },
    },
  });

  blogs = blogs.sort(function (a: any, b: any) {
    return b.views[0].views - a.views[0].views;
  });

  const users = await prisma.user.count();
  const posts = await prisma.post.count();

  return (
    <>
      <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
        <div className="flex flex-col space-y-6">
          <h1 className="font-inter hide_onboarding text-3xl font-bold dark:text-white">
            Blog Stats
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col items-center gap-2 rounded-xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:shadow-slate-700/[.7] md:p-5">
            <Users width={18} className="h-10 w-10 text-blue-500" />
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {users}
            </h3>
            <p className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-500">
              Registered Users
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:shadow-slate-700/[.7] md:p-5">
            <Globe width={18} className="h-10 w-10 text-blue-500" />
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {blogs.length}
            </h3>
            <p className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-500">
              Sites Created
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:shadow-slate-700/[.7] md:p-5">
            <Globe2 width={18} className="h-10 w-10 text-blue-500" />
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {posts}
            </h3>
            <p className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-500">
              Posts Created
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <BlogStats blogs={blogs} />
        </div>
      </div>
    </>
  );
}
