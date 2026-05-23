import File from "../models/file.model.js";
import multer from "multer";

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

            const newFile = new File({
                filename: req.file.originalname,
                mimetype: req.file.mimetype,
                data: req.file.buffer,
            });
            await newFile.save();
            res.status(201).json({ message: "File uploaded successfully!" });
        } catch (err) {
            console.error(err);
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
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

export const getFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        res.status(200).json(file);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

export const downloadFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        res.status(200).json(file);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
