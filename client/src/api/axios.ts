import axios from "axios";
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { useToastStore } from "../store/toastStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "http://localhost:5000/api",
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url ?? "";

    // Don't intercept auth endpoint errors — forms handle those themselves
    const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/register");

    if (status === 401 && !isAuthEndpoint) {
      // Token expired or invalid — clear storage and force re-login
      localStorage.removeItem("token");
      window.location.replace("/login");
    } else if (!isAuthEndpoint) {
      // Show toast for all other non-auth errors
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "An unexpected error occurred.";
      useToastStore.getState().addToast(message, "error");
    }

    return Promise.reject(error);
  }
);
