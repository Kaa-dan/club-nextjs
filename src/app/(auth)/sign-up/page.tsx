import LeftScreen from "@/components/globals/auth/auth-left";
import { SignUpForm } from "@/components/pages/sign-up/register-form";
import React from "react";

const page = () => {
  return (
    <div className="flex h-screen w-full flex-col bg-white md:flex-row">
      <div className="md:w-[45%]">
        <LeftScreen />
      </div>
      <div className="px-3 md:w-[55%] md:px-0">
        <SignUpForm />
      </div>
    </div>
  );
};

export default page;
