import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ICONS } from "@/lib/constants";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Endpoints } from "@/utils/endpoint";
import { useNodeStore } from "@/store/nodes-store";
import { Button } from "@/components/ui/button";
import ReCAPTCHA from "react-google-recaptcha";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { NodeEndpoints } from "@/utils/endpoints/node";
import { toast } from "sonner";
import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ImageSkeleton } from "../club/club-profile-card";

interface ProfileCardProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const NodeProfileCard: React.FC<ProfileCardProps> = ({
  currentPage,
  setCurrentPage,
}) => {
  const { currentNode, currentUserRole } = useNodeStore((state) => state);
  const [joinStatus, setJoinStatus] = useState<String>("");
  const [cancelRequestTriggered, setCancelRequestTriggered] = useState(false);
  const recaptchaRef = useRef(null);

  const { setUserRequestedNodes } = useNodeStore((state) => state);

  const isAdmin = () => currentUserRole === "admin";
  const isModeratorOrAdminOrOwner = () =>
    ["moderator", "admin", "owner"].includes(currentUserRole.toLowerCase());

  const SECTIONS = [
    { name: "News Feed", icon: ICONS.NodeNewsFeedIcon, path: "#" },
    { name: "Modules", icon: ICONS.NodeModulesIcon, path: "#" },
    {
      name: "Profile",
      icon: ICONS.NodeProfileIcon,
      path: `/node/${currentNode?.node?._id}/profile`,
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
      path: `/node/${currentNode?.node?._id}/members`,
    },
    {
      name: "Approvals",
      icon: ICONS.NodeApprovalsIcon,
      notifications: 0,
      path: `/node/${currentNode?.node?._id}/approvals`,
      show: isModeratorOrAdminOrOwner, // Only show for moderator and admin
    },
    {
      name: "Insights/Analytics",
      icon: ICONS.NodeInsightsIcon,
      path: "#",
      show: isAdmin, // Only show for admin
    },
    {
      name: "Activities",
      icon: ICONS.NodeActivitiesIcon,
      path: `/node/${currentNode?.node?._id}/activity`, // Fixed the path from approvals to activity
    },
    {
      name: "Preferences",
      icon: ICONS.NodePreferencesIcon,
      path: "#",
    },
  ];
  const router = useRouter();
  const joinToNode = async (nodeId: string) => {
    try {
      const response = await Endpoints.requestToJoinNode(nodeId);
      const requestedNodes = await NodeEndpoints.fetchUserRequestedNodes();
      setUserRequestedNodes(requestedNodes);
      setJoinStatus(response.status);
    } catch (error) {
      console.log({ error });
    }
  };
  const [recaptcha, setRecaptcha] = useState(false);

  const cancelJoinRequest = async (nodeId: string) => {
    try {
      const response = await NodeEndpoints.cancelJoinRequest(nodeId);
      const requestedNodes = await NodeEndpoints.fetchUserRequestedNodes();
      setUserRequestedNodes(requestedNodes);
      console.log(response);
      toast.success("Request Cancelled");
      setCancelRequestTriggered(!cancelRequestTriggered);
    } catch (error) {
      console.log(error);
      toast.error("Error while cancelling request");
    }
  };

  useEffect(() => {
    if (currentNode?.node?._id) {
      Endpoints.fetchNodeUserStatus(currentNode?.node?._id as string)
        .then((res) => {
          setJoinStatus(res.status);
          console.log("user status", res.status);
        })
        .catch((err) => {
          console.log({ err });
        });
    }
  }, [currentNode?.node?._id, cancelRequestTriggered]);

  const onRecaptchaChange = (token: any) => {
    if (!token) {
      toast.error("Please complete the reCAPTCHA to proceed.");
      return;
    }
    Endpoints.recaptcha(token)
      .then((res) => {
        if (res) {
          joinToNode(currentNode?.node?._id as string);
        }
      })
      .catch((err) => {
        console.log({ err });

        toast.error("something went wrong!!");
      })
      .finally(() => {
        setRecaptcha(false);
      });
  };
  return (
    <div className="sticky top-16 h-fit  w-full overflow-hidden rounded-lg bg-white pb-2 text-sm shadow-md">
      {currentNode ? (
        <div className="relative">
          <Image
            src={currentNode?.node?.coverImage?.url}
            alt="Cover"
            width={300}
            height={120}
            className="max-h-[120px] w-full max-w-[300px] rounded-t-lg object-cover"
            layout="responsive"
          />
          <div className="absolute -bottom-6 left-4">
            <Image
              src={currentNode?.node?.profileImage?.url as string}
              alt="Avatar"
              width={60}
              height={60}
              className="max-h-[60px] max-w-[60px] rounded-full border-4 border-white"
            />
          </div>
        </div>
      ) : (
        <ImageSkeleton />
      )}
      <div className="px-4">
        <div className="pt-8">
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
        </div>
        {recaptcha && (
          <div>
            <Dialog open={recaptcha} onOpenChange={setRecaptcha}>
              <DialogContent
                className="pointer-events-auto"
                onInteractOutside={(e) => {
                  e.preventDefault();
                }}
              >
                <DialogHeader>
                  {recaptcha ? (
                    <ReCAPTCHA
                      className="z-50 flex justify-center"
                      ref={recaptchaRef}
                      sitekey={
                        process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT as string
                      }
                      onChange={onRecaptchaChange}
                    />
                  ) : (
                    "Loading..."
                  )}
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button
            onClick={() => setRecaptcha(true)}
            className="h-8 w-full border border-gray-500 bg-transparent text-gray-800 hover:bg-transparent"
            disabled={joinStatus === "REQUESTED" || joinStatus === "MEMBER"} // Disable when requested or joined
          >
            {joinStatus === "VISITOR" && "Request to Join"}
            {joinStatus === "MEMBER" && "Joined"}
            {joinStatus === "REQUESTED" && "Request Pending"}
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
                  <AlertDialogAction
                    onClick={() => cancelJoinRequest(currentNode?.node?._id!)}
                  >
                    Continue
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <div className=" my-3 h-auto  space-y-2 pb-4">
          {SECTIONS?.filter((section) => !section.show || section.show())?.map(
            (section) => (
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
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default NodeProfileCard;
