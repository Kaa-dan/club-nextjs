import { axiosConfig } from "@/lib/axios";

export const forgotPassword = async (email: string) => {
  try {
    const response = await axiosConfig.post("/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (password: string) => {
  try {
    // Assume token is stored in localStorage (adjust as needed for your storage method)

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    console.log(token, "tokennn");
    const response = await axiosConfig.post(
      "/change-password",
      { password },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to the Authorization header
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
