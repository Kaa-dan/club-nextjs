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

interface UserProfile {
  name: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  contributions?: number;
}

interface CommentReply {
  id: string;
  name: string;
  username?: string;
  comment: string;
  time: string;
  likes?: number;
  dislikes?: number;
  timestamp: number;
  userProfile?: UserProfile;
}

interface CommentType extends CommentReply {
  mention?: string;
  replies?: CommentReply[];
}

const CommentsSection: React.FC<{
  plugin: TPlugins;
  postId: string;
}> = ({ plugin, postId }) => {
  const [sortBy, setSortBy] = useState("relevance");
  const [comments, setComments] = useState<CommentType[]>([
    {
      id: "1",
      name: "Leslie Alexander",
      username: "leslie",
      comment: "Loving your work @cameron always be on top up.",
      time: "1 days ago",
      likes: 231,
      dislikes: 23,
      timestamp: Date.now() - 24 * 60 * 60 * 1000,
      replies: [
        {
          id: "2",
          name: "Cameron Williamson",
          username: "cameron",
          comment: "Thanks @leslie! Really appreciate the support 🙏",
          time: "1 day ago",
          likes: 45,
          dislikes: 2,
          timestamp: Date.now() - 23 * 60 * 60 * 1000,
        },
      ],
    },
  ]);

  const sortComments = (type: string) => {
    setSortBy(type);
    const sortedComments = [...comments];

    switch (type) {
      case "relevance":
        sortedComments.sort(
          (a, b) =>
            (b.likes ?? 0) -
            (b.dislikes ?? 0) -
            ((a.likes ?? 0) - (a.dislikes ?? 0))
        );
        break;
      case "newest":
        sortedComments.sort((a, b) => b.timestamp - a.timestamp);
        break;
      case "oldest":
        sortedComments.sort((a, b) => a.timestamp - b.timestamp);
        break;
      case "most-liked":
        sortedComments.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
        break;
    }

    setComments(sortedComments);
  };

  async function getComments() {
    const response = await Endpoints.getRulesComments(postId);
  }

  useEffect(() => {
    getComments();
  });

  return (
    <div className="mx-auto w-full max-w-2xl">
      <CommentInput />
      <div className="flex justify-between border-b p-4">
        <div className="font-medium">Comments (1.2k)</div>
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
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
