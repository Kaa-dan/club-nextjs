import { withTokenAxios } from "@/lib/mainAxios";

export class Endpoints {
  static async getRulesComments(entityType: string, entityId: string) {
    try {
      const { data } = await withTokenAxios.get(
        `/comments/${entityType}/${entityId}`
      );
      return data;
    } catch (error) {
      console.log({ error });
    }
  }

  static async postRulesComment(formData: FormData) {
    try {
      const res = await withTokenAxios.post(`/comments`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  static async putLikeComment(commentId: string) {
    try {
      const res = await withTokenAxios.put(`/comments/like/${commentId}`);
      return res;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }
  static async putDislikeComment(commentId: string) {
    try {
      const res = await withTokenAxios.put(`/comments/dislike/${commentId}`);
      return res;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }
  static async createSolution(obj: {
    forum: string | undefined;
    forumId: string;
    commentId: string;
    postId: string;
  }) {
    const res = await withTokenAxios.post(`issues/create-solution`, obj);
    return res;
  }
}
