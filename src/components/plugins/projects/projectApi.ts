import { withTokenAxios } from "@/lib/mainAxios";

export const ProjectApi = {
  create: async (data: FormData) => {
    try {
      const response = await withTokenAxios.post("project", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  singleView: async (projectId: string) => {
    try {
      const response = await withTokenAxios.get(`project/single/${projectId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  contribute: async (data: FormData) => {
    try {
      const response = await withTokenAxios.post("adopt-contribution", data);
    } catch (error) {
      throw error;
    }
  },

  contributions: async (
    projectId: string,
    status: "accepted" | "rejected" | "pending"
  ) => {
    try {
      const response = await withTokenAxios.get(
        `project/contributions/${projectId}/${status}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  acceptContribuion: async (contribuionId: string) => {
    try {
      const response = await withTokenAxios.put(
        `project/accept-contributions/${contribuionId}`
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  },

  notAdoptedClubsAndNodes: async (projectId: string) => {
    try {
      const response = await withTokenAxios.get(
        `adopt-contribution/not-adopted-forum/${projectId}`
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  },

  adoptProject: async (data: { project: string; [key: string]: string }) => {
    try {
      const response = await withTokenAxios.post(
        `adopt-contribution/adopt-forum`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createAnnouncement: async (data: FormData) => {
    try {
      const response = await withTokenAxios.post("announcement", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllProjectActivities: async (projectId: String) => {
    try {
      const response = await withTokenAxios.get(
        `adopt-contribution/project-activities/${projectId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  fetchActivities: async (projectId: string) => {
    try {
      const response = await withTokenAxios.get(
        `announcement/all-project-announcement/${projectId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
