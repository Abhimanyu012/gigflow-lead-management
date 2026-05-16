"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("./config/env");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const leads_routes_1 = __importDefault(require("./routes/leads.routes"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const db_1 = require("./config/db");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: env_1.env.CLIENT_URL }));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json({ limit: "10kb" }));
app.use("/api/auth", (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
}), auth_routes_1.default);
app.use(["/api/leads", "/leads"], leads_routes_1.default);
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Not Found" });
});
app.use(errorMiddleware_1.errorMiddleware);
const start = async () => {
    await (0, db_1.connectDB)();
    const port = Number(env_1.env.PORT || 5000);
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
