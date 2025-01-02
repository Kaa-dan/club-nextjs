"use client";
import NodeProfileCard from "@/components/pages/node/node-profile-card";
import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import TeamsSidePopover from "@/components/pages/club/club-teams";
import ModulesBar from "@/components/pages/forum-common/module-bar";
import { useNodeCalls } from "@/hooks/apis/use-node-calls";
import ForumSidebar from "@/components/globals/forum-sidebar";
import { useNodeStore } from "@/store/nodes-store";
import { Endpoints } from "@/utils/endpoint";
import { NodeEndpoints } from "@/utils/endpoints/node";
import { toast } from "sonner";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { fetchNodeDetails, fetchNodeJoinStatus } = useNodeCalls();

  const [currentPage, setCurrentPage] = useState("modules");
  const {
    currentNode,
    nodeJoinStatus,
    setNodeJoinStatus,
    setUserRequestedNodes,
  } = useNodeStore((state) => state);
  const params = useParams<{ nodeId: string; plugin?: TPlugins }>();
  const pathname = usePathname();

  const isChaptersRoute = pathname.includes("/chapters/");

  useEffect(() => {
    if (params?.nodeId) {
      fetchNodeDetails(params?.nodeId);
      fetchNodeJoinStatus(params?.nodeId);
    }
  }, [params.nodeId]);

  if (isChaptersRoute) {
    return <>{children}</>;
  }

  const joinToNode = async (nodeId: string) => {
    try {
      const response = await Endpoints.requestToJoinNode(nodeId);
      const requestedNodes = await NodeEndpoints.fetchUserRequestedNodes();
      setUserRequestedNodes(requestedNodes);
      setNodeJoinStatus(response.status);
    } catch (error) {
      console.log({ error });
    }
  };

  const cancelJoinRequest = async (nodeId: string) => {
    try {
      const response = await NodeEndpoints.cancelJoinRequest(nodeId);
      const requestedNodes = await NodeEndpoints.fetchUserRequestedNodes();
      setUserRequestedNodes(requestedNodes);
      console.log(response);
      toast.success("Request Cancelled");
      fetchNodeJoinStatus(nodeId);
    } catch (error) {
      console.log(error);
      toast.error("Error while cancelling request");
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex w-[calc(100%-3rem)] gap-6">
        <div className="w-1/4 shrink-0 flex-col">
          <ForumSidebar
            type="node"
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            forumId={params.nodeId}
            currentForum={currentNode}
            joinStatus={nodeJoinStatus!}
            onJoin={joinToNode}
            onCancelRequest={cancelJoinRequest}
            members={currentNode?.members || []}
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
