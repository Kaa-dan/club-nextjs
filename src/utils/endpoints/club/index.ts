import { mainAxios } from "@/lib/mainAxios";

export class ClubEndpoints {
    static async cancelJoinRequest(clubId: string) {
        const response = await mainAxios.delete(`clubs/cancel-join-request/${clubId}`);
        return response.data;
    }

    static async fetchUserRequestedClubs() {
        const response = await mainAxios.get("/clubs/user-join-requests");
        return response.data;
    }
}