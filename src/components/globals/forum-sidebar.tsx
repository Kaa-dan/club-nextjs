import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Globe2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
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

interface ForumSidebarProps {
  type: "node" | "club";
  currentPage: string;
  setCurrentPage: (page: string) => void;
  forumId: string;
  currentForum: any;
  joinStatus: TJoinStatus;
  onJoin: (id: string) => Promise<void>;
  onCancelRequest: (id: string) => Promise<void>;
  members: any[];
}

interface NavigationSection {
  name: string;
  icon: string;
  path: string;
  notifications?: number;
  show?: boolean;
}

const ForumSidebar: React.FC<ForumSidebarProps> = ({
  type,
  currentPage,
  setCurrentPage,
  forumId,
  currentForum,
  joinStatus,
  onJoin,
  onCancelRequest,
  members,
}) => {
  const { hasPermission } = usePermission();
  const recaptchaRef = useRef(null);
  const router = useRouter();
  const [showRecaptcha, setShowRecaptcha] = useState(false);

  const basePath = `/${type}/${forumId}`;

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
      show: hasPermission("view:chapters"),
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

  const handleRecaptchaChange = (token: string | null) => {
    if (!token) {
      toast.error("Please complete the reCAPTCHA to proceed.");
      return;
    }

    fetch("/api/recaptcha", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          onJoin(forumId);
        }
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setShowRecaptcha(false));
  };

  const renderSkeleton = () => (
    <div className="relative">
      <Skeleton className="h-[120px] w-full max-w-[300px] rounded-t-lg" />
      <div className="absolute -bottom-6 left-4">
        <Skeleton className="size-[60px] rounded-full border-4 border-white" />
      </div>
    </div>
  );

  const renderHeader = () => {
    if (!currentForum) return renderSkeleton();

    const forum = type === "club" ? currentForum.club : currentForum.node;

    return (
      <div className="relative">
        <Image
          src={forum?.coverImage?.url}
          alt="Cover"
          width={300}
          height={120}
          className="max-h-[120px] w-full max-w-[300px] rounded-t-lg object-cover"
          layout="responsive"
        />
        <div className="absolute -bottom-6 left-4">
          <Image
            src={forum?.profileImage?.url}
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
    const isPublic = type === "club" && currentForum?.club?.isPublic;

    return (
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => setShowRecaptcha(true)}
          className="h-8 w-full border border-gray-500 bg-transparent text-gray-800 hover:bg-transparent"
          disabled={isDisabled}
        >
          {!currentForum ? (
            <Skeleton className="h-4 w-1/2" />
          ) : (
            <>
              {joinStatus === "VISITOR" &&
                (isPublic ? "Join" : "Request to Join")}
              {joinStatus === "MEMBER" && "Joined"}
              {joinStatus === "REQUESTED" && "Request Pending"}
            </>
          )}
        </Button>

        {joinStatus === "REQUESTED" && (
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

  console.log("curry ", currentForum?.node?.location);

  return (
    <div className="sticky top-16 h-fit w-full overflow-hidden rounded-lg bg-white pb-2 shadow-md">
      {renderHeader()}

      <div className="mt-6 px-4">
        <div className="flex flex-col justify-center gap-1">
          {currentForum ? (
            <>
              <h2 className="text-lg font-bold">
                {type === "club"
                  ? currentForum.club?.name
                  : currentForum.node?.name}
              </h2>
              <p className="text-xs text-gray-500">
                {type === "club"
                  ? currentForum.club?.about
                  : currentForum.node?.about}
              </p>
              <div className=" flex text-xs font-medium text-gray-700">
                {type === "club" && (
                  <span className="flex items-center gap-1">
                    {currentForum.club?.isPublic ? (
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
                {type === "node" && (
                  <span className="text-gray-500">
                    {currentForum?.node?.location} •{" "}
                  </span>
                )}
                <span className="text-gray-500">{members?.length} Members</span>
              </div>
              {/* <div className="mt-2 flex text-xs font-medium text-gray-700">
            <span className="flex items-center gap-1">
              {currentClub?.club?.isPublic ? (
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
            • {currentClub?.members?.length} Members
          </div> */}

              {/* <div className="pt-8">
          <h2 className="text-lg font-bold">{currentNode?.node?.name}</h2>
          <p className="text-xs text-gray-600">{currentNode?.node?.about}</p>
          <p className="mb-1 flex gap-2 text-xs text-gray-500">
            {currentNode?.node?.location}
            <span>•</span>
            <span>
              {currentNode?.members?.length}
              {"  Members"}
            </span>
          </p>
        </div> */}
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
