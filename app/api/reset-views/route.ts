import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Nextjs route segment config
export const dynamic = "force-dynamic"; // Force dynamic (server) route instead of static page

export async function GET() {
  try {
    await prisma.vistor.updateMany({
      where: {},
      data: {
        views: 0,
      },
    });

    const visitors = await prisma.vistor.findMany();

    visitors.forEach((visit) => {
      revalidateTag(`${visit.userId}-states`);
    });

    return new NextResponse("Views Reset", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}