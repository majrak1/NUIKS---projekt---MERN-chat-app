import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
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
            console.log(data)
            if (data.error) throw new Error(data.error);

            // API returns { message: "Message sent successfully", newMessage }
            // append the actual message object so the UI renders the real message text
            if (!data.newMessage) throw new Error(data.message || "No message returned from server");
            setMessages([...messages, data.newMessage]);
            console.log("Appended message:", data.newMessage);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading };
};
export default useSendMessage;