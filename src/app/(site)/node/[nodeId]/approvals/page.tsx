"use client";
import React, { useEffect, useState } from "react";
import { ICONS } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Endpoints } from "@/utils/endpoint";
import { useParams } from "next/navigation";

const ApprovalPage = () => {
  const { nodeId } = useParams<{ nodeId: string }>();
  const [request, setRequest] = useState<number>(0);
  const requestToShow = request > 10 ? "10" : request;

  const fetchRequests = async (nodeId: string) => {
    const response = await Endpoints.getNodeJoinRequests(nodeId);
    setRequest(
      response?.filter(
        ({ status }: { status: string }) => status === "REQUESTED"
      )?.length
    );
  };

  useEffect(() => {
    fetchRequests(nodeId);
  }, [nodeId]);
  return (
    <div className="flex flex-col items-center space-y-4 bg-gray-50 p-4">
      {/* Header with horizontal lines */}
      <div className="flex w-full items-center ">
        <hr className="grow border-t border-gray-300" />
        <span className="px-4 text-xs font-medium text-gray-500">
          Approvals
        </span>
        <hr className="grow border-t border-gray-300" />
      </div>

      {/* Approval card */}
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
    </div>
  );
};

export default ApprovalPage;
