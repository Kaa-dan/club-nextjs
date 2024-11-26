"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddPointDialog } from "./Add-point-dialog";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Endpoints } from "@/utils/endpoint";
import moment from "moment";
import { Image, Send } from "lucide-react";
import { ThumbsUp, ThumbsDown, ChevronDown, MessageCircle } from "lucide-react";
import { useTokenStore } from "@/store/store";
import sanitizeHtmlContent from "@/utils/sanitize";
import { Input } from "@/components/ui/input";

interface Reply {
  _id: string;
  content: string;
  createdAt: string;
  participant: {
    user: {
      firstName: string;
    };
  };
  relevant: string[];
  irrelevant: string[];
  parentId: string;
}

const DebateCard = ({
  content,
  author,
  date,
  imageUrl,
  debateId,
  initialRelevant,
  initialIrrelevant,
  userId,
  commentId,
}: any) => {
  const [relevant, setRelevant] = useState(initialRelevant);
  const [irrelevant, setIrrelevant] = useState(initialIrrelevant);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<any>(null);
  const [replies, setReplies] = useState<Reply[]>([]);

  // Handle main argument vote functionality
  const handleVote = async (type: "relevant" | "irrelevant") => {
    const previousRelevant = [...relevant];
    const previousIrrelevant = [...irrelevant];

    if (type === "relevant") {
      const isCurrentlyRelevant = relevant.includes(userId);
      setRelevant(
        isCurrentlyRelevant
          ? relevant.filter((id: string) => id !== userId)
          : [...relevant, userId]
      );
      if (irrelevant.includes(userId)) {
        setIrrelevant(irrelevant.filter((id: string) => id !== userId));
      }
    } else {
      const isCurrentlyIrrelevant = irrelevant.includes(userId);
      setIrrelevant(
        isCurrentlyIrrelevant
          ? irrelevant.filter((id: string) => id !== userId)
          : [...irrelevant, userId]
      );
      if (relevant.includes(userId)) {
        setRelevant(relevant.filter((id: string) => id !== userId));
      }
    }

    try {
      const updatedArgument = await Endpoints.toggleVote(debateId, type);
      setRelevant(updatedArgument.relevant);
      setIrrelevant(updatedArgument.irrelevant);
    } catch (error) {
      console.error("Error toggling vote:", error);
      setRelevant(previousRelevant);
      setIrrelevant(previousIrrelevant);
    }
  };

  // Handle reply vote functionality
  const handleReplyVote = async (
    replyId: string,
    type: "relevant" | "irrelevant"
  ) => {
    const replyIndex = replies.findIndex((reply) => reply._id === replyId);
    if (replyIndex === -1) return;

    const reply = replies[replyIndex];
    const previousRelevant = [...reply.relevant];
    const previousIrrelevant = [...reply.irrelevant];

    // Create new replies array for updates
    const updatedReplies = [...replies];

    if (type === "relevant") {
      const isCurrentlyRelevant = reply.relevant.includes(userId);
      // Update relevant votes
      updatedReplies[replyIndex] = {
        ...reply,
        relevant: isCurrentlyRelevant
          ? reply.relevant.filter((id) => id !== userId)
          : [...reply.relevant, userId],
      };
      // Remove from irrelevant if exists
      if (reply.irrelevant.includes(userId)) {
        updatedReplies[replyIndex] = {
          ...updatedReplies[replyIndex],
          irrelevant: reply.irrelevant.filter((id) => id !== userId),
        };
      }
    } else {
      const isCurrentlyIrrelevant = reply.irrelevant.includes(userId);
      // Update irrelevant votes
      updatedReplies[replyIndex] = {
        ...reply,
        irrelevant: isCurrentlyIrrelevant
          ? reply.irrelevant.filter((id) => id !== userId)
          : [...reply.irrelevant, userId],
      };
      // Remove from relevant if exists
      if (reply.relevant.includes(userId)) {
        updatedReplies[replyIndex] = {
          ...updatedReplies[replyIndex],
          relevant: reply.relevant.filter((id) => id !== userId),
        };
      }
    }

    // Update UI immediately
    setReplies(updatedReplies);

    try {
      const updatedReply = await Endpoints.toggleVote(replyId, type);
      // Update with server response
      setReplies((prevReplies) => {
        const newReplies = [...prevReplies];
        newReplies[replyIndex] = {
          ...reply,
          relevant: updatedReply.relevant,
          irrelevant: updatedReply.irrelevant,
        };
        return newReplies;
      });
    } catch (error) {
      console.error("Error toggling reply vote:", error);
      // Revert to previous state on error
      setReplies((prevReplies) => {
        const newReplies = [...prevReplies];
        newReplies[replyIndex] = {
          ...reply,
          relevant: previousRelevant,
          irrelevant: previousIrrelevant,
        };
        return newReplies;
      });
    }
  };

  // Fetch replies when comment is clicked
  const fetchRepliesForComment = async () => {
    try {
      const fetchedReplies =
        await Endpoints.getRepliesForDebateArgument(commentId);
      setReplies(fetchedReplies);
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  const handleReplySubmit = async () => {
    if (newComment.trim() === "") return;

    const commentContent = replyTo
      ? `@${replyTo.author} ${newComment}`
      : newComment;

    try {
      const newReply = await Endpoints.replyToDebateArgument(
        commentId,
        commentContent
      );
      setReplies((prev) => [...prev, newReply]);
      setNewComment("");
      setReplyTo(null);
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  useEffect(() => {
    if (showComments) {
      fetchRepliesForComment();
    }
  }, [showComments]);

  const isRelevant = relevant.includes(userId);
  const isIrrelevant = irrelevant.includes(userId);
  const inputRef = useRef<HTMLInputElement>(null);

  // Modified reply click handler with scroll
  const handleReplyClick = (author: string, parentId: string) => {
    setReplyTo({
      author,
      id: parentId,
    });

    // Scroll to input with a slight delay to ensure smooth transition
    setTimeout(() => {
      inputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <Card className="overflow-hidden rounded-lg bg-white shadow-md">
      <div className="space-y-4 p-4">
        {/* Content */}
        <p
          className="mb-4 text-lg leading-relaxed text-gray-800"
          dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(content) }}
        ></p>

        {/* Author Section */}
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage
              src={imageUrl || "/api/placeholder/32/32"}
              alt={author}
            />
            <AvatarFallback className="bg-gray-200 text-lg text-gray-500">
              {author[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">{author}</span>
            <span className="text-sm text-gray-500">Last updated: {date}</span>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          {/* Relevant Button */}
          <button
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-all ${
              isRelevant ? "text-green-600" : "text-gray-500"
            }`}
            onClick={() => handleVote("relevant")}
          >
            <ThumbsUp
              className={`size-5 transition-colors ${
                isRelevant ? "fill-current text-green-600" : "text-gray-500"
              }`}
            />
            <span>{relevant.length}</span>
          </button>

          {/* Irrelevant Button */}
          <button
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-all ${
              isIrrelevant ? "text-red-500" : "text-gray-500"
            }`}
            onClick={() => handleVote("irrelevant")}
          >
            <ThumbsDown
              className={`size-5 transition-colors ${
                isIrrelevant ? "fill-current text-red-500" : "text-gray-500"
              }`}
            />
            <span>{irrelevant?.length}</span>
          </button>

          {/* Comments Button */}
          <button
            className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-500"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="size-5" />
            <ChevronDown
              className={`size-4 transition-transform ${
                showComments ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 space-y-4">
            {/* Add Comment Section - Now with ref */}
            <div className="relative flex items-center gap-2">
              <Input
                ref={inputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={
                  replyTo
                    ? `Reply to @${replyTo.author}...`
                    : "Add a comment..."
                }
                className="h-8 w-full rounded-md border border-gray-300 pl-3 pr-12 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              />

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReplySubmit}
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

            {/* Replies */}
            {replies.map((reply) => (
              <div key={reply._id} className="flex gap-2">
                <Avatar className="size-8 bg-gray-200">
                  <AvatarFallback className="text-sm">
                    {reply?.participant?.user?.firstName[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-gray-800">
                      {reply.participant?.user?.firstName || "Unknown User"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {moment(reply.createdAt).fromNow()}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-700">
                    {reply.content
                      .split(" ")
                      .map((word: string, index: number) =>
                        word.startsWith("@") ? (
                          <span key={index} className="text-blue-500">
                            {word}{" "}
                          </span>
                        ) : (
                          <span key={index}>{word} </span>
                        )
                      )}
                  </p>
                  <div className="mt-1 flex items-center gap-3">
                    {/* Relevant Button */}
                    <button
                      onClick={() => handleReplyVote(reply._id, "relevant")}
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

                    {/* Irrelevant Button */}
                    <button
                      onClick={() => handleReplyVote(reply._id, "irrelevant")}
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
                          reply.irrelevant.includes(userId)
                            ? "font-semibold"
                            : ""
                        }`}
                      >
                        {reply.irrelevant.length}
                      </span>
                    </button>

                    {/* Reply Button */}
                    <button
                      onClick={() =>
                        handleReplyClick(
                          reply.participant?.user?.firstName,
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
        )}
      </div>
    </Card>
  );
};

export function DebateSection({ forum }: { forum: TForum }) {
  const { postId, clubId, nodeId } = useParams<{
    postId: string;
    clubId: string;
    nodeId: string;
  }>();
  const entityId = clubId ? clubId : nodeId;
  const [supportArgs, setSupportArgs] = useState([]);
  const [againstArgs, setAgainstArgs] = useState([]);
  const { globalUser } = useTokenStore((state) => state);
  const userId = globalUser?._id;

  const fetchArgs = () => {
    Endpoints.fetchDebateArgs(postId).then((res) => {
      const support = res.filter(
        (arg: any) => arg.participant.side === "support"
      );
      const against = res.filter(
        (arg: any) => arg.participant.side === "against"
      );
      setSupportArgs(support);
      setAgainstArgs(against);
    });
  };

  useEffect(() => {
    fetchArgs();
  }, [postId]);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {/* Support Arguments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">For ({supportArgs.length})</h2>
          <AddPointDialog
            entity={entityId}
            entityType={forum}
            fetchArg={fetchArgs}
            side="support"
            debateId={postId}
          />
        </div>
        <div className="space-y-4">
          {supportArgs.map((arg: any) => (
            <DebateCard
              key={arg._id}
              debateId={arg._id}
              content={arg.content}
              author={arg.participant.user.firstName}
              date={new Date(arg.timestamp).toLocaleDateString()}
              imageUrl={arg.profileImage}
              initialRelevant={arg.relevant}
              initialIrrelevant={arg.irrelevant}
              userId={userId as string}
              commentId={arg._id}
            />
          ))}
        </div>
      </div>

      {/* Against Arguments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Against ({againstArgs.length})</h2>
          <AddPointDialog
            entity={entityId}
            entityType={forum}
            fetchArg={fetchArgs}
            side="against"
            debateId={postId}
          />
        </div>
        <div className="space-y-4">
          {againstArgs.map((arg: any) => (
            <DebateCard
              key={arg._id}
              debateId={arg._id}
              content={arg.content}
              author={arg.participant.user.firstName}
              date={new Date(arg.timestamp).toLocaleDateString()}
              imageUrl={arg.profileImage}
              initialRelevant={arg.relevant}
              initialIrrelevant={arg.irrelevant}
              userId={userId as string}
              commentId={arg._id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
