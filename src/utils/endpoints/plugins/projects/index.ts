import { withTokenAxios } from "@/lib/mainAxios";

export class ProjectsEndpoints {
  static async fetchAllProjects(
    forum: TForum,
    forumId: string,
    status: "published" | "proposed"
  ) {
    const queryParams = new URLSearchParams({
      status,
      page: "1",
      limit: "10",
      isActive: "true",
      search: "",
      [forum === "club" ? "club" : "node"]: forumId,
    });

    const { data } = await withTokenAxios.get(
      `/project/all-projects?${queryParams.toString()}`
    );
    return data;
  }

  static async fetchMyProjects(forum: TForum, forumId: string) {
    const queryParams = new URLSearchParams({
      status: "published",
      page: "1",
      limit: "10",
      [forum === "club" ? "club" : "node"]: forumId,
    });

    const { data } = await withTokenAxios.get(
      `/project/my-projects?${queryParams.toString()}`
    );
    return data;
  }

  static async fetchGlobalProjects() {
    const queryParams = new URLSearchParams({
      status: "published",
      page: "1",
      limit: "10",
    });

    const { data } = await withTokenAxios.get(
      `/project/global-projects?${queryParams.toString()}`
    );
    return data;
  }
}
