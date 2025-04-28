import { env } from "@/utils/constants";
import axios from "axios";

export const api = axios.create({
  baseURL: env.BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 1000,
});
