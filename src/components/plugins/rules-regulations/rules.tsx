"use client";

import { useState, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ThumbsUp,
  MessageCircle,
  MoreVertical,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Endpoints } from "@/utils/endpoint";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import plugin from "tailwindcss";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PhotoInput from "@/components/ui/photo-input";
import { type } from "os";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NodeEndpoints } from "@/utils/endpoints/node";
import { error } from "console";
import { RulesAndRegulationsEndpoints } from "@/utils/endpoints/plugins/rules-and-regulations";
import { toast } from "sonner";

type Rule = {
  id: number;
  title: string;
  _id: string;
  description: string;
  publishedDate: string;
  club: string;
  createdBy: {
    name: string;
    avatar: string;
  };
  relevanceScore: number;
  comments: number;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  nodeorclubId: string;
  plugin: string;
}

function DataTable<TData, TValue>({
  columns,
  data,
  nodeorclubId,
  plugin,
}: DataTableProps<TData, TValue>) {
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
    <div className="rounded-md border">
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
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="text-lg font-medium">No rules found</div>
                  <div className="text-sm text-muted-foreground">
                    There are no rules available at the moment
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

export function RulesTable({
  plugin,
  section,
  nodeorclubId,
  data,
  clickTrigger,
  setClickTrigger,
}: {
  plugin: TPlugins;
  section: TSections;
  nodeorclubId: string;
  data: any;
  clickTrigger: boolean;
  setClickTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // const [rules, setRules] = useState<Rule[]>([]);
  // const [loading, setLoading] = useState(true);

  // if (loading) {
  //   return (
  //     <div className="flex h-32 items-center justify-center">
  //       <div className="size-8 animate-spin rounded-full border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }

  const columns: ColumnDef<Rule>[] = [
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
      /*************  ✨ Codeium Command ⭐  *************/
      /**
       * @description
       * The header cell for the `publishedDate` column.
       * It displays a button that toggles the sorting of the column when clicked.
       * The button displays the text "Posted" and an arrow up/down icon that
       * indicates the direction of the sort.
       */
      /******  b94d036e-89dc-42f6-b14c-14391b9c0d6c  *******/
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
        const postedBy = row.getValue("createdBy") as Rule["createdBy"];
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
        const rule = row.original;
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
                  href={`/${section}/${nodeorclubId}/${plugin}/${row.original._id}/view`}
                  className="w-full"
                >
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                {/* <Dialog>
                  <DialogTrigger>
                    <div>Report</div>
                  </DialogTrigger>
                  <ContentDailog
                    plugin={plugin}
                    pluginId={row?.original?._id}
                    section={section}
                    sectionId={nodeorclubId}
                  />
                </Dialog> */}
                <ContentDailog
                  plugin={plugin}
                  pluginId={row?.original?._id}
                  section={section}
                  sectionId={nodeorclubId}
                  setClickTrigger={setClickTrigger}
                  clickTrigger={clickTrigger}
                />
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

const reportSchema = z.object({
  offenderName: z
    .string()
    .min(3, { message: "Offender name must be at least 3 characters long." }),
  description: z.string().min(2, { message: "Description is required." }),
  proofPhoto: z
    .instanceof(File)
    .nullable()
    .refine((file) => file, { message: "Proof photo is required." }),
});

type ReportType = z.infer<typeof reportSchema>;

const ContentDailog = ({
  plugin,
  pluginId,
  sectionId,
  section,
  clickTrigger,
  setClickTrigger,
}: {
  plugin: TPlugins;
  pluginId: string;
  section: TSections;
  sectionId: string;
  clickTrigger: boolean;
  setClickTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [formData, setFormData] = useState<Partial<ReportType>>({});
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ReportType>({
    resolver: zodResolver(reportSchema),
    defaultValues: formData,
  });

  useEffect(() => {
    form.reset(formData);
  }, [formData, form]);

  const fetchUserNodesOrClubs = async () => {
    try {
      if (section === "node") {
        const response = await NodeEndpoints.fetchUsersOfNode(sectionId);
        console.log("users node", response);
        setUsers(response);
      } else if (section === "club") {
        const response = await Endpoints.fetchClubMembers(sectionId);
        console.log("users club", response);
        setUsers(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserNodesOrClubs();
  }, []);

  const onSubmit: SubmitHandler<ReportType> = async (data: ReportType) => {
    // Handle form submission

    const values = form.getValues();
    console.log(values, "values");

    const formData = new FormData();
    formData.append("type", section);
    formData.append("typeId", sectionId);
    formData.append("reason", values.description);
    formData.append("rulesID", pluginId);
    formData.append("offenderID", values.offenderName);
    if (values.proofPhoto) formData.append("file", values.proofPhoto);
    try {
      const response =
        await RulesAndRegulationsEndpoints.reportOffence(formData);
      console.log("response", response);
      toast.success("Reported successfully");
      setClickTrigger(!clickTrigger);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger>
        <div>Report</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Report Offence</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="offenderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Offender name</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select offender" />
                        </SelectTrigger>
                        <SelectContent>
                          {users &&
                            users.map((user: any, index) => (
                              <SelectItem key={index} value={user?.user?._id}>
                                {user?.user?.userName}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Write here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="proofPhoto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>+ Upload document</FormLabel>
                    <FormControl>
                      {/* <PhotoInput
                        field="Proof"
                        onUpload={(file) => field.onChange(file)}
                      /> */}
                      <Input
                        type="file"
                        accept=".jpeg, .jpg, .png, .gif, .pdf, .doc, .docx"
                        onChange={(event) =>
                          field.onChange(event.target.files?.[0])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={form?.formState?.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form?.formState?.isSubmitting}>
                {form?.formState?.isSubmitting ? "Submitting..." : "onSubmit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
