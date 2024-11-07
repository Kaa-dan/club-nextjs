"use client";

import LayoutPanel from "@/components/globals/layout-panel/layout-panel";
import { useRouter } from "next/navigation";
import { useTokenStore } from "@/store/store";
import { useEffect } from "react";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { globalUser } = useTokenStore((state) => state);

  useEffect(() => {
    const accessToken = localStorage.getItem("access-token");
    const isOnBoarded = localStorage.getItem("isOnboarded") === "true";
    console.log("site", isOnBoarded);
    if (!accessToken) {
      router.replace("/sign-in");
    } else if (!isOnBoarded) {
      router.replace("/onboarding");
    }
  }, [router]);

  return (
    <section className="bg-green-400">
      <LayoutPanel>{children}</LayoutPanel>
    </section>
  );
};

export default SiteLayout;
