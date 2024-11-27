import { useState } from "react";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
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
import { useRouter } from "next/navigation";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";

export default function DebateTable({
  data,
  forum,
  plugin,
  forumId,
}: {
  data: any;
  forum: TForum;
  plugin: string;
  forumId: string;
}) {
  const router = useRouter();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "_id",
      cell: ({ row }) => <div>{row.index + 1}</div>,
      header: "No.",
      size: 60,
    },
    {
      accessorKey: "debates",
      header: ({ column }) => {
        return (
          <div className="flex items-center gap-2">
            <span>Debates</span>
            <ChevronDown className="size-4" />
          </div>
        );
      },
      cell: ({ row }) => {
        const debate = row.original;
        const handleClick = () => {
          // Navigate to the debate details page
          router.push(`/${forum}/${forumId}/${plugin}/${debate._id}/view`);
        };
        return (
          <div
            onClick={handleClick}
            className="space-y-1 hover:cursor-pointer "
          >
            <div className="font-medium">{debate.topic}</div>
            <div className="text-sm text-muted-foreground">
              {debate.description}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "for",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-2"
          >
            For
            <ArrowUpDown className="ml-1 size-3" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="text-center">{row.original.for}</div>,
    },
    {
      accessorKey: "against",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-2"
          >
            Against
            <ArrowUpDown className="ml-1 size-3" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.original.against}</div>
      ),
    },
    {
      accessorKey: "createdAt", // Use createdAt field
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-2"
          >
            Posted Date
            <ArrowUpDown className="ml-1 size-3" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const createdAt = row.original.createdAt;
        return (
          <div className="mx-auto text-center">
            {format(new Date(createdAt), "dd/MM/yyyy")}
          </div> // Format the date
        );
      },
    },
    {
      accessorKey: "postedBy",
      header: "Posted by",
      cell: ({ row }) => {
        const { firstName, profileIMage } = row?.original?.createdBy; // Assuming `postedBy` contains `name` and `avatar`
        return (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={profileIMage} alt={firstName} />
              <AvatarFallback>{firstName || "?"}</AvatarFallback>
            </Avatar>
            <span>{firstName}</span>
          </div>
        );
      },
    },
  ];
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
  );
}
