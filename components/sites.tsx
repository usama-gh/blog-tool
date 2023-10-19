import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SiteCard from "./site-card";
import Image from "next/image";
import BlurImage from "./blur-image";

export default async function Sites({ limit }: { limit?: number }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const customStyles = `
    .hide_onboarding {
      visibility: hidden;
    }`;
  const sites = await prisma.site.findMany({
    where: {
      user: {
        id: session.user.id as string,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    ...(limit ? { take: limit } : {}),
  });

  return sites.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {sites.map((site) => (
        <SiteCard key={site.id} data={site} />
      ))}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-start justify-left space-x-4">
     <style>{customStyles}</style>
     <BlurImage
  alt="wave"
  blurDataURL="/wave.webp" // Reference to the image in the public folder
    className="animate-bounce animate-duration-300"
  width={50}
  height={50}
  placeholder="blur"
  src="/wave.webp" // Reference to the image in the public folder
/>

      <h1 className="font-inter font-bold text-4xl">Welcome to Typedd</h1>
      <p className="text-lg text-slate-500 dark:text-gray-200 mt-2">
        You do not have any blog yet. So let's create one and get started.
      </p>
      <Image
        alt="missing site"
        className="opacity-50"
        src="https://illustrations.popsy.co/gray/web-design.svg"
        width={400}
        height={400}
      />
     
    </div>
  );
}
