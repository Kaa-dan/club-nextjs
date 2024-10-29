"use client";
import ModulesBar from "@/components/pages/node/modules-bar";
import NodeProfileCard from "@/components/pages/node/node-profile-card";
import NodeTeams from "@/components/pages/node/node-teams";
import React, { useState } from "react";

const dummyNodeData = {
  name: "Gretchen Lehner",
  role: "Lead Markets Architect",
  location: "HSR, Bengaluru",
  members: [],
  avatar: "https://picsum.photos/200", // Replace with an actual image path or URL
  coverImage: "https://picsum.photos/500/200", // Replace with an actual image path or URL
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [currentPage, setCurrentPage] = useState("modules");
  const nodeId = "erjnekrnekjr";
  return (
    <div className="flex gap-6 w-full">
      <div className="w-[75%] flex gap-6">
        <NodeProfileCard
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          node={dummyNodeData}
        />
        <div className="flex flex-col w-full">
          <ModulesBar />
          {children}
        </div>
      </div>
      <NodeTeams />
    </div>
  );
};

export default Layout;
