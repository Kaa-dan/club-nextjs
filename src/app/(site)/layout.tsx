"use client";

import LayoutPanel from "@/components/globals/layout-panel/layout-panel";
import { useRouter } from "next/navigation";
import { useTokenStore } from "@/store/store";
import { useEffect, useState } from "react";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { globalUser } = useTokenStore((state) => state);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access-token");
    const isOnBoarded = localStorage.getItem("isOnboarded") === "true";
    if (!accessToken) {
      router.replace("/sign-in");
    } else if (!isOnBoarded) {
      router.replace("/onboarding");
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return <div>loading....</div>;
  }

  return (
    <section className="">
      <LayoutPanel>{children}</LayoutPanel>
    </section>
  );
};

export default SiteLayout;
