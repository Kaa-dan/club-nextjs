import LeftScreen from "@/components/globals/auth/auth-left";
import { BoardingForm } from "@/components/pages/boarding/boarding-form";
import React from "react";

const page = () => {
  return (
    <div className="flex bg-white h-screen w-full flex-col  md:flex-row">
      <div className="md:w-[45%]">
        <LeftScreen />
      </div>
      <div className="md:w-[55%]">
        <BoardingForm />
      </div>
    </div>
  );
};

export default page;
