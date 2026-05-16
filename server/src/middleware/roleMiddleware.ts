import { RequestHandler } from "express";
import { ApiError } from "../utils/ApiError";
import { UserRole } from "../models/User.model";

export const authorizeRoles = (allowedRoles: UserRole[]): RequestHandler => {
  return (req, res, next) => {
    const role = req.user?.role as UserRole;
    if (!role || !allowedRoles.includes(role)) {
      return next(new ApiError("Forbidden", 403));
    }
    next();
  };
};
