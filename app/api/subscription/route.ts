import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  try {
    const data = await request.json();
    const updated = await prisma.subscription.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        planId: data.planId,
        priceId: data.priceId,
        websites: data.websites,
        visitors: data.visitors,
        checkoutId: data.checkoutId,
        transactionId: data.transactionId,
      },
    });
    revalidateTag(`${data.userId}-states`);
    return new NextResponse(JSON.stringify({ subscription: updated }), {
      status: 201,
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
      },
    });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
