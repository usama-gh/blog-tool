import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Overview() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  redirect("admin/stats");

  return <></>;
}
