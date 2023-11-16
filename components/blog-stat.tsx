"use client";

import Link from "next/link";
import Image from "next/image";

export default function BlogStat({ blog }: any) {
  const url = `${blog.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  return (
    <tr className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
      <th
        scope="row"
        className="flex items-center whitespace-nowrap px-6 py-4 text-gray-900 dark:text-white"
      >
        <Image
          src={
            blog?.user?.image ?? `https://avatar.vercel.sh/${blog?.user?.email}`
          }
          width={40}
          height={40}
          alt={blog?.user?.name ?? "User avatar"}
          className="h-10 w-10 rounded-full"
        />
        <div className="ps-3">
          <div className="text-base font-semibold">{blog?.user?.name}</div>
          <div className="font-normal text-gray-500">{blog?.user?.email}</div>
        </div>
      </th>
      <td className="px-6 py-4">{blog.name}</td>
      <td className="px-6 py-4">
        <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://${blog.subdomain}.localhost:3000`
          }
          target="_blank"
          rel="noreferrer"
          className=""
        >
          {url} ↗
        </a>
      </td>
      <td className="px-6 py-4">{blog._count.posts}</td>
      <td className="px-6 py-4">{blog.views[0]?.views}</td>
      <td className="px-6 py-4">
        <Link
          href={`/admin/stats/${blog.id}`}
          className="font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          View details
        </Link>
      </td>
    </tr>
  );
}
