"use client";
import ModulesBar from "@/components/pages/node/modules-bar";
import NodeProfileCard from "@/components/pages/node/node-profile-card";
import NodeTeams from "@/components/pages/node/node-teams";
import { Endpoints } from "@/utils/endpoint";
import React, { useEffect, useState } from "react";
import { NodeData } from "@/types";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [currentPage, setCurrentPage] = useState("modules");
  const [node, setNode] = useState<NodeData | null>(null);
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
