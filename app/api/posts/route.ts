import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { markdownToTxt } from "markdown-to-txt";

// Nextjs route segment config
export const dynamic = "force-dynamic"; // Force dynamic (server) route instead of static page

export async function POST(request: Request) {
  const escapeSpecialCharacters = (str: string) => {
    return str.replace(/[<{]/g, "\\$&");
  };

  const escapeSpecialCharactersInArray = (array: Array<string>) => {
    return array.map((item) => escapeSpecialCharacters(item));
  };

  // make slug from post title
  const makeSlug = (title: string) => {
    return title
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[`~!@#$%^*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi, "")
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-");
  };

  // get 170 words of content eliminated all special character
  const syncDescription = (string: string) => {
    string = string?.replace(/!\[.*\]\(.*\)/g, "");
    return (
      markdownToTxt(string as string)
        ?.replaceAll("\n", " ")
        ?.substring(0, 170) || ""
    );
  };

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

  // auth token is valid next steps
  // 1: validation schema
  const schema = z.object({
    title: z.string().min(5),
    image: z.nullable(z.string()).optional(),
    published: z.nullable(z.boolean()).optional(),
    description: z.nullable(z.string()),
    threads: z.array(
      z.object({
        content: z.string(),
        links: z.array(z.string().optional()),
        images: z.array(z.string().optional()),
      }),
    ),
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

      // if threads is empty array then return error
      if (data.threads.length < 1) {
        return Response.json(
          { message: "Threads should have one slide" },
          { status: 422 },
        );
      }

      // 5: check if the site exist against siteId provided
      const site = await prisma.site.findFirst({
        where: {
          id: apiToken.siteId,
          userId: apiToken.userId,
        },
        select: {
          subdomain: true,
          customDomain: true,
        },
      });
      if (!site) {
        return Response.json(
          { message: "No site found for the id provided" },
          { status: 404 },
        );
      }

      // 6: check weather the new slug is unique or not
      let slug = makeSlug(data.title);
      let uniqueSlug = false;
      let starting = 0;

      do {
        if (starting != 0) {
          slug = `${slug}-${starting}`;
        }
        const post = await prisma.post.findFirst({
          where: {
            slug,
          },
        });

        if (post) {
          starting++;
        } else {
          uniqueSlug = true;
        }
      } while (!uniqueSlug);

      // use first slide of thread as content
      const contentSlide = data?.threads[0];

      let content = escapeSpecialCharacters(contentSlide.content);
      if (Array.isArray(contentSlide.images)) {
        contentSlide.images.forEach((image) => {
          content += "\n\n" + `![](${image})`;
        });
      }

      // 8: Arranging slides
      let slides: any = [];
      if (Array.isArray(data.threads)) {
        data.threads.slice(1).map((thread: any) => {
          let imagesContent = "";
          if (Array.isArray(thread.images)) {
            thread.images.forEach((image: string) => {
              imagesContent += "\n\n" + `![](${image})`;
            });
          }
          // 9: Escape < characters in the content
          slides.push(escapeSpecialCharacters(thread.content) + imagesContent);
        });
      }

      // 10: Escape < characters in the newSlides array
      const escapedSlides = escapeSpecialCharactersInArray(slides);

      // 11: Creating new post
      const newPost = await prisma.post.create({
        data: {
          title: data.title,
          slug: slug,
          content: content,
          description:
            !data.description || data.description == ""
              ? syncDescription(content)
              : data.description,
          image: data.image,
          slides: JSON.stringify(escapedSlides),
          published: data.published ?? false,
          siteId: apiToken.siteId,
          userId: apiToken.userId,
        },
      });

      // 12: forcing the site to cache the new data
      revalidateTag(
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`,
      );
      site.customDomain && revalidateTag(`${site.customDomain}-posts`);

      // 13: returning response
      return Response.json(
        {
          success: true,
          message: "New post created successfuly.",
          post: newPost,
        },
        { status: 200 },
      );
    } catch (error: any) {
      // 14: catch and returning response if any error happend during process
      return new NextResponse(error.message, { status: 500 });
    }
  }
}
