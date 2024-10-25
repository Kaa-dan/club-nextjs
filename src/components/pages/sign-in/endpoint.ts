import { axiosConfig } from "@/lib/axios";

export const login = async (data: any) => {
  try {
    const response = await axiosConfig.post("/login", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const googleSignIn = async (data: any) => {
  try {
    const response = await axiosConfig.post("/google-signin", data);
    console.log(response, "Ress");

    return response.data;
  } catch (error) {
    throw error;
  }
};
