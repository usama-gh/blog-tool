import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Editor from "@/components/editor";
import { updatePostMetadata } from "@/lib/actions";
import DeletePostForm from "@/components/form/delete-post-form";
import PostForm from "@/components/form/post-form";
import Form from "@/components/form";
import { getUserPlanAnalytics } from "@/lib/fetchers";

export default async function PostPage({ params }: { params: { id: string } }) {
  let canUseAI = false;
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const result = await getUserPlanAnalytics(session.user.id as string);
  canUseAI = result.canUseAI;

  const data = await prisma.post.findUnique({
    where: {
      id: params.id,
    },
    include: {
      site: {
        select: {
          subdomain: true,
        },
      },
    },
  });

  if (!data || data.userId !== session.user.id) {
    notFound();
  }

  const leads = await prisma.lead.findMany({
    where: {
      siteId: data.siteId as string,
    },
  });
  

  return (
    <>
      <div className="flex flex-wrap justify-between gap-y-2">
        <div className="w-full px-2 lg:px-4">
          <Editor post={data} canUseAI={canUseAI} leads={leads} />
        </div>
        <div className="mb-10  ml-auto mt-10 px-2 lg:px-4 xl:mb-0">
          <div className="flex flex-col space-y-6">
            {/* <PostForm
              title="Post Slug"
              description="A slug is a lowercase, URL-friendly version of a name, consisting of letters, numbers, and hyphens."
              // helpText="Please use a slug that is unique to this post."
              helpText=""
              inputAttrs={{
                name: "slug",
                type: "text",
                defaultValue: data?.slug!,
                placeholder: "slug",
              }}
              postTitle={data?.title}
              handleSubmit={updatePostMetadata}
            /> */}

            {/* <Form
              title="Thumbnail image"
              description="The thumbnail image for your post. Accepted formats: .png, .jpg, .jpeg"
              helpText="Recommended size 1200x630."
              inputAttrs={{
                name: "image",
                type: "file",
                defaultValue: data?.image!,
              }}
              handleSubmit={updatePostMetadata}
            /> */}

            <DeletePostForm postName={data?.title!} />
          </div>
        </div>
      </div>
    </>
  );
}
