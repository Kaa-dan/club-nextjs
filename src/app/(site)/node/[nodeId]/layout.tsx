"use client";
import NodeProfileCard from "@/components/pages/node/node-profile-card";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TeamsSidePopover from "@/components/pages/club/club-teams";
import ModulesBar from "@/components/pages/forum-common/module-bar";
import { useNodeCalls } from "@/hooks/apis/use-node-calls";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { fetchNodeDetails, fetchNodeJoinStatus } = useNodeCalls();
  const [currentPage, setCurrentPage] = useState("modules");
  const params = useParams<{ nodeId: string; plugin?: TPlugins }>();

  useEffect(() => {
    if (params?.nodeId) {
      fetchNodeDetails(params?.nodeId);
      fetchNodeJoinStatus(params?.nodeId);
    }
  }, [params.nodeId]);

  return (
    <div className="flex w-full gap-6">
      <div className=" flex w-11/12 gap-3">
        <div className="w-1/4 shrink-0 flex-col">
          <NodeProfileCard
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
        <div className="flex w-3/4 flex-col ">
          <ModulesBar
            plugin={params?.plugin}
            forum={"node"}
            forumId={params.nodeId}
          />
          {children}
        </div>
      </div>
      <div className="">
        <TeamsSidePopover />
      </div>
    </div>
  );
};

export default Layout;
