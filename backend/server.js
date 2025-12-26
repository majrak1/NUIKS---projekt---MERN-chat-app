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
// Conversation model is used inside the chatbot controller now
import File from './models/file.model.js';
import fileRoutes from './routes/file.routes.js';

import { app, server } from './socket/socket.js'
import multer from 'multer';

dotenv.config();

// const app = express();
const PORT = process.env.PORT || 2100;

app.use(cors({
    origin: true, // reflect request origin, effectively allowing all origins
    methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"],
    credentials: true // keep if you're using cookies or sessions
}));

app.use(express.json()); // to parse the incoming requests with JSON payloads from req.body
app.use(cookieParser()); // to parse cookies from the request headers

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);


// files
app.use("/api/files", fileRoutes);






import { chatbot } from './controllers/chatbot.controller.js';

// Protected chatbot endpoint (moved to controller)
app.post("/chatbot", protectRoute, chatbot);


// !chatbot







server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);
});