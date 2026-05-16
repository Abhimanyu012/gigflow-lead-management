import { Request, Response } from "express";
import { signJwt } from "../utils/jwt";
import { User, UserRole } from "../models/User.model";
import { env } from "../config/env";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError("Email already in use", 400);
  const user = await User.create({ name, email, password, role: role || UserRole.SALES });
  const token = signJwt({ id: user._id.toString(), role: user.role });
  res.status(201).json(new ApiResponse({ user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role }, token }, "User registered", true, 201));
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError("Invalid credentials", 401);
  const matched = await user.comparePassword(password);
  if (!matched) throw new ApiError("Invalid credentials", 401);
  const token = signJwt({ id: user._id.toString(), role: user.role });
  res.json(new ApiResponse({ user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role }, token }, "Logged in", true, 200));
};

export const getMe = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError("Unauthorized", 401);
  const user = await User.findById(userId).select("-password");
  if (!user) throw new ApiError("User not found", 404);
  res.json(new ApiResponse({ id: user._id.toString(), email: user.email, name: user.name, role: user.role }, "User fetched", true, 200));
};
