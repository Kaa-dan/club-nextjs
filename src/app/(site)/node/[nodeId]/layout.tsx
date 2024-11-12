"use client";
import ModulesBar from "@/components/pages/node/modules-bar";
import NodeProfileCard from "@/components/pages/node/node-profile-card";
import NodeTeams from "@/components/pages/node/node-teams";
import { Endpoints } from "@/utils/endpoint";
import React, { useEffect, useState } from "react";
import { TMembers, TNodeData } from "@/types";
import { useParams } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [currentPage, setCurrentPage] = useState("modules");
  const [node, setNode] = useState<{
    node: TNodeData;
    members: TMembers[];
  } | null>(null);
  const params = useParams<{ nodeId: string }>();

  const fetchNodeDetails = async () => {
    if (!params.nodeId) return;
    try {
      const response = await Endpoints.fetchNodeDetails(params.nodeId);
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
      {node ? (
        <>
          <div className=" flex w-full gap-3  lg:w-3/4">
            <div className="w-1/4 shrink-0 flex-col">
              <NodeProfileCard
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                nodeData={node}
              />
            </div>
            <div className="flex w-3/4 flex-col ">
              <ModulesBar nodeId={params.nodeId} />
              {children}
            </div>
          </div>
          <div className="hidden lg:flex">
            <NodeTeams />
          </div>
        </>
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default Layout;
