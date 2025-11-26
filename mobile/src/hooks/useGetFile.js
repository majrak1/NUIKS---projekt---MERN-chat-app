import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { apiFetch } from "../utils/api";

const useGetFile = (fileId) => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (!fileId) return;

        const fetchFile = async () => {
            setLoading(true);
            try {
                const res = await apiFetch(`/api/files/${fileId}`);
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setFile(data);
            } catch (error) {
                Alert.alert("Error", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFile();
    }, [fileId]);

    return { loading, file };
};

export default useGetFile;
