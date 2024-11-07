"use client";
import ClubProfileCard from "@/components/pages/club/club-profile-card";
import ModulesBar from "@/components/pages/club/module-bar";
import NodeProfileCard from "@/components/pages/node/node-profile-card";
import NodeTeams from "@/components/pages/node/node-teams";
import React, { useEffect, useState } from "react";
import { fetchSpecificClub } from "@/components/pages/club/endpoint";
import { useParams } from "next/navigation";
import { useHandleParams } from "@/hooks/use-handle-params";
import { TClub } from "@/types";
// const dummyClubData = {
//   name: "Gretchen Lehner",
//   descripion:
//     "Lead Markets Architect  with an actual image path or URL with an actual image path or URL",
//   isPublic: false,
//   membersCount: "2.4k Members",
//   avatar: "https://picsum.photos/200", // Replace with an actual image path or URL
//   coverImage: "https://picsum.photos/500/200", // Replace with an actual image path or URL
// };

interface LayoutParams {
  clubId: string;
}

const Layout = ({
  children,
}: {
  children: React.ReactNode;
  params: Promise<LayoutParams> | LayoutParams;
}) => {
  const [currentPage, setCurrentPage] = useState("modules");
  const [club, setCLub] = useState<TClub>();
  const params = useParams<{ clubId: string }>();
  console.log({ params });
  // const {
  //   params: resolvedParams,
  //   isLoading,
  //   error,
  // } = useHandleParams<LayoutParams>(params);

  useEffect(() => {
    if (params.clubId) {
      fetchSpecificClub(params.clubId as string).then((res) => {
        if (res) {
          setCLub(res);
        }
      });
    }
  }, [params.clubId]);

  return (
    <div className="flex gap-6 w-full">
      <div className="flex gap-6 w-[75%]">
        <div className="w-[25%]">
          {" "}
          <ClubProfileCard
            clubId={params?.clubId as string}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            club={club as TClub}
          />
        </div>

        <div className="flex flex-col gap-4 w-[75%]">
          <ModulesBar />
          {children}
        </div>
      </div>
      <NodeTeams />
    </div>
  );
};

export default Layout;
