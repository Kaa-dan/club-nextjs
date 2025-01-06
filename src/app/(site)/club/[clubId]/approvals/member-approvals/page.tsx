"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ClubRequest from "@/components/pages/club/club-request";
import { Endpoints } from "@/utils/endpoint";
import { Request } from "@/types";
import { Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ICONS } from "@/lib/constants";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
    }, 3000);

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
      <div className="mt-2 ">{/* Breadcrumbs and other UI elements */}</div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/club/${params.clubId}/approvals`}>
              Approvals
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage> Member approvals</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-2 rounded-lg bg-white p-6 shadow-lg w-full">
        <h2 className="mb-4 text-lg font-semibold">All Members request</h2>
        <div className="space-y-4">
          {alertVisible && (
            <div className="py-4">
              <Alert className="animate-bounce ">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div>
                      <Image
                        src={ICONS.GreenCheckMark}
                        alt="green-tick"
                        width={25}
                        height={25}
                      />
                    </div>
                    <div>
                      <AlertDescription>
                        Processing your request. You can undo within 5 seconds.
                      </AlertDescription>
                    </div>
                  </div>
                  <Button
                    className="h-6 w-16 border border-gray-500 bg-transparent text-gray-700"
                    onClick={undoAction}
                  >
                    Undo
                  </Button>
                </div>
              </Alert>
            </div>
          )}
          {requests.length === 0 ? (
            <h1 className="my-3 text-center text-muted-foreground">
              No request
            </h1>
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
