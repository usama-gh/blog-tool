import prisma from "@/lib/prisma";
import { makeSlug } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const leads = await prisma.lead.findMany({
      select: {
        id: true,
        title: true,
      },
    });

    leads.forEach(async (lead) => {
      try {
        const slug = makeSlug(lead.title);
        await prisma.lead.update({
          where: { id: lead.id },
          data: { slug },
        });
      } catch (error: any) {
        console.log(error.message);
      }
    });

    return Response.json(
      {
        success: true,
        message: `slug has been updated for ${leads.length} leads.`,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
