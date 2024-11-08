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

  static async fetchUserJoinedNodes() {
    try {
      const { data } = await mainAxios.get("/node/user-nodes");
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
    status: "ACCEPTED" | "REJECTED"
  ) {
    const response = await mainAxios.post(`/node/handle-request`, {
      nodeId,
      requestId: userId,
      status,
    });
    return response.data;
  }

  static async getNodeJoinRequests(nodeId: string) {
    try {
      const response = await mainAxios.get("/node/join-requests/" + nodeId);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getAllClubs() {
    try {
      const response = await mainAxios.get("/clubs");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async fetchUserJoinedClubs() {
    try {
      const response = await mainAxios.get(`/clubs/user-clubs`);
      console.log({ response });

      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async fetchRequests(cludId: string) {
    try {
      const response = await mainAxios.get(`clubs/club-requests/${cludId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async fetchClubUserStatus(clubdId: string) {
    try {
      const response = await mainAxios.get(`clubs/check-status/${clubdId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async fetchNodeUserStatus(nodeId: string) {
    try {
      const response = await mainAxios.get(`node/check-status/${nodeId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async fetchClubMembers(clubdId: string) {
    try {
      const response = await mainAxios.get(`/clubs/club-members/${clubdId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async leaveClub(clubId: string) {
    try {
      const response = await mainAxios.delete(`clubs/leave-club/${clubId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async handleRequest(
    clubId: string,
    requestId: string,
    status: string // Added closing quote here
  ) {
    console.log("api called");

    try {
      const response = await mainAxios.post("/clubs/handle-request", {
        clubId,
        requestId,
        status,
      });
      console.log({ response });

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
