"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  ChevronDown,
  MoreVertical,
  Pin,
  Trash2,
} from "lucide-react";
import { ReplySection } from "./reply-section";
import Image from "next/image";
import UserHoverCard from "@/components/globals/user-hover-card";
import { useTokenStore } from "@/store/store";
import { useParams } from "next/navigation";
import { AddPointDialog } from "./Add-point-dialog";
import { FilterComponent } from "./filter-component";
import { Endpoints } from "@/utils/endpoint";
import sanitizeHtmlContent from "@/utils/sanitize";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { type } from "os";
import { useClubStore } from "@/store/clubs-store";
import { useNodeStore } from "@/store/nodes-store";

interface DebateCardProps {
  isPinned: boolean;
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
  authorId: string;
  argumentAuthorId: string;
  fetchArgs: () => void;
  pinnedAgainstCount?: number;
  pinnedSupportCount?: number;
  argumentType: "support" | "against";
  postId: string;
  forum: TForum;
  entityId: string;
  startingPoint: boolean;
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
  authorId,
  isPinned,
  argumentAuthorId,
  fetchArgs,
  pinnedAgainstCount,
  pinnedSupportCount,
  argumentType,
  postId,
  forum,
  entityId,
  startingPoint,
}) => {
  const [relevant, setRelevant] = useState(initialRelevant);
  const [irrelevant, setIrrelevant] = useState(initialIrrelevant);
  const [showComments, setShowComments] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [showFullImage, setShowFullImage] = useState(false);
  const { globalUser } = useTokenStore((state) => state);
  const [participant, setParticipant] = useState();
  const currentUserId = globalUser?._id;
  const { currentUserRole: userClubRole } = useClubStore((state) => state);
  const { currentUserRole: userNodeRole } = useNodeStore((state) => state);
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
      console.log(fetchedReplies, "iheeuhre");

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
    Endpoints.checkParticipationStatus(postId, forum, entityId).then((res) => {
      setParticipant(res.isAllowed);
    });
  }, []);

  useEffect(() => {
    fetchRepliesForComment();
  }, [showComments]);

  const isRelevant = relevant.includes(userId);
  const isIrrelevant = irrelevant.includes(userId);
  const isCurrentUserAuthor = currentUserId === authorId; // Current user authored the argument
  const userCanDelete = currentUserId === argumentAuthorId; // User is the commenter
  console.log({ userClubRole });

  const hasRolePermission =
    ["admin", "moderator", "owner"].includes(userClubRole) ||
    ["admin", "moderator", "owner"].includes(userNodeRole);
  console.log({ hasRolePermission });
  console.log({ userNodeRole });

  return (
    <Card
      className={`overflow-hidden rounded-lg border-t-4 bg-white shadow-md ${
        argumentType === "support" ? "border-t-blue-500" : "border-t-red-500"
      }`}
    >
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
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
              <span className="text-sm text-gray-500">
                Last updated: {date}
              </span>
            </div>
          </div>
          {isPinned && (
            <Badge className="text-white">{isPinned && "Marquee"}</Badge>
          )}

          {participant &&
            (isCurrentUserAuthor || userCanDelete || hasRolePermission) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full p-2 hover:bg-gray-100">
                    <MoreVertical className="size-5 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* Pin/Unpin option - Only show if not starting and other conditions are met */}
                  {isCurrentUserAuthor &&
                    !hasRolePermission &&
                    !startingPoint && // Added condition to hide pin for starting posts
                    ((!isPinned &&
                      ((argumentType === "support" &&
                        (pinnedSupportCount || 0) < 5) ||
                        (argumentType === "against" &&
                          (pinnedAgainstCount || 0) < 5))) ||
                      isPinned) && (
                      <DropdownMenuItem
                        onClick={() => {
                          if (!isPinned) {
                            Endpoints.pin(debateId)
                              .then((res) => {
                                fetchArgs();
                                console.log({ success: res });
                              })
                              .catch((err) =>
                                console.error("Error pinning:", err)
                              );
                          } else {
                            Endpoints.unpin(debateId)
                              .then((res) => {
                                fetchArgs();
                                console.log({ success: res });
                              })
                              .catch((err) =>
                                console.error("Error unpinning:", err)
                              );
                          }
                        }}
                      >
                        <Pin className="mr-2 size-4" />
                        <span>{!isPinned ? "Pin" : "Unpin"}</span>
                      </DropdownMenuItem>
                    )}

                  {/* Delete option remains unchanged */}
                  {(isCurrentUserAuthor ||
                    userCanDelete ||
                    hasRolePermission) && (
                    <DropdownMenuItem
                      onClick={() => {
                        Endpoints.deleteDebateArgument(commentId)
                          .then((res) => {
                            fetchArgs();
                            console.log({ success: res });
                          })
                          .catch((err) =>
                            console.error("Error deleting:", err)
                          );
                      }}
                    >
                      <Trash2 className="mr-2 size-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
        </div>

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
                  className="h-screen max-h-screen w-screen max-w-full object-contain"
                />
              </div>
            )}
          </div>
        )}

        <p
          className="mb-4 text-lg leading-relaxed text-gray-800"
          dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(content) }}
        ></p>

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

          <button className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-500">
            <MessageCircle
              onClick={() => setShowComments(!showComments)}
              className="size-5"
            />
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

