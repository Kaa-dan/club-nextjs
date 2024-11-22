"use client";
import sanitizeHtmlContent from "@/utils/sanitize";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import {
  User,
  Eye,
  UserCheck,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  FileText,
  ImageIcon,
  VideoIcon,
  Search,
  LockKeyhole,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import CommentsSection from "@/components/globals/comments/comments-section";
import { Endpoints } from "@/utils/endpoint";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useTokenStore } from "@/store/store";
import { ICONS } from "@/lib/constants";
import Image from "next/image";
import { IssuesEndpoints } from "@/utils/endpoints/issues";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ClubMembersList from "@/components/pages/club/club-members-list";
import IssueWhoShouldAddresList from "./issue-who-should-addres-list";
import plugin from "tailwindcss";
import { map } from "zod";
import { formatDate, formatTimeAgo } from "@/lib/utils";
import { useClubStore } from "@/store/clubs-store";
interface Item {
  _id: string;
  name: string;
  description: string;
  userRole: string;
}

interface ClubAndNodesData {
  clubs: Item[];
  nodes: Item[];
}
const IssueView = ({
  section,
  nodeOrClubId,
}: {
  section: TSections;
  nodeOrClubId: string;
}) => {
  const { currentUserRole } = useClubStore((state) => state);
  const { globalUser } = useTokenStore((state) => state);
  const router = useRouter();
  const [issue, setIssue] = useState<TIssue>();
  const { postId, plugin } = useParams<{
    plugin: TPlugins;
    postId: string;
  }>();

  const [clubAndNodes, setClubAndNodes] = useState<ClubAndNodesData>();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const visibleUsers = 2;
  const totalUsers = issue?.whoShouldAddress?.length ?? 0;
  const remainingUsers = totalUsers - visibleUsers;
  const displayRemainingCount = remainingUsers > 100 ? "100+" : remainingUsers;

  const filteredItems = useMemo(() => {
    const filterFn = (item: Item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const clubs = (clubAndNodes?.clubs || [])
      .filter(filterFn)
      .map((club) => ({ ...club, type: "Club" }));
    const nodes = (clubAndNodes?.nodes || [])
      .filter(filterFn)
      .map((node) => ({ ...node, type: "Node" }));

    return [...clubs, ...nodes];
  }, [clubAndNodes, searchTerm]);

  const fetchSpecificIssue = () => {
    IssuesEndpoints.fetchSpecificIssue(postId)
      .then((res) => {
        setIssue(res);
        console.log(res, "specific issue");
      })
      .catch((err) => {
        console.log(err, "sdfas");
      });
  };

  useEffect(() => {
    fetchSpecificIssue();
    Endpoints.createView(postId).then((err) => {
      console.log("views created");
    });
  }, []);

  function fetchNodesAndClubs() {
    IssuesEndpoints.getClubsNodesNotAdopted(postId as string).then((res) => {
      console.log("effect1");
      setClubAndNodes(res);
    });
  }

  useEffect(() => {
    fetchNodesAndClubs();
  }, []);

  const adopt = (item: { _id: string; type: "Club" | "Node" }) => {
    const entityType = item.type === "Club" ? "club" : "node";
    const data = {
      [entityType]: item._id,
      issueId: postId,
    };
    IssuesEndpoints.adoptOrProposeIssue(data)
      .then((res) => {
        toast.success("rule adopted successfully");
        fetchNodesAndClubs();
      })
      .catch((err) => {
        toast.error(err.message || "something went error");
        console.log({ err });
      });
  };

  const images =
    issue?.files?.filter((file) => file.mimetype.includes("image")) || [];
  const pdfs =
    issue?.files?.filter((file) => file.mimetype === "application/pdf") || [];
  const otherFiles =
    issue?.files?.filter(
      (file) =>
        !file.mimetype.includes("image") && file.mimetype !== "application/pdf"
    ) || [];

  return (
    <>
      <div className="max-w-full bg-white p-4">
        {/* Header with ID and Privacy */}
        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-xl font-medium">{issue?.title}</h1>
          <div className="flex items-center gap-2">
            {/* <span className="text-sm text-gray-500">9545/35</span> */}
            <LockKeyhole className="size-4 text-gray-600" />
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600">Private</span>
              <MoreVertical className="size-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm text-gray-600">{issue?.significance}</p>

        {/* Tags */}
        {/* <div className="mb-4">
        <div className="mb-1 text-sm text-gray-500">Tags:</div>
        <div className="flex gap-2">
          {issue?.tags?.map(
            (tag, index) => (
              console.log(issue?.tags, "tags"),
              (
                <span
                  key={index}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                >
                  {tag}
                </span>
              )
            )
          )}
        </div>
      </div> */}

        {/* Categories */}
        <div className="mb-6 flex gap-4 text-sm">
          <div className="max-w-max rounded-md border border-gray-200 px-5 py-1">
            <div className="text-gray-500">Issue Type</div>
            <div>{issue?.issueType}</div>
          </div>
          <div className="max-w-max rounded-md border border-gray-200 px-5 py-1">
            <div className="text-gray-500">Where/Who</div>
            <div>{issue?.whereOrWho}</div>
          </div>
          <div className="max-w-max rounded-md border border-gray-200 px-5 py-1">
            <div className="text-gray-500">Deadline</div>
            <div>{formatDate(issue?.deadline)}</div>
          </div>
          {issue?.whoShouldAddress?.length ? (
            <div className="max-w-max rounded-md border border-gray-200 px-5 py-1">
              <div className="text-gray-500">Who should address</div>
              <div>
                <div className="flex -space-x-2">
                  {issue?.whoShouldAddress
                    .slice(0, visibleUsers)
                    .map((member: any) => (
                      <Avatar
                        key={member._id}
                        className="border-2 border-background"
                      >
                        <AvatarImage
                          src={
                            member?.profileImage ||
                            `/placeholder.svg?height=32&width=32`
                          } // Replace with dynamic src
                        />
                        <AvatarFallback>
                          {member?.firstName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}

                  {remainingUsers > 0 && (
                    <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs">
                      {displayRemainingCount}+
                    </div>
                  )}

                  <Button
                    variant="link"
                    className="text-sm"
                    onClick={() => setIsModalOpen(true)}
                  >
                    See all
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>

        {/* Author Info */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {issue?.createdBy?.profileImage ? (
              <Image
                src={issue.createdBy.profileImage}
                alt={issue.createdBy?.userName || "User"}
                className="size-8 rounded-full object-cover"
                width={32}
                height={32}
              />
            ) : (
              <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <span className="text-xs font-medium">
                  {issue?.createdBy?.userName
                    ? issue.createdBy.userName
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : "U"}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="font-medium">{issue?.createdBy?.userName}</div>
              <div className="size-1 rounded-full bg-gray-500"></div>
              <div className="text-sm text-gray-500">
                {formatTimeAgo(issue?.createdAt as string)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Eye className="size-4" />
              <span>{`${issue?.views?.length || 0} Viewers`}</span>
            </div>
            {/* <div className="flex items-center gap-2 text-sm text-gray-600">
            <UserCheck className="size-4" />
            <span>
              {issue?.adobtedClubs ? issue.adobtedClubs : "0"} Adopted
            </span>
          </div> */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="rounded-md bg-green-500 px-4 py-1.5 text-sm text-white">
                  Adopt
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Clubs and Nodes</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search clubs and nodes..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <ScrollArea className="h-[300px] rounded-md border p-4">
                    {filteredItems.length > 0 ? (
                      filteredItems.map(
                        (item) => (
                          console.log(item, "itms"),
                          (
                            <div
                              key={item._id}
                              className="flex items-center justify-between py-2"
                            >
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {item.name}
                                  </span>
                                  {item.type === "Club" ? (
                                    <Image
                                      src={ICONS.ClubGreyIcon}
                                      alt="node_logo"
                                      height={30}
                                      width={30}
                                      className="ml-2 size-6 object-cover"
                                    />
                                  ) : (
                                    <Image
                                      src={ICONS.NodeGreyIcon}
                                      alt="node_logo"
                                      height={30}
                                      width={30}
                                      className="ml-2 size-6 object-cover"
                                    />
                                  )}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {`${item.description.slice(0, 30)}${item.description.length > 30 ? "..." : ""}`}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => adopt(item as any)}
                              >
                                {item.userRole === "admin"
                                  ? "Adopt"
                                  : "Propose"}
                              </Button>
                            </div>
                          )
                        )
                      )
                    ) : (
                      <p className="text-center text-muted-foreground">
                        No items found.
                      </p>
                    )}
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-8 space-y-4">
          <div
            dangerouslySetInnerHTML={{
              __html: issue?.description
                ? sanitizeHtmlContent(issue.description)
                : "",
            }}
          />
        </div>

        {/* Document Info */}
        <div className="flex gap-3">
          {issue?.files?.map((file) => (
            <div
              key={file._id}
              className="mb-4 flex cursor-pointer items-center gap-4 rounded-sm bg-gray-100 px-2 py-1"
            >
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded">
                  {file.mimetype.includes("image") && (
                    <ImageIcon className="size-4" />
                  )}
                  {file.mimetype === "application/pdf" && (
                    <FileText className="size-4" />
                  )}

                  {file.mimetype.includes("video") && (
                    <VideoIcon className="size-4" />
                  )}
                  {!file.mimetype.includes("image") &&
                    file.mimetype !== "application/pdf" &&
                    !file.mimetype.includes("audio") &&
                    !file.mimetype.includes("video") && (
                      <FileText className="size-4" />
                    )}
                </div>
                <div>
                  <div
                    onClick={() => window.open(file?.url, "_blank")}
                    className="text-sm"
                  >
                    {file?.originalname}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interaction Bar */}
        {["draft", "proposed"]?.includes(issue?.publishedStatus || "") ? (
          <>
            {issue?.publishedStatus === "draft" && (
              <Button className="btn btn-primary">Save</Button>
            )}
            {issue?.publishedStatus === "proposed" &&
              currentUserRole === "admin" && (
                <Button className="">Approved & Adopt</Button>
              )}
          </>
        ) : (
          <div className="flex items-center justify-between border-t py-4">
            <div className="flex gap-6">
              <button className="flex items-center gap-1">
                <ThumbsUp
                  onClick={() => {
                    IssuesEndpoints.likeIssue(postId).then(() => {
                      fetchSpecificIssue();
                    });
                  }}
                  className="size-4  text-green-500"
                  fill={
                    issue?.relevant?.some(
                      (like) => like?.user === globalUser?._id
                    )
                      ? "currentColor"
                      : "none"
                  }
                />
                <span className="text-sm text-green-500">
                  {issue?.relevant?.length} Relevant
                </span>
              </button>
              <button className="flex items-center gap-1">
                <ThumbsDown
                  onClick={() => {
                    IssuesEndpoints.disLikeIssue(postId).then(() => {
                      fetchSpecificIssue();
                    });
                  }}
                  fill={
                    issue?.irrelevant?.some(
                      (dislike) => dislike?.user === globalUser?._id
                    )
                      ? "currentColor"
                      : "none"
                  }
                  className="size-4 text-red-500"
                />
                <span className="text-sm text-red-500">
                  {issue?.irrelevant?.length} Not Relevant
                </span>
              </button>
              <button className="flex items-center gap-1">
                <Share2 className="size-4" />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        )}

        {/* Comment Input */}
        {!["draft", "proposed"]?.includes(issue?.publishedStatus || "") && (
          <CommentsSection plugin={plugin} postId={postId} />
        )}
      </div>
      <IssueWhoShouldAddresList
        members={issue?.whoShouldAddress || []}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default IssueView;
