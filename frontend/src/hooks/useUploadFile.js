import { useState } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "../utils/api";

const useUploadFile = () => {
    const [uploading, setUploading] = useState(false);

    const uploadFile = async (file) => {
        if (!file) {
            toast.error("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploading(true);

            // Only allow PDF files
            if (file.type !== "application/pdf") {
                toast.error("Only PDF files are allowed.");
                setUploading(false);
                return;
            }

            console.log("filetype", file)

            const response = await fetch("http://localhost:2000/api/files/upload", {
                method: "POST",
                body: formData, // DO NOT set Content-Type manually
                credentials: "include", // <-- important: sends cookies
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data?.error || data?.message || "Failed to upload file");
            }

            toast.success("File uploaded successfully!");
        } catch (error) {
            toast.error(error.message || "Error uploading file.");
        } finally {
            setUploading(false);
        }
    };

    return { uploadFile, uploading };
};

export default useUploadFile;