// export function DebateSection({ forum }: { forum: TForum }) {
//   const { postId, clubId, nodeId } = useParams<{
//     postId: string;
//     clubId: string;
//     nodeId: string;
//   }>();
//   const entityId = clubId ? clubId : nodeId;
//   const [supportArgs, setSupportArgs] = useState<Argument[]>([]);
//   const [againstArgs, setAgainstArgs] = useState<Argument[]>([]);
//   const [sortOption, setSortOption] = useState<string>("relevantDesc");
//   const { globalUser } = useTokenStore((state) => state);
//   const userId = globalUser?._id;
//   const [author, setAuthor] = useState("");
//   const [pinnedAgainstCount, setPinnedAgainstCount] = useState(0);
//   const [pinnedSupportCount, setPinnedSupportCount] = useState(0);
//   const [endingDate, setEndingDate] = useState<Date>();

//   const fetchArgs = () => {
//     Endpoints.viewDebate(postId).then((res) => {
//       setAuthor(res.createdBy._id);
//       setPinnedAgainstCount(res.pinnedAgainstCount);
//       setPinnedSupportCount(res.pinnedSupportCount);
//       setEndingDate(res.closingDate as Date);
//     });

//     Endpoints.fetchDebateArgs(postId)
//       .then((res) => {
//         // Filter and sort support arguments
//         const support = res
//           .filter((arg) => arg.participant.side === "support")
//           .sort((a, b) => {
//             // Starting point first
//             if (a.startingPoint && !b.startingPoint) return -1;
//             if (!a.startingPoint && b.startingPoint) return 1;
//             // Then pinned
//             if (a.isPinned && !b.isPinned) return -1;
//             if (!a.isPinned && b.isPinned) return 1;
//             // Finally by timestamp
//             return (
//               new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
//             );
//           });

//         // Filter and sort against arguments
//         const against = res
//           .filter((arg) => arg.participant.side === "against")
//           .sort((a, b) => {
//             if (a.startingPoint && !b.startingPoint) return -1;
//             if (!a.startingPoint && b.startingPoint) return 1;
//             if (a.isPinned && !b.isPinned) return -1;
//             if (!a.isPinned && b.isPinned) return 1;
//             return (
//               new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
//             );
//           });

//         setSupportArgs(support);
//         setAgainstArgs(against);
//       })
//       .catch((err) => {
//         console.log("err", err);
//         setSupportArgs([]);
//         setAgainstArgs([]);
//       });
//   };
//   useEffect(() => {
//     fetchArgs();
//   }, [postId]);
//   const sortArguments = (args: Argument[]) => {
//     return [...args].sort((a, b) => {
//       // Handle pinned arguments: pinned arguments come first
//       if (a.isPinned && !b.isPinned) return -1; // `a` is pinned, `b` is not
//       if (!a.isPinned && b.isPinned) return 1; // `b` is pinned, `a` is not

