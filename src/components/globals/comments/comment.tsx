import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  ThumbsUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useParams } from "next/navigation";
import { Endpoints } from "./endpoints";
import { toast } from "sonner";
import { useCommentsStore } from "@/store/comments-store";
import AttachmentRenderComponent from "./attachment-component";
import { useTokenStore } from "@/store/store";
import { cn } from "@/lib/utils";
import UserHoverCard from "../user-hover-card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

const processCommentText = (text: string) => {
  return text?.split(" ")?.map((word, index) => {
    return word?.startsWith("@") ? (
      <React.Fragment key={index}>
        <UserHoverCard username={word?.slice(1)?.trim()}>
          <span className="cursor-pointer text-blue-500 hover:underline">
            {word}{" "}
          </span>
        </UserHoverCard>
      </React.Fragment>
    ) : (
      word + " "
    );
  });
};
interface InteractionState {
  isLiked: boolean;
  isDisLiked: boolean;
}

const Comment: React.FC<{
  comment: TCommentType;
  forumId: string;
  forum: string;
  // postId:string
}> = ({ comment, forumId, forum }) => {
  const { setComments, comments } = useCommentsStore((state) => state);
  const { globalUser } = useTokenStore((state) => state);
  const { postId, plugin } = useParams<{ postId: string; plugin: TPlugins }>();

  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentInteraction, setCommentInteraction] =
    useState<InteractionState>({
      isLiked: comment.like.includes(globalUser?._id),
      isDisLiked: comment.dislike.includes(globalUser?._id),
    });

  useEffect(() => {
    setCommentInteraction({
      isLiked: comment.like.includes(globalUser?._id),
      isDisLiked: comment.dislike.includes(globalUser?._id),
    });
  }, [comment, globalUser?._id]);

  const handleInteraction = async (
    commentId: string,
    parentId: string | null = null,
    type: "like" | "dislike"
  ) => {
    try {
      const endpoint =
        type === "like"
          ? Endpoints.putLikeComment
          : Endpoints.putDislikeComment;
      const res = await endpoint(commentId);

      if (res?.data) {
        if (!parentId) {
          // Main comment interaction
          setCommentInteraction((prev) => ({
            isLiked: type === "like" ? !prev.isLiked : false,
            isDisLiked: type === "dislike" ? !prev.isDisLiked : false,
          }));

          setComments(
            comments?.map((c) =>
              c._id === res.data._id
                ? { ...c, like: res.data.like, dislike: res.data.dislike }
                : c
            )
          );
        } else {
          // Reply interaction
          setComments(
            comments?.map((c) => {
              if (c._id === parentId) {
                return {
                  ...c,
                  replies: c.replies.map((r) =>
                    r._id === commentId
                      ? { ...r, like: res.data.like, dislike: res.data.dislike }
                      : r
                  ),
                };
              }
              return c;
            })
          );
        }
      }
    } catch (error) {
      console.error(`Error ${type}ing comment:`, error);
    }
  };

  //make solution handler
  const handleMakeSolution = async (commentId: string) => {
    try {
      // forum forumId commentId postId
      const bodyObj = {
        forum,
        forumId,
        commentId,
        postId,
      };
      const response = await Endpoints.createSolution(bodyObj);
      toast.success("Comment marked as solution!");
    } catch (error) {
      console.error("Error marking as solution:", error);
      toast.error("Failed to mark as solution");
    }
  };
  const handleReplySubmit = async () => {
    if (!replyText?.trim()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("content", replyText);
      formData.append("entityId", postId);
      formData.append("entityType", plugin);
      formData.append("parent", comment._id);

      const res = await Endpoints.postRulesComment(formData);
      if (res?.data) {
        setComments(res.data);
        toast.success("Success", { description: "Reply posted successfully!" });
        setReplyText("");
        setShowReplyInput(false);
        setShowReplies(true);
      }
    } catch (error) {
      console.error("Error posting reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplyToReply = (reply: TCommentReply) => {
    setReplyText(`@${reply?.userName} `);
    setShowReplyInput(true);
    document
      .getElementById("likeReplySection")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const InteractionButtons = ({
    item,
    parentId = null,
  }: {
    item: TCommentType | TCommentReply;
    parentId?: string | null;
  }) => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <ThumbsUp
          onClick={() => handleInteraction(item._id, parentId, "like")}
          className={cn("size-4 cursor-pointer text-primary", {
            "fill-current": parentId
              ? item.like.includes(globalUser?._id!)
              : commentInteraction.isLiked,
          })}
        />
        <span className="text-sm">{item.like?.length}</span>
      </div>
      <div className="flex items-center gap-1">
        <ThumbsUp
          onClick={() => handleInteraction(item._id, parentId, "dislike")}
          className={cn("size-4 rotate-180 cursor-pointer text-red-500", {
            "fill-current": parentId
              ? item.dislike.includes(globalUser?._id!)
              : commentInteraction.isDisLiked,
          })}
        />
        <span className="text-sm">{item.dislike?.length}</span>
      </div>
    </div>
  );

  return (
    <div className="flex gap-3">
      <UserHoverCard username={comment?.userName} userData={comment}>
        <Image
          src={comment?.profileImage}
          alt={`${comment?.firstName?.charAt(0)}`}
          width={32}
          height={32}
          className="size-8 rounded-full object-cover"
        />
      </UserHoverCard>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <UserHoverCard username={comment?.userName} userData={comment}>
              <span className="font-medium">
                {comment.firstName} {comment.lastName}
              </span>
            </UserHoverCard>
            <span className="ml-2 text-sm text-gray-500">
              •{" "}
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <MoreHorizontal className="size-4 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleMakeSolution(comment?._id)}
                className="gap-2"
              >
                <span className="cursor-pointer text-sm font-thin  mt-6 bg-green-400 text-white">
                  Make Solution
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="mt-1 whitespace-pre-wrap text-sm">
          {processCommentText(comment?.content)}
        </p>

        {comment.attachment && (
          <AttachmentRenderComponent attachment={comment.attachment} />
        )}

        <div
          className="mt-2 flex scroll-mt-24 items-center gap-4"
          id="likeReplySection"
        >
          <InteractionButtons item={comment} />
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
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !isSubmitting &&
                  replyText?.trim() &&
                  handleReplySubmit()
                }
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

        {comment.replies?.length > 0 && (
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
              {comment.replies.length} replies
            </button>

            {showReplies && (
              <div className="ml-8 mt-4 space-y-4">
                {comment.replies.map((reply) => (
                  <div key={reply._id} className="flex gap-3">
                    <UserHoverCard username={reply?.userName} userData={reply}>
                      <Image
                        src={reply.profileImage}
                        alt={`${reply.firstName} ${reply.lastName}`}
                        width={32}
                        height={32}
                        className="size-8 rounded-full object-cover"
                      />
                    </UserHoverCard>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <UserHoverCard
                            username={reply?.userName}
                            userData={reply}
                          >
                            <span className="font-medium">
                              {reply.firstName} {reply.lastName}
                            </span>
                          </UserHoverCard>
                          <span className="ml-2 text-sm text-gray-500">
                            •{" "}
                            {formatDistanceToNow(new Date(reply.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <button className="bg-yellow-400">
                          <MoreHorizontal className="size-4 text-gray-500" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm">
                        {processCommentText(reply.content)}
                      </p>
                      <div className="mt-2 flex items-center gap-4">
                        <InteractionButtons
                          item={reply}
                          parentId={comment._id}
                        />
                        <button
                          className="text-sm text-blue-500"
                          onClick={() => handleReplyToReply(reply)}
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
