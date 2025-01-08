import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Globe2, Lock } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ICONS } from "@/lib/constants";
import env from "@/lib/env.config";
import { usePermission } from "@/lib/use-permission";
import { Endpoints } from "@/utils/endpoint";

type ForumType = "node" | "club" | "chapter";

interface NavigationSection {
  name: string;
  icon: string;
  path: string;
  notifications?: number;
  show?: boolean;
}

interface ForumSidebarProps {
  type: ForumType;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  forumId: string;
  nodeId?: string;
  currentForum: any;
  joinStatus: TJoinStatus;
  onJoin: (forumId: string, nodeId?: string) => Promise<void>; //the nodeId is only for chapter
  onCancelRequest?: (id: string) => Promise<void>;
  members: any[];
  currentUserRole?: TUserRole | null;
}

const ForumSidebar: React.FC<ForumSidebarProps> = ({
  type,
  currentPage,
  setCurrentPage,
  forumId,
  nodeId,
  currentForum,
  joinStatus,
  onJoin,
  onCancelRequest,
  members,
  currentUserRole,
}) => {
  const { hasPermission } = usePermission();
  const recaptchaRef = useRef(null);
  const router = useRouter();
  const [showRecaptcha, setShowRecaptcha] = useState(false);

  const getBasePath = () => {
    switch (type) {
      case "chapter":
        return `/node/${nodeId}/chapters/${forumId}`;
      default:
        return `/${type}/${forumId}`;
    }
  };

  const basePath = getBasePath();

  const SECTIONS: NavigationSection[] = [
    {
      name: "News Feed",
      icon: ICONS.NodeNewsFeedIcon,
      path: basePath,
      show: hasPermission("view:newsFeed"),
    },
    {
      name: "Profile",
      icon: ICONS.NodeProfileIcon,
      path: `${basePath}/profile`,
      show: hasPermission("view:profile"),
    },
    {
      name: "Chapters",
      icon: ICONS.NodeChaptersIcon,
      path: `${basePath}/chapters`,
      show: type === "node" && hasPermission("view:chapters"),
    },
    {
      name: "Members",
      icon: ICONS.NodeMembersIcon,
      path: `${basePath}/members`,
      show: hasPermission("view:members"),
    },
    {
      name: "Approvals",
      icon: ICONS.NodeApprovalsIcon,
      path: `${basePath}/approvals`,
      show: hasPermission("view:approvals"),
    },
  ];

  const handleRecaptchaChange = async (token: string | null) => {
    if (!token) {
      toast.error("Please complete the reCAPTCHA to proceed.");
      return;
    }

    try {
      const res = await Endpoints.recaptcha(token);
      if (res) {
        await onJoin(forumId, currentForum?.node?._id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setShowRecaptcha(false);
    }
  };

  const getForumData = () => {
    if (!currentForum) return null;
    switch (type) {
      case "club":
        return currentForum.club;
      case "chapter":
        return currentForum;
      default:
        return currentForum.node;
    }
  };

  const forumData = getForumData();

  const renderSkeleton = () => (
    <div className="relative">
      <Skeleton className="h-[120px] w-full max-w-[300px] rounded-t-lg" />
      <div className="absolute -bottom-6 left-4">
        <Skeleton className="size-[60px] rounded-full border-4 border-white" />
      </div>
    </div>
  );

  const renderHeader = () => {
    if (!forumData) return renderSkeleton();

    return (
      <div className="relative">
        <Image
          src={forumData.coverImage?.url}
          alt="Cover"
          width={300}
          height={120}
          className="max-h-[120px] w-full max-w-[300px] rounded-t-lg object-cover"
          layout="responsive"
        />
        <div className="absolute -bottom-6 left-4">
          <Image
            src={forumData.profileImage?.url}
            alt="Avatar"
            width={60}
            height={60}
            className="max-h-[60px] max-w-[60px] rounded-full border-4 border-white"
          />
        </div>
      </div>
    );
  };

  const renderJoinButton = () => {
    const isDisabled = joinStatus === "REQUESTED" || joinStatus === "MEMBER";
    const isPublic = type === "club" && forumData?.isPublic;
    console.log({ currentUserRole });
    return (
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => setShowRecaptcha(true)}
          className="h-8 w-full border border-gray-500 bg-transparent capitalize text-gray-800 hover:bg-transparent"
          disabled={isDisabled}
        >
          {!forumData ? (
            <Skeleton className="h-4 w-1/2" />
          ) : (
            <>
              {joinStatus === "VISITOR" &&
                (isPublic ? "Join" : "Request to Join")}
              {joinStatus === "MEMBER" && currentUserRole}
              {joinStatus === "REQUESTED" && "Request Pending"}
            </>
          )}
        </Button>

        {joinStatus === "REQUESTED" && onCancelRequest && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="h-8 w-full border border-white bg-red-500 text-white hover:bg-red-500">
                Cancel Request
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-center">
                  Are you absolutely sure?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <div className="flex w-full justify-center gap-4">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onCancelRequest(forumId)}>
                  Continue
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    );
  };

  return (
    <div className="sticky top-16 h-fit w-full overflow-hidden rounded-lg bg-white pb-2 shadow-md">
      {renderHeader()}

      <div className="mt-6 px-4">
        <div className="flex flex-col justify-center gap-1">
          {forumData ? (
            <>
              <h2 className="text-lg font-bold">{forumData.name}</h2>
              <p className="text-xs text-gray-500">{forumData.about}</p>
              <div className="flex text-xs font-medium text-gray-700">
                {type === "club" && (
                  <span className="flex items-center gap-1">
                    {forumData.isPublic ? (
                      <>
                        <Globe2 size="0.8rem" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock size="0.8rem" />
                        Private
                      </>
                    )}
                    {" • "}
                  </span>
                )}
                {(type === "node" || type === "chapter") &&
                  forumData.location && (
                    <span className="text-gray-500">
                      {forumData.location} •{" "}
                    </span>
                  )}
                <span className="text-gray-500">
                  {members?.length}{" "}
                  {members?.length === 1 ? "Member" : "Members"}
                </span>
              </div>
            </>
          ) : (
            <>
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-3/4" />
            </>
          )}

          {showRecaptcha && (
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={env.RECAPTCHA_CLIENT as string}
              onChange={handleRecaptchaChange}
              className="z-50 flex justify-center"
            />
          )}

          {renderJoinButton()}
        </div>

        <div className="my-3 h-auto space-y-2 pb-4">
          {SECTIONS.filter((section) => section.show).map((section) => (
            <Link
              key={section.name}
              href={section.path}
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
                  <span className="flex size-5 items-center justify-center rounded-full bg-orange-500 text-xs font-medium text-white">
                    {section.notifications}
                  </span>
                ) : null}
                <ChevronRight size="1rem" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForumSidebar;
