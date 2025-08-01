import axios from "axios";

import AppService from "./app.service";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const authToken = AppService.getCookie();
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error);
    if (error.response?.status === 401 && typeof window !== "undefined") {
        window.location.href = "/auth";
      }
    return Promise.reject(error);
  },
);

export default api;
