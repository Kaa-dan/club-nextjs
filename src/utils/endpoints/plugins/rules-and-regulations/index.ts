import { withTokenAxios } from "@/lib/mainAxios";

export class RulesAndRegulationsEndpoints {
  static async reportOffence(data: any) {
    const response = await withTokenAxios.post(
      "/rules-regulations/reportOffence",
      data
    );
    return response.data;
  }

  static async fetchOffeses(forum: TForum, typeId: string) {
    const response = await withTokenAxios.get(
      `/rules-regulations/get-all-report-offence?type=${forum}&clubId=${typeId}`
    );
    return response.data;
  }

  static async fetchMyRulesOnNodeOrClub(forum: TForum, entityId: string) {
    const response = await withTokenAxios.get(
      `/rules-regulations/get-my-rules?type=${forum}&entity=${entityId}`
    );
    return response.data;
  }
}
