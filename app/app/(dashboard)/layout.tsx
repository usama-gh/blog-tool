import { ReactNode, Suspense } from "react";
import Profile from "@/components/profile";
import Nav from "@/components/nav";
import Script from "next/script";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
        <Script
        src="https://assets.userscom.com/script.js"
        id="userscom-chat"
        data-reference="6553c9324bb5c"
        strategy="lazyOnload" // Load script after the page is loaded
        onLoad={() => console.log('Script loaded successfully')}
      />
      <Nav>
        <Suspense fallback={<div>Loading...</div>}>
          <Profile />
        </Suspense>
      </Nav>
      <div className="min-h-screen sm:pl-60">{children}</div>
    </div>
  );
}
