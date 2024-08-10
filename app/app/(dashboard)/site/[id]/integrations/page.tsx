import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSiteIntegrations } from "@/lib/fetchers";
import { Integration } from "@prisma/client";
import ResendIntegration from "@/components/resend-integration";
import ZapierIntegration from "@/components/zapier-integration";
import PlunkIntegration from "@/components/plunk-integration";

async function Integrations({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const integrations = await getSiteIntegrations(params.id);
  const resendIntegration = integrations?.find(
    (integration: Integration) => integration.type === "resend",
  );
  const zapierIntegration = integrations?.find(
    (integration: Integration) => integration.type === "zapier",
  );
  const plunkIntegration = integrations?.find(
    (integration: Integration) => integration.type === "plunk",
  );

  return (
    <>
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div className="">
            <h1 className="font-inter truncate text-lg font-bold dark:text-white sm:w-auto sm:text-2xl">
              Integrations
            </h1>
            <p className="mt-3 text-base font-normal text-slate-800 dark:text-gray-400">
              Build automations on your posts & leads with Typedd's
              integrations.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <ResendIntegration integration={resendIntegration} />
        <ZapierIntegration integration={zapierIntegration} />
        <PlunkIntegration integration={plunkIntegration} />
      </div>
    </>
  );
}

export default Integrations;
