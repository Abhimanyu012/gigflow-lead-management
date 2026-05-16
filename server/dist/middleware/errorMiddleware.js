"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const ApiError_1 = require("../utils/ApiError");
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof ApiError_1.ApiError) {
        return res.status(err.statusCode).json({ success: false, message: err.message, errors: err.errors || [] });
    }
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
};
exports.errorMiddleware = errorMiddleware;
