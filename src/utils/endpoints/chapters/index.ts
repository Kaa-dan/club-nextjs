import { withTokenAxios } from "@/lib/mainAxios";

export class ChapterEndpoints {
  static async fetchChapterDetails(chapterId: string) {
    const { data } = await withTokenAxios.get("/chapters/" + chapterId);
    return data;
  }
  static async fetchChapterJoinStatus(chapter: string) {
    const { data } = await withTokenAxios.get(
      `/chapters/check-status?chapter=${chapter}`
    );
    return data;
  }
  static async joinChapter(chapter: string, node: string) {
    try {
      const response = await withTokenAxios.put(`/chapters/join-user`, {
        chapter,
        node,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async leaveChapter(chapter: string) {
    try {
      const response = await withTokenAxios.put(`/chapters/leave-user`, {
        chapter,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async upvoteChapter(chapter: string) {
    try {
      const response = await withTokenAxios.put(`/chapters/upvote-proposed`, {
        chapter,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async downvoteChapter(chapter: string) {
    try {
      const response = await withTokenAxios.put(`/chapters/downvote-proposed`, {
        chapter,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
