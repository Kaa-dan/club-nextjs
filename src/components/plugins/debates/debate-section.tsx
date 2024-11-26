"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp, ThumbsDown, MessageCircle, ChevronDown } from "lucide-react";
import { ReplySection } from "./reply-section";
import Image from "next/image";
import UserHoverCard from "@/components/globals/user-hover-card";
import { useTokenStore } from "@/store/store";
import { useParams } from "next/navigation";
import { AddPointDialog } from "./Add-point-dialog";
import { FilterComponent } from "./filter-component";
import { Endpoints } from "@/utils/endpoint";
import sanitizeHtmlContent from "@/utils/sanitize";

interface DebateCardProps {
  content: string;
  author: string;
  date: string;
  profileImage?: string;
  debateId: string;
  initialRelevant: any;
  initialIrrelevant: any;
  userId: string;
  commentId: string;
  imageUrl?: string;
}
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
export const DebateCard: React.FC<DebateCardProps> = ({
  content,
  author,
  date,
  profileImage,
  debateId,
  initialRelevant,
  initialIrrelevant,
  userId,
  commentId,
  imageUrl,
}) => {
  console.log({ imageUrl });

  const [relevant, setRelevant] = useState(initialRelevant);
  const [irrelevant, setIrrelevant] = useState(initialIrrelevant);
  const [showComments, setShowComments] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [showFullImage, setShowFullImage] = useState(false);

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

  const handleReplyVote = async (
    replyId: string,
    type: "relevant" | "irrelevant"
  ) => {
    const replyIndex = replies.findIndex((reply) => reply._id === replyId);
    if (replyIndex === -1) return;

    const reply = replies[replyIndex];
    const previousRelevant = [...reply.relevant];
    const previousIrrelevant = [...reply.irrelevant];

    const updatedReplies = [...replies];

    if (type === "relevant") {
      const isCurrentlyRelevant = reply.relevant.includes(userId);
      updatedReplies[replyIndex] = {
        ...reply,
        relevant: isCurrentlyRelevant
          ? reply.relevant.filter((id) => id !== userId)
          : [...reply.relevant, userId],
        irrelevant: reply.irrelevant.filter((id) => id !== userId),
      };
    } else {
      const isCurrentlyIrrelevant = reply.irrelevant.includes(userId);
      updatedReplies[replyIndex] = {
        ...reply,
        irrelevant: isCurrentlyIrrelevant
          ? reply.irrelevant.filter((id) => id !== userId)
          : [...reply.irrelevant, userId],
        relevant: reply.relevant.filter((id) => id !== userId),
      };
    }

    setReplies(updatedReplies);

    try {
      const updatedReply = await Endpoints.toggleVote(replyId, type);
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

  const fetchRepliesForComment = async () => {
    try {
      const fetchedReplies =
        await Endpoints.getRepliesForDebateArgument(commentId);
      setReplies(fetchedReplies);
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  const handleReplySubmit = async (
    newComment: string,
    replyTo: { author: string; id: string } | null
  ) => {
    const commentContent = replyTo
      ? `@${replyTo.author} ${newComment}`
      : newComment;

    try {
      const newReply = await Endpoints.replyToDebateArgument(
        commentId,
        commentContent
      );
      setReplies((prev) => [...prev, newReply]);
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

  return (
    <Card className="overflow-hidden rounded-lg bg-white shadow-md">
      <div className="space-y-4 p-4">
        {imageUrl && (
          <div className="relative mb-4">
            <Image
              src={imageUrl}
              alt="Debate image"
              width={500}
              height={300}
              className="w-full cursor-pointer rounded-lg object-cover"
              onClick={() => setShowFullImage(true)}
            />
            {showFullImage && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                onClick={() => setShowFullImage(false)}
              >
                <Image
                  src={imageUrl}
                  alt="Full size debate image"
                  width={1000}
                  height={1000}
                  className="max-h-screen max-w-full object-contain"
                />
              </div>
            )}
          </div>
        )}

        <p
          className="mb-4 text-lg leading-relaxed text-gray-800"
          dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(content) }}
        ></p>

        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <UserHoverCard username={author}>
              <AvatarImage
                src={profileImage || "/placeholder.svg?height=32&width=32"}
                alt={author}
              />
            </UserHoverCard>
            <AvatarFallback className="bg-gray-200 text-lg text-gray-500">
              {author[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">{author}</span>
            <span className="text-sm text-gray-500">Last updated: {date}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
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

          <button
            className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-500"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="size-5" />
            {replies.length}
            <ChevronDown
              className={`size-4 transition-transform ${showComments ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {showComments && (
          <ReplySection
            replies={replies}
            userId={userId}
            onReplySubmit={handleReplySubmit}
            onReplyVote={handleReplyVote}
          />
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
  const [supportArgs, setSupportArgs] = useState<Argument[]>([]);
  const [againstArgs, setAgainstArgs] = useState<Argument[]>([]);
  const [sortOption, setSortOption] = useState<string>("relevantDesc");
  const { globalUser } = useTokenStore((state) => state);
  const userId = globalUser?._id;

  const fetchArgs = () => {
    Endpoints.fetchDebateArgs(postId).then((res) => {
      const support = res.filter(
        (arg: Argument) => arg.participant.side === "support"
      );
      const against = res.filter(
        (arg: Argument) => arg.participant.side === "against"
      );
      setSupportArgs(support);
      setAgainstArgs(against);
    });
  };

  useEffect(() => {
    fetchArgs();
  }, [postId]);

  const sortArguments = (args: Argument[]) => {
    return [...args].sort((a, b) => {
      switch (sortOption) {
        case "relevantDesc":
          return b.relevant - b.irrelevant - (a.relevant - a.irrelevant);
        case "relevantAsc":
          return a.relevant - a.irrelevant - (b.relevant - b.irrelevant);
        case "timeDesc":
          return (
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        case "timeAsc":
          return (
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        default:
          return 0;
      }
    });
  };

  const sortedSupportArgs = sortArguments(supportArgs);
  const sortedAgainstArgs = sortArguments(againstArgs);
  console.log({ sortedSupportArgs });

  return (
    <div className="space-y-8">
      <div className="flex justify-start">
        <FilterComponent onSortChange={setSortOption} />
      </div>
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
            {sortedSupportArgs.map((arg: Argument) => (
              <DebateCard
                key={arg._id}
                debateId={arg._id}
                content={arg.content}
                author={arg.participant.user.userName}
                date={new Date(arg.timestamp).toLocaleDateString()}
                profileImage={arg.participant.user.profileImage}
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
            <h2 className="text-lg font-bold">
              Against ({againstArgs.length})
            </h2>
            <AddPointDialog
              entity={entityId}
              entityType={forum}
              fetchArg={fetchArgs}
              side="against"
              debateId={postId}
            />
          </div>
          <div className="space-y-4">
            {sortedAgainstArgs.map((arg: Argument) => (
              <DebateCard
                key={arg._id}
                debateId={arg._id}
                content={arg.content}
                author={arg.participant.user.userName}
                date={new Date(arg.timestamp).toLocaleDateString()}
                profileImage={arg.participant.user.profileImage}
                initialRelevant={arg.relevant}
                initialIrrelevant={arg.irrelevant}
                userId={userId as string}
                commentId={arg._id}
                imageUrl={arg?.image[0]?.url}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
