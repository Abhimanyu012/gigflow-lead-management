"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const jwt_1 = require("../utils/jwt");
const User_model_1 = require("../models/User.model");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const register = async (req, res) => {
    const { name, email, password } = req.body;
    const exists = await User_model_1.User.findOne({ email });
    if (exists)
        throw new ApiError_1.ApiError("Email already in use", 400);
    const user = await User_model_1.User.create({ name, email, password });
    const token = (0, jwt_1.signJwt)({ id: user._id.toString(), role: user.role });
    res.status(201).json(new ApiResponse_1.ApiResponse({ user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role }, token }, "User registered", true, 201));
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User_model_1.User.findOne({ email });
    if (!user)
        throw new ApiError_1.ApiError("Invalid credentials", 401);
    const matched = await user.comparePassword(password);
    if (!matched)
        throw new ApiError_1.ApiError("Invalid credentials", 401);
    const token = (0, jwt_1.signJwt)({ id: user._id.toString(), role: user.role });
    res.json(new ApiResponse_1.ApiResponse({ user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role }, token }, "Logged in", true, 200));
};
exports.login = login;
const getMe = async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        throw new ApiError_1.ApiError("Unauthorized", 401);
    const user = await User_model_1.User.findById(userId).select("-password");
    if (!user)
        throw new ApiError_1.ApiError("User not found", 404);
    res.json(new ApiResponse_1.ApiResponse({ id: user._id.toString(), email: user.email, name: user.name, role: user.role }, "User fetched", true, 200));
};
exports.getMe = getMe;
