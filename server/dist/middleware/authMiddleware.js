"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const User_model_1 = require("../models/User.model");
const ApiError_1 = require("../utils/ApiError");
const authMiddleware = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth || !auth.startsWith("Bearer "))
            throw new ApiError_1.ApiError("Not authenticated", 401);
        const token = auth.split(" ")[1];
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        const user = await User_model_1.User.findById(payload.id);
        if (!user)
            throw new ApiError_1.ApiError("User not found", 401);
        req.user = { id: user._id.toString(), role: user.role };
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.authMiddleware = authMiddleware;
