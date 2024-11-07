"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTokenStore } from "@/store/store";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { globalUser } = useTokenStore((state) => state);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access-token");
    const isOnBoarded = localStorage.getItem("isOnboarded") === "true";
    console.log("auth", isOnBoarded);
    if (accessToken) {
      const destination = isOnBoarded ? "/" : "/onboarding";
      router.replace(destination);
    }
    setIsLoading(false);
  }, [globalUser]);

  if (isLoading) {
    return <div>loading....</div>;
  }

  return <>{children}</>;
}
