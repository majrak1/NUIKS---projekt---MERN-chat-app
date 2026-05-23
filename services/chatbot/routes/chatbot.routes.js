import express from "express";
import { chatbot } from "../controllers/chatbot.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, chatbot);

export default router;
