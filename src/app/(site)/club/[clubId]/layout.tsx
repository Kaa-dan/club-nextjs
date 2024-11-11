"use client";
import ClubProfileCard from "@/components/pages/club/club-profile-card";
import ModulesBar from "@/components/pages/club/module-bar";
import NodeTeams from "@/components/pages/node/node-teams";
import React, { useEffect, useState } from "react";
import { fetchSpecificClub } from "@/components/pages/club/endpoint";
import { useParams } from "next/navigation";
import { TClub } from "@/types";
import NodeProfileCard from "@/components/pages/node/node-profile-card";

interface LayoutParams {
  clubId: string;
}

const Layout = ({
  children,
}: {
  children: React.ReactNode;
  params: Promise<LayoutParams> | LayoutParams;
}) => {
  const [currentPage, setCurrentPage] = useState("modules");
  const [club, setCLub] = useState<{ club: TClub; members: Array<any> }>();
  const params = useParams<{ clubId: string }>();

  useEffect(() => {
    if (params.clubId) {
      fetchSpecificClub(params.clubId as string).then((res) => {
        if (res) {
          setCLub(res);
        }
      });
    }
  }, [params.clubId]);

  return (
    <div className="flex h-auto min-h-screen w-full pb-8 ">
      {/* <div className="hidden w-56 shrink-0 flex-col  py-4 lg:flex"> */}
      <div className="w-1/4 shrink-0 flex-col  py-4">
        <ClubProfileCard
          clubId={params?.clubId as string}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          club={club as { club: TClub; members: Array<any> }}
        />
      </div>

      <div className="flex w-full  flex-col lg:w-3/5">
        {/* <div className="sticky top-0 z-10"> */}
        <ModulesBar />
        {/* </div> */}

        <div className="thin-scrollbar grow overflow-y-auto p-4">
          {children}
        </div>
      </div>

      {/* <div className="hidden  w-[28%] shrink-0 flex-col  py-4 lg:flex">
        <NodeTeams />
      </div> */}
    </div>
  );
};

export default Layout;
