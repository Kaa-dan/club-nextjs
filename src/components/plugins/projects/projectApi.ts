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
  contribute: async (rootProject: string, parameter: string) => {
    try {
      const response = await withTokenAxios.post("adopt-contribution", {
        rootProject,
        parameter,
      });
    } catch (error) {
      throw error;
    }
  },
};