"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const ApiError_1 = require("../utils/ApiError");
const requireRole = (roles) => {
    return (req, res, next) => {
        const role = req.user?.role;
        if (!role || !roles.includes(role))
            return next(new ApiError_1.ApiError("Forbidden", 403));
        next();
    };
};
exports.requireRole = requireRole;
