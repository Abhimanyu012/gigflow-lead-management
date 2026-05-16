"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const ApiError_1 = require("../utils/ApiError");
const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.errors.map((e) => e.message);
            return next(new ApiError_1.ApiError("Validation failed", 400, errors));
        }
        req.body = result.data;
        next();
    };
};
exports.validate = validate;
