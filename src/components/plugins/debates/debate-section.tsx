"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddPointDialog } from "./Add-point-dialog";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Endpoints } from "@/utils/endpoint";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useTokenStore } from "@/store/store";

const DebateCard = ({
  content,
  author,
  date,
  imageUrl,
  debateId,
  initialRelevant,
  initialIrrelevant,
  userId,
}: {
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
  debateId: string;
  initialRelevant: string[];
  initialIrrelevant: string[];
  userId: string;
}) => {
  const [relevant, setRelevant] = useState(initialRelevant);
  const [irrelevant, setIrrelevant] = useState(initialIrrelevant);

  const handleVote = async (type: "relevant" | "irrelevant") => {
    // Store previous state for recovery if needed
    const previousRelevant = [...relevant];
    const previousIrrelevant = [...irrelevant];

    // Instantly update UI
    if (type === "relevant") {
      const isCurrentlyRelevant = relevant.includes(userId);
      setRelevant(
        isCurrentlyRelevant
          ? relevant.filter((id) => id !== userId)
          : [...relevant, userId]
      );
      // Remove from irrelevant if it exists there
      if (irrelevant.includes(userId)) {
        setIrrelevant(irrelevant.filter((id) => id !== userId));
      }
    } else {
      const isCurrentlyIrrelevant = irrelevant.includes(userId);
      setIrrelevant(
        isCurrentlyIrrelevant
          ? irrelevant.filter((id) => id !== userId)
          : [...irrelevant, userId]
      );
      // Remove from relevant if it exists there
      if (relevant.includes(userId)) {
        setRelevant(relevant.filter((id) => id !== userId));
      }
    }

    try {
      // Make API call in background
      const updatedArgument = await Endpoints.toggleVote(debateId, type);
      // Sync with server response
      setRelevant(updatedArgument.relevant);
      setIrrelevant(updatedArgument.irrelevant);
    } catch (error) {
      console.error("Error toggling vote:", error);
      // Restore previous state on error
      setRelevant(previousRelevant);
      setIrrelevant(previousIrrelevant);
    }
  };

  const isRelevant = relevant.includes(userId);
  const isIrrelevant = irrelevant.includes(userId);

  return (
    <Card className="bg-white shadow">
      <div className="p-4">
        <p className="text-lg mb-4">{content}</p>

        <div className="flex items-center gap-2 mb-4">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={imageUrl || "/api/placeholder/32/32"}
              alt={author}
            />
            <AvatarFallback>{author[0]}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{author}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400 text-sm">Last updated: {date}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            className="flex items-center gap-1"
            onClick={() => handleVote("relevant")}
          >
            <ThumbsUp
              className={`w-5 h-5 transition-all active:scale-[0.9] ${
                isRelevant ? "text-green-600 fill-current" : "text-gray-500"
              }`}
            />
            <span>{relevant.length}</span>
          </button>

          <button
            className="flex items-center gap-1"
            onClick={() => handleVote("irrelevant")}
          >
            <ThumbsDown
              className={`w-5 h-5 transition-all active:scale-[0.9] ${
                isIrrelevant ? "text-red-500 fill-current" : "text-gray-500"
              }`}
            />
            <span>{irrelevant.length}</span>
          </button>
        </div>
      </div>
    </Card>
  );
};

export function DebateSection() {
  const { postId } = useParams<{ postId: string }>();
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Support Arguments */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">For ({supportArgs.length})</h2>
          <AddPointDialog
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
            />
          ))}
        </div>
      </div>

      {/* Against Arguments */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Against ({againstArgs.length})</h2>
          <AddPointDialog
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}
