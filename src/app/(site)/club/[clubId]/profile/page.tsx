"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, LogOut, Search, Filter, Mail } from "lucide-react";
import { useParams } from "next/navigation";
import Invite from "@/components/pages/club/invite/invite";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Endpoints } from "@/utils/endpoint";
import ClubMembersList from "@/components/pages/club/club-members-list";

import { useClubStore } from "@/store/clubs-store";
import { useTokenStore } from "@/store/store";
import { useClubCalls } from "@/hooks/apis/use-club-calls";
import { usePermission } from "@/lib/use-permission";

export default function Page() {
  const { leaveClub } = useClubCalls();
  const { currentClub } = useClubStore((state) => state);
  const [invite, setInvite] = useState<boolean>();
  const [clickTrigger, setClickTrigger] = useState(false);
  const params = useParams<{ clubId: string }>();
  const visibleUsers = 5;
  const totalUsers = currentClub?.members?.length || 0;
  const remainingUsers = totalUsers - visibleUsers;
  const displayRemainingCount = remainingUsers > 100 ? "100+" : remainingUsers;
  const [sentClub, setSentClub] = useState(params.clubId);
  const { globalUser } = useTokenStore((state) => state);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleInviteClick = () => {
    setInvite(true); // Open the modal
  };

  const { hasPermission } = usePermission();
  return (
    <>
      <Card className="mx-auto w-full max-w-3xl ">
        <CardHeader className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                Members
                <span className="flex text-sm font-normal  text-muted-foreground">
                  • {currentClub?.members?.length}{" "}
                  {currentClub?.members?.length === 1 ? "Member" : "Members"}
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {currentClub?.members
                    .slice(0, visibleUsers)
                    .map((member: any) => (
                      <Avatar
                        key={member._id}
                        className="border-2 border-background"
                      >
                        <AvatarImage
                          src={
                            member?.user?.profileImage ||
                            `/placeholder.svg?height=32&width=32`
                          } // Replace with dynamic src
                        />
                        <AvatarFallback>
                          {member?.user?.firstName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}

                  {remainingUsers > 0 && (
                    <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs">
                      {displayRemainingCount}+
                    </div>
                  )}
                </div>
                <Button
                  variant="link"
                  className="text-sm"
                  onClick={() => setIsModalOpen(true)}
                >
                  See all
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentClub?.members?.some(
                (member: any) => member?.user?._id == globalUser?._id
              ) && (
                <>
                  <Invite entityId={sentClub} type={"club"} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      {hasPermission("permission:leave") && (
                        <Button
                          variant="outline"
                          className="gap-2 text-red-500 hover:text-red-600"
                        >
                          <LogOut className="size-4" />

                          <span>Leave Club</span>
                        </Button>
                      )}
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to leave the club?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. Leaving the club will
                          remove you from the members list and you will lose
                          access to all club activities and resources.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => leaveClub(params.clubId)}
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          Leave Club
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-sm text-muted-foreground">
              {currentClub?.club?.description}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4 border-t pt-4">
            <div>
              <h4 className="font-semibold">Modules</h4>
              <p className="text-sm">
                <span className="text-green-500">4 Modules</span>
              </p>
            </div>
            {/* <div>
              <h4 className="font-semibold">Contributions</h4>
              <p className="text-sm text-muted-foreground">15.2k</p>
            </div> */}
            <div>
              <h4 className="font-semibold">Chapters</h4>
              <p className="text-sm">
                <span className="text-green-500">
                  {currentClub?.chapters?.length}
                </span>
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Founded</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(currentClub?.club?.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <h3 className="font-semibold">About</h3>
            <p className="text-sm text-muted-foreground">
              {currentClub?.club?.about}
            </p>
            <Button variant="link" className="p-0 text-sm">
              see all
            </Button>
          </div>
        </CardContent>
      </Card>

      {currentClub?.members && (
        <ClubMembersList
          members={currentClub?.members!}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setClickTrigger={setClickTrigger}
          clickTrigger={clickTrigger}
        />
      )}
    </>
  );
}
