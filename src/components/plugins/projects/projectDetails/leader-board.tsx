"use client";
import { useEffect, useState, useMemo } from "react";
import * as React from "react";
import { MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProjectApi } from "../projectApi";
import { useParams } from "next/navigation";

interface Parameter {
  _id?: string;
  project?: string;
  title?: string;
  value?: string;
  unit?: string;
}

interface Contribution {
  _id?: string;
  value?: number;
  files?: Array<{
    url?: string;
    originalname?: string;
    mimetype?: string;
    size?: number;
    _id?: string;
  }>;
  status?: string;
  createdAt?: string;
}

interface TotalContribution {
  parameter?: Parameter;
  totalValue?: number;
  contributions?: Contribution[];
}

interface User {
  _id?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
}

interface Forum {
  _id?: string;
  name?: string;
  profileImage?: {
    filename?: string;
    url?: string;
  };
}

interface MemberEntry {
  _id?: string;
  totalContributions?: TotalContribution[];
  overallTotal?: number;
  user?: User;
}

interface ForumEntry {
  _id?: string;
  forumType?: "club" | "node";
  totalContributions?: TotalContribution[];
  overallTotal?: number;
  forum?: Forum;
}

interface LeaderboardData {
  totalContributors?: number;
  memberWize?: MemberEntry[];
  forumWise?: ForumEntry[];
}

export function LeaderBoard({
  forumId,
  forum,
}: {
  forumId?: string;
  forum?: TForum;
}) {
  const { postId } = useParams<{ postId: string }>();
  const [view, setView] = React.useState<"member" | "forum">("member");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardData | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    if (postId && forumId && forum) {
      ProjectApi.leaderBoard(postId, forumId, forum)
        .then((res) => {
          setLeaderboardData(res);
        })
        .catch((error) => {
          console.error("Error fetching leaderboard:", error);
        });
    }
  }, [postId, forumId, forum]);

  // Get unique parameters from all contributions
  const uniqueParameters = useMemo(() => {
    const parametersMap = new Map<string, Parameter>();

    const contributions =
      view === "member"
        ? leaderboardData?.memberWize
        : leaderboardData?.forumWise;

    contributions?.forEach((entry) => {
      entry?.totalContributions?.forEach((contribution) => {
        if (contribution?.parameter?._id) {
          parametersMap.set(contribution.parameter._id, contribution.parameter);
        }
      });
    });

    return Array.from(parametersMap.values());
  }, [leaderboardData, view]);

  const currentEntries = useMemo(() => {
    const entries =
      view === "member"
        ? leaderboardData?.memberWize || []
        : leaderboardData?.forumWise || [];

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return entries.slice(startIndex, endIndex);
  }, [leaderboardData, view, currentPage]);

  const totalPages = Math.ceil(
    ((view === "member"
      ? leaderboardData?.memberWize?.length
      : leaderboardData?.forumWise?.length) || 0) / itemsPerPage
  );

  const getParameterValue = (
    totalContributions?: TotalContribution[],
    parameterId?: string
  ) => {
    const contribution = totalContributions?.find(
      (c) => c?.parameter?._id === parameterId
    );
    return contribution?.totalValue || 0;
  };

  const getDisplayName = (entry: MemberEntry | ForumEntry) => {
    if ("user" in entry && entry.user) {
      return `${entry.user.firstName || ""} ${entry.user.lastName || ""}`;
    }
    return (entry as ForumEntry).forum?.name || "";
  };

  const getProfileImage = (entry: MemberEntry | ForumEntry) => {
    if ("user" in entry && entry.user) {
      return entry.user.profileImage;
    }
    return (entry as ForumEntry).forum?.profileImage?.url;
  };

  const getSubtext = (entry: MemberEntry | ForumEntry) => {
    if ("user" in entry && entry.user) {
      return entry.user.userName;
    }
    return (entry as ForumEntry).forumType;
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Leaderboard</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Private</span>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVertical className="size-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Total Contributors: {leaderboardData?.totalContributors || 0}
        </p>
      </div>
      <div className="mb-4 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Member wise</span>
          <Switch
            checked={view === "forum"}
            onCheckedChange={(checked) => {
              setView(checked ? "forum" : "member");
              setCurrentPage(1);
            }}
          />
          <span className="text-sm font-medium">Forum wise</span>
        </div>
      </div>
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>
                {view === "member" ? "Member's name" : "Forum name"}
              </TableHead>
              {uniqueParameters.map((param) => (
                <TableHead key={param._id} className="text-right">
                  {param.title} ({param.unit})
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentEntries.map((entry, index) => (
              <TableRow key={entry?._id}>
                <TableCell>
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-10">
                      <AvatarImage
                        src={getProfileImage(entry)}
                        alt={getDisplayName(entry)}
                      />
                      <AvatarFallback>
                        {getDisplayName(entry).charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{getDisplayName(entry)}</div>
                      <div className="text-sm text-muted-foreground">
                        {getSubtext(entry)}
                      </div>
                    </div>
                  </div>
                </TableCell>
                {uniqueParameters.map((param) => (
                  <TableCell key={param._id} className="text-right">
                    {getParameterValue(entry?.totalContributions, param._id)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 px-2">
        <div className="text-sm text-muted-foreground">
          Total {view === "member" ? "Members" : "Forums"}:{" "}
          {(view === "member"
            ? leaderboardData?.memberWize?.length
            : leaderboardData?.forumWise?.length) || 0}
        </div>
        {totalPages > 1 && (
          <div className="flex space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaderBoard;
