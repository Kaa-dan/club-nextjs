import { withTokenAxios } from "@/lib/mainAxios";
import { error } from "console";
import { type } from "os";

export class Endpoints {
  static async fetchNodeDetails(nodeId: string) {
    const { data } = await withTokenAxios.get("/node/" + nodeId);
    return data;
  }

  static async fetchAllNodes() {
    try {
      const { data } = await withTokenAxios.get("/node");
      return data;
    } catch (error) {
      console.log({ error });
    }
  }

  static async fetchUserJoinedNodes() {
    try {
      const { data } = await withTokenAxios.get("/node/user-nodes");
      return data;
    } catch (error) {
      console.log({ error });
    }
  }

  static async requestToJoinNode(nodeId: string) {
    const { data } = await withTokenAxios.post(
      "/node/request-to-join/" + nodeId
    );
    return data;
  }

  static async toggleMembersRequest(
    nodeId: string,
    userId: string,
    status: "ACCEPTED" | "REJECTED"
  ) {
    const response = await withTokenAxios.post(`/node/handle-request`, {
      nodeId,
      requestId: userId,
      status,
    });
    return response.data;
  }

  static async getNodeJoinRequests(nodeId: string) {
    const response = await withTokenAxios.get("/node/join-requests/" + nodeId);
    return response.data;
  }

  static async getAllClubs() {
    try {
      const response = await withTokenAxios.get("/clubs");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async fetchUserJoinedClubs() {
    try {
      const response = await withTokenAxios.get(`/clubs/user-clubs`);
      console.log({ response });

      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async fetchRequests(cludId: string) {
    try {
      const response = await withTokenAxios.get(
        `clubs/club-requests/${cludId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async fetchClubUserStatus(clubdId: string) {
    try {
      const response = await withTokenAxios.get(
        `clubs/check-status/${clubdId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * VISITOR || MEMBER || REQUESTED
   * */
  static async fetchNodeUserStatus(nodeId: string) {
    try {
      const response = await withTokenAxios.get(`node/check-status/${nodeId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async fetchClubMembers(clubdId: string) {
    try {
      const response = await withTokenAxios.get(
        `/clubs/club-members/${clubdId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async leaveClub(clubId: string) {
    try {
      const response = await withTokenAxios.delete(
        `clubs/leave-club/${clubId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async leaveNode(nodeId: string) {
    try {
      const response = await withTokenAxios.delete(`node/leave-node/${nodeId}`);
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
      const response = await withTokenAxios.post("/clubs/handle-request", {
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
  static async pinClub(clubId: string) {
    try {
      const response = await withTokenAxios.put(`/clubs/pin-club/${clubId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async unpinClub(clubId: string) {
    try {
      const response = await withTokenAxios.put(`/clubs/unpin-club/${clubId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async addRulesAndRegulations(data: any) {
    try {
      const response = await withTokenAxios.post("/rules-regulations", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getActiveRules(type: string, Id: string) {
    try {
      const response = await withTokenAxios.get(
        `rules-regulations/get-all-active-rules?type=${type}&from=${Id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getGlobalRules() {
    try {
      const response = await withTokenAxios.get(`rules-regulations`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async recaptcha(token: string) {
    try {
      const response = await withTokenAxios.post("/recaptcha", {
        token,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async specificRule(id: string) {
    try {
      const response = await withTokenAxios.get(
        `/rules-regulations/get-rules/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async adoptRule(
    rulesId: string,
    type: "club" | "node" | string,
    clubId?: string | null,
    nodeId?: string | null
  ) {
    try {
      const response = await withTokenAxios.post(
        "/rules-regulations/adopt-rules",
        {
          rulesId,
          type,
          clubId,
          nodeId,
        }
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getClubsNodesNotAdopted(ruleId: string) {
    try {
      console.log({ ruleId });

      const response = await withTokenAxios.get(
        `/rules-regulations/get-clubs-nodes-notadopted/${ruleId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async likeRules(rulesId: string) {
    try {
      const response = await withTokenAxios.put(
        "/rules-regulations/like-rules",
        {
          rulesId,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async disLikeRules(rulesId: string) {
    try {
      const response = await withTokenAxios.put(
        "/rules-regulations/unlike-rules",
        {
          rulesId,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async createView(rulesId: string) {
    try {
      const response = await withTokenAxios.put(
        "/rules-regulations/create-views",
        {
          rulesId,
        }
      );
      return response.data;
    } catch (error) {
      console.log({ error });

      throw error;
    }
  }

  static async saveDraft(data: any) {
    try {
      const response = await withTokenAxios.post(
        "/rules-regulations/draft",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateRule(data: FormData) {
    try {
      const response = await withTokenAxios.put("/rules-regulations", data);

      return response.data;
    } catch (error) {
      console.error("Error in updateRule:", error);
      throw error;
    }
  }

  static async myRules(entity: string, type: string) {
    try {
      const response = await withTokenAxios.get(
        `/rules-regulation/get-my-rules?entity=${entity}&type?=${type}`
      );
    } catch (error) {
      throw error;
    }
  }
  static async postDebate(data: any) {
    try {
      const response = await withTokenAxios.post("/debate", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async fetchMyDebate(entity: string, entityId: string) {
    try {
      const response = await withTokenAxios.get(
        `debate/my-debates?entityId=${entityId}&entity=${entity}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  }

  static async fetchAllDebates(entity: string, entityId: string) {
    try {
      const response = await withTokenAxios.get(
        `debate/all-debates?entityId=${entityId}&entity=${entity}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  }

  static async fetchOnGoingDebates(entity: string, entityId: string) {
    try {
      const response = await withTokenAxios.get(
        `debate/ongoing?entityId=${entityId}&entity=${entity}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  }
  static async fetchGlobalDebates(entity: string, entityId: string) {
    try {
      const response = await withTokenAxios.get("debate/global");
      return response.data;
    } catch (error) {
      return error;
    }
  }

  static async viewDebate(debateId: string) {
    try {
      const response = await withTokenAxios.get(`debate/view/${debateId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async notAdoptedClubs(debateId: string) {
    try {
      const response = await withTokenAxios.get(
        `debate/get-clubs-nodes-notadopted/${debateId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async adoptDebate(
    debateId: string,
    type: "club" | "node",
    clubId?: string,
    nodeId?: string
  ) {
    console.log({ debateId });

    try {
      const response = await withTokenAxios.post("debate/adopt", {
        debateId,
        type,
        clubId,
        nodeId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
