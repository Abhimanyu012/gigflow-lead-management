export type UserRole = "admin" | "sales";

export interface SystemUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}
