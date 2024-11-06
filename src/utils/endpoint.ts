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

  static async toggleMembersRequest(userId: string, action: string) {
    const response = await mainAxios.patch(`/user/:${userId}`);
    return response.data;
  }

  static async getJoinRequests(nodeId: string) {
    try {
      const response = await mainAxios.get("/join-requests/" + nodeId);
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

  static async fetchSpecificClubs() {
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
}
