"use client";
import React, { useState, useEffect, act } from "react";
import { Endpoints } from "@/utils/endpoint";
import Image from "next/image";
import { TNodeJoinRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { Check, Loader2, X } from "lucide-react";

// Define types for member data and status
interface MemberStatus {
  loading: boolean;
  status: "Accepted" | "Rejected" | null;
}

const Page = ({ params }: { params: { nodeId: string } }) => {
  const [memberRequests, setMemberRequests] = useState<TNodeJoinRequest[]>([]);
  const [memberStatus, setMemberStatus] = useState<
    Record<string, MemberStatus>
  >({});
  const [nodeId, setNodeId] = useState<string | null>(null);
  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setNodeId(resolvedParams.nodeId);
    };
    unwrapParams();
  }, [params]);

  // Fetch members data from backend
  useEffect(() => {
    const fetchMembers = async () => {
      if (!nodeId) return;
      try {
        const response = await Endpoints.getJoinRequests(nodeId); // Fetch members from the backend
        setMemberRequests(response.data);
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
    fetchMembers();
  }, [nodeId]);

  const handleRequest = async (userId: string, action: "accept" | "reject") => {
    // Set loading state to true for the current member
    setMemberStatus((prevStatus) => ({
      ...prevStatus,
      [userId]: { ...prevStatus[userId], loading: true },
    }));
    try {
      const response = await Endpoints.toggleMembersRequest(
        nodeId!,
        userId,
        action
      );
      console.log("action response", response);
      if (!response.success) {
        throw new Error(response.message ?? "Something went wrong");
      }
      setMemberStatus((prevStatus) => ({
        ...prevStatus,
        [userId]: {
          loading: false,
          status: action === "reject" ? "Rejected" : "Accepted",
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

  return (
    <div className="p-6 mt-10 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">All Members Request</h2>
      <div className="space-y-4">
        {memberRequests.length > 0 ? (
          memberRequests.map((request) => (
            <div
              key={request.user._id}
              className="flex items-center justify-between p-2 border rounded-lg hover:shadow-md"
            >
              <div className="flex items-center space-x-4">
                <Image
                  height={50}
                  width={50}
                  src={request.user.profileImage}
                  alt={request.user.firstName}
                  className="w-10 h-10 rounded-sm"
                />
                <div>
                  <h3 className="font-medium">
                    {request.user.firstName + " " + request.user.lastName}
                  </h3>
                  {/* change to 'title' when ready */}
                  <p className="text-sm text-gray-500">
                    {request.user.firstName}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {memberStatus[request.user._id]?.status ? (
                  <Button
                    disabled
                    className={`px-2 py-1 bg-slate-100 border-slate-300 ${
                      memberStatus[request.user._id].status === "Accepted"
                        ? "text-green-500"
                        : "text-red-500"
                    } border rounded`}
                  >
                    {memberStatus[request.user._id].status}
                  </Button>
                ) : memberStatus[request.user._id]?.loading ? (
                  <Button disabled={true} variant={"outline"} className="px-4">
                    <Loader2 className="animate-spin" size={"1rem"} />
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => handleRequest(request.user._id, "reject")}
                      disabled={memberStatus[request.user._id]?.loading}
                      className={`px-2 py-1 ${
                        memberStatus[request.user._id]?.loading
                          ? "bg-gray-300"
                          : "text-red-500 bg-white  border border-red-500 hover:bg-red-500 hover:text-white"
                      } rounded`}
                    >
                      {memberStatus[request.user._id]?.loading ? (
                        <Loader2 className="animate-spin" size={"1rem"} />
                      ) : (
                        <>
                          <X size={"1rem"} />
                          {"Reject"}
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleRequest(request.user._id, "accept")}
                      disabled={memberStatus[request.user._id]?.loading}
                      className={`px-2 py-1 ${
                        memberStatus[request.user._id]?.loading
                          ? "bg-gray-300"
                          : "text-green-500 bg-white border border-green-500 hover:bg-green-500 hover:text-white"
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
          <p className="text-slate-400 text-center font-medium text-base my-32">
            No requests to show
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;
