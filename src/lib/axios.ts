import axios from "axios";
import env from "./env.config";

export const axiosInstance = axios.create({
  baseURL: env.BACKEND_URL,
});
