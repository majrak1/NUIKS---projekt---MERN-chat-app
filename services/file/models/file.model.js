import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    mimetype: { type: String, required: true },
    data: { type: Buffer, required: true },
    uploadDate: { type: Date, default: Date.now },
});

const File = mongoose.model("File", fileSchema);
export default File;
