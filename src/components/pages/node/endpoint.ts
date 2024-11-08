import { mainAxios } from "@/lib/mainAxios";

export const addClub = async (data: any) => {
  try {
    const response = await mainAxios.post("/clubs", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSpecificClub = async (id: string) => {
  try {
    const response = await mainAxios.get(`/clubs/${id}`);

    return response.data;
  } catch (error) {
    console.log(error, "errr");

    throw error;
  }
};

export const pinClub = async (id: string) => {
  try {
    const response = await mainAxios.patch(`/clubs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
