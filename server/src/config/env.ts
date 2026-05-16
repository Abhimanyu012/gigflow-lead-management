import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || "5000",
  MONGO_URI: process.env.MONGO_URI!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
};

if (!env.MONGO_URI) {
  throw new Error("MONGO_URI is required in environment variables");
}
if (!env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required in environment variables");
}
