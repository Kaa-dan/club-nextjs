import React, { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  ThumbsUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

interface UserProfile {
  name: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  contributions?: number;
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
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      // Here you would call your API endpoint to post the reply
      // const response = await Endpoints.postRulesComment({
      //   content: replyText,
      //   parentId: comment.id,
      //   // Add other necessary fields
      // });

      // For now, we'll just simulate the reply
      const newReply: CommentReply = {
        id: Math.random().toString(),
        name: "Current User", // Replace with actual user data
        username: "currentuser", // Replace with actual user data
        comment: replyText,
        time: "Just now",
        likes: 0,
        dislikes: 0,
        timestamp: Date.now(),
      };

      comment.replies = [...(comment.replies || []), newReply];
      setReplyText("");
      setShowReplyInput(false);
      setShowReplies(true);
    } catch (error) {
      console.error("Error posting reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplyToReply = (replyUsername: string) => {
    setReplyText(`@${replyUsername} `);
    setShowReplyInput(true);
  };

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
          <button
            className="text-sm text-blue-500"
            onClick={() => setShowReplyInput(!showReplyInput)}
          >
            Reply
          </button>
        </div>

        {showReplyInput && (
          <div className="mt-3">
            <div className="flex gap-2">
              <Input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1"
                disabled={isSubmitting}
              />
              <Button
                onClick={handleReplySubmit}
                disabled={!replyText.trim() || isSubmitting}
              >
                Reply
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowReplyInput(false);
                  setReplyText("");
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

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
                  <div key={reply.id} className="flex gap-3">
                    <div className="size-8 shrink-0 rounded-full bg-gray-200" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{reply.name}</span>
                          {reply.username && (
                            <span className="ml-1 text-sm text-gray-500">
                              @{reply.username}
                            </span>
                          )}
                          <span className="ml-2 text-sm text-gray-500">
                            • {reply.time}
                          </span>
                        </div>
                        <button>
                          <MoreHorizontal className="size-4 text-gray-500" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm">
                        {processCommentText(reply.comment)}
                      </p>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="size-4 text-green-500" />
                          <span className="text-sm">{reply.likes ?? 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="size-4 rotate-180 text-red-500" />
                          <span className="text-sm">{reply.dislikes ?? 0}</span>
                        </div>
                        <button
                          className="text-sm text-blue-500"
                          onClick={() => {
                            if (reply.username) {
                              handleReplyToReply(reply.username);
                            }
                          }}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
