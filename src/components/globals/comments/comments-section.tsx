"use client";
import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Endpoints } from "./endpoints";
import CommentInput from "./comment-input";
import Comment from "./comment";
import { useCommentsStore } from "@/store/comments-store";
import { useSocketStore } from "@/hooks/use-socket-store";

const CommentsSection: React.FC<{
  plugin: TPlugins;
  postId: string;
  forumId?: string;
  forum?: string;
}> = ({ plugin, postId, forumId, forum }) => {
  console.log({ plugin, nithin: "nithin" });
  const { socket, isConnected, connect, disconnect, sendComment } =
    useSocketStore();

  const [sortBy, setSortBy] = useState("relevance");
  const { comments, setComments } = useCommentsStore((state) => state);
  const sortComments = (type: string) => {
    setSortBy(type);
    const sortedComments = [...comments];

    switch (type) {
      case "relevance":
        sortedComments.sort(
          (a, b) =>
            b?.like?.length -
            b?.dislike?.length -
            (a.like?.length - a.dislike?.length)
        );
        break;
      case "newest":
        sortedComments.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        sortedComments.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "most-liked":
        sortedComments.sort((a, b) => b.like?.length - a.like?.length);
        break;
    }

    setComments(sortedComments);
  };

  async function getComments() {
    try {
      const response = await Endpoints.getRulesComments(plugin, postId);
      if (response) {
        setComments(response);
        console.log({ response });
      }
    } catch (error) {
      console.log({ error });
    }
  }

  useEffect(() => {
    getComments();
  }, []);

  useEffect(() => {
    connect();

    socket.on("commentAdded", (comment: TCommentType) => {
      // setComments((prev) => [...prev, comment]);
      // console.log("commentAdding ", comment);
      // console.log("comments ", comments);
      // setComments([comment, ...comments]);
      getComments();
    });

    // Cleanup
    return () => {
      socket.off("commentAdded");
      disconnect();
    };
  }, [socket, connect, disconnect]);

  return (
    <div className="mx-auto  w-full max-w-2xl">
      <CommentInput />
      <div className="flex justify-between border-b p-4">
        <div className="font-medium">Comments ({comments?.length || 0})</div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100">
            Sort by: {sortBy}
            <ChevronDown className="ml-1 size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => sortComments("relevance")}>
              Top Comments
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => sortComments("newest")}>
              Newest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => sortComments("oldest")}>
              Oldest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => sortComments("most-liked")}>
              Most Liked
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-4 p-4">
        {comments?.map((comment) => (
          <Comment
            key={comment?._id}
            comment={comment}
            forumId={forumId}
            forum={forum}
            // postId={postId}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
