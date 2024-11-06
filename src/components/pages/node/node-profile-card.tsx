import React from "react";
import Image from "next/image";
import { ICONS } from "@/lib/constants";
import { ChevronRight } from "lucide-react";
import { TNodeData } from "@/types";
<<<<<<< HEAD
import { useRouter } from "next/navigation";
=======

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
>>>>>>> 2f54d0faf91c7dd38c764d74166b6a63ad80f9c9

interface ProfileCardProps {
  node: TNodeData;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const NodeProfileCard: React.FC<ProfileCardProps> = ({
  node,
  currentPage,
  setCurrentPage,
}) => {
  const SECTIONS = [
    { name: "News Feed", icon: ICONS.NodeNewsFeedIcon, path: "/news-feed" },
    { name: "Modules", icon: ICONS.NodeModulesIcon, path: "/modules" },
    {
      name: "Profile",
      icon: ICONS.NodeProfileIcon,
      path: `/node/${node._id}/profile`,
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
      path: `/node/${node._id}/members`,
    },
    {
      name: "Approvals",
      icon: ICONS.NodeApprovalsIcon,
      notifications: 3,
      path: `/node/${node._id}/approvals`,
    },
    {
      name: "Insights/Analytics",
      icon: ICONS.NodeInsightsIcon,
      path: "/insights",
    },
    {
      name: "Activities",
      icon: ICONS.NodeActivitiesIcon,
      path: `/node/${node._id}/approvals`,
    },
    {
      name: "Preferences",
      icon: ICONS.NodePreferencesIcon,
      path: "/preferences",
    },
  ];
  const router = useRouter();
  return (
    <div className="sticky top-16 h-fit max-h-[80vh] overflow-hidden rounded-lg bg-white pb-2 text-sm shadow-md md:min-w-60 md:max-w-60">
      <div className="relative">
        <Image
          src={node.coverImage}
          alt="Cover"
          width={300}
          height={150}
          className="h-24 w-full rounded-t-lg object-cover"
          layout="responsive"
        />
        <div className="absolute left-4 top-14">
          <Image
            src={node.profileImage}
            alt="Avatar"
            width={64}
            height={64}
            className="rounded-md border-4 border-white"
          />
        </div>
      </div>
      <div className="px-4">
        <div className="pt-8">
          <h2 className="text-lg font-bold">{node.name}</h2>
          <p className="text-xs text-gray-600">{node.about}</p>
          <p className="text-xs text-gray-500">
            {node.location} • {node.members.length}
          </p>
        </div>
        <div className="thin-scrollbar mt-4 max-h-[50vh] space-y-2 overflow-y-auto pb-4">
          {SECTIONS.map((section) => (
            <button
              key={section.name}
              className={`flex w-full items-center justify-between rounded-md p-2 ${
                currentPage === section.name
                  ? "border border-primary bg-green-50"
                  : "border border-white hover:bg-gray-100"
              }`}
              onClick={() => {
                setCurrentPage(section.name);
                router.push(section.path);
              }}
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

export default NodeProfileCard;
