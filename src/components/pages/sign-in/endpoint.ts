import { noTokenAxios } from "@/lib/axios";

export const login = async (data: any) => {
  try {
    const response = await noTokenAxios.post("/login", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const signinWithSocial = async (data: any) => {
  try {
    const response = await noTokenAxios.post("/google-signin", data);
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
