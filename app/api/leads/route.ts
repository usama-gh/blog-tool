import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Force dynamic (server) route instead of static page
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return Response.json({ message: "Success" }, { status: 200 });
}

export async function POST(request: Request) {
  const data = await request.json();
  const email = data.email;
  try {
    const response = await prisma.leadCollector.create({
      data: {
        email,
        ...(data.leadId && {
          lead: {
            connect: {
              id: data.leadId,
            },
          },
        }),
        post: {
          connect: {
            id: data.postId,
          },
        },
      },
    });
    return Response.json(
      {
        success: true,
        id: response.id,
        message: "Lead collector added",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
