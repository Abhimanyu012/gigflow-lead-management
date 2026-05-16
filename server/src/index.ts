import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import leadsRoutes from "./routes/leads.routes";
import usersRoutes from "./routes/users.routes";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { connectDB } from "./config/db";
import mongoose from "mongoose";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL }));
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));

app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
  authRoutes
);

app.use(["/api/leads", "/leads"], leadsRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not Found" });
});

app.use(errorMiddleware);

app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState; // 0 = disconnected, 1 = connected
  res.json({ status: "ok", db: dbState === 1 ? "connected" : "disconnected" });
});

const start = async () => {
  await connectDB();
  const port = Number(env.PORT || 5000);
  const server = app.listen(port, () => console.log(`Server listening on ${port}`));

  process.on("SIGTERM", () => {
    console.log("SIGTERM received, closing server...");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
