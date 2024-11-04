"use client";

import LeftScreen from "@/components/globals/auth/auth-left";
import { BoardingForm } from "@/components/pages/boarding/boarding-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const accessToken = localStorage.getItem("access-token");

  useEffect(() => {
    if (!accessToken) {
      router.replace("/sign-in");
    }
  }, [accessToken, router]);

  return (
    <div className="flex h-screen w-full flex-col bg-white md:flex-row">
      <div className="hidden md:flex md:w-[45%]">
        <LeftScreen />
      </div>
      <div className="px-3 md:w-[55%] md:px-0">
        <BoardingForm />
      </div>
    </div>
  );
};

export default Page;
