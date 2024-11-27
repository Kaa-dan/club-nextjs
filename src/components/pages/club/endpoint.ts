import { withTokenAxios } from "@/lib/mainAxios";

export const addClub = async (data: any) => {
  try {
    const response = await withTokenAxios.post("/clubs", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSpecificClub = async (id: string) => {
  try {
    const response = await withTokenAxios.get(`/clubs/${id}`);

    return response.data;
  } catch (error) {
    console.log(error, "errr");

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

export const joinClub = async (clubId: string) => {
  try {
    const response = await withTokenAxios.put(`/clubs/request-join/${clubId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchUser = async (
  search: string,
  type: "node" | "club",
  entityId: string
) => {
  console.log({ search, type, entityId });
  try {
    const response = await withTokenAxios.get(
      `/users/search?type=${type}&entityId=${entityId}&keyword=${search}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sentInvitation = async (
  entityId: string,
  userId: string,
  type: string
) => {
  try {
    const response = await withTokenAxios.post(`/invitation`, {
      entityId,
      userId,
      type,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllInvitations = async () => {
  try {
    const response = await withTokenAxios.get(`/invitation`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const acceptOrRejectInvitation = async (
  invitationId: string,
  accept: boolean
) => {
  try {
    return await withTokenAxios.put(
      `/invitation/acceptOrReject/${invitationId}/${accept}`
    );
  } catch (error) {
    throw error;
  }
};
