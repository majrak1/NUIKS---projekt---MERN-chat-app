import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "../utils/api";

const useGetFiles = () => {
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            setLoading(true);
            console.log("ight")
            try {
                console.log("blah")
                const res = await apiFetch('/api/files');
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                console.log(data)

                setFiles(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, []);
    return { loading, files };
}
export default useGetFiles