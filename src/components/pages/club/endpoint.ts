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

export const joinClub = async (clubId: string) => {
  try {
    const response = await mainAxios.put(`/clubs/request-join/${clubId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchUser = async (search: string) => {
  try {
    const response = await mainAxios.get(`/users/search?keyword=${search}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sentInvitation = async (clubId: string, userId: string) => {
  try {
    const response = await mainAxios.post(`/invitation`, {
      clubId,
      userId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllInvitations = async () => {
  try {
    const response = await mainAxios.get(`/invitation`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
