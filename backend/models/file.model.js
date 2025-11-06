import mongoose, { mongo } from "mongoose";

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    mimetype: { type: String, required: true },
    data: { type: Buffer, required: true }, // actual file data
    uploadDate: { type: Date, default: Date.now }
});

export default mongoose.model("File", fileSchema);