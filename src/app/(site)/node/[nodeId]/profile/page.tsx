"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePermission } from "@/lib/use-permission";

import {
  LogOut,
  Search,
  Filter,
  MoreHorizontal,
  Check,
  X,
  Pencil,
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
import { useState } from "react";
import { useParams } from "next/navigation";
import { TMembers } from "@/types";
import { cn, formatDate } from "@/lib/utils";
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
import { SharedEndpoints } from "@/utils/endpoints/shared";
import { useNodeCalls } from "@/hooks/apis/use-node-calls";
import Invite from "@/components/pages/club/invite/invite";
import { Endpoints } from "@/utils/endpoint";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
export default function Page() {
  const { leaveNode, fetchNodeDetails } = useNodeCalls();
  const { globalUser } = useTokenStore((state) => state);
  const { currentNode, currentUserRole, nodeJoinStatus } = useNodeStore(
    (state) => state
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { nodeId } = useParams<{ nodeId: string }>();
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const visibleUsers = 5;
  const totalUsers = currentNode?.members?.length || 0;
  const remainingUsers = totalUsers - visibleUsers;
  const displayRemainingCount = remainingUsers > 100 ? "100+" : remainingUsers;

  const isOwner = () => currentUserRole === "owner";

  const isOWnerOrAdmin = () => ["owner", "admin"].includes(currentUserRole!);

  type UserRole = "member" | "admin" | "moderator" | "owner";

  const isModeratorOrAdminOrOwner = () =>
    ["moderator", "admin", "owner"].includes(currentUserRole!);
  const { hasPermission } = usePermission();
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
          fetchNodeDetails(nodeId);
        } catch (error) {
          console.log(error, "error");
          toast.error("something went wrong when making admin");
        }
      },
      show: (role: UserRole) => {
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
          fetchNodeDetails(nodeId);
        } catch (error) {
          console.log(error, "error");
          toast.error("something went wrong when making moderator");
        }
      },
      show: (role: UserRole) => {
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
          fetchNodeDetails(nodeId);
        } catch (error) {
          toast.error("something went wrong when making member");
          console.log(error, "error");
        }
      },
      show: (role: UserRole) => {
        return role !== "member" && isOwner();
      },
    },

    {
      title: "Remove user",
      description: (member: any) =>
        `Are you sure you want to remove ${member?.user?.firstName} ${member?.user?.lastName}?`,
      onClickFunction: async (accessToUserId: string) => {
        const data = {
          entityId: nodeId,
          entity: "node",
          accessToUserId,
        };
        try {
          await SharedEndpoints.removeMember(data);
          fetchNodeDetails(nodeId);
        } catch (error) {
          console.log(error, "error");
          toast.error("something went wrong when removing member");
        }
      },
      show: (role: UserRole) => {
        return role !== "owner" && isOWnerOrAdmin();
      },
    },
  ];
  const [designations, setDesignations] = useState<{ [key: string]: string }>(
    {}
  );

  const handleInputChange = (memberId: string, value: string) => {
    setDesignations((prev) => ({
      ...prev,
      [memberId]: value,
    }));
  };
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});
  const updateMemberDesignation = useNodeStore(
    (state: any) => state.updateMemberDesignation
  );
  const handleSubmit = async (memberId: string) => {
    const newValue = designations[memberId];
    try {
      await Endpoints.updateDesignation(memberId, newValue, nodeId);
      updateMemberDesignation(memberId, newValue);
      setIsEditing((prev) => ({ ...prev, [memberId]: false }));
      toast.success("Designation updated");
    } catch (error) {
      console.error("Failed to update designation:", error);
      toast.error("Failed to update designation");
    }
  };

  const handleClear = (memberId: string) => {
    setDesignations((prev) => ({
      ...prev,
      [memberId]: "",
    }));
  };

  const updateMemberPosition = async (
    newPosition: string,
    memberId: string
  ) => {
    try {
      const response = await Endpoints.updatePosition(
        nodeId,
        memberId,
        newPosition
      );
    } catch (err) {}
  };

  const handleEditClick = (userId: string) => {
    setIsEditing((prev) => ({ ...prev, [userId]: true }));
  };

  const handleSave = async (userId: string) => {
    await handleSubmit(userId);
    setIsEditing((prev) => ({ ...prev, [userId]: false }));
  };

  const handleCancel = (userId: string) => {
    handleClear(userId);
    setIsEditing((prev) => ({ ...prev, [userId]: false }));
  };
  console.log({ currentNode });
  return (
    <>
      <Card className="ml-5 mt-5 w-full  max-w-3xl">
        <CardHeader className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                Members
                <span className="text-sm font-normal text-muted-foreground">
                  • {currentNode?.members?.length}{" "}
                  {currentNode?.members?.length === 1 ? "Member" : "Members"}
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {currentNode?.members
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
              {nodeJoinStatus === "MEMBER" && currentUserRole !== "owner" && (
                <>
                  {/* <Button className="gap-2">
                    <span>+ Invite</span>
                  </Button> */}
                  <Invite entityId={nodeId} type={"node"} />
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
                          onClick={() => leaveNode(nodeId)}
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          Leave Node
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
              {currentNode?.node?.description}
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
              <p className="text-sm text-muted-foreground">132</p>
            </div>
            <div>
              <h4 className="font-semibold">Clubs</h4>
              <p className="text-sm">
                <span className="text-green-500">12 Clubs</span>
              </p>
            </div> */}
            <div>
              <h4 className="font-semibold">Founded</h4>
              <p className="text-sm text-muted-foreground">
                {formatDate(currentNode?.node?.createdAt)}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <h3 className="font-semibold">About</h3>
            <p className="text-sm text-muted-foreground">
              {currentNode?.node?.about}
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
            <DialogTitle>
              All Members{" "}
              <span className="text-sm text-gray-500">
                ({currentNode?.members?.length || 0}{" "}
                {currentNode?.members?.length === 1 ? "Member" : "Members"})
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="my-1 flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input placeholder="Search for Members..." className="pl-8" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Filter className="size-4" />
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[280px]">{`Member's Name`}</TableHead>
                <TableHead className="w-[120px]">Level</TableHead>
                <TableHead className="w-[120px] text-center">
                  Contribution
                </TableHead>
                <TableHead className="w-[120px]">Designation</TableHead>
                {/* {hasPermission("update:designation") && (
                )} */}
                <TableHead className="w-[200px]">Position</TableHead>
                <TableHead className="w-[120px]">Join Date</TableHead>
                {isModeratorOrAdminOrOwner() && (
                  <TableHead className="w-[60px]" />
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentNode?.members?.map((member) => (
                <TableRow key={member?.user?._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 shrink-0">
                        <AvatarImage src={member?.user?.profileImage} />
                        <AvatarFallback>
                          {member?.user?.firstName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="truncate font-medium">
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
                    </div>
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={member?.role} />
                  </TableCell>
                  <TableCell className="text-center">{0}</TableCell>
                  <TableCell>
                    <div className="flex w-[300px] items-center space-x-2">
                      {isEditing[member?.user?._id] ? (
                        <>
                          <div className="relative w-[220px]">
                            <Input
                              type="text"
                              placeholder="Enter designation"
                              value={
                                designations[member?.user._id] ??
                                member?.designation ??
                                ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  member?.user._id,
                                  e.target.value
                                )
                              }
                              className="h-9 w-full"
                            />
                          </div>
                          <div className="flex shrink-0 gap-1">
                            <Button
                              onClick={() => handleSave(member?.user._id)}
                              variant="outline"
                              size="icon"
                              className="size-9 shrink-0"
                            >
                              <Check className="size-4" />
                            </Button>
                            <Button
                              onClick={() => handleCancel(member?.user._id)}
                              variant="outline"
                              size="icon"
                              className="size-9 shrink-0"
                            >
                              <X className="size-4" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="flex w-full items-center justify-between">
                          <span className="text-sm">
                            {member?.designation || "No designation set"}
                          </span>
                          {hasPermission("update:designation") && (
                            <Button
                              onClick={() => handleEditClick(member?.user._id)}
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            >
                              <Pencil className="size-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {hasPermission("update:position") ? (
                      <Select
                        value={member.position}
                        onValueChange={(newPosition) =>
                          updateMemberPosition(newPosition, member.user._id)
                        }
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="junior">Junior</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Label className="text-sm text-gray-500">
                        {member.position || " - "}
                      </Label>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {new Date(member?.createdAt).toLocaleDateString()}
                  </TableCell>
                  {isModeratorOrAdminOrOwner() &&
                    member?.user?._id !== globalUser?._id &&
                    member?.role !== "owner" && (
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
            <div className="flex w-full items-center justify-end gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
              <Select>
                <SelectTrigger className="w-fit px-4">10 / page</SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="20">20 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                </SelectContent>
              </Select>
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
