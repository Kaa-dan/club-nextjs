"use client";
interface PageState {
  globalRules: number;
  activeRules: number;
  allRules: number;
  myRules: number;
}

import { Badge } from "@/components/ui/badge";
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
  DropdownMenuLabel,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NodeEndpoints } from "@/utils/endpoints/node";
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
import Loader1 from "@/components/globals/loaders/loader-1";

type Rule = {
  _id: string;
  id: number;
  title: string;
  description: string;
  publishedDate: string;
  club: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
  };
  relevant: any[];
  irrelevant: any[];
  comments: number;
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
  setCurrentPages: any;
  totalPages: any;
  currentPages: any;
  tab: "Active" | "All Rules" | "Global Rules" | "My Rules" | "Report Offenses";
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
  totalPages,
  currentPages,
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
  console.log({ currentPages });
  console.log({ totalPages });
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
              <ExpandableTableRow
                key={row.id}
                row={row}
                expandedContent={
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
                          <LockKeyhole className="size-4 text-gray-500" />
                          <span className="text-gray-600">
                            {row?.original?.isPublic ? "Public" : "Private"}
                          </span>
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
                        <button className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:text-gray-800">
                          <Link
                            href={`/${forum}/${forumId}/${plugin}/${row?.original?._id}/view`}
                            className="w-full"
                          >
                            View Original
                          </Link>
                        </button>
                        <ContentDailog
                          plugin={plugin}
                          pluginId={row?.original?._id}
                          forum={forum}
                          forumId={forumId}
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
                      <div className="text-lg font-medium">No rules found</div>
                      <div className="text-sm text-muted-foreground">
                        There are no rules available at the moment
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
            {tab === "Active"
              ? currentPages.activeRules
              : tab === "All Rules"
                ? currentPages.activeRules
                : tab === "Global Rules"
                  ? currentPages.globalRules
                  : tab === "My Rules"
                    ? currentPages.myRules
                    : tab === "Report Offenses"
                      ? currentPages.reportOffenses
                      : 1}
          </span>
          <span>of</span>
          <span className="font-medium">
            {tab === "Active"
              ? totalPages.activeRules
              : tab === "All Rules"
                ? totalPages.activeRules
                : tab === "Global Rules"
                  ? totalPages.globalRules
                  : tab === "My Rules"
                    ? totalPages.myRules
                    : tab === "Report Offenses"
                      ? totalPages.reportOffenses
                      : 1}
          </span>
        </div>
        <Button
          onClick={() => {
            setCurrentPages((prev: PageState) => {
              switch (tab) {
                case "Active":
                  return {
                    ...prev,
                    active: prev.activeRules - 1,
                  };
                case "All Rules":
                  return {
                    ...prev,
                    allRules: prev.allRules - 1,
                  };
                case "Global Rules":
                  return {
                    ...prev,
                    globalRules: prev.globalRules - 1,
                  };
                case "My Rules":
                  return {
                    ...prev,
                    myRules: prev.myRules - 1,
                  };
                // case "Report Offenses":
                // return {
                // ...prev,
                // reportOffenses: prev.reportOffenses - 1,
                // };
                default:
                  return prev;
              }
            });
          }}
          variant="outline"
          size="sm"
          disabled={
            tab === "Active"
              ? currentPages.activeRules <= 1 ||
                currentPages.activeRules > totalPages.activeRules
              : tab === "All Rules"
                ? currentPages.activeRules <= 1 ||
                  currentPages.activeRules > totalPages.activeRules
                : tab === "Global Rules"
                  ? currentPages.globalRules <= 1 ||
                    currentPages.globalRules > totalPages.globalRules
                  : tab === "My Rules"
                    ? currentPages.myRules <= 1 ||
                      currentPages.myRules > totalPages.myRules
                    : tab === "Report Offenses"
                      ? currentPages.reportOffenses <= 1 ||
                        currentPages.reportOffenses > totalPages.reportOffenses
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
                case "Active":
                  return {
                    ...prev,
                    active: prev.activeRules + 1,
                  };
                case "All Rules":
                  return {
                    ...prev,
                    allRules: prev.allRules + 1,
                  };
                case "Global Rules":
                  return {
                    ...prev,
                    globalRules: prev.globalRules + 1,
                  };
                case "My Rules":
                  return {
                    ...prev,
                    myRules: prev.myRules + 1,
                  };
                // case "Report Offenses":
                // return {
                // ...prev,
                // reportOffenses: prev.reportOffenses + 1,
                // };
                default:
                  return prev;
              }
            });
          }}
          disabled={
            tab === "Active"
              ? currentPages.activeRules >= totalPages.activeRules
              : tab === "All Rules"
                ? currentPages.activeRules >= totalPages.activeRules
                : tab === "Global Rules"
                  ? currentPages.globalRules >= totalPages.globalRules
                  : tab === "My Rules"
                    ? currentPages.myRules >= totalPages.myRules
                    : true
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export function RulesTable({
  plugin,
  forum,
  forumId,
  data,
  clickTrigger,
  setClickTrigger,
  loading,
  currentPage,
  setCurrentPages,
  tab,
  totalPage,
}: {
  plugin: TPlugins;
  forum: TForum;
  forumId: string;
  data: any;
  clickTrigger: boolean;
  setClickTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setCurrentPages: (val: any) => void;
  tab: any;
  totalPage: any;
  currentPage: any;
}) {
  console.log({ currentPage });
  const columns: ColumnDef<Rule>[] = [
    {
      accessorKey: "sno",
      header: "No.",
      cell: ({ row }) => {
        // Get the current page based on the active tab
        const getPageNumber = (tab: any) => {
          switch (tab) {
            case "Global Rules":
              return currentPage.globalRules;
            case "Active":
              return currentPage.activeRules;
            case "All Rules":
              return currentPage.activeRules;
            case "My Rules":
              return currentPage.myRules;
            default:
              return 1;
          }
        };

        return (
          <div className="font-medium">
            {Number((getPageNumber(tab) - 1) * 10) + row.index + 1}
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rules & Regulations
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
      accessorKey: "publishedStatus",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="max-w-[500px] space-y-1">
          <p className="font-medium leading-none  text-white">
            <Badge
              variant={
                row.getValue("publishedStatus") === "true"
                  ? "default"
                  : "outline"
              }
            >
              {row.getValue("publishedStatus") === "true"
                ? "Published"
                : "Draft"}
            </Badge>
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Posted Date
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
      header: "Posted by",
      cell: ({ row }) => {
        const postedBy: any = row.getValue("createdBy") as Rule["createdBy"];
        console.log("postedBy", row.original);
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Relevance Score
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
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link
                  href={`/${forum}/${forumId}/${plugin}/${row?.original?._id}/edit`}
                  className="w-full"
                >
                  Edit Section
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div>
      <DataTable
        currentPages={currentPage}
        setCurrentPages={setCurrentPages}
        totalPages={totalPage}
        columns={columns}
        data={data}
        forumId={forumId}
        plugin={plugin}
        forum={forum}
        setClickTrigger={setClickTrigger}
        clickTrigger={clickTrigger}
        loading={loading}
        tab={tab}
      />
    </div>
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
  forumId,
  forum,
  clickTrigger,
  setClickTrigger,
  isBtn,
}: {
  plugin: TPlugins;
  pluginId: string;
  forum: TForum;
  forumId: string;
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
    console.log("fetchUserNodesOrClubs");
    try {
      if (forum === "node") {
        const response = await NodeEndpoints.fetchUsersOfNode(forumId);
        console.log("users node", response);
        setUsers(response);
      } else if (forum === "club") {
        const response = await Endpoints.fetchClubMembers(forumId);
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
    formData.append("type", forum);
    formData.append("typeId", forumId);
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
                {form?.formState?.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
