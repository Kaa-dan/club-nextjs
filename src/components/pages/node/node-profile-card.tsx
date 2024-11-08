import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ICONS } from "@/lib/constants";
import { ChevronRight } from "lucide-react";
import { TNodeData } from "@/types";
import { useRouter } from "next/navigation";
import { Endpoints } from "@/utils/endpoint";
import { useNodeStore } from "@/store/nodes-store";
import { useTokenStore } from "@/store/store";
import { Button } from "@/components/ui/button";

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
  console.log({ node });
  const [joinStatus, setJoinStatus] = useState<String>("");
  const { setUserJoinedNodes } = useNodeStore((state) => state);
  const { globalUser } = useTokenStore((state) => state);

  const SECTIONS = [
    { name: "News Feed", icon: ICONS.NodeNewsFeedIcon, path: "#" },
    { name: "Modules", icon: ICONS.NodeModulesIcon, path: "#" },
    {
      name: "Profile",
      icon: ICONS.NodeProfileIcon,
      path: `/node/${node._id}/profile`,
    },
    {
      name: "Chapters",
      icon: ICONS.NodeChaptersIcon,
      notifications: 0,
      path: "#",
    },
    {
      name: "Members",
      icon: ICONS.NodeMembersIcon,
      path: `/node/${node._id}/members`,
    },
    {
      name: "Approvals",
      icon: ICONS.NodeApprovalsIcon,
      notifications: 0,
      path: `/node/${node._id}/approvals`,
    },
    {
      name: "Insights/Analytics",
      icon: ICONS.NodeInsightsIcon,
      path: "#",
    },
    {
      name: "Activities",
      icon: ICONS.NodeActivitiesIcon,
      path: `/node/${node._id}/approvals`,
    },
    {
      name: "Preferences",
      icon: ICONS.NodePreferencesIcon,
      path: "#",
    },
  ];
  const router = useRouter();
  console.log({ nodeImg: node });
  const joinToNode = async (nodeId: string) => {
    try {
      const response = await Endpoints.requestToJoinNode(nodeId);
      const joinedNodes = await Endpoints.fetchUserJoinedNodes();
      setUserJoinedNodes(joinedNodes);
      setJoinStatus(response.status);
    } catch (error) {
      console.log({ error });
    }
  };
  useEffect(() => {
    console.log({ node });

    Endpoints.fetchNodeUserStatus(node._id as string)
      .then((res) => {
        setJoinStatus(res.status);
      })
      .catch((err) => {
        console.log({ err });
      });
  }, [node._id]);

  return (
    <div className="sticky top-16 h-fit  overflow-hidden rounded-lg bg-white pb-2 text-sm shadow-md md:min-w-60 md:max-w-60">
      <div className="relative">
        <Image
          src={node?.coverImage?.url}
          alt="Cover"
          width={300}
          height={150}
          className="h-24 w-full rounded-t-lg object-cover"
          layout="responsive"
        />
        <div className="absolute left-4 top-14">
          <Image
            src={node?.profileImage?.url as string}
            alt="Avatar"
            width={64}
            height={64}
            className="rounded-md border-4 border-white"
          />
        </div>
      </div>
      <div className="px-4">
        <div className="pt-8">
          <h2 className="text-lg font-bold">{node?.name}</h2>
          <p className="text-xs text-gray-600">{node?.about}</p>
          <p className="text-xs text-gray-500">
            {node?.location} • {node?.members?.length}
          </p>
        </div>
        <div>
          <Button
            onClick={() => joinToNode(node._id)}
            className="h-8 w-full border border-gray-500 bg-transparent text-gray-800 hover:bg-transparent"
            disabled={joinStatus === "REQUESTED" || joinStatus === "MEMBER"} // Disable when requested or joined
          >
            {joinStatus === "VISITOR" && "Request to Join"}
            {joinStatus === "MEMBER" && "Joined"}
            {joinStatus === "REQUESTED" && "Request Pending"}
          </Button>
        </div>
        <div className=" my-3 max-h-[50vh]  space-y-2 pb-4">
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
                  src={section?.icon as string}
                  alt={section?.name}
                  height={30}
                  width={30}
                  className="size-4"
                />
                <span>{section?.name}</span>
              </span>
              <div className="flex gap-2">
                {section?.notifications ? (
                  <span
                    className="flex size-5 items-center justify-center rounded-full bg-orange-500 text-xs
                   font-medium text-white"
                  >
                    {section?.notifications}
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
