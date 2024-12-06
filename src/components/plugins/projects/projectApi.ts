import { withTokenAxios } from "@/lib/mainAxios";
import { thru } from "lodash";

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
    } catch (error) {
      throw error;
    }
  },
};
