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
    if (!accessToken) {
      router.replace("/sign-in");
    } else if (!globalUser?.isOnBoarded) {
      router.replace("/onboarding");
    }
  }, [globalUser]);

  return (
    <section>
      <LayoutPanel>{children}</LayoutPanel>
    </section>
  );
};

export default SiteLayout;
