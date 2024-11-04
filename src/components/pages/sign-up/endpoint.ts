import { axiosInstance } from "@/lib/axios";
import { useTokenStore } from "@/store/store";

export const sendOtp = async (email: string) => {
  try {
    const response = await axiosInstance.post("/send-otp", { email });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resendOtp = async (email: string) => {
  try {
    const response = await axiosInstance.post("/resend-otp", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (otp: string, email: string) => {
  try {
    const response = await axiosInstance.patch("/verify-otp", { otp, email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkVerified = async () => {
  try {
    const token = useTokenStore.getState().verifyToken;

    // Make the request and send the token in the headers
    const response = await axiosInstance.post(
      "/verify-token",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyToken = async (token: any): Promise<boolean> => {
  try {

    // Make the request and send the token in the headers
    const response = await axiosInstance.post(
      "/verify-token",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      }
    );
    return response?.data?.status

  } catch (error) {
    return false
  }
}

export const signUp = async (data: any) => {
  try {
    const response = await axiosInstance.post("/sign-up", data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const socialAuth = async (data: any) => {
  console.log(data, "daat");

  try {
    const response = await axiosInstance.post("/google-signup", data);
    console.log("response", response)
    return response.data;
  } catch (error) {
    throw error;
  }
};
