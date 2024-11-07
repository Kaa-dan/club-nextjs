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
    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-sm overflow-hidden border border-gray-300">
          <Image
            width={40}
            height={40}
            alt="user"
            src={request.user.profileImage}
            className="object-cover w-full h-full"
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
          className="px-4 py-1 text-xs font-medium text-red-600 border border-red-600 rounded hover:bg-red-100"
        >
          Reject
        </button>
        <button
          onClick={() => onAccept(request._id, "ACCEPTED")}
          className="px-4 py-1 text-xs font-medium text-green-600 border border-green-600 rounded hover:bg-green-100"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default ClubRequest;
