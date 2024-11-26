import { withTokenAxios } from "@/lib/mainAxios";

export const addClub = async (data: any) => {
  try {
    const response = await withTokenAxios.post("/clubs", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const pinClub = async (id: string) => {
  try {
    const response = await withTokenAxios.patch(`/clubs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
