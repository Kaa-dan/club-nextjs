import React from "react";
import Image from "next/image";
import { ICONS } from "@/lib/constants";
import { ChevronRight, Globe2, Lock } from "lucide-react";

const SECTIONS = [
  { name: "News Feed", icon: ICONS.NodeNewsFeedIcon },
  { name: "Modules", icon: ICONS.NodeModulesIcon },
  { name: "Profile", icon: ICONS.NodeProfileIcon },
  { name: "Chapters", icon: ICONS.NodeChaptersIcon, notifications: 8 },
  { name: "Members", icon: ICONS.NodeMembersIcon },
  { name: "Approvals", icon: ICONS.NodeApprovalsIcon, notifications: 3 },
  { name: "Insights/Analytics", icon: ICONS.NodeInsightsIcon },
  { name: "Activities", icon: ICONS.NodeActivitiesIcon },
  { name: "Preferences", icon: ICONS.NodePreferencesIcon },
];

interface NodeData {
  name: string;
  descripion: string;
  isPublic: boolean;
  membersCount: string;
  avatar: string;
  coverImage: string;
}

interface ProfileCardProps {
  club: NodeData;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const ClubProfileCard: React.FC<ProfileCardProps> = ({
  club,
  currentPage,
  setCurrentPage,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md md:min-w-60 md:max-w-60 sticky top-16 h-fit max-h-[80vh] overflow-hidden pb-2">
      <div className="relative">
        <Image
          src={club.coverImage}
          alt="Cover"
          width={300}
          height={150}
          className="w-full h-24 object-cover rounded-t-lg"
          layout="responsive"
        />
        <div className="absolute top-14 left-4">
          <Image
            src={club.avatar}
            alt="Avatar"
            width={64}
            height={64}
            className="rounded-md border-4 border-white"
          />
        </div>
      </div>
      <div className="px-4">
        <div className="pt-8">
          <h2 className="text-lg font-bold">{club.name}</h2>
          <p className="text-xs text-gray-500">{club.descripion}</p>
          <p className="text-xs text-gray-700 mt-2 font-medium flex">
            <span className="flex gap-1 items-center">
              {club.isPublic ? (
                <>
                  <Globe2 size={"0.8rem"} />
                  Public
                </>
              ) : (
                <>
                  <Lock size={"0.8rem"} />
                  Private
                </>
              )}{" "}
            </span>
            • {club.membersCount}
          </p>
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
              onClick={() => setCurrentPage(section.name)}
            >
              <span className="flex items-center space-x-2">
                <Image
                  src={section.icon}
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
