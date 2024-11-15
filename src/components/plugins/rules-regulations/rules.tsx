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
  LockKeyhole,
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
import { date, z } from "zod";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ExpandableTableRow } from "./expandable-row";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
  relevant: any[];
  irrelevant: any[];
  comments: number;
};

interface DataTableProps {
  columns: ColumnDef<any>[];
  data: any[];
  nodeorclubId: string;
  plugin: TPlugins;
  section: TSections;
  clickTrigger: boolean;
  setClickTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}

function DataTable({
  columns,
  data,
  nodeorclubId,
  plugin,
  section,
  clickTrigger,
  setClickTrigger,
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
              // <TableRow
              //   key={row.id}
              //   data-state={row.getIsSelected() && "selected"}
              //   className="group hover:bg-muted/50"
              // >
              //   {row.getVisibleCells().map((cell) => (
              //     <TableCell key={cell.id}>
              //       {flexRender(cell.column.columnDef.cell, cell.getContext())}
              //     </TableCell>
              //   ))}
              // </TableRow>
              <ExpandableTableRow
                key={row.id}
                row={row}
                expandedContent={
                  // <div className="flex">
                  //   <div className="w-1/3 bg-red-500">hai</div>
                  //   <div className="w-1/3 bg-green-500">hello</div>
                  //   <div className="w-1/3 bg-blue-500">nice</div>
                  // </div>
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="">
                        <div className="mb-2 flex items-center gap-2">
                          {/* <span className="text-gray-500">number</span> */}
                          <h2 className="text-lg font-medium text-green-500 underline">
                            {row?.original?.title}
                          </h2>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-gray-400">Domain</p>
                            <p className="font-medium text-gray-800">
                              {row?.original?.domain}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-400">Category</p>
                            <p className="font-medium text-gray-800">
                              {row?.original?.category}
                            </p>
                          </div>

                          {/* <div>
                            <p className="text-sm text-gray-400">
                              Applicable for
                            </p>
                            <p className="font-medium text-gray-800">
                              applicableFor
                            </p>
                          </div> */}
                        </div>
                      </div>

                      <p
                        className="px-2 text-center text-gray-600"
                        dangerouslySetInnerHTML={{
                          __html: row?.original?.description,
                        }}
                      ></p>

                      <div className="text-right">
                        <p className="text-gray-600">
                          {new Date(row?.original?.createdAt).toLocaleString(
                            "default",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                        <div className="mt-1 flex items-center justify-end gap-1">
                          {/* <svg
                            className="size-4 text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg> */}
                          <LockKeyhole className="size-4 text-gray-500" />
                          <span className="text-gray-600">Private</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image
                          src={row?.original?.createdBy?.profileImage}
                          alt={row?.original?.createdBy?.userName}
                          width={32}
                          height={32}
                          className="size-8 rounded-full object-cover"
                        />
                        <span className="text-gray-700">
                          {row?.original?.createdBy?.userName}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* <span className="rounded-full bg-orange-50 px-3 py-1 text-sm text-orange-400">
                          relevantCount of totalCount find it relevant
                        </span> */}
                        <button className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:text-gray-800">
                          <Link
                            href={`/${section}/${nodeorclubId}/${plugin}/${row?.original?._id}/view`}
                            className="w-full"
                          >
                            View Original
                          </Link>
                        </button>
                        {/* <button className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                          Report Offence
                        </button> */}
                        <ContentDailog
                          plugin={plugin}
                          pluginId={row?.original?._id}
                          section={section}
                          sectionId={nodeorclubId}
                          isBtn={true}
                          setClickTrigger={setClickTrigger}
                          clickTrigger={clickTrigger}
                        />
                      </div>
                    </div>
                  </div>
                }
              />
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
      accessorKey: "sno",
      header: "SNO",
      cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>,
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
          {/* <p
            className="line-clamp-2 truncate text-xs text-muted-foreground after:content-['...']"
            dangerouslySetInnerHTML={{
              __html: row?.original?.description,
            }}
          ></p> */}
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
        // const relevanceScore = parseFloat(row.getValue("relevant"));
        const comments = row.original.comments;
        return (
          console.log(row, "relevanceScore"),
          (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {/* <ThumbsUp className="size-4" /> */}
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
                {/* <MessageCircle className="size-4" /> */}
              </div>
            </div>
          )
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
              {/* <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <ContentDailog
                  plugin={plugin}
                  pluginId={row?.original?._id}
                  section={section}
                  sectionId={nodeorclubId}
                  setClickTrigger={setClickTrigger}
                  clickTrigger={clickTrigger}
                />
              </DropdownMenuItem> */}
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
      section={section}
      setClickTrigger={setClickTrigger}
      clickTrigger={clickTrigger}
    />
  );
}

const reportSchema = z.object({
  offenderName: z
    .string()
    .nonempty({ message: "Offender name must be at least 3 characters long." }),
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
  isBtn,
}: {
  plugin: TPlugins;
  pluginId: string;
  section: TSections;
  sectionId: string;
  clickTrigger: boolean;
  setClickTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  isBtn?: boolean;
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
        {isBtn ? (
          <button className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600">
            Report Offence
          </button>
        ) : (
          <div>Report</div>
        )}
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
