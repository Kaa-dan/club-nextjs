import { axiosInstance } from "@/lib/axios";
import { mainAxios } from "@/lib/mainAxios";

export const postDetails = async (id: string, userData: any) => {
  try {
    console.log({ id, userData });
    //api calling and storing response
    const response = await mainAxios.put(`/onboarding/details`, userData);
    console.log({ response });
    // returning the response
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postPicture = async (id: string, userData: any) => {
  try {
    const response = await mainAxios.put(`/onboarding/images`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const completeOnboarding = async () => {
  const { data } = await mainAxios.put("/onboarding/complete");
  return data;
};

export const postInterest = async (id: string, userData: any) => {
  try {
    const response = await mainAxios.put(`/onboarding/interest`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addNode = async (data: any) => {
  try {
    const response = await mainAxios.post("/node", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNodes = async () => {
  try {
    const response = await mainAxios.get("/node");
    return response.data;
  } catch (error) {
    throw error;
  }
};
