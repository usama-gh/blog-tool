import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidateTag } from "next/cache";

// Nextjs route segment config
export const dynamic = "force-dynamic"; // Force dynamic (server) route instead of static page

export async function POST(
  request: Request,
  { params }: { params: { postId: string } },
) {
  const postId = params.postId;

  const headersList = headers();

  // check if authorization token is present
  if (!headersList.get("Authorization")) {
    return Response.json(
      { message: "Authorization token is missing" },
      { status: 400 },
    );
  }

  // check if the request has valid token
  const token = headersList
    .get("Authorization")
    ?.replace("Bearer ", "")
    ?.replace("bearer ", "");
  const apiToken = await prisma.apiToken.findFirst({
    where: {
      token,
    },
  });
  if (!apiToken) {
    return Response.json({ message: "Unathenticated" }, { status: 403 });
  }

  // check if post exist against the id and user id
  let post = await prisma.post.findFirst({
    where: {
      id: postId,
      userId: apiToken.userId,
    },
  });

  if (!post) {
    return Response.json({ message: "No post found" }, { status: 404 });
  }

  // auth token is valid next steps
  // 1: validation schema
  const schema = z.object({
    published: z.boolean(),
  });

  const requestBody = await request.json();
  // 2: validating request with validation schema
  const response = schema.safeParse(requestBody);

  // 3: If the request body is invalid, return a 422 error with the validation errors
  if (!response.success) {
    const { errors } = response.error;
    return Response.json(
      { message: "Invalid request", errors },
      { status: 422 },
    );
  } else {
    // 4: request body pass the validation
    try {
      const data = response.data;

      // 5: Updating post
      let post = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          published: data.published,
        },
      });

      // 6: forcing the site to cache the new data
      if (post) {
        const site = await prisma.site.findFirst({
          where: {
            // @ts-ignore
            id: post.siteId,
          },
        });

        revalidateTag(
          `${site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`,
        );
        site?.customDomain && revalidateTag(`${site.customDomain}-posts`);
      }

      // 7: returning response
      return Response.json(
        {
          success: true,
          message: "Post updated successfuly.",
          post: post,
        },
        { status: 200 },
      );
    } catch (error: any) {
      // 8: catch and returning response if any error happend during process
      return new NextResponse(error.message, { status: 500 });
    }
  }
}
