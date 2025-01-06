"use client";
import NodeProfileCard from "@/components/pages/node/node-profile-card";
import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import TeamsSidePopover from "@/components/pages/club/club-teams";
import ModulesBar from "@/components/pages/forum-common/module-bar";
import { useNodeCalls } from "@/hooks/apis/use-node-calls";
import ChaptersProfileCard from "@/components/pages/chapters/chapter-profile-card";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { fetchNodeDetails, fetchNodeJoinStatus } = useNodeCalls();
  const [currentPage, setCurrentPage] = useState("modules");
  const params = useParams<{ nodeId: string; plugin?: TPlugins }>();
  const pathname = usePathname();

  const isChaptersRoute = pathname.includes("/chapters/");

  useEffect(() => {
    if (params?.nodeId) {
      fetchNodeDetails(params?.nodeId);
      fetchNodeJoinStatus(params?.nodeId);
    }
  }, [params.nodeId]);

  return (
    <div className="flex w-full">
      <div className="flex w-[calc(100%-3rem)] gap-6">
        <div className="w-1/4 shrink-0 flex-col">
          <ChaptersProfileCard
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
        <div className="flex w-3/4 flex-col">
          <ModulesBar
            plugin={params?.plugin}
            forum={"node"}
            forumId={params.nodeId}
          />
          {children}
        </div>
      </div>
      <div className="relative">
        <TeamsSidePopover />
      </div>
    </div>
  );
};

export default Layout;
