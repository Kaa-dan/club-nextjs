import { mainAxios } from "@/lib/mainAxios";

export class ClubEndpoints {
  static async cancelJoinRequest(clubId: string) {
    try {
      const response = await mainAxios.delete(
        `clubs/cancel-join-request/${clubId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async fetchUserRequestedClubs() {
    try {
      const response = await mainAxios.get("/clubs/user-join-requests");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
