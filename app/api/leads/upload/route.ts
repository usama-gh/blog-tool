import prisma from "@/lib/prisma";
// @ts-ignore
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

// Force dynamic (server) route instead of static page
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return Response.json({ message: "Success" }, { status: 200 });
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        pathname: string,
        clientPayload?: string,
      ) => {
        // Generate a client token for the browser to upload the file
        // ⚠️ Authenticate and authorize users before generating the token.
        // Otherwise, you're allowing anonymous uploads.

        return {
          // allowedContentTypes: ["image/jpeg", "image/png", "application/pdf"],
          validUntil: Date.now() + 360000,
          tokenPayload: JSON.stringify({
            leadId:clientPayload
            // optional, sent to your server on upload completion
            // you could pass a user id from auth, or a value from clientPayload
          }),
        };
      },
      // @ts-ignore
      onUploadCompleted: async ({
        blob,
        tokenPayload,
      }: {
        blob: any;
        tokenPayload: any;
      }) => {
        try {
          console.log("File uploaded: ", blob, tokenPayload);
          // await prisma.user.findFirst({});
        } catch (error) {
          throw new Error("Could not update the lead");
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times waiting for a 200
    );
  }
}
