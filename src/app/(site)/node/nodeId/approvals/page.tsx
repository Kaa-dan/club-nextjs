import React from "react";
import { ICONS } from "@/lib/constants";
import Image from "next/image";

const page = () => {
  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-gray-50">
      {/* Header with horizontal lines */}
      <div className="flex items-center w-full">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="px-4 text-gray-500 text-xs font-medium">
          Approvals
        </span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      {/* Approval card */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md border border-gray-200 w-full max-w-full">
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
            <h2 className="font-semibold text-lg text-gray-800">
              Member Approval
            </h2>
            <p className="text-gray-500 text-sm">
              Evaluate and decide on requests by either approving or rejecting
              them.
            </p>
          </div>
        </div>
        <button className="text-white bg-orange-500 hover:bg-orange-600 rounded-full px-4 py-2 font-semibold">
          561+
        </button>
      </div>
    </div>
  );
};

export default page;
