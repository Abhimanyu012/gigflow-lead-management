import { RequestHandler } from "express";
import { PERMISSIONS } from "../config/permissions";
import { ApiError } from "../utils/ApiError";
import { Lead } from "../models/Lead.model";

export const requirePerm = (resource: string, action: string): RequestHandler => {
  return async (req, res, next) => {
    try {
      const perms = PERMISSIONS[resource]?.[action];
      if (!perms) return next(new ApiError("Forbidden", 403));
      const role = req.user?.role;
      const userId = req.user?.id;
      if (!role || !userId) return next(new ApiError("Not authenticated", 401));

      // check role first
      if (perms.roles.includes(role)) return next();

      // if role not allowed, but ownership is permitted, check owner
      if (perms.allowOwner) {
        // currently only support ownership check for leads resource using :id param
        if (resource === "leads") {
          const id = req.params.id as string | undefined;
          if (!id) return next(new ApiError("Forbidden", 403));
          const lead = await Lead.findById(id).select("createdBy");
          if (!lead) return next(new ApiError("Not found", 404));
          if (lead.createdBy?.toString() === userId.toString()) return next();
        }
      }

      return next(new ApiError("Forbidden", 403));
    } catch (err) {
      next(err);
    }
  };
};

export default requirePerm;
