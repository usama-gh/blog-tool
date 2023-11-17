import { ReactNode, Suspense } from "react";
import Profile from "@/components/profile";
import AdminNav from "@/components/admin-nav";
import { getSession } from "@/lib/auth";
import { isUserAdmin } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (!isUserAdmin(session.user.email)) {
    redirect("/overview");
  }

  return (
    <div>
      <AdminNav>
        <Suspense fallback={<div>Loading...</div>}>
          <Profile />
        </Suspense>
      </AdminNav>
      <div className="min-h-screen dark:bg-black sm:pl-60">{children}</div>
    </div>
  );
}
