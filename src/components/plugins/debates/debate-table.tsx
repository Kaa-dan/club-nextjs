// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";
// import { Badge } from "lucide-react";
// const issues: any[] = [
//   {
//     _id: "1",
//     title: "Login page error",
//     description: "Users unable to log in with correct credentials.",
//     createdAt: "2024-11-11",
//     status: "ACTIVE",
//     postedBy: {
//       name: "Alice Johnson",
//       avatar: "https://example.com/avatar/alice.jpg",
//     },
//     relevanceScore: 8,
//   },
//   {
//     _id: "2",
//     title: "Payment gateway timeout",
//     description: "Intermittent timeouts occurring on payment submission.",
//     createdAt: "2024-11-10",
//     status: "RESOLVED",
//     postedBy: {
//       name: "Bob Smith",
//       avatar: "https://example.com/avatar/bob.jpg",
//     },
//     relevanceScore: 9,
//   },
//   {
//     _id: "3",
//     title: "Broken links on homepage",
//     description: "Several links on the homepage are broken.",
//     createdAt: "2024-11-09",
//     status: "INACTIVE",
//     postedBy: {
//       name: "Carol Martinez",
//       avatar: "https://example.com/avatar/carol.jpg",
//     },
//     relevanceScore: 6,
//   },
//   {
//     _id: "4",
//     title: "Mobile responsiveness issues",
//     description: "Layout breaks on smaller screens.",
//     createdAt: "2024-11-08",
//     status: "ACTIVE",
//     postedBy: {
//       name: "Dav_id Lee",
//       avatar: "https://example.com/avatar/dav_id.jpg",
//     },
//     relevanceScore: 7,
//   },
//   {
//     _id: "5",
//     title: "404 error on contact page",
//     description: "Contact page not found for certain users.",
//     createdAt: "2024-11-07",
//     status: "RESOLVED",
//     postedBy: {
//       name: "Emma Davis",
//       avatar: "https://example.com/avatar/emma.jpg",
//     },
//     relevanceScore: 8,
//   },
// ];
// const IssueTable = () => (
//   <Table>
//     <TableHeader>
//       <TableRow>
//         <TableHead className="w-[50px]">No.</TableHead>
//         <TableHead>Issues (Supporters)</TableHead>
//         <TableHead>Posted Date</TableHead>
//         <TableHead>Status</TableHead>
//         <TableHead>Posted by</TableHead>
//         <TableHead>Solution</TableHead>
//         <TableHead>Relevance Score</TableHead>
//         <TableHead className="w-[50px]">Action</TableHead>
//       </TableRow>
//     </TableHeader>
//     <TableBody>
//       {issues?.map((issue) => (
//         <TableRow key={issue._id}>
//           <TableCell>{issue._id}</TableCell>
//           <TableCell>
//             <div className="space-y-1">
//               <div className="font-medium">{issue.title}</div>
//               <div className="text-sm text-muted-foreground">
//                 {issue.description}
//               </div>
//             </div>
//           </TableCell>
//           <TableCell>{issue.createdAt}</TableCell>
//           <TableCell>
//             <Badge
//               variant={
//                 issue.status === "ACTIVE"
//                   ? "default"
//                   : issue.status === "RESOLVED"
//                     ? "secondary"
//                     : "destructive"
//               }
//             >
//               {issue.status}
//             </Badge>
//           </TableCell>
//           <TableCell>
//             <div className="flex items-center gap-2">
//               <Avatar className="size-8">
//                 <AvatarImage src={issue.postedBy?.avatar} alt="Avatar" />
//                 <AvatarFallback>{issue.postedBy?.name?.[0]}</AvatarFallback>
//               </Avatar>
//               <span className="text-sm">{issue.postedBy?.name}</span>
//             </div>
//           </TableCell>
//           <TableCell>{issue.status}</TableCell>
//           <TableCell>{issue.relevanceScore}</TableCell>
//           <TableCell>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="size-8 p-0">
//                   <span className="sr-only">Open menu</span>
//                   <div className="flex flex-col gap-1">
//                     <div className="size-1 rounded-full bg-foreground"></div>
//                     <div className="size-1 rounded-full bg-foreground"></div>
//                     <div className="size-1 rounded-full bg-foreground"></div>
//                   </div>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem>View details</DropdownMenuItem>
//                 <DropdownMenuItem>Copy link</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </TableCell>
//         </TableRow>
//       ))}
//     </TableBody>
//   </Table>
// );

// export default IssueTable;

"use client";

import { MoreHorizontal, ArrowUpDown } from "lucide-react";
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
import { table } from "console";
import { useState } from "react";

export type Issue = {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  status: "ACTIVE" | "RESOLVED" | "INACTIVE";
  postedBy: {
    name: string;
    avatar: string;
  };
  relevanceScore: number;
};

const columns: ColumnDef<Issue>[] = [
  {
    accessorKey: "_id",
    header: "No.",
  },
  {
    accessorKey: "title",
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
          <div className="text-sm text-muted-foreground">
            {issue.description}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Posted Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "ACTIVE"
              ? "default"
              : status === "RESOLVED"
                ? "secondary"
                : "destructive"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "postedBy",
    header: "Posted by",
    cell: ({ row }) => {
      const postedBy = row.original.postedBy;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage src={postedBy.avatar} alt="Avatar" />
            <AvatarFallback>{postedBy.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{postedBy.name}</span>
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
  },
  {
    id: "actions",
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(issue._id)}
            >
              Copy issue ID
            </DropdownMenuItem>
            <DropdownMenuItem>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const issues: Issue[] = [
  {
    _id: "1",
    title: "Login page error",
    description: "Users unable to log in with correct credentials.",
    createdAt: "2024-11-11",
    status: "ACTIVE",
    postedBy: {
      name: "Alice Johnson",
      avatar: "https://example.com/avatar/alice.jpg",
    },
    relevanceScore: 8,
  },
  {
    _id: "2",
    title: "Payment gateway timeout",
    description: "Intermittent timeouts occurring on payment submission.",
    createdAt: "2024-11-10",
    status: "RESOLVED",
    postedBy: {
      name: "Bob Smith",
      avatar: "https://example.com/avatar/bob.jpg",
    },
    relevanceScore: 9,
  },
  {
    _id: "3",
    title: "Broken links on homepage",
    description: "Several links on the homepage are broken.",
    createdAt: "2024-11-09",
    status: "INACTIVE",
    postedBy: {
      name: "Carol Martinez",
      avatar: "https://example.com/avatar/carol.jpg",
    },
    relevanceScore: 6,
  },
  {
    _id: "4",
    title: "Mobile responsiveness issues",
    description: "Layout breaks on smaller screens.",
    createdAt: "2024-11-08",
    status: "ACTIVE",
    postedBy: {
      name: "David Lee",
      avatar: "https://example.com/avatar/david.jpg",
    },
    relevanceScore: 7,
  },
  {
    _id: "5",
    title: "404 error on contact page",
    description: "Contact page not found for certain users.",
    createdAt: "2024-11-07",
    status: "RESOLVED",
    postedBy: {
      name: "Emma Davis",
      avatar: "https://example.com/avatar/emma.jpg",
    },
    relevanceScore: 8,
  },
];

export default function DebateTable() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: issues,
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
    <div className=" mx-auto py-10  min-w-[100%]">
      {/* <DataTable columns={columns} data={issues} /> */}
      <div>
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
    </div>
  );
}
