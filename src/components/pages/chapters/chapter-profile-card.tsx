import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ICONS } from "@/lib/constants";
import { ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
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
import { ImageSkeleton } from "../club/club-profile-card";
import env from "@/lib/env.config";
import { useNodeCalls } from "@/hooks/apis/use-node-calls";
import { usePermission } from "@/lib/use-permission";
import { useChapterCalls } from "@/hooks/apis/use-chapter-calls";
import { useChapterStore } from "@/store/chapters-store";

interface ProfileCardProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const ChaptersProfileCard: React.FC<ProfileCardProps> = ({
  currentPage,
  setCurrentPage,
}) => {
  const { hasPermission } = usePermission();
  const { nodeId, chapterId } = useParams<{
    nodeId: string;
    chapterId: string;
  }>();
  const { currentChapter, chapterMembers } = useChapterStore((state) => state);

  // const { fetchNodeJoinStatus } = useNodeCalls();
  const { fetchChapterDetails } = useChapterCalls();
  const recaptchaRef = useRef(null);

  const { setUserRequestedNodes } = useNodeStore((state) => state);

  const SECTIONS = [
    {
      name: "News Feed",
      icon: ICONS.NodeNewsFeedIcon,
      path: `/node/${nodeId}/chapters/${chapterId}`,
    },
    // { name: "Modules", icon: ICONS.NodeModulesIcon, path: "#" },
    {
      name: "Profile",
      icon: ICONS.NodeProfileIcon,
      path: `/node/${nodeId}/chapters/${chapterId}/profile`,
    },
    {
      name: "Members",
      icon: ICONS.NodeMembersIcon,
      path: `/node/${nodeId}/chapters/${chapterId}`,
    },
    {
      name: "Approvals",
      icon: ICONS.NodeApprovalsIcon,
      notifications: 0,
      path: `/node/${nodeId}/chapters/${chapterId}/approvals`,
      show: hasPermission("view:approvals"),
    },
    // {
    //   name: "Insights/Analytics",
    //   icon: ICONS.NodeInsightsIcon,
    //   path: "#",
    //   show: hasPermission("view:analytics"),
    // },
    // {
    //   name: "Activities",
    //   icon: ICONS.NodeActivitiesIcon,
    //   path: `/node/${currentNode?.node?._id}/activity`,
    //   show: hasPermission("view:activities"),
    // },
    // {
    //   name: "Preferences",
    //   icon: ICONS.NodePreferencesIcon,
    //   path: "#",
    // },
  ];
  const router = useRouter();
  const joinChapter = async (nodeId: string) => {
    try {
      const response = await Endpoints.requestToJoinNode(nodeId);
      const requestedNodes = await NodeEndpoints.fetchUserRequestedNodes();
      // setUserRequestedNodes(requestedNodes);
      // setNodeJoinStatus(response.status);
    } catch (error) {
      console.log({ error });
    }
  };
  const [recaptcha, setRecaptcha] = useState(false);

  /**
   * Cancels a join request to a node
   * @param nodeId The id of the node to cancel the request for
   * @returns A promise that resolves when the request has been cancelled
   */

  const cancelJoinRequest = async (nodeId: string) => {
    try {
      const response = await NodeEndpoints.cancelJoinRequest(nodeId);
      // Fetch the user's requested nodes again to update the state
      const requestedNodes = await NodeEndpoints.fetchUserRequestedNodes();
      setUserRequestedNodes(requestedNodes);
      console.log(response);
      toast.success("Request Cancelled");
      // fetchNodeJoinStatus(nodeId);
    } catch (error) {
      console.log(error);
      toast.error("Error while cancelling request");
    }
  };

  const onRecaptchaChange = (token: any) => {
    if (!token) {
      toast.error("Please complete the reCAPTCHA to proceed.");
      return;
    }
    Endpoints.recaptcha(token)
      .then((res) => {
        if (res) {
          joinChapter(currentChapter?._id as string);
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

  useEffect(() => {
    if (chapterId) fetchChapterDetails(chapterId);
  }, [chapterId]);

  return (
    <div className="sticky top-16 mb-10 h-screen  w-full overflow-hidden rounded-lg  pb-2 text-sm shadow-md">
      {currentChapter ? (
        <div className="relative">
          <Image
            src={currentChapter?.coverImage?.url}
            alt="Cover"
            width={300}
            height={120}
            className="max-h-[120px] w-full max-w-[300px] rounded-t-lg object-cover"
            layout="responsive"
          />
          <div className="absolute -bottom-6 left-4">
            <Image
              src={currentChapter?.profileImage?.url as string}
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
          <h2 className="text-lg font-bold">{currentChapter?.name}</h2>
          <p className="text-xs text-gray-600">{currentChapter?.about}</p>
          <p className="mb-1 flex gap-2 text-xs text-gray-500">
            {/* {currentChapter?.location}
            <span>•</span> */}
            <span>
              {chapterMembers?.length || 0}
              {"  Members"}
            </span>
          </p>
        </div>

        {recaptcha ? (
          <ReCAPTCHA
            className="z-50 flex justify-center"
            ref={recaptchaRef}
            sitekey={env.RECAPTCHA_CLIENT as string}
            onChange={onRecaptchaChange}
          />
        ) : (
          ""
        )}

        <div className="flex flex-col gap-2">
          {/* <Button
            onClick={() => setRecaptcha(true)}
            className="h-8 w-full border border-gray-500 bg-transparent text-gray-800 hover:bg-transparent"
            disabled={
              nodeJoinStatus === "REQUESTED" || nodeJoinStatus === "MEMBER"
            } // Disable when requested or joined
          >
            {nodeJoinStatus === "VISITOR" && "Request to Join"}
            {nodeJoinStatus === "MEMBER" && "Joined"}
            {nodeJoinStatus === "REQUESTED" && "Request Pending"}
          </Button> */}
          {/* {nodeJoinStatus === "REQUESTED" && (
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
          )} */}
        </div>
        <div className=" my-3 h-auto  space-y-2 pb-4">
          {SECTIONS?.filter((section) => section.show !== false)?.map(
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

export default ChaptersProfileCard;
