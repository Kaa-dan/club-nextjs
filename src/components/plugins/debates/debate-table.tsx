import { useState } from "react";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { getFormattedDateAndTime } from "@/utils/text";
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
import { Badge } from "@/components/ui/badge";
import { useClubStore } from "@/store/clubs-store";
import { Endpoints } from "@/utils/endpoint";

// Type for badge variants
type BadgeVariant = "default" | "destructive" | "outline" | "secondary";
type TPublishedStatus = "proposed" | "published" | "draft" | "archived";
interface IUser {
  _id: string;
  email: string;
  interests: string[];
  isBlocked: boolean;
  emailVerified: boolean;
  registered: boolean;
  signupThrough: string;
  isOnBoarded: boolean;
  onBoardingStage: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  dateOfBirth: Date;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  userName: string;
  profileImage: string;
}

interface IFile {
  url: string;
  mimetype: string;
  size: number;
  _id: string;
}

interface IAdopted {
  club?: string;
  node?: string;
  date: Date;
  _id: string;
}

interface IView {
  user: IUser;
  timestamp: Date;
}

// type TPublishedStatus = "draft" | "published" | "archived";

interface IArgs {
  for: IArgument[];
  against: IArgument[];
}

interface IArgument {
  _id: string;
  debate: string;
  participant: {
    user: IUser;
    side: "support" | "against";
    _id: string;
  };
  content: string;
  relevant: string[];
  irrelevant: string[];
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

interface IDebate {
  _id: string;
  topic: string;
  closingDate: Date;
  significance: string;
  targetAudience: string;
  tags: string[];
  files: IFile[];
  isPublic: boolean;
  club?: string;
  node?: string;
  adoptedClubs: IAdopted[];
  adoptedNodes: IAdopted[];
  views: IView[];
  createdBy: IUser;
  publishedBy?: string;
  publishedStatus: TPublishedStatus;
  createdAt: Date;
  updatedAt: Date;
  openingCommentsFor?: string;
  openingCommentsAgainst?: string;
  args: IArgs;
  adoptionInfo: any;
  type: string;
  adoptionId: string;
  creator: IUser;
}

interface DebateTableProps {
  data: IDebate[];
  forum: TForum;
  plugin: string;
  forumId: string;
  tab: string;
  setClickTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  clickTrigger: boolean;
  setCurrentPages: (val: any) => void;
  totalPage: any;
  currentPage: any;
}

export default function DebateTable({
  tab,
  data,
  forum,
  plugin,
  forumId,
  setClickTrigger,
  clickTrigger,
  currentPage,
  setCurrentPages,
  totalPage,
}: DebateTableProps) {
  const router = useRouter();
  const isMyDebates = tab === "My Debates";
  const isGlobalDebates = tab === "Global Debates";
  const isProposeDebates = tab === "Proposed Debates";
  const isAllDebates = !isMyDebates && !isGlobalDebates && !isProposeDebates;

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "ongoing":
        return "border-green-500 text-green-700 bg-green-50";
      case "ended":
        return "border-red-500 text-red-700 bg-red-50";
      case "draft":
        return "border-yellow-500 text-yellow-700 bg-yellow-50";
      default:
        return "border-gray-200 text-gray-700 bg-gray-50";
    }
  };

  const getDebateStatus = (
    debate: IDebate,
    isAllDebatesTab: boolean = false
  ) => {
    if (isAllDebatesTab || debate.publishedStatus === "published") {
      if (!debate.closingDate) {
        return "ongoing";
      }
      const isExpired =
        new Date(debate?.closingDate).setHours(0, 0, 0, 0) <
        new Date().setHours(0, 0, 0, 0);
      // const now = new Date();
      // const closingDate = new Date(debate.closingDate);
      return isExpired ? "ended" : "ongoing";
    }
    return debate.publishedStatus;
  };

  const baseColumns: ColumnDef<IDebate>[] = [
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
          const debateUrl = `/${forum}/${forumId}/${plugin}/${debate._id}/view`;

          // Only add query parameters if it's an adopted debate
          const url =
            debate.type === "adopted" && debate.adoptionId
              ? `${debateUrl}?type=${debate.type}&adoptedId=${debate.adoptionId}`
              : debateUrl;

          router.push(url);
        };
        return (
          <div onClick={handleClick} className="space-y-1 hover:cursor-pointer">
            <div className="font-medium">{debate.topic}</div>
            <div className="text-sm text-muted-foreground">
              {debate.significance}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "For",
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
      cell: ({ row }) => {
        const support = row?.original?.args?.for;
        return <div className="text-center">{support?.length}</div>;
      },
    },
    {
      accessorKey: "Against",
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
      cell: ({ row }) => {
        const againstCount = row?.original?.args?.against?.length;
        return <div className="text-center">{againstCount}</div>;
      },
    },
  ];

  const statusColumn: ColumnDef<IDebate> = {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-2"
        >
          Status
          <ArrowUpDown className="ml-1 size-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = getDebateStatus(row.original, isAllDebates);
      return (
        <div className="text-center">
          <div
            className={`inline-block rounded-full border px-3 py-1 ${getStatusStyles(
              status
            )}`}
          >
            {status}
          </div>
        </div>
      );
    },
  };

  const postedByColumn: ColumnDef<IDebate> = {
    accessorKey: "createdBy",
    header: "Posted by",
    cell: ({ row }) => {
      const { firstName, profileImage } = row.original.creator;
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={profileImage} alt={firstName} />
            <AvatarFallback>{firstName?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>
          <span>{firstName}</span>
        </div>
      );
    },
  };

  const postedDateColumn: ColumnDef<IDebate> = {
    accessorKey: "createdAt",
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
      const { formattedDate } = getFormattedDateAndTime(row.original.createdAt);
      return <div className="mx-auto text-center">{formattedDate}</div>;
    },
  };

  // Define different column sets based on tab
  let columns: ColumnDef<IDebate>[];

  if (isProposeDebates) {
    columns = [
      {
        accessorKey: "_id",
        cell: ({ row }) => <div>{row.index + 1}</div>,
        header: "No.",
        size: 60,
      },
      {
        accessorKey: "debates",
        header: "Debate",
        cell: ({ row }) => {
          const debate = row.original;
          const handleClick = () => {
            router.push(`/${forum}/${forumId}/${plugin}/${debate._id}/view`);
          };
          return (
            <div
              onClick={handleClick}
              className="space-y-1 hover:cursor-pointer"
            >
              <div className="font-medium">{debate.topic}</div>
              <div className="text-sm text-muted-foreground">
                {debate.significance}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-2"
            >
              Created Date
              <ArrowUpDown className="ml-1 size-3" />
            </Button>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="mx-auto text-center">
              {format(new Date(row.original.createdAt), "dd/MM/yyyy")}
            </div>
          );
        },
      },
      {
        accessorKey: "createdBy",
        header: "Posted By",
        cell: ({ row }) => {
          const { firstName, profileImage } = row.original.creator;
          console.log({ firstName });
          return (
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={profileImage} alt={firstName} />
                <AvatarFallback>{firstName?.charAt(0) || "?"}</AvatarFallback>
              </Avatar>
              <span>{firstName}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "actions",
        header: "Action",
        cell: ({ row }) => {
          const handleApprove = () => {
            Endpoints.acceptDebate(
              row.original._id,
              row.original.adoptionInfo.type
            )
              .then((res) => {
                setClickTrigger(!clickTrigger);
              })
              .catch((err) => {
                console.log({ err });
              });
          };

          const handleReject = () => {
            Endpoints.rejectDebate(row.original._id)
              .then((res) => {
                setClickTrigger(!clickTrigger);
              })
              .catch((err) => {
                console.log({ err });
              });
            console.log(`Rejecting debate ID: ${row.original._id}`);
          };

          return (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleApprove}>
                Approve
              </Button>
              <Button variant="destructive" size="sm" onClick={handleReject}>
                Reject
              </Button>
            </div>
          );
        },
      },
    ];
  } else if (isMyDebates) {
    columns = [...baseColumns, statusColumn, postedDateColumn];
  } else if (isGlobalDebates) {
    columns = [...baseColumns, postedDateColumn, postedByColumn];
  } else {
    // For "All Debates" tab
    columns = [...baseColumns, statusColumn, postedByColumn, postedDateColumn];
  }

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
            {table?.getHeaderGroups()?.map((headerGroup) => (
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
            {table?.getRowModel().rows?.length ? (
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
      <div className="flex items-center justify-end space-x-2 p-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>Page</span>
          <span className="font-medium">
            {tab === "Global Debates"
              ? currentPage?.globalDebates
              : tab === "Ongoing Debates"
                ? currentPage?.ongoingDebates
                : tab === "All Debates"
                  ? currentPage?.allDebates
                  : tab === "My Debates"
                    ? currentPage?.myDebates
                    : tab === "Proposed Debates"
                      ? currentPage?.proposed
                      : 1}
          </span>
          <span>of</span>
          <span className="font-medium">
            {tab === "Global Debates"
              ? totalPage?.globalDebates
              : tab === "Ongoing Debates"
                ? totalPage?.ongoingDebates
                : tab === "All Debates"
                  ? totalPage?.allDebates
                  : tab === "My Debates"
                    ? totalPage?.myDebates
                    : tab === "Proposed Debates"
                      ? totalPage?.proposed
                      : 1}
          </span>
        </div>
        <Button
          onClick={() => {
            setCurrentPages((prev: any) => {
              switch (tab) {
                case "Global Debates":
                  return {
                    ...prev,
                    globalDebates: prev.globalDebates - 1,
                  };
                case "Ongoing Debates":
                  return {
                    ...prev,
                    ongoingDebates: prev.ongoingDebates - 1,
                  };
                case "All Debates":
                  return {
                    ...prev,
                    allDebates: prev.allDebates - 1,
                  };
                case "My Debates":
                  return {
                    ...prev,
                    myDebates: prev.myDebates - 1,
                  };
                case "Proposed Debates":
                  return {
                    ...prev,
                    proposed: prev.proposed - 1,
                  };
                default:
                  return prev;
              }
            });
          }}
          variant="outline"
          size="sm"
          disabled={
            tab === "Global Debates"
              ? currentPage?.globalDebates <= 1 ||
                currentPage?.globalDebates > totalPage?.globalDebates
              : tab === "Ongoing Debates"
                ? currentPage?.ongoingDebates <= 1 ||
                  currentPage?.ongoingDebates > totalPage?.ongoingDebates
                : tab === "All Debates"
                  ? currentPage?.allDebates <= 1 ||
                    currentPage?.allDebates > totalPage?.allDebates
                  : tab === "My Debates"
                    ? currentPage?.myDebates <= 1 ||
                      currentPage?.myDebates > totalPage?.myDebates
                    : tab === "Proposed Debates"
                      ? currentPage?.proposed <= 1 ||
                        currentPage?.proposed > totalPage?.proposed
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
                case "Global Debates":
                  return {
                    ...prev,
                    globalDebates: prev.globalDebates + 1,
                  };
                case "Ongoing Debates":
                  return {
                    ...prev,
                    ongoingDebates: prev.ongoingDebates + 1,
                  };
                case "All Debates":
                  return {
                    ...prev,
                    allDebates: prev.allDebates + 1,
                  };
                case "My Debates":
                  return {
                    ...prev,
                    myDebates: prev.myDebates + 1,
                  };
                case "Proposed Debates":
                  return {
                    ...prev,
                    proposed: prev.proposed + 1,
                  };
                default:
                  return prev;
              }
            });
          }}
          disabled={
            tab === "Global Debates"
              ? currentPage?.globalDebates >= totalPage?.globalDebates ||
                currentPage?.globalDebates > totalPage?.globalDebates
              : tab === "Ongoing Debates"
                ? currentPage?.ongoingDebates >= totalPage?.ongoingDebates ||
                  currentPage?.ongoingDebates > totalPage?.ongoingDebates
                : tab === "All Debates"
                  ? currentPage?.allDebates >= totalPage?.allDebates ||
                    currentPage?.allDebates > totalPage?.allDebates
                  : tab === "My Debates"
                    ? currentPage?.myDebates >= totalPage?.myDebates ||
                      currentPage?.myDebates > totalPage?.myDebates
                    : tab === "Proposed Debates"
                      ? currentPage?.proposed >= totalPage?.proposed ||
                        currentPage?.proposed > totalPage?.proposed
                      : true
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
