"use client";
import ClubProfileCard from "@/components/pages/club/club-profile-card";
import ModulesBar from "@/components/pages/club/module-bar";
import NodeTeams from "@/components/pages/node/node-teams";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TClub } from "@/types";

import { fetchSpecificClub } from "@/components/pages/club/endpoint";
import Posts from "@/components/pages/club/club-modules/posts";
// Module Components
const RulesModule = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold">Club Rules</h2>
    {/* Add your Rules content here */}
  </div>
);

const MarketPlaceModule = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold">Marketplace</h2>
    {/* Add your Marketplace content here */}
  </div>
);

const DebateModule = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold">Debates</h2>
    {/* Add your Debate content here */}
  </div>
);

const EventsNewsModule = () => <Posts />;

const FunnyModule = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold">Fun Zone</h2>
    {/* Add your Funny content here */}
  </div>
);

const page = () => {
  const [currentModule, setCurrentModule] = useState("Rules");
  const [club, setClub] = useState<{ club: TClub; members: Array<any> }>();
  const params = useParams<{ clubId: string }>();

  const renderModuleContent = () => {
    switch (currentModule) {
      case "Rules":
        return <RulesModule />;
      case "Market Place":
        return <MarketPlaceModule />;
      case "Debate":
        return <DebateModule />;
      case "Events News":
        return <EventsNewsModule />;
      case "Funny":
        return <FunnyModule />;
      default:
        return <></>;
    }
  };

  useEffect(() => {
    if (params.clubId) {
      fetchSpecificClub(params.clubId as string).then((res) => {
        if (res) {
          setClub(res);
        }
      });
    }
  }, [params.clubId]);
  return (
    <>
      <div className="w-[20%] shrink-0 flex-col py-4">
        <ClubProfileCard
          clubId={params?.clubId as string}
          currentPage={currentModule}
          setCurrentPage={setCurrentModule}
          club={club as { club: TClub; members: Array<any> }}
        />
      </div>
      <div className="flex w-[50%] flex-col lg:w-3/5">
        <div className="sticky top-0 z-10 p-4">
          <ModulesBar
            currentModule={currentModule}
            onModuleChange={setCurrentModule}
          />
        </div>

        <div className="thin-scrollbar grow overflow-y-auto bg-white p-4">
          {renderModuleContent()}
        </div>
      </div>

      <div className="hidden w-[28%] shrink-0 flex-col py-4 lg:flex">
        <NodeTeams />
      </div>
    </>
  );
};

export default page;
