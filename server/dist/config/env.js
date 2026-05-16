"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    PORT: process.env.PORT || "5000",
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
    NODE_ENV: process.env.NODE_ENV || "development",
};
if (!exports.env.MONGO_URI) {
    throw new Error("MONGO_URI is required in environment variables");
}
if (!exports.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required in environment variables");
}
