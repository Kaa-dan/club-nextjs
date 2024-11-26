"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ICONS } from "@/lib/constants";
import { ChevronRight, Globe2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { joinClub } from "./endpoint";
import { Endpoints } from "@/utils/endpoint";
import { useClubStore } from "@/store/clubs-store";
import ReCAPTCHA from "react-google-recaptcha";
import {
  AlertDialogHeader,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ClubEndpoints } from "@/utils/endpoints/club";
import { toast } from "sonner";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileCardProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  clubId: string;
}

const ClubProfileCard: React.FC<ProfileCardProps> = ({
  currentPage,
  setCurrentPage,
  clubId,
}) => {
  const {
    setUserJoinedClubs,
    setUserRequestedClubs,
    currentUserRole,
    currentClub,
  } = useClubStore((state) => state);
  const [recaptcha, setRecaptcha] = useState(false);
  const recaptchaRef = useRef(null);
  const [joinStatus, setJoinStatus] = useState<String>("");
  const [cancelRequestTriggered, setCancelRequestTriggered] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const _currentUserRole =
      club?.members?.find((member) => member?.user?._id === globalUser?._id)
        ?.role || "";
    setCurrentUserRole(_currentUserRole);
  }, [club]);

  const isAdmin = () => currentUserRole === "admin";
  const isModeratorOrAdmin = () =>
    ["moderator", "admin"].includes(currentUserRole.toLowerCase());

  const SECTIONS = [
    { name: "News Feed", icon: ICONS.NodeNewsFeedIcon, path: "#" },
    { name: "Modules", icon: ICONS.NodeModulesIcon, path: "#" },
    {
      name: "Profile",
      icon: ICONS.NodeProfileIcon,
      path: `/club/${clubId}/profile`,
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
      path: `/club/${clubId}/members`,
    },
    {
      name: "Approvals",
      icon: ICONS.NodeApprovalsIcon,
      notifications: 0,
      path: `/club/${clubId}/approvals`,
      show: isModeratorOrAdmin, // Only show for moderator and admin
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
      path: `/club/${clubId}/activity`,
    },
    {
      name: "Preferences",
      icon: ICONS.NodePreferencesIcon,
      path: "#",
    },
  ];
  // console.log({ url: club.club.profileImage.url);

  const joinToClub = async (clubId: string) => {
    try {
      const response = await joinClub(clubId);
      const joinedClubs = await Endpoints.fetchUserJoinedClubs();
      const requestedClubs = await ClubEndpoints.fetchUserRequestedClubs();
      setUserJoinedClubs(joinedClubs);
      setUserRequestedClubs(requestedClubs);
      setJoinStatus(response.status);
    } catch (error) {
      console.log({ error });
    }
  };

  const cancelJoinRequest = async (clubId: string) => {
    try {
      const response = await ClubEndpoints.cancelJoinRequest(clubId);
      const requestedClubs = await ClubEndpoints.fetchUserRequestedClubs();
      setUserRequestedClubs(requestedClubs);
      console.log(response);
      toast.success("Request Cancelled");
      setCancelRequestTriggered(!cancelRequestTriggered);
    } catch (error) {
      console.log(error);
      toast.error("Error while cancelling request");
    }
  };

  useEffect(() => {
    Endpoints.fetchClubUserStatus(clubId as string)
      .then((res) => {
        setJoinStatus(res.status);
        console.log(res.status, "join status");
      })
      .catch((err) => {
        console.log({ err });
      });
  }, [clubId, cancelRequestTriggered]);
  const onRecaptchaChange = (token: any) => {
    if (!token) {
      toast.error("Please complete the reCAPTCHA to proceed.");
      return;
    }
    Endpoints.recaptcha(token)
      .then((res) => {
        if (res) {
          joinToClub(clubId);
          setRecaptcha(false);
        }
      })
      .catch((err) => {
        console.log({ err });

        toast.error("something went wrong!!");
      });
  };
  return (
    <div className="sticky top-16 h-fit  w-full overflow-hidden rounded-lg bg-white pb-2 shadow-md">
      {currentClub ? (
        <div className="relative">
          {currentClub?.club?.coverImage && (
            <Image
              src={currentClub?.club?.coverImage?.url}
              alt="Cover"
              width={300}
              height={120}
              className="max-h-[120px] w-full max-w-[300px] rounded-t-lg object-cover"
              layout="responsive"
            />
          )}

          <div className="absolute -bottom-6 left-4">
            {currentClub?.club?.profileImage?.url && (
              <Image
                src={currentClub?.club.profileImage?.url}
                alt="Avatar"
                width={60}
                height={60}
                className="max-h-[60px] max-w-[60px] rounded-full  border-4 border-white"
              />
            )}
          </div>
        </div>
      ) : (
        <ImageSkeleton />
      )}
      <div className="mt-6 px-4">
        <div className="flex flex-col justify-center gap-2">
          {currentClub ? (
            <h2 className="text-lg font-bold">{currentClub?.club?.name}</h2>
          ) : (
            <Skeleton className="h-4 w-1/2" />
          )}
          {currentClub ? (
            <p className="text-xs text-gray-500">{currentClub?.club?.about}</p>
          ) : (
            <Skeleton className="h-8 w-3/4" />
          )}
          <div className="mt-2 flex text-xs font-medium text-gray-700">
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
          </div>

          {recaptcha && (
            <Dialog open={recaptcha} onOpenChange={setRecaptcha}>
              <DialogTitle>Recaptcha</DialogTitle>
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
          )}

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => {
                // joinToClub(clubId);
                setRecaptcha(true);
              }}
              className="h-8 w-full border border-gray-500 bg-transparent text-gray-800 hover:bg-transparent"
              disabled={joinStatus === "REQUESTED" || joinStatus === "MEMBER"} // Disable when requested or joined
            >
              {!currentClub ? (
                <Skeleton className="h-4 w-1/2" />
              ) : (
                <>
                  {currentClub?.club?.isPublic &&
                    joinStatus === "VISITOR" &&
                    "Join"}
                  {!currentClub?.club?.isPublic &&
                    joinStatus === "VISITOR" &&
                    "Request to Join"}
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
                    <AlertDialogAction
                      onClick={() => cancelJoinRequest(clubId)}
                    >
                      Continue
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
        <div className=" my-3 h-auto space-y-2  pb-4">
          {SECTIONS?.filter((section) => !section.show || section.show())?.map(
            (section) => (
              <button
                key={section?.name}
                className={`flex w-full items-center justify-between rounded-md p-2 ${
                  currentPage === section?.name
                    ? "border border-primary bg-green-50"
                    : "border border-white hover:bg-gray-100"
                }`}
                onClick={() => {
                  setCurrentPage(section?.name);
                  router.push(section?.path);
                }}
              >
                <span className="flex items-center space-x-2">
                  <Image
                    src={section?.icon}
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

export default ClubProfileCard;

export const ImageSkeleton = () => {
  return (
    <div className="relative">
      {/* Cover image skeleton */}
      <Skeleton className="h-[120px] w-full max-w-[300px] rounded-t-lg" />

      {/* Profile image skeleton */}
      <div className="absolute -bottom-6 left-4">
        <Skeleton className="size-[60px] rounded-full border-4 border-white" />
      </div>
    </div>
  );
};
