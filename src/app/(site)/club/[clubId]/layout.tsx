"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// import ClubProfileCard from "@/components/pages/club/club-profile-card";

import TeamsSidePopover from "@/components/pages/club/club-teams";
import { useClubCalls } from "@/hooks/apis/use-club-calls";
import ModulesBar from "@/components/pages/forum-common/module-bar";
import ForumSidebar from "@/components/globals/forum-sidebar";
import { useClubStore } from "@/store/clubs-store";
import { joinClub } from "@/components/pages/club/endpoint";
import { Endpoints } from "@/utils/endpoint";
import { ClubEndpoints } from "@/utils/endpoints/club";
import { toast } from "sonner";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { fetchClubDetails, fetchClubJoinStatus } = useClubCalls();
  const [currentPage, setCurrentPage] = useState("modules");
  const params = useParams<{ clubId: string; plugin?: TPlugins }>();
  const {
    setUserJoinedClubs,
    setUserRequestedClubs,
    currentClub,
    clubJoinStatus,
    currentUserRole,
  } = useClubStore((state) => state);
  useEffect(() => {
    if (params?.clubId) {
      fetchClubDetails(params?.clubId);
      fetchClubJoinStatus(params?.clubId);
    }
  }, [params.clubId]);

  const joinToClub = async (clubId: string) => {
    try {
      const response = await joinClub(clubId);
      const joinedClubs = await Endpoints.fetchUserJoinedClubs();
      const requestedClubs = await ClubEndpoints.fetchUserRequestedClubs();
      setUserJoinedClubs(joinedClubs);
      setUserRequestedClubs(requestedClubs);
      // setJoinStatus(response.status);
      fetchClubJoinStatus(clubId);
    } catch (error) {
      console.log({ error });
    }
  };

  const cancelJoinRequest = async (clubId: string) => {
    try {
      const response = await ClubEndpoints.cancelJoinRequest(clubId);
      const requestedClubs = await ClubEndpoints.fetchUserRequestedClubs();
      setUserRequestedClubs(requestedClubs);
      fetchClubJoinStatus(clubId);
      console.log(response);
      toast.success("Request Cancelled");
      // setCancelRequestTriggered(!cancelRequestTriggered);
    } catch (error) {
      console.log(error);
      toast.error("Error while cancelling request");
    }
  };

  return (
    <div className="relative flex w-full gap-6  ">
      <>
        <div className=" flex  w-11/12 gap-3 ">
          <div className="w-1/4 shrink-0 flex-col">
            <ForumSidebar
              type="club"
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              forumId={params?.clubId}
              currentForum={currentClub}
              joinStatus={clubJoinStatus!}
              onJoin={joinToClub}
              currentUserRole={currentUserRole}
              onCancelRequest={cancelJoinRequest}
              members={currentClub?.members || []}
            />
          </div>
          <div className="flex w-3/4 flex-col items-start ">
            <ModulesBar
              plugin={params?.plugin}
              forum={"club"}
              forumId={params.clubId}
            />
            {children}
          </div>
        </div>
        <div className="">
          <TeamsSidePopover />
        </div>
      </>
    </div>
  );
};

export default Layout;
