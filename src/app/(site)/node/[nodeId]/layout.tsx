"use client";
import ModulesBar from "@/components/pages/node/modules-bar";
import NodeProfileCard from "@/components/pages/node/node-profile-card";
import NodeTeams from "@/components/pages/node/node-teams";
import { Endpoints } from "@/utils/endpoint";
import React, { use, useEffect, useState } from "react";
import { TNodeData } from "@/types";

const Layout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { nodeId: string };
}) => {
  const [currentPage, setCurrentPage] = useState("modules");
  const [node, setNode] = useState<TNodeData | null>(null);
  const [nodeId, setNodeId] = useState<string | null>(null);
  console.log("nodeId", nodeId);

  // Fetch nodeId from params
  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setNodeId(resolvedParams.nodeId);
    };
    unwrapParams();
  }, [params]);
  const fetchNodeDetails = async () => {
    if (!nodeId) return;
    try {
      const response = await Endpoints.fetchNodeDetails(nodeId);
      setNode(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchNodeDetails();
  }, [nodeId]);
  use;
  return (
    <div className="flex gap-6 w-full">
      {node ? (
        <>
          <div className="w-[75%] flex gap-6">
            <NodeProfileCard
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              node={node}
            />
            <div className="flex flex-col w-full">
              <ModulesBar />
              {children}
            </div>
          </div>
          <NodeTeams />
        </>
      ) : (
        "Loading"
      )}
    </div>
  );
};

export default Layout;
