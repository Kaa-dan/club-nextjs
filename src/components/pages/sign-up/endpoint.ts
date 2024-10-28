import { axiosConfig } from "@/lib/axios";
import { useTokenStore } from "@/store/store";




export const sendOtp = async (email: string) => {
  try {
    const response = await axiosConfig.post("/send-otp", { email });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resendOtp = async (email: string) => {
  try {
    const response = await axiosConfig.post("/resend-otp", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (otp: string, email: string) => {
  try {
    const response = await axiosConfig.patch("/verify-otp", { otp, email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkVerified = async () => {
  try {
    // const token = localStorage.getItem("verify-token");
    const token = useTokenStore.getState().verifyToken;

    console.log(token, "ssd")

    // Make the request and send the token in the headers
    const response = await axiosConfig.post(
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

export const signUp = async (data: any) => {
  try {
    const response = await axiosConfig.post("/sign-up", data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const socialAuth = async (data: any) => {
  console.log(data, "daat");

  try {
    const response = await axiosConfig.post("/google-signup", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
