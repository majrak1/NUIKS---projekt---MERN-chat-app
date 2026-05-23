import axios from "axios";
import Conversation from "../models/conversation.model.js";
import "../models/message.model.js";

const PROVIDER = process.env.AI_PROVIDER || "groq";

const PROVIDER_CONFIG = {
    groq: {
        url: "https://api.groq.com/openai/v1/chat/completions",
        model: process.env.AI_MODEL || "llama-3.1-8b-instant",
        getHeaders: () => ({
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
        }),
    },
    huggingface: {
        url: `https://router.huggingface.co/hf-inference/models/${process.env.AI_MODEL || "meta-llama/Llama-3.2-1B-Instruct"}/v1/chat/completions`,
        model: process.env.AI_MODEL || "meta-llama/Llama-3.2-1B-Instruct",
        getHeaders: () => ({
            Authorization: `Bearer ${process.env.HF_TOKEN}`,
            "Content-Type": "application/json",
        }),
    },
};

export async function chatbot(req, res) {
    const { text, conversationId, otherUserId } = req.body;
    const systemPrompt = `You are a helpful assistant that helps the user craft natural, engaging, and contextually appropriate messages in an ongoing conversation with another person.

You will be given the chat history between the user ("Me") and the recipient ("Them").
Your task is to suggest the next message that "Me" could send.

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
        let conversation = null;
        const otherUser = otherUserId || conversationId;
        if (otherUser) {
            conversation = await Conversation.findOne({
                participants: { $all: [req.user._id, otherUser] },
            }).populate("messages");
        }

        const messages = [{ role: "system", content: systemPrompt }];

        if (conversation && Array.isArray(conversation.messages)) {
            const sorted = conversation.messages.slice().sort((a, b) => {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });

            const MAX_HISTORY = parseInt(process.env.MAX_CHAT_HISTORY || "20", 10);
            const limited = sorted.slice(-MAX_HISTORY);

            let historyText = "";
            limited.forEach((msg) => {
                const sender = String(msg.senderId) === String(req.user._id) ? "Me" : "Them";
                historyText += `${sender}: ${msg.message}\n`;
            });

            if (historyText) {
                messages.push({ role: "user", content: `Chat history:\n${historyText}` });
                messages.push({ role: "assistant", content: "I understand the conversation context. What would you like me to suggest?" });
            }
        }

        messages.push({ role: "user", content: text });

        const config = PROVIDER_CONFIG[PROVIDER];
        if (!config) {
            return res.status(500).json({ error: `Unknown AI provider: ${PROVIDER}` });
        }

        const response = await axios.post(
            config.url,
            {
                model: config.model,
                messages,
                max_tokens: 150,
                temperature: 0.7,
            },
            { headers: config.getHeaders() }
        );

        const reply = response.data.choices?.[0]?.message?.content?.trim() || "No reply received";
        res.json({ reply });
    } catch (err) {
        console.error("Error calling AI API:", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to generate AI response" });
    }
}
