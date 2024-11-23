"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  MessageCircle,
  MoreVertical,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mainAxios } from "@/lib/mainAxios";

// Define the type for your data
interface ReportData {
  _id: string;
  clubOrNode: "Club" | "Node";
  clubOrNodeId: string;
  createdAt: string;
  updatedAt: string;
  reason: string;
  rulesId: string;
  offender: {
    _id: string;
    email: string;
    isBlocked: boolean;
    emailVerified: boolean;
    registered: boolean;
  };
  reportedBy: {
    _id: string;
    email: string;
    isBlocked: boolean;
    emailVerified: boolean;
    registered: boolean;
  };
  proof: any[]; // Define proper type based on your proof structure
}

interface DataTableProps {
  columns: ColumnDef<any>[];
  data: any[];
  nodeorclubId: string;
  plugin: string;
}

// Define your columns
const columns = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }: { row: any }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString();
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "offender.userName",
    header: "Offender",
  },
  {
    accessorKey: "reportedBy.userName",
    header: "Reported By",
  },
  {
    accessorKey: "rulesId.title",
    header: "Rule",
  },
  {
    accessorKey: "proof",
    header: "file",
  },
];

export function DataTable({ data }: DataTableProps) {
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

  function getFileNameFromUrl(url: string) {
    const lastIndex = url.lastIndexOf("/");
    const fileName = url.substring(lastIndex + 1);
    const dotIndex = fileName.lastIndexOf(".");
    const name = dotIndex !== -1 ? fileName.substring(0, dotIndex) : fileName;
    return name;
  }

  async function downloadFile(url: string) {
    try {
      const fileName = getFileNameFromUrl(url);
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = fileName;
      downloadLink.target = "_blank";
      downloadLink.rel = "noopener noreferrer";
      downloadLink.click();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
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
                    {/* {flexRender(cell.column.columnDef.cell, cell.getContext())} */}
                    {cell.column.id === "proof" && cell.getValue() ? (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            downloadFile(
                              (cell.getValue() as { url: string }).url
                            )
                          }
                        >
                          view
                        </Button>
                      </>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="text-lg font-medium">No reports found</div>
                  <div className="text-sm text-muted-foreground">
                    There are no reports available at the moment
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

interface OffenceTableProps {
  plugin: TPlugins;
  forum: TForum;
  nodeorclubId: string;
  data: any[];
}

export function OffenceTable({
  plugin,
  forum,
  nodeorclubId,
  data,
}: OffenceTableProps) {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-medium">#{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Details
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="max-w-[500px] space-y-1">
          <p className="font-medium leading-none text-foreground">
            {row.getValue("title")}
          </p>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {row.original.description}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "publishedDate",
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
        const date = new Date(row.getValue("publishedDate"));
        return (
          <div className="text-sm text-muted-foreground">
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "createdBy",
      header: "Author",
      cell: ({ row }) => {
        const postedBy = row.getValue("createdBy") as any["createdBy"];
        return (
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage
                src={
                  postedBy?.avatar ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWdu-qOixArQruGnl8wz6iK-ygXGGGOSQytg&s"
                }
                alt={postedBy?.name}
              />
              <AvatarFallback>{postedBy?.name?.[0] || "A"}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {postedBy?.name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "relevanceScore",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Engagement
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const relevanceScore = parseFloat(row.getValue("relevanceScore"));
        const comments = row.original.comments;
        return (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <ThumbsUp className="size-4" />
              <span>{relevanceScore}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="size-4" />
              <span>{comments}</span>
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="size-8 p-0"
                aria-label="Open actions"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link
                  href={`/${forum}/${nodeorclubId}/${plugin}/${row.original._id}/view`}
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

  return (
    <DataTable
      columns={columns}
      data={data}
      nodeorclubId={nodeorclubId}
      plugin={plugin}
    />
  );
}
