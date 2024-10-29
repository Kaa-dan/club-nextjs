// src/api/axiosInstance.ts
import axios from "axios";
import env from "./env.config";
import { useTokenStore } from "@/store/store";

const createAxiosInstance = () => {
  const axiosInstance = axios.create({
    baseURL: env.BACKEND_URL,
  });

  // Request interceptor to attach token
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = useTokenStore.getState().accessToken;

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle 401 errors
  axiosInstance.interceptors.response.use(
    (response) => response, // Pass through successful responses
    (error) => {
      if (error.response && error.response.status === 401) {
        // Redirect to /login if status is 401
        if (typeof window !== undefined) {
          window.location.href = "/sign-in";
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const mainAxios = createAxiosInstance();
