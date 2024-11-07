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
    <div className="sticky top-16 h-fit max-h-[80vh]  w-full overflow-hidden rounded-lg bg-white pb-2 shadow-md">
      <div className="relative">
        {club?.club.coverImage && (
          <Image
            src={club.club.coverImage?.url}
            alt="Cover"
            width={300}
            height={150}
            className="h-24 w-full rounded-t-lg object-cover"
            layout="responsive"
          />
        )}

        <div className="absolute left-4 top-14">
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
      <div className="mt-6 px-4">
        <div className="flex flex-col justify-center gap-2">
          <h2 className="text-lg font-bold">{club?.club?.name}</h2>
          <p className="text-xs text-gray-500">{club?.club.about}</p>
          <p className="mt-2 flex text-xs font-medium text-gray-700">
            <span className="flex items-center gap-1">
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
              className="h-8 w-full border border-gray-500 bg-transparent text-gray-800 hover:bg-transparent"
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
        <div className="thin-scrollbar mt-4 max-h-[50vh] space-y-2 overflow-y-auto pb-4">
          {SECTIONS.map((section) => (
            <button
              key={section.name}
              className={`flex w-full items-center justify-between rounded-md p-2 ${
                currentPage === section.name
                  ? "border-primary border bg-green-50"
                  : "border border-white hover:bg-gray-100"
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
                    className="flex size-5 items-center justify-center rounded-full bg-orange-500 text-xs
                   font-medium text-white"
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
