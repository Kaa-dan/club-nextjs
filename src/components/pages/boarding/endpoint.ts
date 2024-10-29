import { axiosInstance } from "@/lib/axios";

export const postDetails = async (id: string, userData: any) => {
  try {
    console.log({ id, userData });
    //api calling and storing response
    const response = await axiosInstance.put(
      `/onboarding/details/${id}`,
      userData
    );
    console.log({ response });
    // returning the response
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postPicture = async (id: string, userData: any) => {
  try {
    const response = await axiosInstance.put(
      `/onboarding/images/${id}`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addNode = async (data: any) => {
  try {
    const response = await axiosInstance.post("/add-node", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
