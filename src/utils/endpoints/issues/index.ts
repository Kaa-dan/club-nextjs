import { withTokenAxios } from "@/lib/mainAxios";

export class IssuesEndpoints {
  static async createIssue(data: any) {
    const response = await withTokenAxios.post("/issues", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }
  static async adoptIssue(issueId: string) {
    const response = await withTokenAxios.post(
      `/issues/adopt-proposed-issue/${issueId}`
    );

    return response.data;
  }

  static async fetchMyIssues(forum: TForum, nodeOrclub: string, page: string) {
    const response = await withTokenAxios.get(
      `/issues/get-my-issues?entity=${forum}&entityId=${nodeOrclub}&page=${page}`
    );

    console.log(response.data, "response my issue");

    return response.data;
  }

  static async fetchAllIssues(forum: TForum, nodeOrclub: string, page: string) {
    const response = await withTokenAxios.get(
      `/issues/all-issues?entity=${forum}&entityId=${nodeOrclub}&page=${page}`
    );

    console.log(response.data, "response all issue");
    return response.data;
  }

  static async fetchGlobalIssues(page: string) {
    const response = await withTokenAxios.get(
      `/issues/global-active-issues?page=${page}`
    );

    console.log(response.data, "response global issue");

    return response.data;
  }

  static async fetchAllLiveIssues(
    forum: TForum,
    nodeOrclub: string,
    page: string
  ) {
    console.log("nic", forum, nodeOrclub);

    const response = await withTokenAxios.get(
      `/issues/get-all-active-issues?entity=${forum}&entityId=${nodeOrclub}&page=${page}`
    );

    console.log(response.data, "response all live issue");

    return response.data;
  }

  static async fetchSpecificIssue(issueId: string) {
    const response = await withTokenAxios.get(`/issues/get-issue/${issueId}`);

    console.log(response.data, "response specific issue");

    return response.data;
  }

  static async likeIssue(issueId: string) {
    const response = await withTokenAxios.put(`/issues/like/${issueId}`);

    console.log("like");

    return response.data;
  }

  static async disLikeIssue(issueId: string) {
    console.log("dislike");

    const response = await withTokenAxios.put(`/issues/dislike/${issueId}`);

    return response.data;
  }

  static async getClubsNodesNotAdopted(issueId: string) {
    const response = await withTokenAxios.get(
      `/issues/get-clubs-and-nodes-not-adopted/${issueId}`
    );

    return response.data;
  }

  static async adoptOrProposeIssue(data: any) {
    const response = await withTokenAxios.post("/issues/adopt-issue", data);

    return response.data;
  }

  static async fetchProposedIssues(
    entity: TForum,
    entityId: string,
    page: string
  ) {
    const response = await withTokenAxios.get(
      `/issues/proposed-issues/${entity}/${entityId}/${page}`
    );

    return response.data;
  }
}
