import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import BlogStats from "@/components/blog-stats";

export default async function Stats() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  //   {
  //     select: {
  //       name: true,
  //     },
  //   }
  const blogs = await prisma.site.findMany({
    include: {
      user: true,
      views: true,
      _count: {
        select: { posts: true },
      },
    },
  });

  return (
    <>
      <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
        <div className="flex flex-col space-y-6">
          <h1 className="font-inter hide_onboarding text-3xl font-bold dark:text-white">
            Blog Stats
          </h1>
        </div>

        <div className="flex flex-col space-y-6">
          <BlogStats blogs={blogs} />
        </div>
      </div>
    </>
  );
}
