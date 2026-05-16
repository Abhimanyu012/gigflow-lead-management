import { api } from "./axios";
import { User, LoginCredentials, RegisterData } from "../types/auth.types";

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await api.post<{ data: { user: User; token: string } }>("/auth/login", credentials);
    return data.data;
  },
  register: async (userData: RegisterData) => {
    const { data } = await api.post<{ data: { user: User; token: string } }>("/auth/register", userData);
    return data.data;
  },
  getMe: async () => {
    const { data } = await api.get<{ data: User }>("/auth/me");
    return data.data;
  },
};
