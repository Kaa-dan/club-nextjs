import React from "react";
import { ICONS } from "@/lib/constants";
import Image from "next/image";

const page = () => {
  return (
    <div className="flex flex-col items-center space-y-4 bg-gray-50 p-4">
      {/* Header with horizontal lines */}
      <div className="flex w-full items-center">
        <hr className="grow border-t border-gray-300" />
        <span className="px-4 text-xs font-medium text-gray-500">
          Approvals
        </span>
        <hr className="grow border-t border-gray-300" />
      </div>

      {/* Approval card */}
      <div className="flex w-full max-w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-md">
        <div className="flex items-center">
          {/* <FaUserFriends className="text-gray-600 text-2xl mr-4" /> */}
          <div className="p-4">
            <Image
              src={ICONS.ApprovalIcon}
              alt="approval-icon"
              height={50}
              width={50}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Member Approval
            </h2>
            <p className="text-sm text-gray-500">
              Evaluate and decide on requests by either approving or rejecting
              them.
            </p>
          </div>
        </div>
        <button className="rounded-full bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600">
          561+
        </button>
      </div>
    </div>
  );
};

export default page;
