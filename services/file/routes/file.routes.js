import express from "express";
import { uploadFile, getFiles, getFile, downloadFile } from "../controllers/file.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/upload", protectRoute, uploadFile);
router.get("/", protectRoute, getFiles);
router.get("/:id", protectRoute, getFile);
router.get("/:id/download", protectRoute, downloadFile);

export default router;
