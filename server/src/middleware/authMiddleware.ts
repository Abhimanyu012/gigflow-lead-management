import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/User.model";
import { ApiError } from "../utils/ApiError";

export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) throw new ApiError("Not authenticated", 401);
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, env.JWT_SECRET) as { id: string; role?: string };
    const user = await User.findById(payload.id);
    if (!user) throw new ApiError("User not found", 401);
    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (err) {
    next(err);
  }
};
