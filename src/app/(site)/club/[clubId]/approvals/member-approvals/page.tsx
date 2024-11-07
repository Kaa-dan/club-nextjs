"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ClubRequest from "@/components/pages/club/club-request";
import { Endpoints } from "@/utils/endpoint";
import { Request } from "@/types";
import { Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

const Page = () => {
  const params = useParams<{ clubId: string }>();
  const [requests, setRequests] = useState<Request[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    requestId: string;
    status: string;
  } | null>(null);
  const [backupRequest, setBackupRequest] = useState<Request | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Ref to store the latest pendingAction state
  const pendingActionRef = useRef(pendingAction);

  // Update ref whenever pendingAction changes
  useEffect(() => {
    pendingActionRef.current = pendingAction;
  }, [pendingAction]);

  useEffect(() => {
    if (params?.clubId) {
      fetchRequests();
    }
  }, [params?.clubId]);

  const fetchRequests = async () => {
    try {
      const res = await Endpoints.fetchRequests(params.clubId);
      setRequests(
        res.filter((request: Request) => request.status === "REQUESTED")
      );
    } catch (err) {
      console.log(err, "err");
    }
  };

  const handleRequest = (requestId: string, status: string) => {
    console.log({ requestId, status });

    const requestToBackup = requests.find(
      (request) => request._id === requestId
    );
    if (!requestToBackup) return;

    // Backup and remove the request from the UI
    setBackupRequest(requestToBackup);
    setRequests((prevRequests) =>
      prevRequests.filter((request) => request._id !== requestId)
    );

    // Set pendingAction and update alert visibility
    setPendingAction({ requestId, status });
    setAlertVisible(true);

    // Set a timeout to make the API call after 5 seconds if "Undo" isn’t clicked
    const id = setTimeout(async () => {
      const currentPendingAction = pendingActionRef.current;
      if (currentPendingAction?.requestId === requestId) {
        try {
          await Endpoints.handleRequest(params.clubId, requestId, status);
          setAlertVisible(false);
          setPendingAction(null);
          setBackupRequest(null);
        } catch (error) {
          console.log(`${status} Error:`, error);
        }
      }
    }, 5000);

    setTimeoutId(id); // Save the timeout ID
  };

  const undoAction = () => {
    if (timeoutId) clearTimeout(timeoutId); // Clear the timeout if "Undo" is clicked

    if (backupRequest) {
      setRequests((prevRequests) => [...prevRequests, backupRequest]);
      setAlertVisible(false);
      setPendingAction(null);
      setBackupRequest(null); // Clear the backup
    }
  };

  return (
    <>
      <div className="mt-2">{/* Breadcrumbs and other UI elements */}</div>
      <div className="p-6 bg-white shadow-lg rounded-lg mt-2">
        <h2 className="text-lg font-semibold mb-4">All Members request</h2>
        <div className="space-y-4">
          {alertVisible && (
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Action in Progress</AlertTitle>
              <div className="flex justify-between items-center">
                <AlertDescription>
                  Processing your request. You can undo within 5 seconds.
                </AlertDescription>
                <Button
                  className="bg-transparent border w-16 h-6 border-gray-500 text-gray-700"
                  onClick={undoAction}
                >
                  Undo
                </Button>
              </div>
            </Alert>
          )}

          {requests.length === 0 ? (
            <h1>No request</h1>
          ) : (
            requests.map((request) => (
              <ClubRequest
                key={request._id}
                request={request}
                onAccept={() => handleRequest(request._id, "ACCEPTED")}
                onReject={() => handleRequest(request._id, "REJECTED")}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
