import { mainAxios } from "@/lib/mainAxios";

export const endPoints = {
  toggleMembersRequest: async (userId: string, action: string) => {
    try {
      const response = await mainAxios.patch(`/user/:${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMembers: async () => {
    try {
      const response = await mainAxios.get("/request");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
