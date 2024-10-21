import LeftScreen from "@/components/globals/auth/auth-left";
import { SignInForm } from "@/components/pages/sign-in/sign-form";
import React from "react";

const page = () => {
  return (
    <div className="flex h-screen w-full flex-col bg-white md:flex-row">
      <div className="md:w-[45%]">
        <LeftScreen/>
      </div>
      <div className="md:w-[55%]">
        <SignInForm/>
      </div>
    </div>
  );
};

export default page;
