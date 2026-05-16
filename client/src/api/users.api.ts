import { api } from "./axios";
import { SystemUser, UserRole } from "../types/user.types";

export const usersApi = {
  getAll: async (): Promise<SystemUser[]> => {
    const { data } = await api.get<{ data: { users: SystemUser[] } }>("/users");
    return data.data.users;
  },
  updateRole: async (id: string, role: UserRole): Promise<SystemUser> => {
    const { data } = await api.put<{ data: { user: SystemUser } }>(`/users/${id}/role`, { role });
    return data.data.user;
  },
};

export default usersApi;
