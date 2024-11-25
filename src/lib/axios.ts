import axios from "axios";
import env from "./env.config";

export const noTokenAxios = axios.create({
  baseURL: env.BACKEND_URL,
});
