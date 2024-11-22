import { mainAxios } from "@/lib/mainAxios";

export class RulesAndRegulationsEndpoints {
  static async reportOffence(data: any) {
    const response = await mainAxios.post(
      "/rules-regulations/reportOffence",
      data
    );
    return response.data;
  }

  static async fetchOffeses(section: TSections, typeId: string) {
    const response = await mainAxios.get(
      `/rules-regulations/get-all-report-offence?type=${section}&clubId=${typeId}`
    );
    return response.data;
  }

  static async fetchMyRulesOnNodeOrClub(section: TSections, entityId: string) {
    const response = await mainAxios.get(
      `/rules-regulations/get-my-rules?type=${section}&entity=${entityId}`
    );
    return response.data;
  }
}
