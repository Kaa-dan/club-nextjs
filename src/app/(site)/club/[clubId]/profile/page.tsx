"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, Copy, LogOut, Search, Filter } from "lucide-react";
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

import { useEffect, useState } from "react";
import { fetchSpecificClub } from "@/components/pages/club/endpoint";
import { Endpoints } from "@/utils/endpoint";
import ClubMembersList from "@/components/pages/club/club-members-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import CopyLink from "@/components/pages/club/invite/copy-link";
import { TClub } from "@/types";

export default function Page() {
  const [members, setMembers] = useState([]);
  const params = useParams<{ clubId: string }>();
  const visibleUsers = 5;
  const totalUsers = members.length;
  const remainingUsers = totalUsers - visibleUsers;
  const displayRemainingCount = remainingUsers > 100 ? "100+" : remainingUsers;
  const [club, setClub] = useState<TClub>();
  useEffect(() => {
    Endpoints.fetchClubMembers(params.clubId as string)
      .then((res) => {
        setMembers(res);
      })
      .catch((err) => {
        console.log({ err });
      });

    fetchSpecificClub(params.clubId)
      .then((res) => {
        setClub(res.club);
      })
      .catch((err) => {
        console.log({ err });
      });
  }, [params.clubId]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const leaveMyClub = (clubId: string) => {
    Endpoints.leaveClub(clubId)
      .then((res) => {
        console.log(res, "ress");
        toast.warning(res.message);
      })
      .catch((err) => {
        console.log({ err });
      });
  };
  return (
    <>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                Members
                <span className="text-sm font-normal text-muted-foreground">
                  • {members.length} Members
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {members.slice(0, visibleUsers).map((member: any) => (
                    <Avatar
                      key={member._id}
                      className="border-2 border-background"
                    >
                      <AvatarImage
                        src={
                          member.user.profileImage ||
                          `/placeholder.svg?height=32&width=32`
                        } // Replace with dynamic src
                      />
                      <AvatarFallback>
                        {member.user.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}

                  {remainingUsers > 0 && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs">
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
                {/* <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Edit Profile</Button>
                  </DialogTrigger>
                  <ClubMembersList
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                  />
                </Dialog> */}
                {/* <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Edit Profile</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]"></DialogContent>
                </Dialog> */}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger>
                  <Button className="gap-2">
                    <span>+ Invite</span>
                  </Button>
                  <Invite />
                </DialogTrigger>
              </Dialog>

              <Dialog>
                <DialogTrigger>
                  <Button variant="outline" className="gap-2">
                    <Copy className="h-4 w-4" />

                    <span>Copy Link</span>
                  </Button>
                </DialogTrigger>
                <CopyLink />
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-red-500 hover:text-red-600 gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Leave Club</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to leave the club?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. Leaving the club will remove
                      you from the members list and you will lose access to all
                      club activities and resources.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => leaveMyClub(params.clubId)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Leave Club
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-sm text-muted-foreground">{club?.description}</p>
          </div>

          <div className="grid grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <h4 className="font-semibold">Modules</h4>
              <p className="text-sm">
                <span className="text-green-500">12 Modules</span>
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Contributions</h4>
              <p className="text-sm text-muted-foreground">15.2k</p>
            </div>
            <div>
              <h4 className="font-semibold">Clubs</h4>
              <p className="text-sm">
                <span className="text-green-500">12 Clubs</span>
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Founded</h4>
              <p className="text-sm text-muted-foreground">1996</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <h3 className="font-semibold">About</h3>
            <p className="text-sm text-muted-foreground">{club?.about}</p>
            <Button variant="link" className="text-sm p-0">
              see all
            </Button>
          </div>
        </CardContent>
      </Card>

      <ClubMembersList
        members={members}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      {/* dialogue  */}
    </>
  );
}
