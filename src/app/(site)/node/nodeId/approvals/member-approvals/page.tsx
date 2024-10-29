"use client";
import React, { useState, useEffect } from "react";
import { Endpoints } from "@/utils/endpoint";

// Define types for member data and status
interface MemberStatus {
  loading: boolean;
  status: "Accepted" | "Rejected" | null;
}

const Page: React.FC = () => {
  const [members, setMembers] = useState([]);
  const [memberStatus, setMemberStatus] = useState<
    Record<string, MemberStatus>
  >({});

  // Fetch members data from backend
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await Endpoints.getMembers(); // Fetch members from the backend
        setMembers(response.data);

        // Initialize status for each member
        const status = response.data.reduce(
          (acc: any, member: any) => {
            acc[member.id] = { loading: false, status: null };
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
      // Call the API to toggle the member's request status
      const response = await Endpoints.toggleMembersRequest(userId, action); // Pass the action to the API

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
    <div className="p-6 mt-10 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">All Members Request</h2>
      <div className="space-y-4">
        {members.map((member: any) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-2 border rounded-lg hover:shadow-md"
          >
            <div className="flex items-center space-x-4">
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-10 h-10 rounded-sm"
              />
              <div>
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {memberStatus[member.id]?.status ? (
                <span
                  className={`px-2 py-1 ${
                    memberStatus[member.id].status === "Accepted"
                      ? "text-green-500"
                      : "text-red-500"
                  } border rounded`}
                >
                  {memberStatus[member.id].status}
                </span>
              ) : (
                <>
                  <button
                    onClick={() => handleRequest(member.id, "reject")}
                    disabled={memberStatus[member.id]?.loading}
                    className={`px-2 py-1 ${
                      memberStatus[member.id]?.loading
                        ? "bg-gray-300"
                        : "text-red-500 border border-red-500 hover:bg-red-500 hover:text-white"
                    } rounded`}
                  >
                    {memberStatus[member.id]?.loading ? "Loading..." : "Reject"}
                  </button>
                  <button
                    onClick={() => handleRequest(member.id, "accept")}
                    disabled={memberStatus[member.id]?.loading}
                    className={`px-2 py-1 ${
                      memberStatus[member.id]?.loading
                        ? "bg-gray-300"
                        : "text-green-500 border border-green-500 hover:bg-green-500 hover:text-white"
                    } rounded`}
                  >
                    {memberStatus[member.id]?.loading ? "Loading..." : "Accept"}
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
