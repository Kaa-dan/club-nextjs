"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Link,
  Copy,
  LogOut,
  Search,
  Filter,
  MoreHorizontal,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge, BadgeProps } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Endpoints } from "@/utils/endpoint";
import { useParams } from "next/navigation";
import { TMembers, TNodeData } from "@/types";
import { cn } from "@/lib/utils";
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
import { useNodeStore } from "@/store/nodes-store";
import { toast } from "sonner";
import { useTokenStore } from "@/store/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { title } from "process";
import { SharedEndpoints } from "@/utils/endpoints/shared";
const members = [
  {
    id: 1,
    name: "Cameron Williamson",
    role: "UI UX Designer",
    level: "Admin",
    contribution: 2500,
    joinDate: "October 30, 2017",
    avatar: "/placeholder.svg",
  },

  {
    id: 2,
    name: "Bessie Cooper",
    role: "President of Sales",
    level: "Moderator",
    contribution: 256,
    joinDate: "July 14, 2015",
    avatar: "/placeholder.svg",
  },

  {
    id: 3,
    name: "Ronald Richards",
    role: "Dog Trainer",
    level: "Moderator",
    contribution: 19500,
    joinDate: "October 25, 2019",
    avatar: "/placeholder.svg",
  },

  // Add more members as needed
];

