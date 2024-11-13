import { mainAxios } from "@/lib/mainAxios";

export class Endpoints {
  static async getRulesComments(ruleId: string) {
    try {
      const { data } = await mainAxios.get(
        `/rules-regulations/${ruleId}/comment`
      );
      return data;
    } catch (error) {
      console.log({ error });
    }
  }

  static async postRulesComment(formData: FormData) {
    try {
      const res = await mainAxios.post(`/rules-regulations/comment`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      res;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }
}
