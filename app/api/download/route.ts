import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest } from "next/server";

import { r2 } from "@/lib/r2";

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key") as string;
  const type = request.nextUrl.searchParams.get("type") as string;

  try {
    const pdf = await r2.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
      }),
    );

    if (!pdf) {
      throw new Error("pdf not found.");
    }

    return new Response(pdf.Body?.transformToWebStream(), {
      headers: {
        "Content-Type": type,
      },
    });
  } catch (err) {
    console.log("error", err);
  }
}