export default function Page() {
  const { globalUser } = useTokenStore((state) => state);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setUserJoinedNodes } = useNodeStore((state) => state);
  const { nodeId } = useParams<{ nodeId: string }>();
  const [clickTrigger, setClickTrigger] = useState<boolean>(false);
  const [nodeDetails, setNodeDetails] = useState<{
    node: TNodeData;
    members: any[];
  }>();
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const visibleUsers = 5;
  const totalUsers = members.length;
  const remainingUsers = totalUsers - visibleUsers;
  const displayRemainingCount = remainingUsers > 100 ? "100+" : remainingUsers;

  const fetchNodeDetails = async () => {
    if (!nodeId) return;
    try {
      const response = await Endpoints.fetchNodeDetails(nodeId);
      console.log("node details", response?.data);
      setNodeDetails(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const leaveMyNode = async (nodeId: string) => {
    try {
      const response = await Endpoints.leaveNode(nodeId);
      const joinedNodes = await Endpoints.fetchUserJoinedNodes();
      setUserJoinedNodes(joinedNodes);
      toast.warning(response.message);
      setClickTrigger(!clickTrigger);
    } catch (error) {}
  };

  useEffect(() => {
    fetchNodeDetails();
  }, [nodeId, clickTrigger]);

  const currentUserRole =
    nodeDetails?.members?.find(
      (member) => member?.user?._id === globalUser?._id
    )?.role || "";

  const isOwner = () => currentUserRole === "owner";

  const isOWnerOrAdmin = () => ["owner", "admin"].includes(currentUserRole);

  const isModeratorOrAdminOrOwner = () =>
    ["moderator", "admin", "owner"].includes(currentUserRole);

  const SECTIONS = [
    {
      title: "Change to admin",
      description: (member: any) =>
        `Are you sure you want to make ${member?.user?.firstName} ${member?.user?.lastName} to Admin?`,
      onClickFunction: async (accessToUserId: string) => {
        const data = {
          entityId: nodeId,
          entity: "node",
          accessToUserId,
        };
        try {
          await SharedEndpoints.makeAdmin(data);
          setClickTrigger(!clickTrigger);
        } catch (error) {
          console.log(error, "error");
          toast.error("something went wrong when making admin");
        }
      },
      show: (role: "member" | "admin" | "moderator") => {
        return role !== "admin" && isOwner();
      },
    },

    {
      title: "Change to moderator",
      description: (member: any) =>
        `Are you sure you want to make ${member?.user?.firstName} ${member?.user?.lastName} to Moderator?`,
      onClickFunction: async (accessToUserId: string) => {
        const data = {
          entityId: nodeId,
          entity: "node",
          accessToUserId,
        };
        try {
          await SharedEndpoints.makeModerator(data);
          setClickTrigger(!clickTrigger);
        } catch (error) {
          console.log(error, "error");
          toast.error("something went wrong when making moderator");
        }
      },
      show: (role: "member" | "admin" | "moderator") => {
        return role !== "moderator" && isOwner();
      },
    },

    {
      title: "Change to member",
      description: (member: any) =>
        `Are you sure you want to make ${member?.user?.firstName} ${member?.user?.lastName} to Member?`,
      onClickFunction: async (accessToUserId: string) => {
        const data = {
          entityId: nodeId,
          entity: "node",
          accessToUserId,
        };
        try {
          await SharedEndpoints.makeMember(data);
          setClickTrigger(!clickTrigger);
        } catch (error) {
          toast.error("something went wrong when making member");
          console.log(error, "error");
        }
      },
      show: (role: "member" | "admin" | "moderator") => {
        return role !== "member" && isOwner();
      },
    },

    {
      title: "Remove user",
      description: (member: any) =>
        `Are you sure you want to remove ${member?.user?.firstName} ${member?.user?.lastName}?`,
      onClickFunction: () => {
        console.log("remove user");
      },
      show: isOWnerOrAdmin,
    },
  ];

  return (
    <>
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                Members
                <span className="text-sm font-normal text-muted-foreground">
                  • {nodeDetails?.members?.length}{" "}
                  {nodeDetails?.members?.length === 1 ? "Member" : "Members"}
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {nodeDetails?.members
                    ?.slice(0, visibleUsers)
                    .map((member: any) => (
                      <Avatar
                        key={member?.user?._id}
                        className="border-2 border-background"
                      >
                        <AvatarImage
                          src={
                            member?.user?.profileImage ||
                            `/placeholder.svg?height=32&width=32`
                          }
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
              {nodeDetails?.members?.some(
                (member: any) => member?.user?._id == globalUser?._id
              ) && (
                <>
                  <Button className="gap-2">
                    <span>+ Invite</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="gap-2 text-red-500 hover:text-red-600"
                      >
                        <LogOut className="size-4" />
                        <span>Leave Node</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to leave the Node?
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
                          onClick={() => leaveMyNode(nodeId)}
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          Leave Node
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}

              {/* <Button variant="outline" className="gap-2">
                <Copy className="size-4" />
                <span>Copy Link</span>
              </Button> */}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-sm text-muted-foreground">
              Our mission is simple but crucial: to protect and promote the
              well-being of trees and forests. Together, we can make a positive
              impact on our environment and leave a legacy
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4 border-t pt-4">
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
            <p className="text-sm text-muted-foreground">
              Our mission is simple but crucial: to protect and promote the
              well-being of trees and forests. Together, we can make a positive
              impact on our environment and leave a legacy for generations to
              come. Our mission is simple but crucial: to protect and promote
              the well-being of trees and forests. Together, we can make a
              positive impact on our environment and leave a legacy for
              generations to come.
            </p>
            <Button variant="link" className="p-0 text-sm">
              see all
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* dialogue  */}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>All Members</DialogTitle>
          </DialogHeader>
          <div className="my-4 flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input placeholder="Search for Members..." className="pl-8" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Filter className="size-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Copy className="size-4" />
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member&#39;s Name</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Contribution</TableHead>
                <TableHead>Join Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodeDetails?.members?.map((member: TMembers) => (
                <TableRow key={member?.user?._id}>
                  <TableCell className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={member?.user?.profileImage} />
                      <AvatarFallback>
                        {member?.user?.firstName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {member?.user?.firstName || ""}{" "}
                        {member?.user?.lastName || ""}{" "}
                        {member?.user?._id === globalUser?._id && (
                          <span className="text-sm text-muted-foreground">
                            (You)
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {member?.role}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={member?.role} />
                  </TableCell>
                  <TableCell>{0}</TableCell>
                  <TableCell>
                    {new Date(member?.createdAt).toLocaleDateString()}
                  </TableCell>
                  {isModeratorOrAdminOrOwner() &&
                    isOwner() &&
                    member?.user?._id !== globalUser?._id && (
                      <TableCell>
                        <DropdownMenu
                          open={dropdownOpen === member?.user?._id}
                          onOpenChange={(open) =>
                            setDropdownOpen(open ? member?.user?._id : null)
                          }
                        >
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="size-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {SECTIONS?.filter(
                              (section) =>
                                !section.show || section.show(member?.role)
                            )?.map((section) => (
                              <CustomAlertDialog
                                key={section?.title}
                                section={section}
                                member={member}
                                onClose={() => setDropdownOpen(null)}
                              />
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Total 85 Members
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
              <select className="rounded-md border px-2 py-1">
                <option>10 / page</option>
                <option>20 / page</option>
                <option>50 / page</option>
              </select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

type RoleBadgeProps = BadgeProps & {
  role: "owner" | "admin" | "moderator" | "member";
};

function RoleBadge({ role, className, ...props }: RoleBadgeProps) {
  const roleStyles = {
    owner: "bg-red-100 text-red-800 hover:bg-red-200",
    admin: "bg-green-100 text-green-800 hover:bg-green-200",
    moderator: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    member: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  };

  return (
    <Badge
      variant="secondary"
      className={cn(roleStyles[role], className)}
      {...props}
    >
      {role}
    </Badge>
  );
}

const CustomAlertDialog = ({
  section,
  member,
  onClose,
}: {
  section: any;
  member: any;
  onClose: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const handleAction = async () => {
    await section.onClickFunction?.(member?.user?._id);
    setOpen(false);
    onClose();
  };

  const handleCancel = () => {
    setOpen(false);
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            setOpen(true);
          }}
        >
          {section?.title}
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {section?.description(member)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAction}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
