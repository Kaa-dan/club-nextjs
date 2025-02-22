"use client";

import {
  MoreHorizontal,
  ArrowUpDown,
  LockKeyhole,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { ExpandableTableRow } from "../rules-regulations/expandable-row";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Loader1 from "@/components/globals/loaders/loader-1";
import { getFormattedDateAndTime } from "@/utils/text";
export type Issue = {
  _id: string;
  title: string;
  description: string;
  publishedDate: string;
  publishedStatus: string;
  createdAt: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
  };
  relevant: any[];
  irrelevant: any[];
};

interface DataTableProps {
  columns: ColumnDef<any>[];
  data: any[];
  forumId: string;
  plugin: TPlugins;
  forum: TForum;
  clickTrigger: boolean;
  setClickTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  totalPages: any;
  setCurrentPages: any;
  currentPages: any;
  tab: TIssuesLabel;
}

function DataTable({
  columns,
  data,
  forumId,
  plugin,
  forum,
  clickTrigger,
  setClickTrigger,
  loading,
  currentPages,
  setCurrentPages,
  totalPages,
  tab,
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-md border ">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="group hover:bg-muted/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <Loader1 />
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <div className="text-lg font-medium">No Issues found</div>
                      <div className="text-sm text-muted-foreground">
                        There are no issues available at the moment
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2  p-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>Page</span>
          <span className="font-medium">
            {tab === "All Issues"
              ? currentPages.allIssues
              : tab === "Global Library"
                ? currentPages.globalIssues
                : tab === "Live Issues"
                  ? currentPages.liveIssues
                  : tab === "My Issues"
                    ? currentPages.myIssues
                    : 1}
          </span>
          <span>of</span>
          <span className="font-medium">
            {tab === "All Issues"
              ? totalPages.allProjects
              : tab === "Global Library"
                ? totalPages.globalIssues
                : tab === "Live Issues"
                  ? totalPages.liveIssues
                  : tab === "My Issues"
                    ? totalPages.myProjects
                    : tab === "Proposed Issues"
                      ? totalPages.proposedProjects
                      : 1}
          </span>
        </div>
        <Button
          onClick={() => {
            setCurrentPages((prev: any) => {
              switch (tab) {
                case "Global Library":
                  return {
                    ...prev,
                    globalIssues: Math.max(1, prev.globalIssues - 1),
                  };
                case "Live Issues":
                  return {
                    ...prev,
                    liveIssues: Math.max(1, prev.liveIssues - 1),
                  };
                case "All Issues":
                  return {
                    ...prev,
                    allIssues: Math.max(1, prev.allIssues - 1),
                  };
                case "My Issues":
                  return {
                    ...prev,
                    myIssues: Math.max(1, prev.myIssues - 1),
                  };
                case "Proposed Issues":
                  return {
                    ...prev,
                    proposedIssues: Math.max(1, prev.proposedIssues - 1),
                  };
                default:
                  return prev;
              }
            });
          }}
          variant="outline"
          size="sm"
          disabled={
            tab === "Global Library"
              ? currentPages.globalIssues <= 1 ||
                currentPages.globalIssues > totalPages.globalIssues
              : tab === "Live Issues"
                ? currentPages.liveIssues <= 1 ||
                  currentPages.liveIssues > totalPages.liveIssues
                : tab === "All Issues"
                  ? currentPages.allIssues <= 1 ||
                    currentPages.allIssues > totalPages.allIssues
                  : tab === "My Issues"
                    ? currentPages.myIssues <= 1 ||
                      currentPages.myIssues > totalPages.myIssues
                    : true
          }
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCurrentPages((prev: any) => {
              switch (tab) {
                case "Global Library":
                  return {
                    ...prev,
                    globalIssues: Math.max(1, prev.globalIssues + 1),
                  };
                case "Live Issues":
                  return {
                    ...prev,
                    liveIssues: Math.max(1, prev.liveIssues + 1),
                  };
                case "All Issues":
                  return {
                    ...prev,
                    allIssues: Math.max(1, prev.allIssues + 1),
                  };
                case "My Issues":
                  return {
                    ...prev,
                    myIssues: Math.max(1, prev.myIssues + 1),
                  };
                case "Proposed Issues":
                  return {
                    ...prev,
                    proposedIssues: Math.max(1, prev.proposedIssues - 1),
                  };
                default:
                  return prev;
              }
            });
          }}
          disabled={
            tab === "Global Library"
              ? currentPages.globalIssues >= totalPages.globalIssues
              : tab === "Live Issues"
                ? currentPages.liveIssues >= totalPages.liveIssues
                : tab === "All Issues"
                  ? currentPages.allIssues >= totalPages.allIssues
                  : tab === "My Issues"
                    ? currentPages.myIssues >= totalPages.myIssues
                    : true
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default function IssueTable({
  plugin,
  forum,
  forumId,
  data,
  clickTrigger,
  setClickTrigger,
  tab,
  loading,
  currentPages,
  setCurrentPages,
  totalPages,
}: {
  plugin: TPlugins;
  forum: TForum;
  forumId: string;
  data: any[];
  clickTrigger: boolean;
  setClickTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  tab: TIssuesLabel;
  loading: boolean;
  totalPages: any;
  setCurrentPages: any;
  currentPages: any;
}) {
  // const [sorting, setSorting] = useState<SortingState>([]);

  // const table = useReactTable({
  //   data: issues,
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   onSortingChange: setSorting,
  //   getSortedRowModel: getSortedRowModel(),
  //   state: {
  //     sorting,
  //   },
  // });

  const columns: ColumnDef<Issue>[] = [
    {
      accessorKey: "sno",
      header: "SNO",
      cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>,
    },
    {
      accessorKey: "Issues",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Issues
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const issue = row.original;
        return (
          <div className="space-y-1">
            <div className="font-medium">{issue.title}</div>
            {/* <div className="text-sm text-muted-foreground">
              {issue.description}
            </div> */}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Posted
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const { formattedDate } = getFormattedDateAndTime(
          row.original.createdAt
        );
        return (
          <div className="text-sm text-muted-foreground">{formattedDate}</div>
        );
      },
    },
    {
      accessorKey: "publishedStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue(
          "publishedStatus"
        ) as Issue["publishedStatus"];
        return (
          <Badge
            variant={
              status === "published"
                ? "default"
                : status === "draft"
                  ? "secondary"
                  : status === "olderversion"
                    ? "secondary"
                    : "destructive"
            }
            className="text-white"
          >
            {status}
          </Badge>
        );
      },
    },

    {
      accessorKey: "createdBy",
      header: "Posted by",
      cell: ({ row }) => {
        const postedBy = row.getValue("createdBy") as Issue["createdBy"];
        console.log(postedBy, "posted by");
        return (
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage
                src={
                  postedBy?.profileImage ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWdu-qOixArQruGnl8wz6iK-ygXGGGOSQytg&s"
                }
                alt="Avatar"
              />
              <AvatarFallback>
                {postedBy?.firstName?.trim()?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {postedBy?.firstName || ""}
              {postedBy?.lastName || ""}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "relevanceScore",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Relevance Score
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          console.log(row, "relevanceScore"),
          (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <ThumbsUp
                  className={cn("size-4  cursor-pointer text-primary")}
                />
                <span>{row?.original?.relevant?.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp
                  className={cn(
                    "size-4 rotate-180 cursor-pointer text-red-500"
                  )}
                />
                <span>{row?.original?.irrelevant?.length}</span>
              </div>
            </div>
          )
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const issue = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link
                  href={`/${forum}/${forumId}/${plugin}/${row.original._id}/view`}
                  className="w-full"
                >
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const getFilteredColumns = () => {
    if (tab === "Proposed Issues") {
      return columns.filter(
        (col) =>
          !("accessorKey" in col && col.accessorKey === "publishedStatus")
      );
    }
    return columns;
  };

  return (
    <DataTable
      currentPages={currentPages}
      setCurrentPages={setCurrentPages}
      totalPages={totalPages}
      columns={getFilteredColumns()}
      data={data}
      forumId={forumId}
      plugin={plugin}
      forum={forum}
      clickTrigger={clickTrigger}
      setClickTrigger={setClickTrigger}
      loading={loading}
      tab={tab}
    />
  );
}
