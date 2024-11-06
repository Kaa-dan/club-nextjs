import React from "react";
import Image from "next/image";
import { ICONS } from "@/lib/constants";
import { ChevronRight } from "lucide-react";

const MemberApprovalTab = () => {
  return (
    <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
      <div className="flex items-center   ">
        <div className="p-4">
          <Image
            src={ICONS.ApprovalIcon}
            alt="approval-icon"
            height={25}
            width={25}
          />
        </div>
        <div className="flex-col ">
          <h1 className="font-medium text-xs">Members Approval</h1>
          <p className="text-xs text-gray-600">
            Evaluate and decide on requests by either approving or rejecting
            them.
          </p>
        </div>
      </div>
      <div className="flex justify-between gap-5">
        <div className="bg-orange-500   p-2   rounded-xl">
          <p className="text-white text-xs text-center ">1000+</p>
        </div>

        <div>
          <ChevronRight />
        </div>
      </div>
    </div>
  );
};

export default MemberApprovalTab;
