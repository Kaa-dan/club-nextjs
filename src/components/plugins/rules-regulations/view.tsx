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
} from "lucide-react";

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface Item {
  _id: string;
  name: string;
  description: string;
}

interface ClubAndNodesData {
  clubs: Item[];
  nodes: Item[];
}
const View = ({ forum }: { forum: TForum }) => {
  const { globalUser } = useTokenStore((state) => state);
  const router = useRouter();
  const [rule, setRule] = useState<TRule>();
  const { postId, plugin } = useParams<{
    plugin: TPlugins;
    postId: string;
  }>();

  const [clubAndNodes, setClubAndNodes] = useState<ClubAndNodesData>();
  const [searchTerm, setSearchTerm] = useState("");

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

  const fetchSpecificRule = () => {
    Endpoints.specificRule(postId)
      .then((res) => {
        setRule(res);
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  useEffect(() => {
    fetchSpecificRule();
    Endpoints.createView(postId).then((err) => {});
  }, []);

  function fetchNodesAndClubs() {
    Endpoints.getClubsNodesNotAdopted(postId as string).then((res) => {
      setClubAndNodes(res);
    });
  }

  useEffect(() => {
    fetchNodesAndClubs();
  }, []);
  const formatDate = (date: string) => {
    return moment(date).fromNow();
  };

  const adopt = (item: { _id: string; type: "Club" | "Node" }) => {
    Endpoints.adoptRule(
      postId as string,
      item?.type?.toLowerCase(),
      item.type === "Club" ? item._id : null,
      item.type === "Node" ? item._id : null
    )
      .then((res) => {
        toast.success("rule adopted succesfully");
        fetchNodesAndClubs();
      })
      .catch((err) => {
        toast.error(err.message || "something went error");
        console.log({ err });
      });
  };
  const images =
    rule?.files?.filter((file) => file.mimetype.includes("image")) || [];
  const pdfs =
    rule?.files?.filter((file) => file.mimetype === "application/pdf") || [];
  const otherFiles =
    rule?.files?.filter(
      (file) =>
        !file.mimetype.includes("image") && file.mimetype !== "application/pdf"
    ) || [];

  return (
    <div className="max-w-full bg-white p-4">
      {/* Header with ID and Privacy */}
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-xl font-medium">{rule?.title}</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">9545/35</span>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-500">
              {rule?.isPublic ? "Public" : "Private"}
            </span>
            <MoreVertical className="size-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mb-4 text-sm text-gray-600">{rule?.significance}</p>

      {/* Tags */}
      <div className="mb-4">
        <div className="mb-1 text-sm text-gray-500">Tags:</div>
        <div className="flex gap-2">
          {rule?.tags?.map(
            (tag, index) => (
              console.log(rule?.tags, "tags"),
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
      </div>

      {/* Categories */}
      <div className="mb-6 grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-gray-500">Domain</div>
          <div>{rule?.domain}</div>
        </div>
        <div>
          <div className="text-gray-500">Category</div>
          <div>{rule?.category}</div>
        </div>
        <div>
          <div className="text-gray-500">Applicable for?</div>
          <div>457</div>
        </div>
      </div>

      {/* Author Info */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {rule?.createdBy?.profileImage ? (
            <Image
              src={rule.createdBy.profileImage}
              alt={rule.createdBy?.userName || "User"}
              className="size-8 rounded-full object-cover"
              width={32}
              height={32}
            />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <span className="text-xs font-medium">
                {rule?.createdBy?.userName
                  ? rule.createdBy.userName
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "U"}
              </span>
            </div>
          )}
          <div>
            <div className="font-medium">{rule?.createdBy?.userName}</div>
            <div className="text-sm text-gray-500">
              {formatDate(rule?.createdAt as string)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Eye className="size-4" />
            <span>{`${rule?.views.length} Viewer's`}</span>
          </div>
          {/* <div className="flex items-center gap-2 text-sm text-gray-600">
            <UserCheck className="size-4" />
            <span>
              {(rule?.adoptedClubs.length || 0) +
                (rule?.adoptedNodes.length || 0)}{" "}
              Adopted
            </span>
          </div> */}

          {/* tooltip for adopted */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserCheck className="size-4" />
                  <span>
                    {" "}
                    {(rule?.adoptedClubs.length || 0) +
                      (rule?.adoptedNodes.length || 0)}{" "}
                    Adopted
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-white border text-black w-[200px] flex justify-between items-center  ">
                <div>
                  <span className="flex justify-between">
                    {" "}
                    {rule?.adoptedClubs.length} <span>Clubs </span>
                  </span>
                </div>
                <div className="h-[5px] w-[5px] rounded-full bg-gray-500"></div>
                <div>
                  <span className="flex justify-between">
                    {rule?.adoptedNodes.length} <span>Nodes</span>
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
                    filteredItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.name}</span>
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
                            {item.description}
                          </span>
                        </div>
                        <Button size="sm" onClick={() => adopt(item as any)}>
                          Adopt
                        </Button>
                      </div>
                    ))
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
            __html: rule?.description
              ? sanitizeHtmlContent(rule.description)
              : "",
          }}
        />
      </div>

      {/* Document Info */}
      {rule?.files?.map((file) => (
        <div
          key={file._id}
          className="mb-4 flex cursor-pointer items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded bg-gray-100">
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
                onClick={() => window.open(file.url, "_blank")}
                className="text-sm"
              >
                {file.originalname}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Interaction Bar */}
      <div className="flex items-center justify-between border-t py-4">
        <div className="flex gap-6">
          <button className="flex items-center gap-1">
            <ThumbsUp
              onClick={() => {
                Endpoints.likeRules(postId).then(() => {
                  fetchSpecificRule();
                });
              }}
              className="size-4  text-green-500"
              fill={
                rule?.relevant?.includes(globalUser?._id)
                  ? "currentColor"
                  : "none"
              }
            />
            <span className="text-sm text-green-500">
              {rule?.relevant?.length} Relevant
            </span>
          </button>
          <button className="flex items-center gap-1">
            <ThumbsDown
              onClick={() => {
                Endpoints.disLikeRules(postId).then(() => {
                  fetchSpecificRule();
                });
              }}
              fill={
                rule?.irrelevant?.includes(globalUser?._id)
                  ? "currentColor"
                  : "none"
              }
              className="size-4 text-red-500"
            />
            <span className="text-sm text-red-500">
              {rule?.irrelevant?.length} Not Relevant
            </span>
          </button>
          <button className="flex items-center gap-1">
            <MessageCircle className="size-4" />
            <span className="text-sm">Comments</span>
          </button>
          <button className="flex items-center gap-1">
            <Share2 className="size-4" />
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>

      {/* Comment Input */}
      <CommentsSection plugin={plugin} postId={postId} />
    </div>
  );
};

export default View;
