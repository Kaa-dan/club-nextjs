"use client";
import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
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

const Page = ({ children }: { children: React.ReactNode }) => {
  const params = useParams<{ clubId: string }>();
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    if (params?.clubId) {
      Endpoints.fetchRequests(params && (params.clubId as string))
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });
    }
  }, [params?.clubId]);
  return (
    <>
      <div className="mt-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/club/${params.clubId}/approvals`}>
                Approvals
              </BreadcrumbLink>
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
