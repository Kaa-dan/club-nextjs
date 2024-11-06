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

  static async requestToJoinNode(nodeId: string) {
    try {
      const { data } = await mainAxios.post("/node/request-to-join/" + nodeId);
      return data;
    } catch (error) {
      console.log({ error });
    }
  }

  static async toggleMembersRequest(
    nodeId: string,
    userId: string,
    action: string
  ) {
    const response = await mainAxios.put(
      `/node/join-requests/status/${action}`,
      {
        nodeId,
        userId,
      }
    );
    return response.data;
  }

  static async getJoinRequests(nodeId: string) {
    try {
      const response = await mainAxios.get("/node/join-requests/" + nodeId);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
