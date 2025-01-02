import { useCallback } from "react";
import { TNodeData, TMembers } from "@/types";
import { useNodeStore } from "@/store/nodes-store";
import { NodeEndpoints } from "@/utils/endpoints/node";
import { Endpoints } from "@/utils/endpoint";
import { useTokenStore } from "@/store/store";
import { useClubStore } from "@/store/clubs-store";
import { useChapterStore } from "@/store/chapters-store";
import { ChapterEndpoints } from "@/utils/endpoints/chapters";

interface IUseChapterCalls {
  fetchChapterDetails: (chapterId: string) => Promise<void>;
  error: Error | null;
}

export const useChapterCalls = (): IUseChapterCalls => {
  const { globalUser } = useTokenStore((state) => state);
  const {
    setProposedChapters,
    setCurrentUserChapterRole,
    setCurrentChapter,
    setChapterMembers,
  } = useChapterStore();
  //   const { setCurrentUserRole: setClubUserRole } = useChapterStore();

  const fetchChapterDetails = useCallback(
    async (chapterId: string) => {
      try {
        const response = await ChapterEndpoints.fetchChapterDetails(chapterId);

        const currentUserRole =
          response?.data?.members?.find(
            (member: TMembers) => member?.user?._id === globalUser?._id
          )?.role || "VISITOR";

        setCurrentUserChapterRole(currentUserRole);
        setCurrentChapter(response?.chapter);
        setChapterMembers(response?.chapterMembers);
        return response.chapter;
      } catch (error) {
        console.error("Error fetching node details:", error);
        throw error;
      }
    },
    [setCurrentChapter, setCurrentUserChapterRole]
  );

  // CRUD Operations
  //   const leaveNode = useCallback(
  //     async (nodeId: string) => {
  //       try {
  //         await Endpoints.leaveNode(nodeId);
  //         await fetchNodeJoinStatus(nodeId);
  //         await fetchUserNodes();
  //         await fetchNodeDetails(nodeId);
  //       } catch (error) {
  //         console.error("Error leaving node:", error);
  //         throw error;
  //       }
  //     },
  //     [fetchUserNodes]
  //   );

  return {
    fetchChapterDetails,
    error: null,
  };
};
