import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Force dynamic (server) route instead of static page
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return Response.json({ message: "Success" }, { status: 200 });
}

export async function POST(request: Request) {
  const data = await request.json();
  try {
    const subscriber = await prisma.subscriber.findFirst({
      where: {
        email: data.email,
      },
    });
    if (subscriber) {
      return Response.json(
        {
          success: false,
          message: "You have already subscribed.",
        },
        { status: 200 },
      );
    }

    // creating site subscriber
    const response = await prisma.subscriber.create({
      data: {
        email: data.email,
        site: {
          connect: {
            id: data.siteId,
          },
        },
      },
    });

    revalidateTag(`${data.siteId}-subscribers`);

    return Response.json(
      {
        success: true,
        message: "Successfully added to subscribers list",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
