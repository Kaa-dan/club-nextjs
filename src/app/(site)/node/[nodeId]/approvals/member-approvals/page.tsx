"use client";
import React, { useState, useEffect, act } from "react";
import { Endpoints } from "@/utils/endpoint";
import Image from "next/image";
import { TNodeJoinRequest } from "@/types";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, Loader2, X } from "lucide-react";

// Define types for member data and status
interface MemberStatus {
  loading: boolean;
  status: "Accepted" | "Rejected" | null;
}

const Page = () => {
  const [memberRequests, setMemberRequests] = useState<TNodeJoinRequest[]>([]);
  const [memberStatus, setMemberStatus] = useState<
    Record<string, MemberStatus>
  >({});
  const params = useParams<{ nodeId: string }>();

  const fetchJoinRequests = async () => {
    if (!params.nodeId) return;
    try {
      const response = await Endpoints.getNodeJoinRequests(params.nodeId);
      setMemberRequests(
        response?.filter(
          ({ status }: { status: string }) => status === "REQUESTED"
        )
      );
      console.log("join requesets", response.data);
      // Initialize status for each member
      const status = response.data.reduce(
        (acc: any, request: any) => {
          acc[request._id] = { loading: false, status: null };
          return acc;
        },
        {} as Record<string, MemberStatus>
      );

      setMemberStatus(status);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching members:", error.message);
      }
    }
  };
  useEffect(() => {
    fetchJoinRequests();
  }, [params?.nodeId]);

  const handleRequest = async (
    userId: string,
    requestId: string,
    action: "ACCEPTED" | "REJECTED"
  ) => {
    // Set loading state to true for the current member
    setMemberStatus((prevStatus) => ({
      ...prevStatus,
      [userId]: { ...prevStatus[userId], loading: true },
    }));
    try {
      const response = await Endpoints.toggleMembersRequest(
        params?.nodeId!,
        requestId,
        action
      );
      fetchJoinRequests();
      console.log("action response", response);
      if (!response.success) {
        throw new Error(response.message ?? "Something went wrong");
      }
      setMemberStatus((prevStatus) => ({
        ...prevStatus,
        [userId]: {
          loading: false,
          status: action === "REJECTED" ? "Rejected" : "Accepted",
        },
      }));
    } catch (error: unknown) {
      // Handle error and set loading to false
      if (error instanceof Error) {
        console.error("Error processing request:", error.message);
      }
      setMemberStatus((prevStatus) => ({
        ...prevStatus,
        [userId]: { ...prevStatus[userId], loading: false },
      }));
    }
  };

  console.log({ memberRequests });

  return (
    <div className="mt-10 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">All Members Request</h2>
      <div className="space-y-4">
        {memberRequests?.length > 0 ? (
          memberRequests?.map((request) => (
            <div
              key={request?.user?._id}
              className="flex items-center justify-between rounded-lg border p-2 hover:shadow-md"
            >
              <div className="flex items-center space-x-4">
                <Image
                  height={50}
                  width={50}
                  src={request?.user?.profileImage}
                  alt={request?.user?.firstName}
                  className="size-10 rounded-sm"
                />
                <div>
                  <h3 className="font-medium">
                    {request?.user?.firstName + " " + request?.user?.lastName}
                  </h3>
                  {/* change to 'title' when ready */}
                  <p className="text-sm text-gray-500">
                    {request?.user?.firstName}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {memberStatus[request?.user?._id]?.status ? (
                  <Button
                    disabled
                    className={`border-slate-300 bg-slate-100 px-2 py-1 ${
                      memberStatus[request.user._id].status === "Accepted"
                        ? "text-green-500"
                        : "text-red-500"
                    } rounded border`}
                  >
                    {memberStatus[request?.user?._id]?.status}
                  </Button>
                ) : memberStatus[request?.user?._id]?.loading ? (
                  <Button disabled={true} variant={"outline"} className="px-4">
                    <Loader2 className="animate-spin" size={"1rem"} />
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() =>
                        handleRequest(
                          request.user._id,
                          request?._id,
                          "REJECTED"
                        )
                      }
                      disabled={memberStatus[request.user._id]?.loading}
                      className={`px-2 py-1 ${
                        memberStatus[request?.user?._id]?.loading
                          ? "bg-gray-300"
                          : "border border-red-500  bg-white text-red-500 hover:bg-red-500 hover:text-white"
                      } rounded`}
                    >
                      {memberStatus[request?.user?._id]?.loading ? (
                        <Loader2 className="animate-spin" size={"1rem"} />
                      ) : (
                        <>
                          <X size={"1rem"} />
                          {"Reject"}
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() =>
                        handleRequest(
                          request?.user?._id,
                          request?._id,
                          "ACCEPTED"
                        )
                      }
                      disabled={memberStatus[request.user._id]?.loading}
                      className={`px-2 py-1 ${
                        memberStatus[request.user._id]?.loading
                          ? "bg-gray-300"
                          : "border border-green-500 bg-white text-green-500 hover:bg-green-500 hover:text-white"
                      } rounded`}
                    >
                      {memberStatus[request.user._id]?.loading ? (
                        <Loader2 className="animate-spin" size={"1rem"} />
                      ) : (
                        <>
                          <Check size={"1rem"} />
                          {"Accept"}
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="my-32 text-center text-base font-medium text-slate-400">
            No requests to show
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;
