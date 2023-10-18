import prisma from "@/lib/prisma";
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

    return new NextResponse("Views Reset", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
