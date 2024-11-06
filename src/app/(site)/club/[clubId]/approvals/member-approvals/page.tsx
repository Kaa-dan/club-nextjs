"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"; // Replace with the actual import path if needed
import ClubRequest from "@/components/pages/club/club-request";
import { Endpoints } from "@/utils/endpoint";
import { useHandleParams } from "@/hooks/use-handle-params";
interface LayoutParams {
  clubId: string;
}

const Page = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<LayoutParams> | LayoutParams;
}) => {
  const {
    error,
    isLoading,
    params: ResolvedParams,
  } = useHandleParams<LayoutParams>(params);
  console.log({ ResolvedParams });
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    if (!isLoading && ResolvedParams.clubId) {
      Endpoints.fetchRequests(
        ResolvedParams && (ResolvedParams.clubId as string)
      )
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });
    }
  }, [ResolvedParams.clubId]);
  return (
    <>
      <div className="mt-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Approvals</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage
              // href="/club/clu/bid/approvals/member-approvals"
              >
                Member Approvals
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="p-6 bg-white shadow-lg rounded-lg mt-2">
        <h2 className="text-lg font-semibold mb-4">All Members request</h2>
        <div className="space-y-4">
          {requests.length == 0 ? <h1>No request</h1> : <ClubRequest />}
        </div>
      </div>
    </>
  );
};

export default Page;
