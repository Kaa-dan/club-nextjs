import { withTokenAxios } from "@/lib/mainAxios";

export class NodeEndpoints {
  static async cancelJoinRequest(nodeId: string) {
    const response = await withTokenAxios.delete(
      `node/cancel-join-request/${nodeId}`
    );
    return response.data;
  }

  static async fetchUserRequestedNodes() {
    const response = await withTokenAxios.get("/node/user-join-requests");
    return response.data;
  }

  static async fetchUsersOfNode(nodeId: string) {
    const response = await withTokenAxios.get(`/node/node-members/${nodeId}`);
    return response.data;
  }
}
