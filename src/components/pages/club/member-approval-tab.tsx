import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ICONS } from "@/lib/constants";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Endpoints } from "@/utils/endpoint";

const MemberApprovalTab: React.FC<{ clubId: string }> = ({ clubId }) => {
  const [request, setRequest] = useState<number>(0);
  const requestToShow = request > 10 ? "10" : request;
  useEffect(() => {
    Endpoints.fetchRequests(clubId).then((res) => {
      setRequest(res.length);
    });
  }, []);
  return (
    <Link
      href={"approvals/member-approvals"}
      className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm"
    >
      <div className="flex items-center ">
        <div className="p-4">
          <Image
            src={ICONS.ApprovalIcon}
            alt="approval-icon"
            height={25}
            width={25}
          />
        </div>
        <div className="flex-col ">
          <h1 className="text-xs font-medium">Members Approval</h1>
          <p className="text-xs text-gray-600">
            Evaluate and decide on requests by either approving or rejecting
            them.
          </p>
        </div>
      </div>
      <div className="flex justify-between gap-5">
        {request > 0 && (
          <div className="rounded-xl   bg-orange-500   p-2">
            <p className="text-center text-xs text-white ">{requestToShow}</p>
          </div>
        )}

        <div>
          <ChevronRight />
        </div>
      </div>
    </Link>
  );
};

export default MemberApprovalTab;
