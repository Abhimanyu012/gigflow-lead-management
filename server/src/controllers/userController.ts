import { Request, Response } from "express";
import { User, UserRole } from "../models/User.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export const listUsers = async (req: Request, res: Response) => {
  const users = await User.find().select("-password");
  res.json(new ApiResponse({ users }, "Users fetched", true, 200));
};

export const updateUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body as { role?: string };
  if (!role || !Object.values(UserRole).includes(role as UserRole)) throw new ApiError("Invalid role", 400);
  const user = await User.findById(id);
  if (!user) throw new ApiError("User not found", 404);
  user.role = role as UserRole;
  await user.save();
  res.json(new ApiResponse({ user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role } }, "User updated", true, 200));
};

export default { listUsers, updateUserRole };
