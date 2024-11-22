import { mainAxios } from "@/lib/mainAxios";

export class Endpoints {
  static async getRulesComments(entityType: string, entityId: string) {
    try {
      const { data } = await mainAxios.get(
        `/comments/${entityType}/${entityId}`
      );
      return data;
    } catch (error) {
      console.log({ error });
    }
  }

  static async postRulesComment(formData: FormData) {
    try {
      const res = await mainAxios.post(`/comments`, formData, {
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
      const res = await mainAxios.put(
        `/comments/like/${commentId}`
      );
      return res;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }
  static async putDislikeComment(commentId: string) {
    try {
      const res = await mainAxios.put(
        `/comments/dislike/${commentId}`
      );
      return res;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }
}
