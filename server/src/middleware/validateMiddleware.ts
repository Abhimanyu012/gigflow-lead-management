import { RequestHandler } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/ApiError";

export const validate = (schema: ZodSchema<unknown>): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message);
      return next(new ApiError("Validation failed", 400, errors));
    }
    req.body = result.data;
    next();
  };
};
