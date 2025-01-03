"use client";
import React from "react";
import Image from "next/image";
import { ICONS } from "@/lib/constants";
import MemberApprovalTab from "@/components/pages/club/member-approval-tab";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

const ApprovalPage = () => {
  const params = useParams<{ clubId: string }>();

  return (
    <>
      <div className="flex items-center justify-center w-full py-5">
        <div className="w-16 border-t border-gray-300"></div>
        <span className="mx-2 text-gray-800 ">Approvals</span>
        <div className="w-16 border-t border-gray-300"></div>
      </div>
      <div className=" w-full flex item-center justify-center">
        <div className="w-full shadow-md">
          <MemberApprovalTab clubId={params.clubId} />
        </div>
      </div>
      {/* <div className="flex   items-center justify-between rounded-md bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Image
            className="flex items-center"
            src={ICONS.GreenCheckMark}
            alt="green-tick"
            width={25}
            height={25}
          />

          <div className="text-xs">
            You have Accept the Cameron Williamson feed post. View post
          </div>
        </div>
        <div>
          <Button className="h-6 w-24 border border-gray-500 bg-gray-300 text-xs text-gray-700">
            Undo
          </Button>
        </div>
      </div> */}
    </>
  );
};

export default ApprovalPage;