//       // Apply the selected sorting option for non-pinned arguments
//       switch (sortOption) {
//         case "relevantDesc":
//           return b.relevant - b.irrelevant - (a.relevant - a.irrelevant);
//         case "relevantAsc":
//           return a.relevant - a.irrelevant - (b.relevant - b.irrelevant);
//         case "timeDesc":
//           return (
//             new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
//           );
//         case "timeAsc":
//           return (
//             new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
//           );
//         case "reset": // No sorting, return array as is
//           return 0;
//         default:
//           return 0;
//       }
//     });
//   };
//   const sortedSupportArgs = sortArguments(supportArgs);
//   const sortedAgainstArgs = sortArguments(againstArgs);
//   console.log({ sortedSupportArgs });

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-start">
//         <FilterComponent onSortChange={setSortOption} />
//       </div>
//       <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
//         {/* Support Arguments */}
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-bold">For ({supportArgs.length})</h2>
//             <AddPointDialog
//               endingDate={endingDate as Date}
//               entity={entityId}
//               entityType={forum}
//               fetchArg={fetchArgs}
//               side="support"
//               debateId={postId}
//             />
//           </div>
//           <div className="space-y-4">
//             {sortedSupportArgs.map((arg: Argument) => (
//               <DebateCard
//                 argumentType="support"
//                 pinnedSupportCount={pinnedSupportCount}
//                 fetchArgs={fetchArgs}
//                 authorId={author}
//                 key={arg?._id}
//                 debateId={arg?._id}
//                 content={arg?.content}
//                 author={arg?.participant?.user?.userName}
//                 date={
//                   arg?.timestamp
//                     ? new Date(arg.timestamp).toLocaleDateString()
//                     : ""
//                 }
//                 profileImage={arg?.participant?.user?.profileImage}
//                 initialRelevant={arg?.relevant}
//                 initialIrrelevant={arg?.irrelevant}
//                 userId={userId as string}
//                 commentId={arg?._id}
//                 imageUrl={arg?.image?.[0]?.url}
//                 isPinned={arg?.isPinned}
//                 argumentAuthorId={arg.participant.user._id}
//                 postId={postId}
//                 forum={forum}
//                 entityId={entityId}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Against Arguments */}
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-bold">
//               Against ({againstArgs.length})
//             </h2>
//             <AddPointDialog
//               entity={entityId}
//               entityType={forum}
//               fetchArg={fetchArgs}
//               side="against"
//               debateId={postId}
//               endingDate={endingDate as Date}
//             />
//           </div>
//           <div className="space-y-4">
//             {sortedAgainstArgs.map((arg: Argument) => (
//               <DebateCard
//                 forum={forum}
//                 argumentType="against"
//                 pinnedAgainstCount={pinnedAgainstCount}
//                 fetchArgs={fetchArgs}
//                 authorId={author}
//                 argumentAuthorId={arg.participant.user._id}
//                 key={arg?._id}
//                 debateId={arg?._id}
//                 content={arg?.content}
//                 author={arg?.participant?.user?.userName}
//                 date={
//                   arg?.timestamp
//                     ? new Date(arg.timestamp).toLocaleDateString()
//                     : ""
//                 }
//                 profileImage={arg?.participant?.user?.profileImage}
//                 initialRelevant={arg?.relevant}
//                 initialIrrelevant={arg?.irrelevant}
//                 userId={userId as string}
//                 commentId={arg?._id}
//                 imageUrl={arg?.image?.[0]?.url}
//                 isPinned={arg?.isPinned}
//                 postId={postId}
//                 entityId={entityId}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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
  const [author, setAuthor] = useState("");
  const [pinnedAgainstCount, setPinnedAgainstCount] = useState(0);
  const [pinnedSupportCount, setPinnedSupportCount] = useState(0);
  const [endingDate, setEndingDate] = useState<Date>();

  const sortArguments = (args: Argument[]) => {
    return [...args].sort((a, b) => {
      // Starting point first
      if (a.startingPoint && !b.startingPoint) return -1;
      if (!a.startingPoint && b.startingPoint) return 1;

      // Then pinned
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Then other sorting options if specified
      if (sortOption !== "reset") {
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
            return (
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
        }
      }

      // Default timestamp sort if no option selected
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  };

  const fetchArgs = () => {
    Endpoints.viewDebate(postId).then((res) => {
      setAuthor(res.createdBy._id);
      setPinnedAgainstCount(res.pinnedAgainstCount);
      setPinnedSupportCount(res.pinnedSupportCount);
      setEndingDate(res.closingDate as Date);
    });

    Endpoints.fetchDebateArgs(postId)
      .then((res) => {
        const support = res.filter(
          (arg: Argument) => arg.participant.side === "support"
        );
        const against = res.filter(
          (arg: Argument) => arg.participant.side === "against"
        );

        setSupportArgs(support);
        setAgainstArgs(against);
      })
      .catch((err) => {
        console.log("err", err);
        setSupportArgs([]);
        setAgainstArgs([]);
      });
  };

  useEffect(() => {
    fetchArgs();
  }, [postId]);

  const sortedSupportArgs = sortArguments(supportArgs);
  const sortedAgainstArgs = sortArguments(againstArgs);

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
              endingDate={endingDate as Date}
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
                argumentType="support"
                pinnedSupportCount={pinnedSupportCount}
                fetchArgs={fetchArgs}
                authorId={author}
                key={arg?._id}
                debateId={arg?._id}
                content={arg?.content}
                author={arg?.participant?.user?.userName}
                date={
                  arg?.timestamp
                    ? new Date(arg.timestamp).toLocaleDateString()
                    : ""
                }
                profileImage={arg?.participant?.user?.profileImage}
                initialRelevant={arg?.relevant}
                initialIrrelevant={arg?.irrelevant}
                userId={userId as string}
                commentId={arg?._id}
                imageUrl={arg?.image?.[0]?.url}
                isPinned={arg?.isPinned}
                argumentAuthorId={arg.participant.user._id}
                postId={postId}
                forum={forum}
                entityId={entityId}
                startingPoint={arg.startingPoint}
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
              endingDate={endingDate as Date}
            />
          </div>
          <div className="space-y-4">
            {sortedAgainstArgs.map((arg: Argument) => (
              <DebateCard
                startingPoint={arg.startingPoint}
                forum={forum}
                argumentType="against"
                pinnedAgainstCount={pinnedAgainstCount}
                fetchArgs={fetchArgs}
                authorId={author}
                argumentAuthorId={arg.participant.user._id}
                key={arg?._id}
                debateId={arg?._id}
                content={arg?.content}
                author={arg?.participant?.user?.userName}
                date={
                  arg?.timestamp
                    ? new Date(arg.timestamp).toLocaleDateString()
                    : ""
                }
                profileImage={arg?.participant?.user?.profileImage}
                initialRelevant={arg?.relevant}
                initialIrrelevant={arg?.irrelevant}
                userId={userId as string}
                commentId={arg?._id}
                imageUrl={arg?.image?.[0]?.url}
                isPinned={arg?.isPinned}
                postId={postId}
                entityId={entityId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
