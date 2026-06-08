import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import messageRoutes from "./routes/message.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";
import logger from "./utils/logger.js";
import requestLogger from "./middleware/requestLogger.js";
import { register, metricsMiddleware } from "./middleware/metricsMiddleware.js";

dotenv.config();

const PORT = process.env.PORT || 3002;

app.use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);
app.use(metricsMiddleware);

app.use("/api/messages", messageRoutes);

app.get("/health", (req, res) => res.json({ status: "ok", service: "messaging" }));

app.get("/metrics", async (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
});

server.listen(PORT, () => {
    connectToMongoDB();
    logger.info(`Messaging service running on port ${PORT}`);
});
