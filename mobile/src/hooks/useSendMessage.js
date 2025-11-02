import { useState } from "react";
import useConversation from "../zustand/useConversation";
import { Alert } from "react-native";
import { apiFetch } from "../utils/api";

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    const sendMessage = async (message) => {
        setLoading(true);
        try {
            const res = await apiFetch(`/api/messages/send/${selectedConversation._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            if (!data.newMessage) throw new Error(data.message || "No message returned from server");
            setMessages([...messages, data.newMessage]);
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading };
};

export default useSendMessage;
