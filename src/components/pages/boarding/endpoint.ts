import { mainAxios } from "@/lib/mainAxios";

export const postDetails = async (id: string, userData: any) => {
  try {
    console.log({ id, userData });
    //api calling and storing response
    const response = await mainAxios.put(`/onboarding/details/${id}`, userData);
    console.log({ response });
    // returning the response
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postPicture = async (id: string, userData: any) => {
  try {
    const response = await mainAxios.put(`/onboarding/images/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postInterest = async (id: string, userData: any) => {
  try {
    const response = await mainAxios.put(
      `/onboarding/interest/${id}`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addNode = async (data: any) => {
  try {
    const response = await mainAxios.post("/add-node", data);
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
