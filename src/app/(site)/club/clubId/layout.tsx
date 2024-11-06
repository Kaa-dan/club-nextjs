"use client";
import ClubProfileCard from "@/components/pages/club/club-profile-card";
import ModulesBar from "@/components/pages/node/modules-bar";
import NodeProfileCard from "@/components/pages/node/node-profile-card";
import NodeTeams from "@/components/pages/node/node-teams";
import React, { useState } from "react";

const dummyClubData = {
  name: "Gretchen Lehner",
  descripion:
    "Lead Markets Architect  with an actual image path or URL with an actual image path or URL",
  isPublic: false,
  membersCount: "2.4k Members",
  avatar: "https://picsum.photos/200", // Replace with an actual image path or URL
  coverImage: "https://picsum.photos/500/200", // Replace with an actual image path or URL
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [currentPage, setCurrentPage] = useState("modules");
  return (
    <div className="flex gap-6 w-full">
      <div className="flex gap-6">
        <ClubProfileCard
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          club={dummyClubData}
        />
        <div className="flex flex-col w-full">
          <ModulesBar />
          {children}
        </div>
      </div>
      {/* <NodeTeams /> */}
    </div>
  );
};

export default Layout;
