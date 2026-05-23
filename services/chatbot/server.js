import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import chatbotRoutes from "./routes/chatbot.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";

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

app.use("/chatbot", chatbotRoutes);

app.get("/health", (req, res) => res.json({ status: "ok", service: "chatbot" }));

const startServer = async () => {
    await connectToMongoDB();
    app.listen(PORT, () => {
        console.log(`Chatbot service running on port ${PORT}`);
    });
};

startServer();
