"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, View } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTokenStore } from "@/store/store";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { SharedEndpoints } from "@/utils/endpoints/shared";
import CustomAlertDialog from "@/components/ui/custom/custom-alert-dialog";
import { TMembers } from "@/types";
import { useClubStore } from "@/store/clubs-store";

type ClubMemberListProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  members: TMembers[];
  setClickTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  clickTrigger: boolean;
};

export default function ClubMembersList({
  isModalOpen,
  members,
  setIsModalOpen,
  setClickTrigger,
  clickTrigger,
}: ClubMemberListProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { globalUser } = useTokenStore((state) => state);
  const { clubId } = useParams<{ clubId: string }>();
  const [isOpen, setIsOpen] = React.useState(false);
  const { currentUserRole } = useClubStore();

  const isOwner = () => currentUserRole === "owner";

  const isOWnerOrAdmin = () => ["owner", "admin"].includes(currentUserRole!);

  const isModeratorOrAdminOrOwner = () =>
    ["moderator", "admin", "owner"].includes(currentUserRole!);

  type UserRole = "member" | "admin" | "moderator" | "owner";

  const ROLE_ACTIONS = [
    {
      title: "Change to admin",
      description: (member: any) =>
        `Are you sure you want to make ${member?.user?.firstName} ${member?.user?.lastName} to Admin?`,
      onClickFunction: async (accessToUserId: string) => {
        const data = {
          entityId: clubId,
          entity: "club",
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
          entityId: clubId,
          entity: "club",
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
          entityId: clubId,
          entity: "club",
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
          entityId: clubId,
          entity: "club",
          accessToUserId,
        };
        try {
          await SharedEndpoints.removeMember(data);
          setClickTrigger(!clickTrigger);
        } catch (error) {
          console.log(error, "error");
          toast.error("something went wrong when removing member");
        }
      },
      show: isOWnerOrAdmin,
    },
  ];

  const columns: ColumnDef<TMembers>[] = [
    {
      accessorKey: "user",
      header: "Member's Name",
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex items-center">
            <Avatar className="mr-2 size-8">
              <AvatarImage
                src={user?.profileImage}
                alt={`${user?.firstName} ${user?.lastName}`}
              />
              <AvatarFallback>
                {user?.firstName[0]}
                {user?.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {user?.firstName} {user?.lastName}{" "}
                {user?._id === globalUser?._id && (
                  <span className="text-sm text-muted-foreground">(You)</span>
                )}
              </div>
            </div>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        const user = row?.getValue(id) as TMembers["user"];
        return (
          user?.firstName?.toLowerCase()?.includes(value?.toLowerCase()) ||
          user?.lastName?.toLowerCase()?.includes(value?.toLowerCase())
        );
      },
    },
    {
      accessorKey: "role",
      header: "Level",
      cell: ({ row }) => {
        const role = row?.getValue("role") as string;
        return (
          <Badge
            variant="secondary"
            className={
              role === "owner"
                ? "bg-red-100 text-red-800 hover:bg-red-200"
                : role === "admin"
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : role === "moderator"
                    ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }
          >
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "contributions",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Contributions
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-right">{row.getValue("contributions")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Join Date",
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {new Date(row.getValue("createdAt")).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const member = row.original;

        return isModeratorOrAdminOrOwner() &&
          isOwner() &&
          member?.user?._id !== globalUser?._id ? (
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {ROLE_ACTIONS?.filter(
                (section) =>
                  !section.show || section.show(member?.role as UserRole)
              )?.map((section) => (
                <CustomAlertDialog
                  key={section?.title}
                  trigger={
                    <DropdownMenuItem
                      onSelect={(event) => {
                        event.preventDefault();
                        setIsOpen(true);
                      }}
                    >
                      {section?.title}
                    </DropdownMenuItem>
                  }
                  description={section?.description(member)}
                  onAction={() => {
                    section?.onClickFunction(member?.user?._id);
                    setIsOpen(false);
                  }}
                  onCancel={() => setIsOpen(false)}
                  title={section?.title}
                  type="warning"
                />
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null;
      },
    },
  ];

  const table = useReactTable({
    data: members,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-4xl gap-0 p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">All Members</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <div className="flex items-center justify-between gap-4 py-4">
            <Input
              placeholder="Search for members..."
              value={
                (table.getColumn("user")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("user")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Columns <ChevronDown className="ml-2 size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getFilteredRowModel().rows?.length ? (
                  table.getFilteredRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
//
