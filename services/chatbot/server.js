import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import chatbotRoutes from "./routes/chatbot.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import logger from "./utils/logger.js";
import requestLogger from "./middleware/requestLogger.js";
import { register, metricsMiddleware } from "./middleware/metricsMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(metricsMiddleware);

app.use("/chatbot", chatbotRoutes);

app.get("/health", (req, res) => res.json({ status: "ok", service: "chatbot" }));

app.get("/metrics", async (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
});

const startServer = async () => {
    await connectToMongoDB();
    app.listen(PORT, () => {
        logger.info(`Chatbot service running on port ${PORT}`);
    });
};

startServer();
