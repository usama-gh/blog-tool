import prisma from "@/lib/prisma";
import { makeSlug } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const leads = await prisma.lead.findMany();

    leads.forEach(async (lead) => {
      if (lead.slug === "") {
        const slug = makeSlug(lead.title);
        await prisma.lead.update({
          where: { id: lead.id },
          data: { slug },
        });
      }
    });

    return Response.json(
      {
        success: true,
        message: "slug has been updated",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
