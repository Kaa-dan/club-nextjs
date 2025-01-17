"use client";
interface PageState {
  globalProjects: number;
  activeProjects: number;
  allProjects: number;
  myProjects: number;
}
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
import { Dispatch, SetStateAction, useState } from "react";
import { ExpandableTableRow } from "../rules-regulations/expandable-row";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Loader1 from "@/components/globals/loaders/loader-1";
import { ProjectApi } from "./projectApi";
import { getFormattedDateAndTime } from "@/utils/text";
interface DataTableProps {
  columns: ColumnDef<any>[];
  data: any[];
  forumId: string;
  plugin: TPlugins;
  forum: TForum;
  clickTrigger: boolean;
  setClickTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setCurrentPages: (val: any) => void;
  tab: TProjectLable;
  totalPage: any;
  currentPage: any;
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
  setCurrentPages,
  tab,
  currentPage,
  totalPage,
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  console.log({ dataTable: data });
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
                      <div className="text-lg font-medium">
                        No Projects found
                      </div>
                      <div className="text-sm text-muted-foreground">
                        There are no Projects available at the moment
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-end space-x-2 p-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>Page</span>
          <span className="font-medium">
            {tab === "All Projects"
              ? currentPage.allProjects
              : tab === "On going projects"
                ? currentPage.activeProjects
                : tab === "Global Projects"
                  ? currentPage.globalProjects
                  : tab === "My Projects"
                    ? currentPage.myProjects
                    : 1}
          </span>
          <span>of</span>
          <span className="font-medium">
            {tab === "All Projects"
              ? totalPage.allProjects
              : tab === "On going projects"
                ? totalPage.activeProjects
                : tab === "Global Projects"
                  ? totalPage.globalProjects
                  : tab === "My Projects"
                    ? totalPage.myProjects
                    : tab === "Proposed Project"
                      ? totalPage.proposedProjects
                      : 1}
          </span>
        </div>
        <Button
          onClick={() => {
            setCurrentPages((prev: PageState) => {
              switch (tab) {
                case "Global Projects":
                  return {
                    ...prev,
                    globalProjects: prev.globalProjects - 1,
                  };
                case "On going projects":
                  return {
                    ...prev,
                    activeProjects: prev.activeProjects - 1,
                  };
                case "All Projects":
                  return {
                    ...prev,
                    allProjects: prev.allProjects - 1,
                  };
                case "My Projects":
                  return {
                    ...prev,
                    myProjects: prev.myProjects - 1,
                  };
                default:
                  return prev;
              }
            });
          }}
          variant="outline"
          size="sm"
          disabled={
            tab === "Global Projects"
              ? currentPage.globalProjects <= 1 ||
                currentPage.globalProjects > totalPage.globalProjects
              : tab === "On going projects"
                ? currentPage.activeProjects <= 1 ||
                  currentPage.activeProjects > totalPage.activeProjects
                : tab === "All Projects"
                  ? currentPage.allProjects <= 1 ||
                    currentPage.allProjects > totalPage.allProjects
                  : tab === "My Projects"
                    ? currentPage.myProjects <= 1 ||
                      currentPage.myProjects > totalPage.myProjects
                    : true
          }
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCurrentPages((prev: PageState) => {
              switch (tab) {
                case "Global Projects":
                  return {
                    ...prev,
                    globalProjects: prev.globalProjects + 1,
                  };
                case "On going projects":
                  return {
                    ...prev,
                    activeProjects: prev.activeProjects + 1,
                  };
                case "All Projects":
                  return {
                    ...prev,
                    allProjects: prev.allProjects + 1,
                  };
                case "My Projects":
                  return {
                    ...prev,
                    myProjects: prev.myProjects + 1,
                  };
                default:
                  return prev;
              }
            });
          }}
          disabled={
            tab === "Global Projects"
              ? currentPage.globalProjects >= totalPage.globalProjects ||
                currentPage.globalProjects > totalPage.globalProjects
              : tab === "On going projects"
                ? currentPage.activeProjects >= totalPage.activeProjects ||
                  currentPage.activeProjects > totalPage.activeProjects
                : tab === "All Projects"
                  ? currentPage.allProjects >= totalPage.allProjects ||
                    currentPage.allProjects > totalPage.allProjects
                  : tab === "My Projects"
                    ? currentPage.myProjects >= totalPage.myProjects ||
                      currentPage.myProjects > totalPage.myProjects
                    : true
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default function ProjectTable({
  plugin,
  forum,
  forumId,
  data,
  clickTrigger,
  setClickTrigger,
  tab,
  loading,
  reFetch,
  setCurrentPages,
  totalPages,
  currentPages,
}: {
  plugin: TPlugins;
  forum: TForum;
  forumId: string;
  data: any[];
  clickTrigger?: boolean;
  setClickTrigger?: React.Dispatch<React.SetStateAction<boolean>>;
  tab: TProjectLable;
  loading?: boolean;
  reFetch: any;
  setCurrentPages: any;
  totalPages: any;
  currentPages: any;
}) {
  console.log({ projectTableData: data });
  const columns: ColumnDef<TProjectData>[] = [
    {
      accessorKey: "sno",
      header: "SNO",
      cell: ({ row }) => {
        // Get current page based on project tab
        const getCurrentPage = (tab: any) => {
          switch (tab) {
            case "All Projects":
              return currentPages.allProjects;
            case "On going projects":
              return currentPages.activeProjects;
            case "Global Projects":
              return currentPages.globalProjects;
            case "My Projects":
              return currentPages.myProjects;
            default:
              return 1;
          }
        };

        return (
          <div className="font-medium">
            {Number((getCurrentPage(tab) - 1) * 10) + row.index + 1}
          </div>
        );
      },
    },
    {
      accessorKey: "Projects",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Projects
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="space-y-1">
            <div className="font-medium">{row?.original?.title}</div>
          </div>
        );
      },
    },

    {
      accessorKey: "traction",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Traction
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        console.log({ row });
        return (
          <div className="space-y-1">
            <div className="font-medium"> {row?.original?.adoptionCount}</div>
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
          Posted At
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as TProjectData["status"];
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
        const postedBy = row.getValue("createdBy") as TProjectData["createdBy"];
        return (
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={postedBy?.profileImage} alt="Avatar" />
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
    ...(tab === "Proposed Project"
      ? [
          {
            accessorKey: "message",
            header: ({ column }: { column: any }) => {
              return (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  Message
                  <ArrowUpDown className="ml-2 size-4" />
                </Button>
              );
            },
            cell: ({ row }: { row: any }) => {
              console.log({ hello: row });
              return (
                <div className="space-y-1 text-center">
                  <div className="text-sm text-muted-foreground">
                    {row?.original?.message || "No message"}
                  </div>
                </div>
              );
            },
          },
        ]
      : []),
    ...(tab !== "Proposed Project"
      ? [
          {
            accessorKey: "relevanceScore",
            header: ({ column }: any) => {
              return (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  Relevance Score
                  <ArrowUpDown className="ml-2 size-4" />
                </Button>
              );
            },
            cell: ({ row }: any) => {
              return (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="size-4 cursor-pointer text-primary" />
                    <span>{0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="size-4 rotate-180 cursor-pointer text-red-500" />
                    <span>{0}</span>
                  </div>
                </div>
              );
            },
          },
        ]
      : []),
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        if (tab === "Proposed Project") {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/${forum}/${forumId}/${plugin}/${row.original._id}/view`}
                    className="w-full"
                  >
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    ProjectApi.projectAction(
                      row.original._id,
                      "accept",
                      row.original.type
                    ).then(() => {
                      reFetch();
                    });
                  }}
                >
                  Accept
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    ProjectApi.projectAction(
                      row.original._id,
                      "reject",
                      row.original.type
                    ).then(() => {
                      reFetch();
                    });
                  }}
                  className="text-red-500"
                >
                  Reject
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

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
              <DropdownMenuItem asChild>
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
    if (tab === "Proposed Project") {
      return columns.filter(
        (col) =>
          !("accessorKey" in col && col.accessorKey === "publishedStatus")
      );
    }
    return columns;
  };

  return (
    <DataTable
      columns={getFilteredColumns()}
      data={data || []}
      forumId={forumId}
      plugin={plugin}
      forum={forum}
      clickTrigger={clickTrigger as boolean}
      setClickTrigger={setClickTrigger as any}
      loading={loading as any}
      setCurrentPages={setCurrentPages}
      tab={tab}
      totalPage={totalPages}
      currentPage={currentPages}
    />
  );
}
