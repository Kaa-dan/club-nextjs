import axios from "axios";
import env from "./env.config";

export const axiosConfig = axios.create({
  baseURL: env.BACKEND_URL,
});
