"use client";
import React, { useState } from "react";
import {
  ChevronRight,
  MoreHorizontal,
  ThumbsUp,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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

const UserHoverCard: React.FC<{
  username: string;
  userProfile?: UserProfile;
}> = ({ username, userProfile }) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <span className="cursor-pointer text-blue-500 hover:underline">
        @{username}
      </span>
    </HoverCardTrigger>
    <HoverCardContent className="w-80">
      <div className="flex gap-4">
        <div className="size-12 shrink-0 rounded-full bg-gray-200" />
        <div className="flex-1">
          <h4 className="font-bold">{userProfile?.name}</h4>
          <p className="text-sm text-gray-500">@{username}</p>
          {userProfile?.bio && (
            <p className="mt-2 text-sm">{userProfile.bio}</p>
          )}
          <div className="mt-2 flex gap-4 text-sm text-gray-600">
            <span>{userProfile?.contributions ?? 0} Contribution</span>
          </div>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
);

const processCommentText = (text: string) => {
  const words = text.split(" ");
  return words.map((word, index) => {
    if (word.startsWith("@")) {
      const username = word.slice(1);
      return (
        <React.Fragment key={index}>
          <UserHoverCard
            username={username}
            userProfile={{
              name: username,
              username: username,
              bio: "User bio goes here",
              contributions: 256,
            }}
          />{" "}
        </React.Fragment>
      );
    }
    return word + " ";
  });
};

const Comment: React.FC<{ comment: CommentType }> = ({ comment }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="flex gap-3">
      <div className="size-8 shrink-0 rounded-full bg-gray-200" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">{comment.name}</span>
            {comment.username && (
              <span className="ml-1 text-sm text-gray-500">
                @{comment.username}
              </span>
            )}
            <span className="ml-2 text-sm text-gray-500">• {comment.time}</span>
          </div>
          <button>
            <MoreHorizontal className="size-4 text-gray-500" />
          </button>
        </div>
        <p className="mt-1 text-sm">{processCommentText(comment.comment)}</p>
        <div className="mt-2 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <ThumbsUp className="size-4 text-green-500" />
            <span className="text-sm">{comment.likes ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="size-4 rotate-180 text-red-500" />
            <span className="text-sm">{comment.dislikes ?? 0}</span>
          </div>
          <button className="text-sm text-blue-500">Reply</button>
        </div>

        {comment?.replies?.length! > 0 && (
          <div className="mt-2">
            <button
              className="flex items-center gap-1 text-sm text-blue-500"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
              {comment?.replies?.length} replies
            </button>

            {showReplies && (
              <div className="ml-8 mt-4 space-y-4">
                {comment?.replies?.map((reply) => (
                  <Comment key={reply.id} comment={reply} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentsSection: React.FC = () => {
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

  return (
    <div className="mx-auto w-full max-w-2xl">
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
