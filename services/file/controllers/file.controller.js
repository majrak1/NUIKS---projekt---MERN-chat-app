import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import File from "../models/file.model.js";
import multer from "multer";
import logger from "../utils/logger.js";
import { s3Client, BUCKET } from "../utils/s3Client.js";

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Only PDF files are allowed!"));
        }
        cb(null, true);
    },
});

export const uploadFile = [
    upload.single("file"),
    async (req, res) => {
        try {
            if (!req.file) return res.status(400).send("No file uploaded.");

            const s3Key = `${randomUUID()}-${req.file.originalname}`;

            await s3Client.send(new PutObjectCommand({
                Bucket: BUCKET,
                Key: s3Key,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            }));

            const newFile = new File({
                filename: req.file.originalname,
                mimetype: req.file.mimetype,
                s3Key,
            });
            await newFile.save();

            logger.info("File uploaded to S3", { filename: req.file.originalname, s3Key });
            res.status(201).json({ message: "File uploaded successfully!" });
        } catch (err) {
            logger.error("File upload failed", { error: err.message });
            res.status(500).json({ error: err.message });
        }
    },
];

export const getFiles = async (req, res) => {
    try {
        const files = await File.find();
        const filesWithoutData = files.map((file) => ({
            _id: file._id,
            filename: file.filename,
            mimetype: file.mimetype,
            uploadDate: file.uploadDate,
        }));
        res.status(200).json(filesWithoutData);
    } catch (err) {
        logger.error("File listing failed", { error: err.message });
        res.status(500).json({ error: err.message });
    }
};

export const getFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ error: "File not found" });

        const s3Response = await s3Client.send(new GetObjectCommand({
            Bucket: BUCKET,
            Key: file.s3Key,
        }));

        const chunks = [];
        for await (const chunk of s3Response.Body) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        res.status(200).json({
            _id: file._id,
            filename: file.filename,
            mimetype: file.mimetype,
            uploadDate: file.uploadDate,
            data: {
                data: Array.from(buffer),
                contentType: file.mimetype,
            },
        });
    } catch (err) {
        logger.error("File retrieval failed", { error: err.message });
        res.status(500).json({ error: err.message });
    }
};

export const downloadFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ error: "File not found" });

        const s3Response = await s3Client.send(new GetObjectCommand({
            Bucket: BUCKET,
            Key: file.s3Key,
        }));

        res.set({
            "Content-Type": file.mimetype,
            "Content-Disposition": `attachment; filename="${file.filename}"`,
        });
        s3Response.Body.pipe(res);
    } catch (err) {
        logger.error("File download failed", { error: err.message });
        res.status(500).json({ error: err.message });
    }
};
