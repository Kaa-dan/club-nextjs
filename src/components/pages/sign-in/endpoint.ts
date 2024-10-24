import { axiosConfig } from "@/lib/axios";

export const login = async (data: any) => {
  try {
    const response = await axiosConfig.post("/login", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
