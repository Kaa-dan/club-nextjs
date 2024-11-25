"use client";
import NodeProfileCard from "@/components/pages/node/node-profile-card";
import { Endpoints } from "@/utils/endpoint";
import React, { useEffect, useState } from "react";
import { TMembers, TNodeData } from "@/types";
import { useParams } from "next/navigation";
import TeamsSidePopover from "@/components/pages/club/club-teams";
import { useNodeStore } from "@/store/nodes-store";
import ModulesBar from "@/components/pages/forum-common/module-bar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [currentPage, setCurrentPage] = useState("modules");
  const [node, setNode] = useState<{
    node: TNodeData;
    members: TMembers[];
  } | null>(null);
  const params = useParams<{ nodeId: string; plugin?: TPlugins }>();
  const { setCurrentNode } = useNodeStore((state) => state);

  const fetchNodeDetails = async () => {
    console.log("fetching new node details");
    if (!params.nodeId) return;
    try {
      const response = await Endpoints.fetchNodeDetails(params.nodeId);
      setCurrentNode(response.data);
      setNode(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchNodeDetails();
  }, [params.nodeId]);

  return (
    <div className="flex w-full gap-6">
      <div className=" flex w-11/12 gap-3">
        <div className="w-1/4 shrink-0 flex-col">
          <NodeProfileCard
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            nodeData={node!}
          />
        </div>
        <div className="flex w-3/4 flex-col ">
          <ModulesBar plugin={params?.plugin} forumId={params.nodeId} />
          {children}
        </div>
      </div>
      {/* <div className="hidden lg:flex">
            <NodeTeams />
          </div> */}
      <div className="">
        <TeamsSidePopover />
      </div>
    </div>
  );
};

export default Layout;
