import { useState } from "react";
// lightweight inline SVG icons to avoid new deps
const SendIcon = ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 21L23 12L2 3L2 10L17 12L2 14L2 21Z" fill="currentColor" />
    </svg>
);

import useSendMessage from "../../hooks/useSendMessage";
import useChatbot from "../../hooks/useChatbot";
import useConversation from "../../zustand/useConversation";
import toast from "react-hot-toast";

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const { loading, sendMessage } = useSendMessage();
    const { generateReply, loading: aiLoading } = useChatbot();
    const { selectedConversation } = useConversation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message) return;
        await sendMessage(message);
        setMessage("");
    };

    return (
        <form onSubmit={handleSubmit} className='px-4 py-3'>
            <div className='flex items-center gap-3'>

                {/* AI suggestion button */}
                <button
                    type='button'
                    className='p-2 rounded-md text-gray-400 hover:text-accent hover:bg-black/5'
                    aria-label='Generate reply with AI'
                    onClick={async () => {
                        if (!selectedConversation) return toast.error("Select a conversation first");
                        try {
                            const prompt = message || "Please suggest a short casual reply";
                            const reply = await generateReply({ text: prompt, conversationId: selectedConversation._id });
                            if (!reply) return toast.error("No reply from chatbot");
                            await sendMessage(reply);
                            setMessage("");
                        } catch (err) {
                            toast.error(err.message || "Failed to generate reply");
                        }
                    }}
                    disabled={aiLoading || loading}
                >
                    {/* simple robot icon */}
                    {/* <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M12 3v1m4 3v1a4 4 0 01-8 0V6' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                        <rect x='3' y='7' width='18' height='10' rx='2' stroke='currentColor' strokeWidth='1.5' />
                        <path d='M8 14h.01M16 14h.01' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />

                    </svg> */}
                    <svg className='w-5 h-5' viewBox='0 0 50 50' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path d="M22.9167 41.6667C15.1047 41.6667 11.1987 41.6667 8.46056 39.6773C7.57625 39.0348 6.79856 38.2571 6.15606 37.3727C4.16667 34.6346 4.16667 30.7286 4.16667 22.9167C4.16667 15.1047 4.16667 11.1988 6.15606 8.46058C6.79856 7.57627 7.57625 6.79858 8.46056 6.15608C11.1987 4.16669 15.1047 4.16669 22.9167 4.16669H23.9583C30.7779 4.16669 34.1877 4.16669 36.6927 5.70169C38.0944 6.5606 39.2727 7.73904 40.1317 9.14067C41.6667 11.6455 41.6667 15.0554 41.6667 21.875" stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                        <path d="M36.2644 30.0075C36.7067 28.8864 38.2933 28.8864 38.7356 30.0075L38.8121 30.2018C39.8921 32.9402 42.0598 35.1079 44.7981 36.1879L44.9925 36.2643C46.1135 36.7066 46.1135 38.2933 44.9925 38.7356L44.7981 38.8121C42.0598 39.8921 39.8921 42.0598 38.8121 44.7981L38.7356 44.9925C38.2933 46.1135 36.7067 46.1135 36.2644 44.9925L36.1879 44.7981C35.1079 42.0598 32.9402 39.8921 30.2019 38.8121L30.0075 38.7356C28.8865 38.2933 28.8865 36.7066 30.0075 36.2643L30.2019 36.1879C32.9402 35.1079 35.1079 32.9402 36.1879 30.2018L36.2644 30.0075Z" stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                        <path d="M22.9167 14.5833H14.5833V16.6666M22.9167 14.5833H31.25V16.6666M22.9167 14.5833V31.25M22.9167 31.25H20.8333M22.9167 31.25H25" stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                    </svg>

                </button>

                <input
                    type='text'
                    className='flex-1 bg-transparent border border-black/12 rounded-full px-4 py-2 text-sm placeholder-gray-500 text-gray-100 focus:outline-none'
                    placeholder='Write a message...'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { handleSubmit(e); } }}
                />

                <button
                    type='submit'
                    className='bg-accent text-black rounded-full p-2 hover:brightness-95 flex items-center justify-center'
                    aria-label='Send message'
                    disabled={loading || aiLoading}
                >
                    {loading || aiLoading ? <div className='loading loading-spinner' /> : <SendIcon className='w-4 h-4' />}
                </button>
            </div>
        </form>
    );
};

export default MessageInput;
