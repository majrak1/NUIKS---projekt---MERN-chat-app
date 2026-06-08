import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import sequelize from "./db/sequelize.js";
import logger from "./utils/logger.js";
import requestLogger from "./middleware/requestLogger.js";
import { register, metricsMiddleware } from "./middleware/metricsMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(metricsMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/health", (req, res) => res.json({ status: "ok", service: "auth" }));

app.get("/metrics", async (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
});

const startServer = async () => {
    try {
        await sequelize.authenticate();
        logger.info("PostgreSQL connected successfully");
        await sequelize.sync();
        logger.info("Database synced");

        app.listen(PORT, () => {
            logger.info(`Auth service running on port ${PORT}`);
        });
    } catch (error) {
        logger.error("Unable to start auth service", { error: error.message });
        process.exit(1);
    }
};

startServer();
