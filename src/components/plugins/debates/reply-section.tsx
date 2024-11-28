import { useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ThumbsUp, ThumbsDown, Send } from "lucide-react";
import UserHoverCard from "@/components/globals/user-hover-card";
import moment from "moment";
interface Reply {
  _id: string;
  content: string;
  createdAt: string;
  participant: {
    user: {
      userName: string;
      profileImage: string;
    };
  };
  relevant: string[];
  irrelevant: string[];
  parentId: string;
}

interface ReplySectionProps {
  replies: Reply[];
  userId: string;
  onReplySubmit: (
    content: string,
    replyTo: { author: string; id: string } | null
  ) => void;
  onReplyVote: (replyId: string, type: "relevant" | "irrelevant") => void;
}

export const ReplySection: React.FC<ReplySectionProps> = ({
  replies,
  userId,
  onReplySubmit,
  onReplyVote,
}) => {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<{ author: string; id: string } | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleReplyClick = (author: string, parentId: string) => {
    setReplyTo({ author, id: parentId });
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      inputRef.current?.focus();
    }, 100);
  };

  const handleSubmit = () => {
    if (newComment.trim() === "") return;
    onReplySubmit(newComment, replyTo);
    setNewComment("");
    setReplyTo(null);
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="relative flex items-center gap-2">
        <Input
          ref={inputRef}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={
            replyTo ? `Reply to @${replyTo.author}...` : "Add a comment..."
          }
          className="h-8 w-full rounded-md border border-gray-300 pl-3 pr-12 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={handleSubmit}
            className="rounded-full bg-green-500 p-1.5 text-white hover:bg-green-600"
          >
            <Send className="size-4" />
          </button>
          {replyTo && (
            <button
              onClick={() => setReplyTo(null)}
              className="text-xs text-gray-500 hover:underline"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {replies.map((reply) => (
        <div key={reply._id} className="flex gap-2">
          <Avatar className="size-8 bg-gray-200">
            <AvatarImage
              src={
                reply.participant.user.profileImage ||
                "/placeholder.svg?height=32&width=32"
              }
              alt={reply.participant.user.userName}
            />
            <AvatarFallback className="text-sm">
              {reply.participant.user.userName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <UserHoverCard username={reply.participant.user.userName}>
                <span className="text-sm font-semibold text-gray-800">
                  {reply.participant.user.userName}
                </span>
              </UserHoverCard>
              <span className="text-xs text-gray-500">
                {moment(reply.createdAt).fromNow()}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-gray-700">
              {reply.content.split(" ").map((word, index) =>
                word.startsWith("@") ? (
                  <span key={index} className="text-blue-500">
                    <UserHoverCard username={word.slice(1)}>
                      {word}{" "}
                    </UserHoverCard>
                  </span>
                ) : (
                  <span key={index}>{word} </span>
                )
              )}
            </p>
            <div className="mt-1 flex items-center gap-3">
              <button
                onClick={() => onReplyVote(reply._id, "relevant")}
                className={`flex items-center gap-1 rounded px-1.5 py-0.5 transition-all duration-200 ${
                  reply.relevant.includes(userId)
                    ? "scale-105 bg-green-50 text-green-600"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <ThumbsUp
                  size={14}
                  className={`transition-all duration-200 ${
                    reply.relevant.includes(userId)
                      ? "rotate-12 fill-current text-green-600"
                      : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-xs transition-all duration-200 ${
                    reply.relevant.includes(userId) ? "font-semibold" : ""
                  }`}
                >
                  {reply.relevant.length}
                </span>
              </button>
              <button
                onClick={() => onReplyVote(reply._id, "irrelevant")}
                className={`flex items-center gap-1 rounded px-1.5 py-0.5 transition-all duration-200 ${
                  reply.irrelevant.includes(userId)
                    ? "scale-105 bg-red-50 text-red-500"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <ThumbsDown
                  size={14}
                  className={`transition-all duration-200 ${
                    reply.irrelevant.includes(userId)
                      ? "-rotate-12 fill-current text-red-500"
                      : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-xs transition-all duration-200 ${
                    reply.irrelevant.includes(userId) ? "font-semibold" : ""
                  }`}
                >
                  {reply.irrelevant.length}
                </span>
              </button>
              <button
                onClick={() =>
                  handleReplyClick(
                    reply.participant.user.userName,
                    reply.parentId
                  )
                }
                className="text-xs text-blue-500 hover:underline"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
