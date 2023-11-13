import prisma from "@/lib/prisma";
import Form from "@/components/form";
import { updateSite, updateSiteBio } from "@/lib/actions";
import DeleteSiteForm from "@/components/form/delete-site-form";
import SocialLinksForm from "@/components/form/social-links-form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserPlanAnalytics } from "@/lib/fetchers";
import ApiToken from "@/components/api-token";

export default async function SiteSettingsIndex({
  params,
}: {
  params: { id: string };
}) {
  let canUseAI = false;
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const result = await getUserPlanAnalytics(session.user.id as string);
  canUseAI = result.canUseAI;

  const data = await prisma.site.findUnique({
    where: {
      id: params.id,
    },
  });

  const apiToken = await prisma.apiToken.findFirst({
    where: {
      siteId: params.id,
    },
  });

  return (
    <div className="flex flex-col space-y-6">
      {/* <form className="rounded-lg border border-stone-200 bg-white dark:border-stone-700 dark:bg-black">
        <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
          <h2 className="font-cal text-xl dark:text-white">Bio</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            The bio of your site. This will be used as the meta description on
            Google as well.
          </p>
          <div className="relative flex w-full max-w-md">
            <textarea
              name="description"
              placeholder="A blog about really interesting things."
              rows={3}
              className="w-full max-w-xl rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
            ></textarea>
          </div>
        </div>
      </form> */}

      <Form
        title="Name"
        description="The name of your site. This will be used as the meta title on Google as well."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: "name",
          type: "text",
          defaultValue: data?.name!,
          placeholder: "My Awesome Site",
          maxLength: 32,
        }}
        handleSubmit={updateSite}
      />

      <Form
        title="Bio"
        description="The bio of your site. This will tell users about your website"
        helpText=""
        inputAttrs={{
          name: "bio",
          type: "text",
          // @ts-ignore
          defaultValue: data?.bio!,
          placeholder: "A bio about really interesting things.",
        }}
        handleSubmit={updateSiteBio}
        canUseAI={canUseAI}
      />

      <Form
        title="Description"
        description="The description of your site. This will be used as the meta description on Google as well."
        helpText="Include SEO-optimized keywords that you want to rank for."
        inputAttrs={{
          name: "description",
          type: "text",
          defaultValue: data?.description!,
          placeholder: "A blog about really interesting things.",
        }}
        handleSubmit={updateSite}
      />

      {/* showing api token to send request */}
      {apiToken?.token && (
        <ApiToken id={apiToken.id} apiToken={apiToken.token} />
      )}

      <SocialLinksForm
        handleSubmit={updateSite}
        links={data?.links ? JSON.parse(data.links) : {}}
      />

      <DeleteSiteForm siteName={data?.name!} />
    </div>
  );
}
