"use client";
import ModulesBar from "@/components/pages/node/modules-bar";
import NodeProfileCard from "@/components/pages/node/node-profile-card";
import NodeTeams from "@/components/pages/node/node-teams";
import { Endpoints } from "@/utils/endpoint";
import React, { useEffect, useState } from "react";
import { TNodeData } from "@/types";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [currentPage, setCurrentPage] = useState("modules");
  const [node, setNode] = useState<TNodeData | null>(null);
  const nodeID = "kasjdkljasdfklasdf";

  const fetchNodeDetails = async () => {
    try {
      const response = await Endpoints.fetchNodeDetails(nodeID);

      setNode(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchNodeDetails();
  }, []);
  return (
    <div className="flex w-full gap-6">
      {node ? (
        <>
          <div className="flex w-[75%] gap-6">
            <div className="flex w-full flex-col">
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
