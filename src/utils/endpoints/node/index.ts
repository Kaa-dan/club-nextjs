import { mainAxios } from "@/lib/mainAxios";

export class NodeEndpoints {
    static async cancelJoinRequest(nodeId: string) {
        const response = await mainAxios.delete(`node/cancel-join-request/${nodeId}`);
        return response.data;
    }

    static async fetchUserRequestedNodes() {
        const response = await mainAxios.get("/node/user-join-requests");
        return response.data;
    }

    static async fetchUsersOfNode(nodeId: string) {
        const response = await mainAxios.get(`/node/node-users/${nodeId}`);
        return response.data;
    }
}