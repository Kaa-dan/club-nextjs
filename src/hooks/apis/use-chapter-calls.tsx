import { useCallback } from "react";
import { TNodeData, TMembers } from "@/types";
import { useNodeStore } from "@/store/nodes-store";
import { NodeEndpoints } from "@/utils/endpoints/node";
import { Endpoints } from "@/utils/endpoint";
import { useTokenStore } from "@/store/store";
import { useClubStore } from "@/store/clubs-store";
import { useChapterStore } from "@/store/chapters-store";
import { ChapterEndpoints } from "@/utils/endpoints/chapters";
import { toast } from "sonner";

interface IUseChapterCalls {
  fetchChapterDetails: (chapterId: string) => Promise<void>;
  joinChapter: (chapterId: string, nodeId?: string) => Promise<void>;
  leaveChapter: (chapterId: string) => Promise<void>;
  fetchChapterJoinStatus: (chapterId: string) => Promise<void>;
  upvoteChapter: (chapterId: string) => Promise<void>;
  downvoteChapter: (chapterId: string) => Promise<void>;
  error: Error | null;
}

export const useChapterCalls = (): IUseChapterCalls => {
  const { globalUser } = useTokenStore((state) => state);
  const {
    setProposedChapters,
    setCurrentUserChapterRole,
    setCurrentChapter,
    setChapterMembers,
    setChapterJoinStatus,
    proposedChapters,
  } = useChapterStore();
  //   const { setCurrentUserRole: setClubUserRole } = useChapterStore();

  const fetchChapterDetails = useCallback(
    async (chapterId: string) => {
      try {
        const response = await ChapterEndpoints.fetchChapterDetails(chapterId);

        const currentUserRole =
          response?.chapterMembers?.find(
            (member: TMembers) => member?.user?._id === globalUser?._id
          )?.role || "VISITOR";

        setCurrentUserChapterRole(currentUserRole);
        setCurrentChapter(response?.chapter);
        setChapterMembers(response?.chapterMembers);
        fetchChapterJoinStatus(chapterId);
        return response.chapter;
      } catch (error) {
        console.error("Error fetching node details:", error);
        throw error;
      }
    },
    [setCurrentChapter, setCurrentUserChapterRole]
  );

  const fetchChapterJoinStatus = useCallback(
    async (chapterId: string) => {
      if (!chapterId) return;

      try {
        const response =
          await ChapterEndpoints.fetchChapterJoinStatus(chapterId);
        setChapterJoinStatus(response?.status || "VISITOR");
        setCurrentUserChapterRole(response?.role);
        return response?.status;
      } catch (error) {
        console.error("Error fetching club details:", error);
        throw error;
      }
    },
    [setChapterJoinStatus]
  );

  const joinChapter = useCallback(
    async (chapter: string, nodeId?: string) => {
      try {
        await ChapterEndpoints.joinChapter(chapter, nodeId!);
      } catch (error) {
        console.error("Error joining node:", error);
        throw error;
      }
    },
    [fetchChapterDetails]
  );

  const upvoteChapter = async (chapterId: string) => {
    try {
      const response = await ChapterEndpoints.upvoteChapter(chapterId);
      const updatedChapters = proposedChapters.map((chapter) => {
        if (chapter._id === chapterId) {
          return {
            ...chapter,
            downvotes: response.downvotes,
            upvotes: response.upvotes,
          };
        }
        return chapter;
      });
      console.log({ updatedChapters });
      setProposedChapters(updatedChapters);
    } catch (error) {
      console.error("Error upvoting node:", error);
      throw error;
    }
  };

  const downvoteChapter = async (chapterId: string) => {
    try {
      const response = await ChapterEndpoints.downvoteChapter(chapterId);
      console.log({ response });
      setTimeout(() => {
        console.log({ proposedChapters });
        const updatedChapters = proposedChapters?.map((chapter) => {
          if (chapter._id === chapterId) {
            return {
              ...chapter,
              downvotes: response.downvotes,
              upvotes: response.upvotes,
            };
          }
          return chapter;
        });
        console.log({ updatedChapters });
        setProposedChapters(updatedChapters);
      }, 0);
    } catch (error) {
      console.error("Error downvoting node:", error);
      throw error;
    }
  };

  const leaveChapter = useCallback(
    async (chapterId: string) => {
      try {
        await ChapterEndpoints.leaveChapter(chapterId);
        await fetchChapterDetails(chapterId);
        toast.success("You have left the chapter");
      } catch (error) {
        console.error("Error leaving node:", error);
        throw error;
      }
    },
    [fetchChapterDetails]
  );

  return {
    fetchChapterDetails,
    joinChapter,
    leaveChapter,
    fetchChapterJoinStatus,
    upvoteChapter,
    downvoteChapter,
    error: null,
  };
};
