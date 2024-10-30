import { axiosInstance } from "@/lib/axios";

export class Endpoints {
  static async fetchNodeDetails(nodeId: string) {
    const { data } = await axiosInstance.get("/node/" + nodeId);
    return data;
  }
}
