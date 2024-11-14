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
  Image as ImageIcon,
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

const UserHoverCard: React.FC<{
  user: TCommentUser;
}> = ({ user }) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <span className="cursor-pointer text-blue-500 hover:underline">
        @{user?.firstName}_{user?.lastName}
      </span>
    </HoverCardTrigger>
    <HoverCardContent className="w-80">
      <div className="flex gap-4">
        <Image
          src={user?.profileImage}
          alt={`${user?.firstName} ${user?.lastName}`}
          width={48}
          height={48}
          className="size-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <h4 className="font-bold">{`${user?.firstName} ${user?.lastName}`}</h4>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {user?.interests?.map((interest, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
);

const processCommentText = (text: string, user: TCommentUser) => {
  const words = text?.split(" ");
  return words?.map((word, index) => {
    if (word?.startsWith("@")) {
      return (
        <React.Fragment key={index}>
          <UserHoverCard user={user} />{" "}
        </React.Fragment>
      );
    }
    return word + " ";
  });
};

const Comment: React.FC<{ comment: TCommentType }> = ({ comment }) => {
  const { setComments } = useCommentsStore((state) => state);
  const [showReplies, setShowReplies] = useState(false);
  // handle like count and liked or not liked, disliked or not disliked
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isDisLiked, setIsDisLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(comment?.likes?.length);
  const [dislikeCount, setDislikeCount] = useState<number>(
    comment?.dislikes?.length
  );
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { postId } = useParams<{ postId: string }>();

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const handleReplySubmit = async () => {
    if (!replyText?.trim()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData?.append("content", replyText);
      formData?.append("entityId", postId);
      formData?.append("parent", comment?._id);

      // if (selectedFile) {
      //   formData.append("file", selectedFile);
      // }

      const res = await Endpoints.postRulesComment(formData);
      if (res?.data) {
        setComments(res?.data);
        toast.success("Success", {
          description: "Reply posted successfully!",
        });
      }

      setReplyText("");
      setShowReplyInput(false);
      setShowReplies(true);
    } catch (error) {
      console.error("Error posting reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplyToReply = (reply: TCommentReply) => {
    setReplyText(`@${reply?.firstName}_${reply?.lastName} `);
    setShowReplyInput(true);
    document
      .getElementById("likeReplySection")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSubmitting && replyText?.trim()) {
      e.preventDefault();
      handleReplySubmit();
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const res = await Endpoints.putLikeComment(commentId);
      if (res?.data) {
        setComments(res?.data);
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDisLike = async (commentId: string) => {
    try {
      const res = await Endpoints.putDislikeComment(commentId);
      if (res?.data) {
        setComments(res?.data);
      }
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };

  return (
    <div className="flex gap-3">
      <Image
        src={comment?.profileImage}
        alt={`${comment?.firstName} ${comment?.lastName}`}
        width={32}
        height={32}
        className="size-8 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">
              {comment?.firstName} {comment?.lastName}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              • {formatDate(comment?.createdAt)}
            </span>
          </div>
          <button>
            <MoreHorizontal className="size-4 text-gray-500" />
          </button>
        </div>
        <p className="mt-1 whitespace-pre-wrap text-sm">
          {processCommentText(comment?.content, comment)}
        </p>

        {/* {comment?.attachment && (
          <div className="mt-2">
            <Image
              src={comment?.attachment.url}
              alt="Comment attachment"
              width={300}
              height={200}
              className="rounded-lg object-cover"
            />
          </div>
        )} */}
        {comment?.attachment && (
          <AttachmentRenderComponent attachment={comment?.attachment} />
        )}

        <div
          className="mt-2 flex scroll-mt-24 items-center gap-4"
          id="likeReplySection"
        >
          <div className="flex items-center gap-1 ">
            <ThumbsUp
              onClick={() => handleLike(comment?._id)}
              className="size-4 cursor-pointer text-green-500"
            />
            <span className="text-sm">{comment?.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp
              onClick={() => handleDisLike(comment?._id)}
              className="size-4 rotate-180 cursor-pointer text-red-500"
            />
            <span className="text-sm">{comment?.dislikes}</span>
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
                onKeyDown={handleKeyDown}
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

        {comment?.replies?.length > 0 && (
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
                  <div key={reply?._id} className="flex gap-3">
                    <Image
                      src={reply?.profileImage}
                      alt={`${reply?.firstName} ${reply?.lastName}`}
                      width={32}
                      height={32}
                      className="size-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">
                            {reply?.firstName} {reply?.lastName}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            • {formatDate(reply?.createdAt)}
                          </span>
                        </div>
                        <button>
                          <MoreHorizontal className="size-4 text-gray-500" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm">
                        {processCommentText(reply?.content, reply)}
                      </p>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="size-4 text-green-500" />
                          <span className="text-sm">{reply?.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="size-4 rotate-180 text-red-500" />
                          <span className="text-sm">{reply?.dislikes}</span>
                        </div>
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
