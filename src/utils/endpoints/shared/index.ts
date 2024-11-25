import { withTokenAxios } from "@/lib/mainAxios";

export class SharedEndpoints {
  static async search(term: string, tag?: string) {
    const response = await mainAxios.get("/search", {
      params: {
        term,
        tag,
      },
    });
    return response.data;
  }

  static async makeAdmin(data: any) {
    const response = await mainAxios.put("/users/make-admin", data);
    return response.data;
  }

  static async makeModerator(data: any) {
    const response = await mainAxios.put("/users/make-moderator", data);
    return response.data;
  }

  static async makeMember(data: any) {
    console.log("first");
    const response = await mainAxios.put("/users/make-member", data);
    return response.data;
  }

  static async removeMember(data: any) {
    const response = await mainAxios.put("/users/remove-member", data);
    return response.data;
  }
}
