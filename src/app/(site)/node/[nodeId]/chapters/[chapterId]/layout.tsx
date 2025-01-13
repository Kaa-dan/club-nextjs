"use client";
import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import TeamsSidePopover from "@/components/pages/club/club-teams";
import ModulesBar from "@/components/pages/forum-common/module-bar";
import ForumSidebar from "@/components/globals/forum-sidebar";
import { useChapterStore } from "@/store/chapters-store";
import { useChapterCalls } from "@/hooks/apis/use-chapter-calls";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [currentPage, setCurrentPage] = useState("modules");
  const params = useParams<{
    nodeId: string;
    plugin?: TPlugins;
    chapterId: string;
  }>();
  const pathname = usePathname();
  const { fetchChapterDetails, joinChapter } = useChapterCalls();
  const {
    currentChapter,
    chapterMembers,
    chapterJoinStatus,
    currentUserChapterRole,
  } = useChapterStore((state) => state);

  useEffect(() => {
    if (params?.nodeId) {
      fetchChapterDetails(params?.chapterId);
    }
  }, [params.chapterId]);

  return (
    <div className="flex w-full">
      <div className="flex w-[calc(100%-3rem)] gap-6">
        <div className="w-1/4 shrink-0 flex-col">
          {/* <ChapterSidebar
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          /> */}
          <ForumSidebar
            type="chapter"
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            forumId={params?.chapterId}
            nodeId={params?.nodeId}
            currentForum={currentChapter}
            joinStatus={chapterJoinStatus!}
            onJoin={joinChapter!}
            members={chapterMembers}
            currentUserRole={currentUserChapterRole!}
          />
        </div>
        <div className="flex w-3/4 flex-col">
          <ModulesBar
            plugin={params?.plugin}
            forum={"node"}
            forumId={params.nodeId}
          />
          {children}
        </div>
      </div>
      <div className="relative">
        <TeamsSidePopover />
      </div>
    </div>
  );
};

export default Layout;
