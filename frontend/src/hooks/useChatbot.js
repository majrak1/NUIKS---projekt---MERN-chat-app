import { useState } from "react";
import { apiFetch } from "../utils/api";

const useChatbot = () => {
    const [loading, setLoading] = useState(false);

    const generateReply = async ({ text, conversationId, otherUserId } = {}) => {
        setLoading(true);
        try {
            const res = await apiFetch("/chatbot", {
                method: "POST",
                body: JSON.stringify({ text, conversationId, otherUserId }),
            });
            const data = await res.json();
            return data.reply;
        } finally {
            setLoading(false);
        }
    };

    return { generateReply, loading };
};

export default useChatbot;
