import React from "react";
import Image from "next/image";
import { Request } from "@/types";

interface ClubRequestProps {
  request: Request;
  onAccept: (requestId: string, status: string) => void;
  onReject: (requestId: string, status: string) => void;
}

const ClubRequest: React.FC<ClubRequestProps> = ({
  request,
  onAccept,
  onReject,
}) => {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="size-10 overflow-hidden rounded-sm border border-gray-300">
          <Image
            width={40}
            height={40}
            alt="user"
            src={request.user.profileImage}
            className="size-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium">{request.user.firstName}</h3>
          <p className="text-xs text-gray-500">{request.role}</p>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onReject(request._id, "REJECTED")}
          className="rounded border border-red-600 px-4 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
        >
          Reject
        </button>
        <button
          onClick={() => onAccept(request._id, "ACCEPTED")}
          className="rounded border border-green-600 px-4 py-1 text-xs font-medium text-green-600 hover:bg-green-100"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default ClubRequest;
