"use client";
import React, { useEffect, useState } from "react";
import { TClub, TMembers } from "@/types";
import { useParams } from "next/navigation";
import ClubProfileCard from "@/components/pages/club/club-profile-card";
import ModulesBar from "@/components/pages/club/module-bar";
import { fetchSpecificClub } from "@/components/pages/club/endpoint";
import TeamsSidePopover from "@/components/pages/club/club-teams";
import { useClubStore } from "@/store/clubs-store";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [currentPage, setCurrentPage] = useState("modules");
  const [club, setClub] = useState<{
    club: TClub;
    members: TMembers[];
  } | null>(null);
  const params = useParams<{ clubId: string; plugin?: TPlugins }>();
  const { setCurrentClub } = useClubStore((state) => state);

  const fetchClubDetails = async () => {
    console.log("fetching new club details");
    if (!params.clubId) return;
    try {
      const res = await fetchSpecificClub(params.clubId);
      console.log({ current: res });

      setCurrentClub(res);

      setClub(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchClubDetails();
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
              club={club!}
            />
          </div>
          <div className="flex w-3/4 flex-col ">
            <ModulesBar plugin={params?.plugin} clubId={params.clubId} />
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
