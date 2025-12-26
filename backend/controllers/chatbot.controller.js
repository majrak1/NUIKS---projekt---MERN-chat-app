import axios from "axios";
import Conversation from "../models/conversation.model.js";

const HF_URL =
    "https://router.huggingface.co/hf-inference/models/HuggingFaceTB/SmolLM3-3B/v1/chat/completions";

export async function chatbot(req, res) {
    const { text, conversationId, otherUserId } = req.body;
    const systemPrompt = `
        You are a helpful assistant that helps the user craft natural, engaging, and contextually appropriate messages
        in an ongoing conversation with another person ("the recipient").

        You will be given the chat history between the user ("me") and the recipient ("recipient").
        Your task is to try to impersonate me (purely based on the context) and think of the next message that I could send.

        Guidelines:
        - Keep the response short (1-2 sentences max).
        - Make it sound natural and human, as if it's sent in casual chat.
        - Stay consistent with the tone and mood of the conversation so far.
        - Do not repeat earlier messages.
        - Do not add emojis unless the tone clearly suggests it.
        - Output only the suggested message text — no explanations or meta comments.`;

    if (!text) {
        return res.status(400).json({ error: "Missing 'text' field in body" });
    }

    try {
        // Determine conversation: prefer conversationId, otherwise find by participants
        let conversation = null;
        if (conversationId) {
            conversation = await Conversation.findById(conversationId).populate("messages");
        } else if (otherUserId) {
            conversation = await Conversation.findOne({
                participants: { $all: [req.user._id, otherUserId] },
            }).populate("messages");
        }

        // Build messages for the LLM from conversation history (if present)
        const hfMessages = [{ role: "system", content: systemPrompt }];

        if (conversation && Array.isArray(conversation.messages)) {
            // Ensure messages are sorted chronologically by createdAt
            const sorted = conversation.messages.slice().sort((a, b) => {
                const ta = new Date(a.createdAt).getTime();
                const tb = new Date(b.createdAt).getTime();
                return ta - tb;
            });

            // Cap history length to avoid sending too many tokens to the LLM
            const MAX_HISTORY = parseInt(process.env.MAX_CHAT_HISTORY || "50", 10);
            const limited = sorted.slice(-MAX_HISTORY);

            limited.forEach((msg) => {
                const role = String(msg.senderId) === String(req.user._id) ? "you" : "recepient";
                hfMessages.push({ role, content: msg.message });
            });
        }

        // Append the current user message
        // hfMessages.push({ role: "me (message to AI)", content: text });
        // console.log("jabajabjajbajbajbajbajbjabjabjab", hfMessages);

        const response = await axios.post(
            HF_URL,
            {
                model: "HuggingFaceTB/SmolLM3-3B",
                messages: hfMessages,
                max_tokens: 200,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.json({
            reply: response.data.choices?.[0]?.message?.content || "No reply received",
        });
    } catch (err) {
        console.error("Error calling Hugging Face API:", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to fetch response from Hugging Face" });
    }
}
