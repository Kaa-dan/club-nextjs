"use client";
import React, { useState, useEffect } from "react";
import { Endpoints } from "@/utils/endpoint";
import Image from "next/image";
import { TNodeJoinRequest } from "@/types";
import { useParams } from "next/navigation";

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

  useEffect(() => {
    const fetchMembers = async () => {
      if (!params.nodeId) return;
      try {
        const response = await Endpoints.getJoinRequests(params.nodeId);
        setMemberRequests(response.data);
        6;
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
  }, []);

  const handleRequest = async (userId: string, action: "accept" | "reject") => {
    // Set loading state to true for the current member
    setMemberStatus((prevStatus) => ({
      ...prevStatus,
      [userId]: { ...prevStatus[userId], loading: true },
    }));

    try {
      const response = await Endpoints.toggleMembersRequest(userId, action);

      // Use the response status to update the member's status in the UI
      setMemberStatus((prevStatus) => ({
        ...prevStatus,
        [userId]: {
          loading: false,
          status: response.data.status, // Set to the status returned by the API
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
    <div className="mt-10 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">All Members Request</h2>
      <div className="space-y-4">
        {memberRequests.map((request) => (
          <div
            key={request.user._id}
            className="flex items-center justify-between rounded-lg border p-2 hover:shadow-md"
          >
            <div className="flex items-center space-x-4">
              <Image
                height={50}
                width={50}
                src={request.user.profileImage}
                alt={request.user.firstName}
                className="size-10 rounded-sm"
              />
              <div>
                <h3 className="font-medium">
                  {request.user.firstName + " " + request.user.lastName}
                </h3>
                {/* change to 'title' when ready */}
                <p className="text-sm text-gray-500">{request.user.title}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {memberStatus[request.user._id]?.status ? (
                <span
                  className={`px-2 py-1 ${
                    memberStatus[request.user._id].status === "Accepted"
                      ? "text-green-500"
                      : "text-red-500"
                  } rounded border`}
                >
                  {memberStatus[request.user._id].status}
                </span>
              ) : (
                <>
                  <button
                    onClick={() => handleRequest(request.user._id, "reject")}
                    disabled={memberStatus[request.user._id]?.loading}
                    className={`px-2 py-1 ${
                      memberStatus[request.user._id]?.loading
                        ? "bg-gray-300"
                        : "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    } rounded`}
                  >
                    {memberStatus[request.user._id]?.loading
                      ? "Loading..."
                      : "Reject"}
                  </button>
                  <button
                    onClick={() => handleRequest(request.user._id, "accept")}
                    disabled={memberStatus[request.user._id]?.loading}
                    className={`px-2 py-1 ${
                      memberStatus[request.user._id]?.loading
                        ? "bg-gray-300"
                        : "border border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                    } rounded`}
                  >
                    {memberStatus[request.user._id]?.loading
                      ? "Loading..."
                      : "Accept"}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
