import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import axios from "axios";
import cors from "cors";

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';
import connectToMongoDB from './db/connectToMongoDB.js';
import protectRoute from './middleware/protectRoute.js';
import fileRoutes from './routes/file.routes.js';
import { chatbot } from './controllers/chatbot.controller.js';

import { app, server } from './socket/socket.js'

dotenv.config();

// const app = express();
const PORT = process.env.PORT || 2100;

app.use(cors({
    origin: true, // reflect request origin, allowing all origins
    methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"],
    credentials: true // true if using cookies or sessions
}));

app.use(express.json()); // to parse the incoming requests with JSON payloads from req.body
app.use(cookieParser()); // to parse cookies from the request headers

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// files
app.use("/api/files", fileRoutes);

// chatbot (protected)
app.post("/chatbot", protectRoute, chatbot);

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);
});