"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ClubProfileCard from "@/components/pages/club/club-profile-card";

import TeamsSidePopover from "@/components/pages/club/club-teams";
import { useClubCalls } from "@/hooks/apis/use-club-calls";
import ModulesBar from "@/components/pages/forum-common/module-bar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { fetchClubDetails, fetchClubJoinStatus } = useClubCalls();
  const [currentPage, setCurrentPage] = useState("modules");
  const params = useParams<{ clubId: string; plugin?: TPlugins }>();

  useEffect(() => {
    fetchClubDetails(params?.clubId);
    fetchClubJoinStatus(params?.clubId);
  }, [params.clubId]);

  return (
    <div className="relative flex w-full gap-6 ">
      <>
        <div className=" flex  w-11/12  gap-3">
          <div className="w-1/4 shrink-0 flex-col">
            <ClubProfileCard
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              clubId={params.clubId}
            />
          </div>
          <div className="flex w-3/4 flex-col ">
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
