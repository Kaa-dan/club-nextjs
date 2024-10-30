import { mainAxios } from "@/lib/mainAxios";

export class Endpoints {
  static async fetchNodeDetails(nodeId: string) {
    const { data } = await mainAxios.get("/node/" + nodeId);
    return data;
  }

  static async fetchAllNodes() {
    try {
      const { data } = await mainAxios.get("/node");
      return data;
    } catch (error) {
      console.log({ error });
    }
  }

  static async toggleMembersRequest(userId: string, action: string) {
    try {
      const response = await mainAxios.patch(`/user/:${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getMembers() {
    try {
      const response = await mainAxios.get("/request");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
