import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ICONS } from "@/lib/constants";
import { ChevronRight, Globe2, Lock } from "lucide-react";
import { TClub } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { joinClub } from "./endpoint";
import { Endpoints } from "@/utils/endpoint";

interface ProfileCardProps {
  club: {
    club: TClub;
    members: Array<any>;
  };
  currentPage: string;
  setCurrentPage: (page: string) => void;
  clubId: string;
}

const ClubProfileCard: React.FC<ProfileCardProps> = ({
  club,
  currentPage,
  setCurrentPage,
  clubId,
}) => {
  const [joinStatus, setJoinStatus] = useState<String>("");
  const router = useRouter();
  const SECTIONS = [
    { name: "News Feed", icon: ICONS.NodeNewsFeedIcon, path: "/news-feed" },
    { name: "Modules", icon: ICONS.NodeModulesIcon, path: "/modules" },
    {
      name: "Profile",
      icon: ICONS.NodeProfileIcon,
      path: `/club/${clubId}/profile`,
    },
    {
      name: "Chapters",
      icon: ICONS.NodeChaptersIcon,
      notifications: 8,
      path: "/chapters",
    },
    {
      name: "Members",
      icon: ICONS.NodeMembersIcon,
      path: `/club/${clubId}/members`,
    },
    {
      name: "Approvals",
      icon: ICONS.NodeApprovalsIcon,
      notifications: 3,
      path: `/club/${clubId}/approvals`,
    },
    {
      name: "Insights/Analytics",
      icon: ICONS.NodeInsightsIcon,
      path: "/insights",
    },
    {
      name: "Activities",
      icon: ICONS.NodeActivitiesIcon,
      path: `/club/${clubId}/activity`,
    },
    {
      name: "Preferences",
      icon: ICONS.NodePreferencesIcon,
      path: "/preferences",
    },
  ];
  // console.log({ url: club.club.profileImage.url);

  const joinToClub = async (clubId: string) => {
    try {
      const response = await joinClub(clubId);
      setJoinStatus(response.status);
    } catch (error) {
      console.log({ error });
    }
  };
  useEffect(() => {
    console.log({ clubId });

    Endpoints.fetchClubUserStatus(clubId as string)
      .then((res) => {
        setJoinStatus(res.status);
      })
      .catch((err) => {
        console.log({ err });
      });
  }, [club?.club._id]);
  return (
    <div className="bg-white rounded-lg shadow-md  sticky top-16 h-fit max-h-[80vh] overflow-hidden pb-2">
      <div className="relative">
        {club?.club.coverImage && (
          <Image
            src={club.club.coverImage?.url}
            alt="Cover"
            width={300}
            height={150}
            className="w-full h-24 object-cover rounded-t-lg"
            layout="responsive"
          />
        )}

        <div className="absolute top-14 left-4">
          {club?.club.profileImage?.url && (
            <Image
              src={club?.club.profileImage?.url}
              alt="Avatar"
              width={64}
              height={64}
              className="rounded-md border-4 border-white"
            />
          )}
        </div>
      </div>
      <div className="px-4 mt-6">
        <div className="gap-2 flex justify-center flex-col">
          <h2 className="text-lg font-bold">{club?.club?.name}</h2>
          <p className="text-xs text-gray-500">{club?.club.about}</p>
          <p className="text-xs text-gray-700 mt-2 font-medium flex">
            <span className="flex gap-1 items-center">
              {club?.club.isPublic ? (
                <>
                  <Globe2 size={"0.8rem"} />
                  Public{" "}
                </>
              ) : (
                <>
                  <Lock size={"0.8rem"} />
                  Private{" "}
                </>
              )}{" "}
            </span>{" "}
            • {club?.members.length} Members
          </p>
          <div>
            <Button
              onClick={() => joinToClub(clubId)}
              className="w-full h-8 bg-transparent text-gray-800 hover:bg-transparent border-gray-500 border"
              disabled={joinStatus === "REQUESTED" || joinStatus === "MEMBER"} // Disable when requested or joined
            >
              {club?.club.isPublic && joinStatus === "VISITOR" && "Join"}
              {!club?.club.isPublic &&
                joinStatus === "VISITOR" &&
                "Request to Join"}
              {joinStatus === "MEMBER" && "Joined"}
              {joinStatus === "REQUESTED" && "Request Pending"}
            </Button>
          </div>
        </div>
        <div className="mt-4 space-y-2 overflow-y-auto max-h-[50vh] thin-scrollbar pb-4">
          {SECTIONS.map((section) => (
            <button
              key={section.name}
              className={`flex items-center justify-between w-full p-2 rounded-md ${
                currentPage === section.name
                  ? "bg-green-50 border-primary border"
                  : "hover:bg-gray-100 border border-white"
              }`}
              onClick={() => {
                setCurrentPage(section.name);
                router.push(section.path);
              }}
            >
              <span className="flex items-center space-x-2">
                <Image
                  src={section?.icon}
                  alt={section.name}
                  height={30}
                  width={30}
                  className="size-4"
                />
                <span>{section.name}</span>
              </span>
              <div className="flex gap-2">
                {section.notifications ? (
                  <span
                    className="bg-orange-500 text-white text-xs font-medium rounded-full flex items-center
                   justify-center size-5"
                  >
                    {section.notifications}
                  </span>
                ) : null}
                <ChevronRight size={"1rem"} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClubProfileCard;
