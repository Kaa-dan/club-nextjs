import axios from "axios";
import env from "./env.config";
axios.defaults.withCredentials = true;
export const noTokenAxios = axios.create({
  baseURL: env.BACKEND_URL,
  withCredentials: true,
});
