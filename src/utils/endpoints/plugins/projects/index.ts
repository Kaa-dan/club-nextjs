import { withTokenAxios } from "@/lib/mainAxios";

export class ProjectsEndpoints {
  static async fetchAllProjects(
    forum: TForum,
    forumId: string,
    status: "published" | "proposed",
    page: string,
    search: string
  ) {
    console.log({ search });
    const queryParams = new URLSearchParams({
      status,
      page,
      limit: "10",
      isActive: "true",
      search,
      [forum === "club" ? "club" : forum === "node" ? "node" : "chapter"]:
        forumId,
    });

    const { data } = await withTokenAxios.get(
      `/project/${forum === "chapter" ? `chapter-all-projects` : `all-projects`}?${queryParams.toString()}`
    );

    return data;
  }

  static async fetchMyProjects(
    forum: TForum,
    forumId: string,
    page: string,
    search: string
  ) {
    const queryParams = new URLSearchParams({
      status: "published",
      page,
      limit: "10",
      [forum === "club" ? "club" : "node"]: forumId,
    });

    const { data } = await withTokenAxios.get(
      `/project/my-projects?${queryParams.toString()}`
    );
    return data;
  }

  static async fetchGlobalProjects(page: string) {
    const queryParams = new URLSearchParams({
      status: "published",
      page,
      limit: "10",
    });

    const { data } = await withTokenAxios.get(
      `/project/global-projects?${queryParams.toString()}`
    );
    return data;
  }
}
