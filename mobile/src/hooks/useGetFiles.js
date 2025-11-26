import { useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";
import { apiFetch } from "../utils/api";

const useGetFiles = () => {
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);

    const fetchFiles = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/api/files');
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setFiles(data);
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    return { loading, files, refetch: fetchFiles };
};

export default useGetFiles;
